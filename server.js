import express from "express";
import cors from "cors";

const participants = [];
const messages = [];

const app = express();
app.use(express.json());
app.use(cors());

app.post("/participants", (req, res) => {
  const name = req.body.name;
  console.log(req.body, name);
  if (!name || participants.filter((p) => p.name === name).length) {
    res.sendStatus(400);
    return;
  }
  const newParticipant = { name, lastStatus: Date.now() };
  participants.push(newParticipant);
  const newMessage = {
    from: name,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: new Date().toLocaleTimeString("pt-br"),
  };
  messages.push(newMessage);
  res.sendStatus(200);
});

app.get("/participants", (req, res) => {
  res.send(participants);
});

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.listen(4000);
