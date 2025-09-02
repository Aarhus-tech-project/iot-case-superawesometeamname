import { Client, PublishPacket } from "aedes";
import db from './DBHandlers'

type IPublishPacket = PublishPacket | PublishPacket & {
	brokerId: string;
	brokerCounter: number;
};

class RequestHandler {
	receivedPubMessage = async (client: Client, packet: IPublishPacket) => {
		console.log(`Received message from ${client.id} on topic ${packet.topic}`)

		const { payload } = packet;

		if (typeof payload !== 'string') {
			console.log(`Message from ${client.id} is invalid`)
			return;
		}

		// userId,heartRate,steps,distance,gforce
		const split = payload.split(',').map(value => parseFloat(value));

		const userId = split[0];
		const heartrate = split[1];
		const steps = split[2];
		const distance = split[3];
		const gforce = split[4];

		db.insertData(userId, heartrate, steps, distance, gforce);

	}

	empty = () => console.log("\n")
}

export default new RequestHandler();