const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser le corps des requêtes JSON
app.use(bodyParser.json());

// Servir les fichiers statiques du dossier 'client'
app.use(express.static(path.join(__dirname, "client")));

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Endpoint pour enregistrer les données d'inscription
app.post("/inscriptions", (req, res) => {
  const inscriptionData = req.body;

  // Lire le fichier db.json
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier db.json:", err);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }

    // Parse les données existantes
    let db;
    try {
      db = JSON.parse(data);
    } catch (parseErr) {
      console.error("Erreur de parsing JSON:", parseErr);
      return res
        .status(500)
        .json({ message: "Erreur de traitement des données" });
    }

    // Ajouter la nouvelle inscription
    db.inscriptions.push(inscriptionData);

    // Écrire les nouvelles données dans db.json
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Erreur d'écriture dans db.json:", writeErr);
        return res.status(500).json({ message: "Erreur interne du serveur" });
      }
      res.json({ message: "Inscription réussie!", data: inscriptionData });
    });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur http://localhost:${PORT}`);
});
