import db from '../DBContext';

class DBHandlers {
	insertData = async (
		userId: Id, heartrate: number,
		steps: number, distance: number,
		spo2: number
	) => {
		const sql = `
			INSERT INTO \`data\` (user_id, heartrate, steps, distance, spo2)
			VALUES (:userId, :heartrate, :steps, :distance, :spo2)
		`;

		const result = await db.namedExec(sql, {
			userId, heartrate, steps, distance, spo2
		})

		return result.affectedRows > 0;
	}
}

export default new DBHandlers();