import express from "express";
import http from "http";
import WebSocket from "ws";
import { WebSocketServer } from "ws";

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
