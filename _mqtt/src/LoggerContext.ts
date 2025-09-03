import fs from 'fs';
import path from 'path';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class LoggerContext {
	private context: string;
	private logFilePath: string;

	constructor(context: string = 'App') {
		this.context = context;

		const logsDir = path.resolve(__dirname, 'logs');
		console.log(logsDir)
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir);
		}

		// Log file per day
		const dateStr = new Date().toISOString().split('T')[0];
		this.logFilePath = path.join(logsDir, `${dateStr}.log`);
	}

	private formatMessage(level: LogLevel, func: string, message: string) {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level}] [${this.context}::${func}] ${message}`;
	}

	private writeToFile(message: string) {
		fs.appendFileSync(this.logFilePath, message + '\n', 'utf8');
	}

	private log(level: LogLevel, func: string, message: string) {
		const formatted = this.formatMessage(level, func, message);
		switch (level) {
			case 'INFO':
				console.log(formatted);
				break;
			case 'WARN':
				console.warn(formatted);
				break;
			case 'ERROR':
				console.error(formatted);
				break;
			case 'DEBUG':
				console.debug(formatted);
				break;
		}

		// File
		this.writeToFile(formatted);
	}

	info = (func: string, message: string) => this.log('INFO', func, message);
	warn = (func: string, message: string) => this.log('WARN', func, message);
	error = (func: string, message: string) => this.log('ERROR', func, message);
	debug = (func: string, message: string) => this.log('DEBUG', func, message);
}