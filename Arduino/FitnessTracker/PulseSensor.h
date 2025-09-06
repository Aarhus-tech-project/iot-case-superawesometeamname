#pragma once
#include <DFRobot_BloodOxygen_S.h>

extern DFRobot_BloodOxygen_S_I2C MAX30102;

// ---- MAX30102 vitals ----
inline void measureVitals(int &spo2, int &bpm, float &tempC) {
  MAX30102.getHeartbeatSPO2();
  spo2  = MAX30102._sHeartbeatSPO2.SPO2;
  bpm   = MAX30102._sHeartbeatSPO2.Heartbeat;
  tempC = MAX30102.getTemperature_C();
}

inline void initMAX30102() {
  Serial.println("Initializing MAX30102 (I2C mode)...");
  if (!MAX30102.begin()) {
    Serial.println("MAX30102 init failed. check wiring");
    while (1);
  }
  MAX30102.sensorStartCollect();
  Serial.println("MAX30102 started measuring.");
}
