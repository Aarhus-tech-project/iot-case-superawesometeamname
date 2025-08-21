import { Router, Request, Response } from 'express';

const router = Router();

// Simple in-memory store
interface DataItem {
	id: string;
	value: any;
}
const dataStore: DataItem[] = [];

// POST /api/data - insert data
router.post('/', (req: Request, res: Response) => {
	const { id, value } = req.body;

	if (!id || value === undefined) {
		return res.status(400).json({ error: 'Missing id or value in request body' });
	}

	// Check if id already exists
	if (dataStore.find(item => item.id === id)) {
		return res.status(409).json({ error: 'Data with this id already exists' });
	}

	dataStore.push({ id, value });
	res.status(201).json({ message: 'Data inserted', data: { id, value } });
});

// GET /api/data/:id - get data by id
router.get('/:id', (req: Request, res: Response) => {
	const { id } = req.params;
	const item = dataStore.find(d => d.id === id);

	if (!item) {
		return res.status(404).json({ error: 'Data not found' });
	}

	res.json(item);
});

// GET /api/data - get all data
router.get('/', (req: Request, res: Response) => {
	res.json(dataStore);
});

export default router;
