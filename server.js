import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Modèle
import Message from "./models/Message.js";

// Route principale
app.get("/", (req, res) => {
  res.send("API Portfolio Backend fonctionne ✅");
});

// Route pour le formulaire contact
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newMsg = new Message({ name, email, message });
    await newMsg.save();

    res.json({ message: "Message envoyé avec succès ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur ❌" });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
