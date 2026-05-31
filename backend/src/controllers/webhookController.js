import { Webhook } from "svix";
import { inngest } from "../lib/inngest.js";

export const clerkWebhookHandler = async (req, res) => {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Missing CLERK_WEBHOOK_SECRET" });
    }

    const wh = new Webhook(secret);
    const event = wh.verify(req.body, req.headers);

    const supported = ["user.created", "user.deleted"];
    if (!supported.includes(event.type)) {
      return res.status(200).json({ message: `Ignored event ${event.type}` });
    }

    await inngest.send({
      name: `clerk/${event.type}`,
      data: event.data,
    });

    return res.status(200).json({ success: true, event: event.type });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
};
