import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import userRoutes from './routes/user';
import dataRoutes from './routes/data';
import { LoggerContext } from './LoggerContext';
const logger = new LoggerContext("Index")

if (!fs.existsSync(path.join(__dirname, "../", ".env"))) {
	logger.error('ENV', 'Missing .env configuration file... exiting');
	throw new Error("Missing .env configuration file");
}

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use('/user', userRoutes);
app.use('/data', dataRoutes);

app.get('/', (req, res) => {
	res.send('ping pong');
});

app.listen(port, () => {
	logger.info('Listen', `🚀 Server running on http://localhost:${port}`);

	return () => {
		logger.info('Listen', `🚀 Closing server`);
	}
});
