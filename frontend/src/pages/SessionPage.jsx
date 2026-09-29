import { useUser } from "@clerk/clerk-react";
import { CheckIcon, CopyIcon, Loader2Icon, LogOutIcon, PhoneOffIcon, Share2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router";
import CodeEditorPanel from "../components/CodeEditorPanel";
import Navbar from "../components/Navbar";
import OutputPanel from "../components/OutputPanel";
import { PROBLEMS } from "../data/problems";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { executeCode } from "../lib/codeExecution";
import { getDifficultyBadgeClass } from "../lib/utils";

import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import EndSessionModal from "../components/EndSessionModal";
import InterviewTimer from "../components/InterviewTimer";
import useStreamClient from "../hooks/useStreamClient";
import { useIsMobile } from "../hooks/useIsMobile";

function SessionPage() {
  const isMobile = useIsMobile(1024);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // Refs for tracking real-time sync state without stale closure traps
  const codeRef = useRef(code);
  codeRef.current = code;
  const selectedLanguageRef = useRef(selectedLanguage);
  selectedLanguageRef.current = selectedLanguage;
  const isRemoteEditRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, {
      onSuccess: refetch,
      onError: (err) => {
        toast.error(err.response?.data?.message || "Could not join session");
        navigate("/dashboard");
      },
    });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") {
      // If the current user is not the host, notify them that the session has ended
      if (!isHost) {
        toast.success("The host has ended the session");
      }
      navigate("/dashboard");
    }
  }, [session, loadingSession, navigate, isHost]);

  // update code when problem loads or changes (only if empty)
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage] && !code) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // Listen to Stream channel custom events for real-time live synchronization
  useEffect(() => {
    if (!channel || !user) return;

    // If candidate just joined, request latest code from host
    if (isParticipant) {
      channel.sendEvent({
        type: "request_code_sync",
        senderId: user.id,
      }).catch((err) => console.error("Request code sync failed:", err));
    }

    const handleCustomEvent = (event) => {
      // Ignore our own broadcasted events
      if (event.user?.id === user.id || event.senderId === user.id) return;

      if (event.type === "code_update") {
        isRemoteEditRef.current = true;
        setCode(event.code || "");
      } else if (event.type === "language_update") {
        isRemoteEditRef.current = true;
        if (event.language) setSelectedLanguage(event.language);
        if (event.code !== undefined) setCode(event.code);
        setOutput(null);
        toast(`${event.user?.name || "Partner"} changed language to ${event.language}`, {
          icon: "🔄",
        });
      } else if (event.type === "code_running") {
        setIsRunning(true);
        setOutput(null);
      } else if (event.type === "code_output") {
        setIsRunning(false);
        setOutput(event.output);
      } else if (event.type === "request_code_sync" && isHost) {
        // Host sends latest code & language to the newly joined participant
        channel.sendEvent({
          type: "code_sync",
          code: codeRef.current,
          language: selectedLanguageRef.current,
          senderId: user.id,
        }).catch((err) => console.error("Host code sync response failed:", err));
      } else if (event.type === "code_sync" && isParticipant) {
        isRemoteEditRef.current = true;
        if (event.language) setSelectedLanguage(event.language);
        if (event.code !== undefined) setCode(event.code);
        toast.success("Synchronized code with host!");
      }
    };

    const listener = channel.on(handleCustomEvent);

    return () => {
      if (listener && typeof listener.unsubscribe === "function") {
        listener.unsubscribe();
      }
    };
  }, [channel, user, isHost, isParticipant]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // If this update was triggered by remote partner, don't echo back
    if (isRemoteEditRef.current) {
      isRemoteEditRef.current = false;
      return;
    }

    if (!channel) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await channel.sendEvent({
          type: "code_update",
          code: newCode,
          senderId: user?.id,
        });
      } catch (err) {
        console.error("Failed to broadcast code update:", err);
      }
    }, 200);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);

    if (channel) {
      channel.sendEvent({
        type: "language_update",
        language: newLang,
        code: starterCode,
        senderId: user?.id,
      }).catch((err) => console.error("Failed to broadcast language update:", err));
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    if (channel) {
      channel.sendEvent({
        type: "code_running",
        senderId: user?.id,
      }).catch((err) => console.error("Failed to broadcast code running:", err));
    }

    const result = await executeCode(selectedLanguage, code, customInput);
    setOutput(result);
    setIsRunning(false);

    if (channel) {
      channel.sendEvent({
        type: "code_output",
        output: result,
        senderId: user?.id,
      }).catch((err) => console.error("Failed to broadcast code output:", err));
    }
  };

  const handleCopyLink = () => {
    const inviteUrl = window.location.href;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Interview invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const handleConfirmEnd = ({ rating, notes }) => {
    endSessionMutation.mutate(
      {
        id,
        finalCode: code,
        language: selectedLanguage,
        executionOutput: output?.output || output?.error || "",
        notes,
        rating,
      },
      {
        onSuccess: () => {
          setShowEndModal(false);
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={45} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-4 sm:p-6 bg-base-100 border-b border-base-300">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                      <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-xs sm:text-sm text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <InterviewTimer isHost={isHost} channel={channel} user={user} />

                        <button
                          onClick={handleCopyLink}
                          className="btn btn-outline btn-xs sm:btn-sm gap-1.5"
                          title="Copy interview invite link"
                        >
                          {copied ? (
                            <CheckIcon className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <CopyIcon className="w-3.5 h-3.5" />
                          )}
                          <span>{copied ? "Copied!" : "Invite Link"}</span>
                        </button>

                        <span
                          className={`badge badge-sm sm:badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty?.slice(0, 1).toUpperCase() +
                            session?.difficulty?.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-xs sm:btn-sm gap-1.5"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-sm sm:badge-lg">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Description</h2>
                        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Examples</h2>

                        <div className="space-y-3 sm:space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-sm sm:text-base text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[60px] sm:min-w-[70px]">
                                    Input:
                                  </span>
                                  <span className="break-all">{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[60px] sm:min-w-[70px]">
                                    Output:
                                  </span>
                                  <span className="break-all">{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90 text-xs sm:text-sm">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-xs sm:text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={55} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      isCollaborative={!!channel}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={handleCodeChange}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel
                      output={output}
                      customInput={customInput}
                      onCustomInputChange={setCustomInput}
                      onClearOutput={() => setOutput(null)}
                    />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className={isMobile ? "h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" : "w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize"} />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <EndSessionModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirmEnd={handleConfirmEnd}
        isEnding={endSessionMutation.isPending}
        problemTitle={session?.problem || "Interview Session"}
        participantName={session?.participant?.name}
        codeLength={code.length}
      />
    </div>
  );
}

export default SessionPage;