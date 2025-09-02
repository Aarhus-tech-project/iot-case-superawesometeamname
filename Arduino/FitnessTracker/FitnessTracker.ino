#include <WiFi.h>
#include <Wire.h>
#include <ArduinoMqttClient.h>
#include "DFRobot_BloodOxygen_S.h"
#include <U8g2lib.h>

// ---- WiFi ----
const char* ssid     = "h4prog";
const char* password = "1234567890";

// ---- MQTT ----
const char* brokerIP = "192.168.102.253";
const char* mqttTopic = "tracker";

WiFiClient wifiClient;
MqttClient mqtt(wifiClient);

//OLED
U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);

int bpm = 72;


// ---- ADXL313 ----
const uint8_t ADXL_ADDR       = 0x1D;
const uint8_t REG_DEVID       = 0x00;
const uint8_t REG_POWER_CTL   = 0x2D;
const uint8_t REG_DATA_FORMAT = 0x31;
const uint8_t REG_BW_RATE     = 0x2C;
const uint8_t REG_DATAX0      = 0x32;

// Step counting
int steps = 0;
bool stepReady = false;
float strideLength = 0.75; // meters, adjust by user height

#define I2C_ADDRESS 0x57
DFRobot_BloodOxygen_S_I2C MAX30102(&Wire, I2C_ADDRESS);

// ---- Helpers ----
void writeReg(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(reg);
  Wire.write(val);
  Wire.endTransmission();
}

uint8_t readReg8(uint8_t reg) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL_ADDR, (uint8_t)1);
  return Wire.read();
}

void readXYZ(int16_t& x, int16_t& y, int16_t& z) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(REG_DATAX0);
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL_ADDR, (uint8_t)6);

  uint8_t x0 = Wire.read();  uint8_t x1 = Wire.read();
  uint8_t y0 = Wire.read();  uint8_t y1 = Wire.read();
  uint8_t z0 = Wire.read();  uint8_t z1 = Wire.read();

  x = (int16_t)((x1 << 8) | x0);
  y = (int16_t)((y1 << 8) | y0);
  z = (int16_t)((z1 << 8) | z0);
}

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

void initADXL313() {
  Wire.begin();
  Wire.setClock(400000);

  uint8_t devid = readReg8(REG_DEVID);
  Serial.print("ADXL313 DEVID: 0x"); Serial.println(devid, HEX);

  // 100 Hz, ±2g, measure mode
  writeReg(REG_BW_RATE, 0x0A);
  writeReg(REG_DATA_FORMAT, 0x00); // ±2g
  writeReg(REG_POWER_CTL, 0x08);   // measure bit
}

void initMAX30102() {
  Serial.println("Initializing MAX30102 (I2C mode)...");
  if (!MAX30102.begin()) {
    Serial.println("MAX30102 init failed. check wiring");
    while (1);
  }
  MAX30102.sensorStartCollect();
  Serial.println("MAX30102 started measuring.");
}

void initOLED() {
  u8g2.begin();             // start display
  u8g2.clearBuffer();       // clear internal memory
  u8g2.setFont(u8g2_font_ncenB14_tr); // pick a readable font
  u8g2.drawStr(0, 24, "BPM:");        // static label
  u8g2.sendBuffer();        // transfer to screen
}

void updateOLED(int bpmValue) {
char buf[8];
  snprintf(buf, sizeof(buf), "%d", bpmValue); // convert int → string

  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB14_tr);
  u8g2.drawStr(0, 24, "BPM:");

  u8g2.setFont(u8g2_font_fub30_tn); // big numeric font
  u8g2.drawStr(0, 62, buf);

  u8g2.sendBuffer(); // draw to screen
}

void measureAndSend() {
  int16_t x, y, z;
  readXYZ(x, y, z);

  const float LSB_PER_G = 512.0f;
  float gx = x / LSB_PER_G;
  float gy = y / LSB_PER_G;
  float gz = z / LSB_PER_G;

  float gVector = sqrt(gx*gx + gy*gy + gz*gz);

  // Step detection: simple threshold
  if (gVector > 1.2 && !stepReady) {
    steps++;
    stepReady = true;
  }
  if (gVector < 1.0) {
    stepReady = false;
  }

  float distance = steps * strideLength / 1000.0; // in km

  MAX30102.getHeartbeatSPO2();
  int spo2     = MAX30102._sHeartbeatSPO2.SPO2;
  int bpm      = MAX30102._sHeartbeatSPO2.Heartbeat;
  float tempC  = MAX30102.getTemperature_C();

  // ---- Publish JSON to MQTT ----
  String payload = "{";
  payload += "\"userId\":" + String(1) + ",";
  payload += "\"steps\":" + String(steps) + ",";
  payload += "\"distance\":" + String(distance, 2) + ",";
  payload += "\"gforce\":" + String(gVector, 2) + ",";
  payload += "\"spo2\":" + String(spo2) + ",";
  payload += "\"bpm\":" + String(bpm) + ",";
  payload += "\"temp\":" + String(tempC, 1);
  payload += "}";

  Serial.println("Publishing: " + payload);

  mqtt.beginMessage(mqttTopic);
  mqtt.print(payload);
  mqtt.endMessage();
}

// ---- Setup/loop ----
void setup() {
  Serial.begin(115200);
  while (!Serial);

  connectWiFi();
  initADXL313();
  initMAX30102();
  initOLED();
  connectToMQTT();
}

void loop() {
  mqtt.poll();   // keep connection alive

  bpm = MAX30102._sHeartbeatSPO2.Heartbeat;
  updateOLED(bpm);
  delay(1000);

  static unsigned long lastSend = 0;

  if (millis() - lastSend > 3000) {  // every 3s
    measureAndSend();
    lastSend = millis();
  }

  if (!mqtt.connected()) {
    Serial.println("MQTT disconnected. Reconnecting...");
    connectToMQTT();
  }
}