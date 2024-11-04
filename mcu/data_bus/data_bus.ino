#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "XXXXXX";
const char* password = "XXXXXX";

const char* serverName = "http://XXX.XXX.X.X:8000/";

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  WiFi.begin(ssid,password);

  while(WiFi.status() != WL_CONNECTED){
    delay(100);
    Serial.println("Connecting to the WiFi...");
  }
  Serial.println("Connected");
  Serial.print("Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
}

void loop() {
  delay(500);
  Serial.println("Ready for Input");

  while(Serial.available() == 0){}
  String testStr  = Serial.readString();
  testStr.trim();
  if (testStr != "Skip"){
    HTTPClient http;

    http.begin(serverName);
    http.addHeader("Content-Type", "text/plain");
    String httpRequestData = testStr;
    int httpResponseCode = http.POST(httpRequestData);
    
    if (httpResponseCode > 0){
      Serial.print("Good HTTP response code: ");
    }else{
      Serial.print("Bad HTTP response code: ");
    }
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);

    http.end();
  }else{
    Serial.println("Skip");
  }

}