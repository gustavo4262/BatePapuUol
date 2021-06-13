import express, { text } from "express";
import cors from "cors";
import Joi from "joi";
import { removeAccents } from "./utils.js";
import { stripHtml } from "string-strip-html";

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

const participantSchema = Joi.object({
  name: Joi.string().required(),
  lastStatus: Joi.number(),
});

const messageSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  text: Joi.string().required(),
  type: Joi.string().valid("message", "private_message").required(),
  time: Joi.string(),
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/participants", (req, res) => {
  const { name } = req.body;
  const newParticipant = { name, lastStatus: Date.now() };
  const val = participantSchema.validate(newParticipant);
  if (val.error || participants.filter((p) => p.name === name).length) {
    Boolean(val.error) && console.log(val.error);
    res.sendStatus(400);
    return;
  }
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
  const newMessage = {
    from,
    to,
    text,
    type,
    time: new Date().toLocaleTimeString("pt-br"),
  };
  const val = messageSchema.validate(newMessage);
  if (val.error || !participants.filter((p) => p.name === from).length) {
    console.log(val.error);
    console.log(participants.filter((p) => p.name === from).length);
    res.sendStatus(400);
    return;
  }
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
