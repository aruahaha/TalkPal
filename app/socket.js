import { io } from "socket.io-client";

const socket = io("https://psychiatric-fanni-chatapp.koyeb.app/");

export default socket;
