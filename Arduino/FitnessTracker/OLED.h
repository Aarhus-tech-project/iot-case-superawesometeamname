#pragma once
#include <U8g2lib.h>

extern U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2;

inline void initOLED() {
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB14_tr);
  u8g2.drawStr(0, 24, "BPM:");
  u8g2.sendBuffer();
}

inline void updateOLED(int bpmValue) {
  char buf[8];
  snprintf(buf, sizeof(buf), "%d", bpmValue);

  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB14_tr);
  u8g2.drawStr(0, 24, "BPM:");

  u8g2.setFont(u8g2_font_fub30_tn);
  u8g2.drawStr(0, 62, buf);

  u8g2.sendBuffer();
}
