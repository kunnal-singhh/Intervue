import { ClockIcon, PauseIcon, PlayIcon, RotateCcwIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const DEFAULT_TIME = 45 * 60; // 45 minutes

function InterviewTimer({ isHost, channel, user }) {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Timer countdown loop
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            toast("⏰ Time's up! Please conclude the interview.", {
              icon: "⏳",
              duration: 5000,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  // Stream Channel sync listener
  useEffect(() => {
    if (!channel || !user) return;

    const handleTimerEvent = (event) => {
      if (event.user?.id === user.id || event.senderId === user.id) return;

      if (event.type === "timer_sync") {
        if (event.seconds !== undefined) setSecondsLeft(event.seconds);
        if (event.isRunning !== undefined) setIsRunning(event.isRunning);
      }
    };

    const listener = channel.on(handleTimerEvent);
    return () => {
      if (listener && typeof listener.unsubscribe === "function") {
        listener.unsubscribe();
      }
    };
  }, [channel, user]);

  const broadcastTimer = (newSeconds, newRunning) => {
    if (channel) {
      channel.sendEvent({
        type: "timer_sync",
        seconds: newSeconds,
        isRunning: newRunning,
        senderId: user?.id,
      }).catch((err) => console.error("Timer broadcast error:", err));
    }
  };

  const toggleTimer = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    broadcastTimer(secondsLeft, nextRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(DEFAULT_TIME);
    broadcastTimer(DEFAULT_TIME, false);
    toast.success("Timer reset to 45:00");
  };

  const addFiveMinutes = () => {
    const updated = secondsLeft + 5 * 60;
    setSecondsLeft(updated);
    broadcastTimer(updated, isRunning);
    toast.success("+5 minutes added to interview timer");
  };

  // Determine badge styling based on remaining time
  const getBadgeColor = () => {
    if (secondsLeft === 0) return "badge-error text-white font-bold animate-bounce";
    if (secondsLeft <= 300) return "badge-error text-white font-bold animate-pulse";
    if (secondsLeft <= 600) return "badge-warning font-semibold";
    return "badge-ghost border border-base-300 font-mono";
  };

  return (
    <div className="flex items-center gap-1.5 bg-base-200/80 px-2.5 py-1 rounded-lg border border-base-300">
      <div className={`badge badge-sm gap-1.5 ${getBadgeColor()}`}>
        <ClockIcon className="size-3" />
        <span className="font-mono text-xs">{formatTime(secondsLeft)}</span>
      </div>

      {isHost && (
        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleTimer}
            className="btn btn-ghost btn-xs btn-circle"
            title={isRunning ? "Pause Timer" : "Start Timer"}
          >
            {isRunning ? <PauseIcon className="size-3 text-warning" /> : <PlayIcon className="size-3 text-success" />}
          </button>

          <button
            onClick={addFiveMinutes}
            className="btn btn-ghost btn-xs btn-circle"
            title="Add 5 Minutes"
          >
            <PlusIcon className="size-3" />
          </button>

          <button
            onClick={resetTimer}
            className="btn btn-ghost btn-xs btn-circle"
            title="Reset Timer"
          >
            <RotateCcwIcon className="size-3 opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  );
}

export default InterviewTimer;
