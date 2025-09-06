#include <WiFi.h>
#include <Wire.h>
#include <ArduinoMqttClient.h>
#include "Accelerometer.h"
#include "PulseSensor.h"
#include "OLED.h"

// ---- WiFi ----
const char* ssid     = "h4prog";
const char* password = "1234567890";

// ---- MQTT ----
const char* brokerIP = "192.168.102.253";
const char* mqttTopic = "tracker";

WiFiClient wifiClient;
MqttClient mqtt(wifiClient);

//GLOBAL HARDWARE OBJECTS
#define I2C_ADDRESS 0x57
U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);
DFRobot_BloodOxygen_S_I2C MAX30102(&Wire, I2C_ADDRESS);

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  while (WiFi.localIP() == INADDR_NONE) {
    delay(100);
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void connectToMQTT() {
  Serial.println("Connecting to MQTT...");
  mqtt.setId("arduino-tracker");

  while (!mqtt.connect(brokerIP)) {
    Serial.print("MQTT failed, code: ");
    Serial.println(mqtt.connectError());
    delay(5000);
  }
  Serial.println("Connected to MQTT broker");
}

// ---- Publish MQTT payload ----
void publishData() {
  float distance = steps * strideLength / 1000.0; // km

  int spo2, bpm;
  float tempC;
  measureVitals(spo2, bpm, tempC);

  String payload = "{";
  payload += "\"userId\":" + String(1) + ",";
  payload += "\"steps\":" + String(steps) + ",";
  payload += "\"distance\":" + String(distance, 2) + ",";
  payload += "\"spo2\":" + String(spo2) + ",";
  payload += "\"bpm\":" + String(bpm) + ",";
  payload += "\"temp\":" + String(tempC, 1);
  payload += "}";

  Serial.println("Publishing: " + payload);

  mqtt.beginMessage(mqttTopic);
  mqtt.print(payload);
  mqtt.endMessage();

  // Update OLED too
  updateOLED(bpm);
}

// ---- Main loop ----
void loop() {
  mqtt.poll();          // keep MQTT alive
  measureSteps();       // update steps continuously

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 3000) {  // every 3s
    publishData();
    lastSend = millis();
  }

  // if (!mqtt.connected()) {
  //   Serial.println("MQTT disconnected. Reconnecting...");
  //   connectToMQTT();
  // }

  delay(20); // ~50 Hz step detection
}

// ---- Setup/loop ----
void setup() {
  Serial.begin(115200);
  while (!Serial);

  //connectWiFi();
  initADXL313();
  initMAX30102();
  initOLED();
 //connectToMQTT();
}
