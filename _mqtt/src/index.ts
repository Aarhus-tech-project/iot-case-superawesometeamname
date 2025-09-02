/// <reference path="types.d.ts" />
import aedes from 'aedes';
import { createServer } from 'net';
import RequestHandler from './processors/RequestHandler';

const mqttPort = 1883;
const topic = "tracker"; 

const broker = new aedes();

// TCP MQTT server
const mqttServer = createServer(broker.handle);
mqttServer.listen(mqttPort, () => {
	console.log(`🚀 MQTT broker started on port ${mqttPort}`);
});

mqttServer.on("error", (err) => {
	console.log("MQTT server error: ", err);
})

broker.on("publish", (packet, client) => {
	// if our client or packet is invalid dont do anything
	if (!client || !packet) return;

	// if our topic is not the one we want dont do anything
	if (packet.topic !== topic) return;

	RequestHandler.receivedPubMessage(client, packet);
	RequestHandler.empty();
})