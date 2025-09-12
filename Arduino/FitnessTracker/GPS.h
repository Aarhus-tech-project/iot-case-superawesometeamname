#pragma once
#include <TinyGPSPlus.h>

// Global GPS objects
extern TinyGPSPlus gps;
extern HardwareSerial GPSSerial;

// Pin mapping (XIAO ESP32-C3)
// GPS TX -> D7 (GPIO20)
// GPS RX -> D6 (GPIO21)
static const int GPS_RX = 20;  // from GPS TX
static const int GPS_TX = 21;  // to GPS RX
static const uint32_t GPS_BAUD = 9600;

// ---- Initialization ----
inline void initGPS() {
  GPSSerial.begin(GPS_BAUD, SERIAL_8N1, GPS_RX, GPS_TX);
  Serial.println("GPS initialized on Serial1 (D7=RX, D6=TX)");
}

// ---- Read and update ----
inline void pollGPS() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }
}

// ---- Get latest coords ----
inline bool getCoordinates(double &lat, double &lng, int &sats, double &hdop) {
  pollGPS();
  if (gps.location.isValid()) {
    lat = gps.location.lat();
    lng = gps.location.lng();
    sats = gps.satellites.isValid() ? gps.satellites.value() : 0;
    hdop = gps.hdop.isValid() ? gps.hdop.hdop() : 0;
    return true;
  }
  return false;
}
