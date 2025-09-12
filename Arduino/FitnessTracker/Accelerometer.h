#pragma once
#include <SparkFunADXL313.h>

extern ADXL313 myAdxl;
extern int steps;
extern float strideLength;
extern float distance;

static bool stepReady = false;s

inline void initADXL313() {
  if (!myAdxl.begin()) {
    Serial.println("The sensor didn't respond, check wiring");
    while(1);
  }

  Serial.print("Sensor is connected");

  myAdxl.measureModeOn();
}

inline void measureSteps() {
  if(myAdxl.dataReady())
  {
    myAdxl.readAccel();

    float x_g = myAdxl.x / 512.0;
    float y_g = myAdxl.y / 512.0;
    float z_g = myAdxl.z / 512.0;

    float gVector = sqrt(x_g * x_g + y_g * y_g + z_g * z_g);

    if (gVector > 1.08 && !stepReady) {
      steps++;
      stepReady = true;
    }
    if (gVector < 1.00) {
      stepReady = false;
    }

    distance = steps * strideLength / 1000.0; // km

    // Serial.print("X: "); Serial.print(x_g, 2);
    // Serial.print("\tY: "); Serial.print(y_g, 2);
    // Serial.print("\tZ: "); Serial.print(z_g, 2);
    Serial.print("\tSteps: "); Serial.println(steps);
    Serial.print("\tDistance: "); Serial.println(distance);
  }
}
