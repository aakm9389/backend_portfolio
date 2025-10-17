import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connexion à MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// 📩 Route pour recevoir les messages du formulaire
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true, message: "Message reçu avec succès !" });
  } catch (err) {
    console.error("Erreur lors de l’envoi du message :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
