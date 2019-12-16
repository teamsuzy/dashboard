//#include <Stepper.h>
#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
//#include <Adafruit_GPS.h>
#include <Servo.h>

//#define IN1 4
//#define IN2 4
//#define IN3 6
//#define IN4 7
//
#define BMP_SCK 13
#define BMP_MISO 12
#define BMP_MOSI 11
#define BMP_CS 10

//#define PMTK_SET_NMEA_UPDATE_1HZ "$PMTK220,1000*1F"
//#define PMTK_SET_NMEA_UPDATE_5HZ "$PMTK220,200*2C"
//#define PMTK_SET_NMEA_UPDATE_10HZ "$PMTK220,100*2F"
//
//// turn on only the second sentence (GPRMC)
//#define PMTK_SET_NMEA_OUTPUT_RMCONLY "$PMTK314,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29"
//// turn on GPRMC and GGA
//#define PMTK_SET_NMEA_OUTPUT_RMCGGA "$PMTK314,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*29"
//// turn on ALL THE DATA
//#define PMTK_SET_NMEA_OUTPUT_ALLDATA "$PMTK314,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0*28"
//// turn off output
//#define PMTK_SET_NMEA_OUTPUT_OFF "$PMTK314,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0*28"
//
//#define PMTK_Q_RELEASE "$PMTK605*31"
//const int stepsPerRevolution = 2048;

//Stepper leftStepper = Stepper(stepsPerRevolution, IN1, IN2, IN3, IN4);

SoftwareSerial rfSerial(2, 3);
Servo myservo;

Adafruit_BMP280 bmp(BMP_CS);

SoftwareSerial gpsSerial(8, 9);
//Adafruit_GPS GPS(&gpsSerial);

void setup()
{
  Serial.begin(9600); // start USB serial on 9600 baud
  while (!Serial) {
    ;
  }
  rfSerial.begin(9600);  // start RF  serial on 9600 baud
  //   gpsSerial.begin(9600); // start GPS serial on 9600 baud
  //   gpsSerial.println(PMTK_Q_RELEASE);
  //   gpsSerial.println(PMTK_SET_NMEA_OUTPUT_RMCGGA); // set the GPS output only GPRMC
  //   gpsSerial.println(PMTK_SET_NMEA_UPDATE_1HZ);    // set the GPS to 1Hz
  myservo.attach(A0);
  //   leftStepper.setSpeed(10);
  if (!bmp.begin())
  {
    Serial.println("No BMP280 connect lol");
    while (1);
  }
  delay(1000);
}

uint32_t timer = millis(); // set the timer
void loop()
{
  if (rfSerial.available())
  {
    int input = rfSerial.parseInt();
    //    String input = rfSerial.readStringUntil('\n');
    //      char beginning = input.charAt(0);
    //    if (input[0] == "S")
    //    {
    //      Serial.println(input);
    //      int degree = input.toInt();
    if (input > 0 && input < 180)
    {
      //          rfSerial.write("test:");
      myservo.write(input);
    }
    //    }
  }
  //  delay(20);
  //  char c = GPS.read();
  //  if (GPS.newNMEAreceived())
  //  {
  //    if (!GPS.parse(GPS.lastNMEA()))
  //      return;
  //  }
  //  if (timer > millis())
  //  {
  //    timer = millis();
  //  } // reset the timer
  //  if (millis() - timer > 500)
  //  {
  //    timer = millis(); // reset the timer
  //
  //    String temp = String(bmp.readTemperature());   // read temperature from BMP
  //    String alt = String(bmp.readAltitude(1016.5)); // read altitude    from BMP
  //    String pres = String(bmp.readPressure());      // read pressure    from BMP
  //    //    if (GPS.fix)
  //    //    {
  //    //      //      Serial.print(GPS.longitude * 1000000000);
  //    //      //      rfSerial.print(GPS.longitude * 1000000000);
  //    //      //      Serial.print(",");
  //    //      //      rfSerial.print(",");
  //    //      //      Serial.print(GPS.latitude * 1000000000);
  //    //      //      rfSerial.print(GPS.latitude * 1000000000);
  //    //      String lat = String(GPS.latitude, 10);          // read latitude    from GPS
  //    //      String longitude = String(GPS.longitude, 10);   // read longitude   from GPS
  //    //      String altitude = String(GPS.altitude, 10);     // read altitude    from GPS
  //    //      String satellites = String(GPS.satellites, 10); // read satellites  from GPS
  //    //      String angle = String(GPS.angle, 10);           // read angle       from GPS
  //    //      String speedy = String(GPS.speed, 10);          // read speed       from GPS
  //    //      Serial.println(("{\"alive\":" + String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":{\"lat\":" + lat + ",\"long\":" + longitude + ",\"altitude\":" + altitude + ",\"satellites\":" + satellites + ",\"angle\":" + angle + ",\"speed\":" + speedy + "},\"team\":\"suzy\"}"));
  //    //      rfSerial.println(("{\"alive\":" + String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":{\"lat\":" + lat + ",\"long\":" + longitude + ",\"altitude\":" + altitude + ",\"satellites\":" + satellites + ",\"angle\":" + angle + ",\"speed\":" + speedy + "},\"team\":\"suzy\"}"));
  //    //    }
  //    //    else
  //    //    {
  //    //      String json = ("{\"alive\":" + String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":" + String(GPS.satellites) + ",\"team\":\"suzy\"}");
  //    String json = ("{\"alive\":" + String(millis()) + ",\"temperature\":" + temp + ",\"altitude\":" + alt + ",\"pressure\":" + pres + ",\"gps\":false,\"team\":\"suzy\"}");
  //    //      Serial.println(json);
  //    rfSerial.println(json);
  //    //        Serial.println((GPS.fix + 1) * 1000000000);
  //    //        rfSerial.println((GPS.fix + 1) * 1000000000);
  //    //    }
  //  }
}
