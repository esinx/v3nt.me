import sirv from "sirv";
import express from "express";
import http from "http";
import compression from "compression";
import * as sapper from "@sapper/server";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import socketIO from "socket.io";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression({ threshold: 0 }), sirv("static", { dev }), sapper.middleware());

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
	socket.on("refresh", (data) => {
		io.emit("refresh");
	});
});

server.listen(PORT, (err) => {
	if (err) console.log("error", err);
});
