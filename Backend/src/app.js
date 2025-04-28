import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from "./routes/users.routes.js";




const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({limit: "40kb"})); 
app.use(express.urlencoded({limit: "40kb", extended: true}));
app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => { 
    return res.json({ "hello": "World" });
  });
  
  const start = async () => { 
    const port = app.get("port");
    const connectionDB = await mongoose.connect("mongodb+srv://raghavjha75420:ci4sRGV4PyCAJe3m@cluster0.qgowhxh.mongodb.net/")
    console.log(`MONGO conntected to DB: ${connectionDB.connection.host}`);
    app.listen(port, () => { 
        console.log(`LISTENING ON PORT ${port}`);
    }
    );
  }
  
start();

