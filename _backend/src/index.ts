import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use('/user', userRoutes);

app.get('/', (req, res) => {
	res.send('meow');
});

app.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
