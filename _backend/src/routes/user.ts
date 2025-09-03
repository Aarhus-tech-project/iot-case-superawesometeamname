import { Router } from 'express';
import { LoggerContext } from '../LoggerContext';
import processor from '../processors/user';

const router = Router();
const logger = new LoggerContext("Routes::User");

router.post('/register', async (req, res) => {
	try {
		const registered = await processor.register(req.body);
		if (registered) {
			res.status(200).send(registered);
		} else {
			res.status(404).send("ERROR_DURING_REGISTER");
		}
	} catch (err) {
		logger.error('Register', `Exception hit`);
		console.log(err);
		res.status(404).send(err);
	}
});

router.post('/login', async (req, res) => {
	try {
		const logged = await processor.login(req.body);
		if (logged) {
			res.status(200).send(logged);
		} else {
			res.status(404).send("ERROR_DURING_LOGIN");
		}
	} catch (err) {
		logger.error('Login', `Exception hit`);
		console.log(err);
		res.status(404).send(err);
	}
});

export default router;
