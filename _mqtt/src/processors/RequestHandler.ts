import { Client, PublishPacket } from "aedes";
import { LoggerContext } from "../LoggerContext";
import db from './DBHandlers'

type IPublishPacket = PublishPacket | PublishPacket & {
	brokerId: string;
	brokerCounter: number;
};

interface IPayload {
	userId: number;
	steps: number;
	distance: number;
	gforce: number;
	spo2: number;
	bpm: number;
	temp: number;
}

class RequestHandler {
	logger = new LoggerContext("RequestHandler");
	receivedPubMessage = async (client: Client, packet: IPublishPacket) => {
		this.logger.info('receivedPubMessage', `Received message from ${client.id} on topic ${packet.topic}`)

		const { payload } = packet;

		if (typeof payload !== 'object') {
			this.logger.error('receivedPubMessage', `Message from ${client.id} is invalid - type is ${typeof payload} instead of object ${payload}`)
			return;
		}

		const decoded: IPayload = JSON.parse(payload.toString());

		this.logger.info('receivedPubMessage', `RequestHandler::receivedPubMessage - decoded json body: ${decoded}`)

		if (decoded.bpm > 1000 || decoded.bpm <= 0) {
			this.logger.error('receivedPubMessage', "RequestHandler::receivedPubMessage - bpm is invalid, ignoring message. GG the person is dead");
			return;
		}

		const { userId, bpm: heartrate, steps, distance, gforce } = decoded;

		db.insertData(userId, heartrate, steps, distance, gforce);
	}

	empty = () => console.log("\n")
}

export default new RequestHandler();