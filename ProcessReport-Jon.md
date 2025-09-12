#### Introduction
My responsibility in this projcet, is to manage the hardware components of the FitnessTracker, both by Wiring and coding.
I Also the one responsible for the Frontend, that'll show the result of the measurements the different sensors measure.

#### Accelerometer
The ADXL313 sensor was somewhat easy enough to setup, altough there were slight problems.
The sensor itself only measures raw x/y/z values which I convert to g's (g-force), which is then converted to steps + distance.
The distance is a bit tricky to measure since every persons stridelength is different, and I need to find a way to dynamically set it.
The step counter increments when: the sensor moves in a direction -> stops moving that direction -> steps increase.

#### Pulse Sensor
The MAX30102 sensor is a little annoying, and I doubt it can be done perfectly.
As of right now, it can measure your pulse (bpm), body temp and SpO2 (Oxygen in the blood). Although you need to press your finger firmly on the infrared lamp, and when it starts to measure, it stops measuring properly after 20-30 seconds.
If the sensor gets out of sync for just a moment (looses it signal), then it can't measure properly, and will show -1 values until it's reset. I'm not sure how this can be prevented.

#### OLED display
The OLED (U8g2) was the easiest and most straight forward sensor to setup.
It the setup function, it's initialized with a value, and then the loop calls a function that contantly updates it with the MAX30102 sensors values.

#### GPS
This was the most tricky and annoying sensor to setup.
I used a code example for the gps module, but already there came accross a problem, I'm using a seeduino xiao esp32-c3 (For making the tracker as compact as possible), but the only working example i could find were using softwareserial - the seeduino doesn't have that.

I tried setting it up first on my regular arduino, but no matter what, it wouldn't work, even after trying different code examples, different baud ranges, different pins etc.
Our teacher got his to work using the same code and same setup as me, but for some reason it didn't work for me. I tried using a brand new arduino, still didn't work, tried different cables etc. still nothing.
My teachers arduino was the only different, he was using an old arduino, which also worked on my pc, but we couldn't use it, as we need an arduino with wifi.
At last i managed to make the GPS module work on the seeduino by using HardwareSerial, but it was a long struggle to make it work.