import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors({
	origin: '*', // or specify origin
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.get('/users', (req, res) => {
	res.json({ users: ['Alice', 'Bob'] });
});

app.listen(port, () => {
	console.log(`🚀 Server running at http://localhost:${port}`);
});