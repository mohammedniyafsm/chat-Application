"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const AllSocket = [];
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    console.log("User coonected to Web Socket Server");
    socket.on("message", (message) => {
        const ParsedMessage = JSON.parse(message);
        if (ParsedMessage.type == "join") {
            console.log("User Joined To room");
            AllSocket.push({
                socket,
                room: ParsedMessage.payload.roomId,
            });
        }
        if (ParsedMessage.type == "chat") {
            console.log("User Sent a Message in Chat");
            const CurrentUserRoom = AllSocket.find((x) => x.socket == socket);
            for (let i = 0; i < AllSocket.length; i++) {
                if (AllSocket[i].room == (CurrentUserRoom === null || CurrentUserRoom === void 0 ? void 0 : CurrentUserRoom.room)) {
                    AllSocket[i].socket.send(ParsedMessage.payload.message);
                }
            }
        }
    });
});
