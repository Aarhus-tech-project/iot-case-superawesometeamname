import { scrypt as _scrypt, BinaryLike, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(_scrypt);

export class CryptoHash {
	static async hashPassword(password: BinaryLike) {
		console.log("CryptoHash::HashPassword - Hashing password", password);

		const salt = randomBytes(16).toString("hex");
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;
		return `${buf.toString("hex")}.${salt}`;
	}

	static async comparePassword(
		storedPassword: string,
		suppliedPassword: string
	): Promise<boolean> {
		const [hashedPassword, salt] = storedPassword.split(".");
		const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
		const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 32)) as Buffer;
		return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
	}
}