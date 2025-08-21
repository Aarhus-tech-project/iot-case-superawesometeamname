import express from 'express';
import cors from 'cors';
import fs from 'fs';

import userRoutes from './routes/user';
import dataRoutes from './routes/data';

if (!fs.existsSync('./env')) {
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
	console.log(`🚀 Server running on http://localhost:${port}`);
});
