import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // 🕒 ajoute createdAt et updatedAt automatiquement
);

export default mongoose.model("Message", messageSchema);
