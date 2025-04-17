import { io } from "socket.io-client";

const socket = io("http://localhost:2100/");

export default socket;
