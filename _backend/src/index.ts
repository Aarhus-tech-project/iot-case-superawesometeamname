import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hello from Express + TypeScript!');
});

app.get('/test', (req, res) => {
	res.send('Test route');
})

app.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
