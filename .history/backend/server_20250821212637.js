import app from './app.js'
import http from 'http'
import dotenv from 'dotenv'
dotenv.config();



const server = http.createServer(app);

const PORT = ProcessingInstruction.env