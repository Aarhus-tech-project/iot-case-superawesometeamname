import { IData, IDataReturn } from '@iot-case/types';
import db from '../DBContext';
import UserContext from '../UserContext';

class DataProcessor {

	private context = UserContext.getInstance();

	insert = async (data: IData) => {
		const { heartrate, steps, distance, gforce } = data;
		const { id: userId } = this.context.getUser();
		
		const sql = `
			INSERT INTO \`data\` (user_id, heartrate, steps, distance, gforce)
			VALUES (:userId, :heartrate, :steps, :distance, :gforce)
		`

		const result = await db.namedExec(sql, {
			userId,
			heartrate,
			steps,
			distance,
			gforce
		})

		return result.affectedRows > 0;
	}

	getById = async (id: Id) => {
		const { id: userId } = this.context.getUser();

		const sql = `
			SELECT
				id, heartrate heartRate,
				steps, distance,
				gforce gForce
			FROM \`data\`
			WHERE user_id = :userId
			AND id = :id
		`

		const result = await db.namedQuery<IDataReturn>(sql, { userId, id });
		return result[0]
	}

	getAll = async () => {
		const { id: userId } = this.context.getUser();

		const sql = `
			SELECT
				id, heartrate heartRate,
				steps, distance,
				gforce gForce
			FROM \`data\`
			WHERE user_id = :userId
		`;

		const result = await db.namedQuery<IDataReturn>(sql, { userId });
		return result;
	}
}

export default new DataProcessor()