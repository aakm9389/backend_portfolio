import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/Message.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// 📩 Route pour recevoir un message
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(200).json({ message: "Message envoyé avec succès ✅" });
  } catch (err) {
    console.error("Erreur POST /contact :", err);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
});

// 🆕 Route pour récupérer les messages récents
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Erreur GET /messages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
