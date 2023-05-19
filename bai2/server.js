const bodyParser = require("body-parser");
const { error, log } = require("console");
const express = require("express");
const server = express();
const fs = require("fs");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/game.html");
});
server.get("/index", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});
server.get("/round/:id", (req, res) => {
  res.sendFile(__dirname + "/public/html/round.html");
});
server.get("/api/v1/game", (req, res) => {
  fs.readFile("./api/game.json", (error, data) => {
    if (error) throw error;
    res.json(data);
  });
});
server.get("/api/v1/game/:id", (req, res) => {
  console.log("does it run in to line 25");
  const { id } = req.params;
  console.log(id);
  const games = JSON.parse(fs.readFileSync("./api/game.json"));
  const index = games.findIndex((e) => {
    return e.id == id;
  });
  console.log(games[index]);
  res.json(games[index]);
});
server.post("/api/v1/game", (req, res) => {
  const user = req.body;
  fs.readFile("./api/game.json", (error, data) => {
    if (error) throw error;
    JSON.parse(data);
    const games = JSON.parse(data);
    console.log(data);
    if (games.length === 0) {
      const newGame = {
        id: 0,
        user: user,
      };
      games.push(newGame);
      fs.writeFileSync("./api/game.json", JSON.stringify(games));
      res.json(games);
    } else {
      const newGame = {
        id: parseInt(games[games.length - 1].id) + 1,
        user: user,
        round: [],
      };
      games.push(newGame);
      fs.writeFileSync("./api/game.json", JSON.stringify(games));
      res.json(games);
    }
  });
});
server.put("/api/v1/game/:id", (req, res) => {
  const { id } = req.params;
  try {
    const games = JSON.parse(fs.readFileSync("./api/game.json"));
    const newRound = [];
    for (let i = 0; i < games[id].user.length; i++) {
      newRound.push({
        userName: games[id].user[1],
        score: 0,
      });
    }
    games.round.push(newRound);
    fs.writeFileSync("./api/game.json", JSON.stringify(games));
    res.json(games);
  } catch (error) {
    res.json({ message: error });
  }
});
// server.put("/api/v1/round/:id")
server.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
