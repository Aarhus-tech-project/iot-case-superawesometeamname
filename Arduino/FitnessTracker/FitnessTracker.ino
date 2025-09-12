#include <WiFi.h>
#include <Wire.h>
#include <ArduinoMqttClient.h>
#include "Accelerometer.h"
#include "PulseSensor.h"
#include "OLED.h"
#include "GPS.h"

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
ADXL313 myAdxl;
int steps = 0;
float strideLength = 0.75;
float distance = 0.00;
TinyGPSPlus gps;
HardwareSerial GPSSerial(1);

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

  int spo2, bpm;
  float tempC;
  measureVitals(spo2, bpm, tempC);

  double lat = 0, lng = 0, hdop = 0;
  int sats = 0;
  bool hasFix = getCoordinates(lat, lng, sats, hdop);

  String payload = "{";
  payload += "\"userId\":" + String(1) + ",";
  payload += "\"steps\":" + String(steps) + ",";
  payload += "\"distance\":" + String(distance, 2) + ",";
  payload += "\"spo2\":" + String(spo2) + ",";
  payload += "\"bpm\":" + String(bpm) + ",";
  payload += "\"temp\":" + String(tempC, 1) + ",";   // <-- always end with comma

  if (hasFix) {
    payload += "\"lat\":" + String(lat, 6) + ",";
    payload += "\"lng\":" + String(lng, 6) + ",";
    payload += "\"sats\":" + String(sats) + ",";
    payload += "\"hdop\":" + String(hdop, 2);
  } else {
    payload += "\"lat\":0,\"lng\":0,\"sats\":0,\"hdop\":0";
  }
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
    //publishData();
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

  Wire.begin();
  //connectWiFi();
  initADXL313();
  //initMAX30102();
  //initOLED();
  //initGPS();
  //connectToMQTT();
}
