import { Router } from 'express';
import processor from '../processors/user';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const registered = await processor.register(req.body);
		if (registered) {
			res.status(200).send(registered);
		} else {
			res.send(404).send("ERROR_DURING_REGISTER");
		}
	} catch (err) {
		res.send(404).send(err);
	}
});

router.post('/login', (req, res) => {
	res.send('User logged in');
});

export default router;
