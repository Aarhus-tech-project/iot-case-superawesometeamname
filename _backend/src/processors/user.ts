import db from '../DBContext';
import { ILogin, IRegister } from '@iot-case/types';
import { CryptoHash } from './hashing';

class UserProccesor {
	register = async (body: IRegister) => {
		const { username, password, age, height, weight } = body;

		const hashedPassword = CryptoHash.hashPassword(password);

		const sql = `
			INSERT INTO users (username, password, age, height, weight)
			VALUES (:username, :hashed, :age, :height, :weight)
		`;

		const result = await db.namedExec(sql, {
			username,
			hashed: hashedPassword,
			age,
			height,
			weight
		})

		return result.affectedRows === 1 ? true : false

	}

	login = async (body: ILogin) => {
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
				return user;
			}
		}

		return null;
	}
}

export default new UserProccesor();