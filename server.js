const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "fridges.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readFridges() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, "{}");
        }

        const data = fs.readFileSync(DATA_FILE, "utf8");

        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error leyendo fridges.json:", error);
        return {};
    }
}

function saveFridges(data) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

app.get("/api/fridge/:id", (req, res) => {

    const fridges = readFridges();

    const id = req.params.id;

    if (!fridges[id]) {
        fridges[id] = [];
        saveFridges(fridges);
    }

    res.json(fridges[id]);
});

app.post("/api/fridge/:id", (req, res) => {

    const fridges = readFridges();

    const id = req.params.id;

    fridges[id] = Array.isArray(req.body.items)
        ? req.body.items
        : [];

    saveFridges(fridges);

    console.log(`💾 Lista guardada para: ${id}`);

    res.json({
        success: true,
        items: fridges[id]
    });
});

app.get("/fridge/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/", (req, res) => {
    res.redirect("/fridge/casa");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🧊 Smart Fridge funcionando en http://localhost:${PORT}`);
});