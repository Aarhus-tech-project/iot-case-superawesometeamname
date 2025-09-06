// ---- ADXL313 ----
const uint8_t ADXL_ADDR       = 0x1D;
const uint8_t REG_DEVID       = 0x00;
const uint8_t REG_POWER_CTL   = 0x2D;
const uint8_t REG_DATA_FORMAT = 0x31;
const uint8_t REG_BW_RATE     = 0x2C;
const uint8_t REG_DATAX0      = 0x32;

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

void initADXL313() {
  uint8_t devid = readReg8(REG_DEVID);
  Serial.print("ADXL313 DEVID: 0x"); Serial.println(devid, HEX);

  // 100 Hz, ±2g, measure mode
  writeReg(REG_BW_RATE, 0x0A);
  writeReg(REG_DATA_FORMAT, 0x00);
  writeReg(REG_POWER_CTL, 0x08);
}

// Step counting
int steps = 0;
bool stepReady = false;
float strideLength = 0.75; // meters, adjust by user height

// ---- Step detection ----
void measureSteps() {
  int16_t x, y, z;
  readXYZ(x, y, z);

  const float LSB_PER_G = 512.0f;
  float gx = x / LSB_PER_G;
  float gy = y / LSB_PER_G;
  float gz = z / LSB_PER_G;
  float gVector = sqrt(gx*gx + gy*gy + gz*gz);

  // Step detection
  if (gVector > 1.08 && !stepReady) {
    steps++;
    stepReady = true;
  }
  if (gVector < 1.00) {
    stepReady = false;
  }
}