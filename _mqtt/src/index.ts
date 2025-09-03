/// <reference path="types.d.ts" />
import aedes from 'aedes';
import { createServer } from 'net';
import RequestHandler from './processors/RequestHandler';
import { LoggerContext } from './LoggerContext';

const mqttPort = 1883;
const topic = "tracker"; 

const broker = new aedes();
const logger = new LoggerContext("Broker");

// TCP MQTT server
const mqttServer = createServer(broker.handle);
mqttServer.listen(mqttPort, () => {
	logger.info('Listen', `🚀 MQTT broker started on port ${mqttPort}`);
});

mqttServer.on("error", (err) => {
	logger.error('Error', `MQTT server error: ${err}`);
})

broker.on("publish", (packet, client) => {
	try {
		// if our client or packet is invalid dont do anything
		if (!client || !packet) return;

		// if our topic is not the one we want dont do anything
		if (packet.topic !== topic) return;

		logger.info('Subscriber', `Recievied packet from ${client.id} ${packet.brokerId}`)

		RequestHandler.receivedPubMessage(client, packet);
	} catch (err) {
		logger.error('Subcriber', `Error mqtt broker: ${err}`);
	}
})