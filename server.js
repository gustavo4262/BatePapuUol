import express from "express";
import cors from "cors";
import { validateMessage, removeAccents } from "./utils.js";

let participants = [{ name: "Joao", lastStatus: 1623560741835 }];
let messages = [
  {
    from: "João",
    to: "Todos",
    text: "oi galera",
    type: "message",
    time: "20:04:37",
  },
];

const app = express();
app.use(express.json());
app.use(cors());

app.post("/participants", (req, res) => {
  const { name } = removeAccents(req.body);
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

app.post("/messages", (req, res) => {
  const { to, text, type } = removeAccents(req.body);
  const from = req.headers.user;
  const newMessage = { from, to, text, type };
  if (!validateMessage(newMessage, participants)) {
    res.sendStatus(400);
    return;
  }
  newMessage.time = new Date().toLocaleTimeString("pt-br");
  messages.push(newMessage);
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  const limit = parseInt(req.query.limit);
  const user = req.headers.user;
  console.log(messages);
  const messagesShown = messages
    .filter((m) => {
      return (
        m.type === "message" ||
        (m.type === "private_message" && (m.to === user || m.from === user))
      );
    })
    .slice(-limit);
  res.send(messagesShown);
});

app.post("/status", (req, res) => {
  const user = req.headers.user;
  if (!participants.filter((p) => p.name === user).length) {
    res.sendStatus(400);
    return;
  }
  const participant = participants.find((p) => p.name === user);
  participant.lastStatus = Date.now();
  res.sendStatus(200);
});

setInterval(() => {
  participants = participants.filter((p) => {
    let newMesage = {
      from: p.name,
      to: "Todos",
      text: "sai da sala...",
      type: "status",
      time: new Date().toLocaleTimeString("pt-br"),
    };
    messages.push(newMesage);
    let now = Date.now();
    return now - p.lastStatus > 10;
  });
}, 15000);

app.listen(4000);
