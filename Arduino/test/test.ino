#include "Arduino.h"
#include <Sodaq_UBlox_GPS.h>

#define debugSerial SerialUSB
#define loraSerial Serial1

int alert;
uint32_t next;
String coords;

void setup() {

  while ((!debugSerial) && (millis() < 10000)) {}

  debugSerial.begin(57600);
  loraSerial.begin(57600);

  sodaq_gps.init(GPS_ENABLE);

  pinMode(BUTTON, INPUT_PULLUP);
  attachInterrupt(BUTTON, interruptButton, FALLING);

  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_BLUE, HIGH);

  loraSerial.write("sys reset\r\n");
  delay(200);
  loraSerial.write("radio set mod lora\r\n");
  delay(100);
  loraSerial.write("radio set freq 868000000\r\n");
  delay(100);
  loraSerial.write("radio set pwr 14\r\n");
  delay(100);
  loraSerial.write("radio set sf sf7\r\n");
  delay(100);
  loraSerial.write("radio set prlen 8\r\n");
  delay(100);
  loraSerial.write("radio set crc on\r\n");
  delay(100);
  loraSerial.write("radio set iqi on\r\n");
  delay(100);
  loraSerial.write("radio set cr 4/5\r\n");
  delay(100);
  loraSerial.write("radio set bw 500\r\n");
  delay(100);
  loraSerial.write("mac pause\r\n");
  delay(100);

  alert = 0;
  next = 0;
  coords = find_fix();
}

void loop() {
  
  if (next < millis()) {
    send(alert);
    next = millis() + 15000;
    coords = find_fix();
  }
  
  if (loraSerial.available()) {
    while (loraSerial.available()) {
      uint8_t inChar = loraSerial.read();
      debugSerial.write(inChar);
    }
  }
}

String find_fix() {
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_BLUE, LOW);
  uint32_t start = millis();
  debugSerial.println("Waiting for fix ..., timeout = 300000ms");
  if (sodaq_gps.scan(false, 300000)) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_BLUE, HIGH);
    return String(sodaq_gps.getLat(), 7)+String(";")+String(sodaq_gps.getLon(), 7);
  } else {
    return "0.0;0.0";
  }
}

void interruptButton() {
  alert = 1 - alert;
  if (alert) {
    digitalWrite(LED_RED, LOW);
  } else {
    digitalWrite(LED_RED, HIGH);
  }
  next = 0;
}

void send(int alert) {
  while (coords == String("0.0;0.0")) {
    coords = find_fix();
  }
  String toSend;
  if (alert) {
    toSend = "radio tx 602440363b313b"; // `$@6;1;
  } else {
    toSend = "radio tx 602440363b303b"; // `$@6;0;
  }
  for (int i = 0; i < coords.length(); i++) {
    if (coords[i] == ';') {
      toSend += "3b";
    } else if (coords[i] == '.') {
      toSend += "2e";
    } else {
      toSend += "3" + String(coords[i]);
    }
  }
  toSend += "5f\r\n";
  debugSerial.println(millis());
  debugSerial.print(toSend);
  for (int i = 0; i < toSend.length(); i++) {
    uint8_t inChar = toSend[i];
    loraSerial.write(inChar);
  }
  loraSerial.flush();
}

