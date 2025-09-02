import db from '../DBContext';

class DBHandlers {
	insertData = async (
		userId: Id, heartrate: number,
		steps: number, distance: number,
		gforce: number
	) => {
		const sql = `
			INSERT INTO \`data\` (user_id, heartrate, steps, distance, gforce)
			VALUES (:userId, :heartrate, :steps, :distance, :gforce)
		`;

		const result = await db.namedExec(sql, {
			userId, heartrate, steps, distance, gforce
		})

		return result.affectedRows > 0;
	}
}

export default new DBHandlers();