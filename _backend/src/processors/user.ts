import db from '../DBContext';
import { IRegister } from '@iot-case/types';
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
}

export default new UserProccesor();