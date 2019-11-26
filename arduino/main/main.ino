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

SoftwareSerial rfSerial(2, 3);

Adafruit_BMP280 bmp(BMP_CS);

SoftwareSerial gpsSerial(8, 9);
Adafruit_GPS GPS(&gpsSerial);


void setup() {
    Serial.begin(115200);
    rfSerial.begin(9600);
    gpsSerial.begin(9600);
    gpsSerial.println(PMTK_Q_RELEASE);
    gpsSerial.println(PMTK_SET_NMEA_OUTPUT_RMCGGA);
    gpsSerial.println(PMTK_SET_NMEA_UPDATE_1HZ);
    if (!bmp.begin()) {  
      Serial.println("No BMP280 connect lol");
      while(1);
    }
    delay(1000);
}

uint32_t timer = millis();
void loop() {
  char c = GPS.read();
  if (GPS.newNMEAreceived()) {
    if (!GPS.parse(GPS.lastNMEA()))
      return;
  }
  if (timer > millis()) { timer = millis(); }
  if (millis() - timer > 500) {
    timer = millis(); // reset the timer
    String temp = String(bmp.readTemperature());
    String alt = String(bmp.readAltitude(1004));
    String pres = String(bmp.readPressure());
    if (GPS.fix) {
      String lat = String(GPS.latitude);
      String longitude = String(GPS.longitude);
      String altitude = String(GPS.altitude);
      String satellites = String(GPS.satellites);
      String angle = String(GPS.angle);
      String speedy = String(GPS.speed);
      Serial.println(("{\"alive\":" +  String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":{\"lat\":" + lat + ",\"long\":" + longitude + ",\"altitude\":" + altitude + ",\"satellites\":" + satellites + ",\"angle\":" + angle + ",\"speed\":" + speedy + "},\"team\":\"suzy\"}"));
      rfSerial.println(("{\"alive\":" +  String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":{\"lat\":" + lat + ",\"long\":" + longitude + ",\"altitude\":" + altitude + ",\"satellites\":" + satellites + ",\"angle\":" + angle + ",\"speed\":" + speedy + "},\"team\":\"suzy\"}"));
    } else {
      String json = ("{\"alive\":" +  String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":false,\"team\":\"suzy\"}");
      Serial.println(json);
      rfSerial.println(json);
    }
  }
}
