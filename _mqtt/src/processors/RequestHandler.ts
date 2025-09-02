import { Client, PublishPacket } from "aedes";
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
	receivedPubMessage = async (client: Client, packet: IPublishPacket) => {
		console.log(`RequestHandler::receivedPubMessage - Received message from ${client.id} on topic ${packet.topic}`)

		const { payload } = packet;

		if (typeof payload !== 'object') {
			console.log(`RequestHandler::receivedPubMessage - Message from ${client.id} is invalid - type is ${typeof payload} instead of object`, payload)
			return;
		}

		const decoded: IPayload = JSON.parse(payload.toString());

		console.log("RequestHandler::receivedPubMessage - decoded json body:", decoded)

		// userId,heartRate,steps,distance,gforce
		/*const split = payload.split(',').map(value => parseFloat(value));

		const userId = split[0];
		const heartrate = split[1];
		const steps = split[2];
		const distance = split[3];
		const gforce = split[4];*/

		//db.insertData(userId, heartrate, steps, distance, gforce);
	}

	empty = () => console.log("\n")
}

export default new RequestHandler();