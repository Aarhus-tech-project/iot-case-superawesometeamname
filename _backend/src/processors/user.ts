import db from '../DBContext';
import { ILogin, IRegister } from '@iot-case/types';
import { CryptoHash } from './hashing';
import { LoggerContext } from '../LoggerContext';

const logger = new LoggerContext("Routes::UserProcessor");

class UserProccesor {
	register = async (body: IRegister) => {
		logger.info('Register', 'Entering account registration');
		const { username, password, age, height, weight } = body;

		const hashedPassword = await CryptoHash.hashPassword(password);

		const sql = `
			INSERT INTO users (username, password, age, height, weight)
			VALUES (:username, :hashed, :age, :height, :weight)
		`;

		logger.info('Register', "Inserting account")
		const result = await db.namedExec(sql, {
			username,
			hashed: hashedPassword,
			age,
			height,
			weight
		})

		const inserted = result.affectedRows === 1;
		if (inserted) logger.info('Register', "Inserted account")

		return inserted;
	}

	login = async (body: ILogin) => {
		logger.info("Login", 'Entering user login')
		const { username, password } = body;

		const sql = `
			SELECT * FROM users WHERE username = :username
		`;

		const result = await db.namedQuery(sql, { username });

		if (result.length === 1) {
			const user = result[0];
			const hashedPassword = user.password;
			const isValid = await CryptoHash.comparePassword(password, hashedPassword);

			if (isValid) {
				delete user.password;
				logger.info("Login", 'Successfully logged into user');
				return user;
			}
		}

		logger.info("Login", 'Could not login to user');
		return null;
	}
}

export default new UserProccesor();