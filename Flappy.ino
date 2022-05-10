#include "PDMSerial.h"
//Control bird using button. Light dims brighter if bird is about to hit.

PDMSerial pdm;

const int buttonPin = 2;
const int ledPin = 6;
int previous = LOW;
int reading;
int buttonstate;

unsigned long lastDebounce = 0;
unsigned long debounceDelay = 2;
void setup() {
  // put your setup code here, to run once:
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  analogWrite(ledPin, 255);
  reading = digitalRead(buttonPin);

  if(reading != previous){
    lastDebounce = millis();  
  }

  if((millis() - lastDebounce) > debounceDelay){
    if(reading != buttonstate){
      buttonstate = reading;

      if(buttonstate == HIGH){
        //Serial.print(buttonstate);
        pdm.transmitSensor("state", buttonstate);
        pdm.transmitSensor("end");  
      }
      else
      {
        //Serial.print(buttonstate);
        pdm.transmitSensor("state", buttonstate);
        pdm.transmitSensor("end");  
      }
    }  
  }

  previous = reading;

  boolean newData = pdm.checkSerial();

  if(newData){
    if(pdm.getName().equals(String("hit"))){
        for (int fadeValue = 250 ; fadeValue >= 0; fadeValue -= 20) {
    // sets the value (range from 0 to 255):
          analogWrite(ledPin, fadeValue);
    // wait for 30 milliseconds to see the dimming effect
          delay(50);
    }
    analogWrite(ledPin, 0);  
  }
  }

  delay(10);
}
