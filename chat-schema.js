import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
