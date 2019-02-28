/*
 * Meditation Vibe simulates a breathing mediation giving haptic cues as feedback of when to inhale and exhale
 */
int fadeAmount = 5;
int brightness = 0;
int vibePin = 9;

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(vibePin, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  int startTime = millis();
  int endTime = startTime;
  // Inhale - Vibrate 4s    
  Serial.print("Inhale");
  Serial.print(",");
  Serial.println(1);
  while ((endTime - startTime) <= 4000) {
    analogWrite(vibePin, brightness); 
    
    // change the brightness for next time through the loop:
    brightness = brightness + fadeAmount;

    // reverse the direction of the fading at the ends of the fade:
    if (brightness <= 0 || brightness >= 150) {
      fadeAmount = -fadeAmount;
    }

    // wait for 30 milliseconds to see the dimming effect
    delay(30);
    
    endTime = millis();
  }
  
  // Hold Breath - no vibration for 1.5s
  Serial.print("Hold");
  Serial.print(",");
  Serial.println(2);
  analogWrite(vibePin, 0); 
  delay(1500);

  // Exhale - no vibration for 4s
  Serial.print("Exhale");
  Serial.print(",");
  Serial.println(0);
  
  startTime = millis();
  endTime = startTime;
  brightness = 0;
  while ((endTime - startTime) <= 4000) {
  analogWrite(vibePin, brightness); 
    
  // change the brightness for next time through the loop:
  brightness = brightness + fadeAmount;

  // reverse the direction of the fading at the ends of the fade:
  if (brightness <= 0 || brightness >= 150) {
    fadeAmount = -fadeAmount;
  }

  // wait for 30 milliseconds to see the dimming effect
  delay(30);
    
  endTime = millis();
  }      
  
  // Hold Breath - no vibration for 1.5s
  Serial.print("Hold");
  Serial.print(",");
  Serial.println(2);
  analogWrite(vibePin, 0); 
  delay(1500);
}
