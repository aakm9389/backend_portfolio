require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ correction ici

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Config SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Config Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Route API
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Envoi de l’email via SendGrid
    const msg = {
      to: email,
      from: "aakm9389@gmail.com",
      subject: `Nouveau message de ${name}`,
      text: `Email: ${email}\nMessage:\n${message}`,
    };

    await sgMail.send(msg);

    // 2. Enregistrement dans Supabase (table contacts)
    const { error } = await supabase.from("contacts").insert([
      { name, email, message }
    ]);

    if (error) {
      console.error("Erreur insertion Supabase:", error.message);
    }

    res.json({ success: true, message: "Message envoyé ✅" });
  } catch (err) {
    console.error("Erreur SendGrid:", err.response?.body || err.message);
    res.status(500).json({ success: false, message: "Erreur d’envoi ❌" });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
});
