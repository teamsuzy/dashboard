#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_GPS.h>

#define BMP_SCK 13
#define BMP_MISO 12
#define BMP_MOSI 11 
#define BMP_CS 10

#define PMTK_SET_NMEA_UPDATE_1HZ  "$PMTK220,1000*1F"
#define PMTK_SET_NMEA_UPDATE_5HZ  "$PMTK220,200*2C"
#define PMTK_SET_NMEA_UPDATE_10HZ "$PMTK220,100*2F"

// turn on only the second sentence (GPRMC)
#define PMTK_SET_NMEA_OUTPUT_RMCONLY "$PMTK314,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29"
// turn on GPRMC and GGA
#define PMTK_SET_NMEA_OUTPUT_RMCGGA  "$PMTK314,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29"
// turn on ALL THE DATA
#define PMTK_SET_NMEA_OUTPUT_ALLDATA "$PMTK314,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0*28"
// turn off output
#define PMTK_SET_NMEA_OUTPUT_OFF "$PMTK314,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*28"

#define PMTK_Q_RELEASE "$PMTK605*31"

Adafruit_BMP280 bmp(BMP_CS);
SoftwareSerial gpsSerial(8, 9);
Adafruit_GPS GPS(&gpsSerial);

String msg;
int counter = 0;

void setup() {
    Serial.begin(9600);
    gpsSerial.begin(9600);
    gpsSerial.println(PMTK_Q_RELEASE);
    gpsSerial.println(PMTK_SET_NMEA_OUTPUT_RMCGGA);
    gpsSerial.println(PMTK_SET_NMEA_UPDATE_1HZ);
    if (!bmp.begin()) {  
      Serial.println("Could not find a valid BMP280 sensor, check wiring!");
      while(1);
    }
    delay(1000);
//    delay(150);
}

uint32_t timer = millis();
void loop() {
  char c = GPS.read();
    if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
    //Serial.println(GPS.lastNMEA());   // this also sets the newNMEAreceived() flag to false
    if (!GPS.parse(GPS.lastNMEA()))   // this also sets the newNMEAreceived() flag to false
      return;  // we can fail to parse a sentence in which case we should just wait for another
  }
//  counter++;
//  String temp = String(bmp.readTemperature());
//  String alt = String(bmp.readAltitude(1004));
//  String pres = String(bmp.readPressure());
//  if(Serial.available() > 0){
//    msg = Serial.readString();
//    if(msg == '1') {
//      digitalWrite(LED_BUILTIN, HIGH);
//      Serial.println("{\"led\":1, \"team\": \"suzy\"}");
//    } else if(msg == '2') {
//      digitalWrite(LED_BUILTIN, LOW);
//      Serial.println("{\"led\":0}");
//    } else if(msg == '3') {
//      Serial.println("{\"temperature\":" + temp + ", \"team\": \"suzy\"}");
//    } else if(msg == '4') {
//      Serial.println();
//      Serial.println("{\"altitude\":" + alt + ", \"team\": \"suzy\"}");
//    } else if(msg == '5') {
//      Serial.println("{\"pressure\":" + pres + ", \"team\": \"suzy\"}");
////    } else if(Number(msg) <= 180 && msg >= 0) {/
////      myServo.write(msg);
////      Serial.println("{\"servo\":" + String(msg) + ", \"team\": \"suzy\"}");
//    } else {
//      Serial.println("{\"msg\":\"" + msg + "\", \"team\": \"suzy\"}");
//    }
//  }
if (timer > millis())  timer = millis();
  if (millis() - timer > 2000) {
    timer = millis(); // reset the timer
    String temp = String(bmp.readTemperature());
    String alt = String(bmp.readAltitude(1004));
    String pres = String(bmp.readPressure());
    String gps = String(GPS.hour) + String(GPS.minute) + String(GPS.seconds);
    String json = ("{\"alive\":" + String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ", \"gps\":" + gps + ", \"team\": \"suzy\"}");
    Serial.println(json);
//    counter = 0;
  }
//  delay(20);
//  if (gpsSerial.available()) {
//    char c = gpsSerial.read();
//    Serial.write(c);
//  }
}
