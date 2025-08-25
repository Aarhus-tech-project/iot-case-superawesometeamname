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

router.post('/login', async (req, res) => {
	try {
		const logged = await processor.login(req.body);
		if (logged) {
			res.status(200).send(logged);
		} else {
			res.send(404).send("ERROR_DURING_LOGIN");
		}
	} catch (err) {
		res.send(404).send(err);
	}
});

export default router;
