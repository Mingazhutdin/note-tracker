const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid.js");
const fs = require("fs");
const PORT = 5000;

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  let newDB = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf-8");
  res.json(JSON.parse(newDB));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const data = {
    title,
    text,
    id: uuid(),
  };

  const arr = [...db, data];
  fs.writeFile("./db/db.json", JSON.stringify(arr), (error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.json(JSON.stringify(arr));
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const result = db.filter((el) => {
    return id !== el.id;
  });
  fs.writeFile("./db/db.json", JSON.stringify(result), (error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.json(JSON.stringify(result));
    }
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("App has been started!");
});
