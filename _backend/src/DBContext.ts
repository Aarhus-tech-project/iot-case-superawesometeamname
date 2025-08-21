import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables into process.env

interface DBConfig {
	host: string;
	user: string;
	password: string;
	database: string;
	port?: number;
}

class DBContext {
	private pool: mysql.Pool;

	constructor() {
		if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
			throw new Error("Missing database configuration in .env file");
		}

		const config: DBConfig = {
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'tracker',
			port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
		};

		this.pool = mysql.createPool({
			host: config.host,
			user: config.user,
			password: config.password,
			database: config.database,
			port: config.port,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
		});
	}

	// For SELECT queries that return rows of type T
	async query<T>(sql: string, params?: any[]): Promise<T[]> {
		const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(sql, params);
		return rows as T[];
	}

	// For INSERT, UPDATE, DELETE queries returning OkPacket info
	async exec(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
		const [result] = await this.pool.execute<mysql.ResultSetHeader>(sql, params);
		return result;
	}

	// Close pool connection (if needed)
	async close() {
		await this.pool.end();
	}
}

export default new DBContext();
