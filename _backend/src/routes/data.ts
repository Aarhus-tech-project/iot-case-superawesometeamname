import { Router, Request, Response } from 'express';
import processor from '../processors/data';

const router = Router();

// POST /api/data - insert data
router.post('/', async (req: Request, res: Response) => {
	try {
		const inserted = await processor.insert(req.body)
		if (inserted) {
			res.status(200).json({ message: 'Data inserted successfully', response: inserted });
		} else {
			res.status(400).json({ message: 'Error inserting data', response: inserted });
		}
	} catch (err) {
		res.status(400).send(err);
	}
})

// GET /api/data/:id - get data by id
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const data = await processor.getById(id);
		res.send(data);
	} catch (err) {
		res.status(400).send(err);
	}
});

// GET /api/data - get all data
router.get('/', async (req: Request, res: Response) => {
	try {
		const data = await processor.getAll();
		res.send(data);
	} catch (err) {
		res.status(400).send(err);
	}
});

export default router;
