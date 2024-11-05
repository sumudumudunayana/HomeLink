#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define RXp2 16
#define TXp2 17


const char* ssid = "XXXXX";
const char* password = "XXXXX";

const char* transmitEP = "http://XXXX.XXX.XXX.XXX:8000/api/mcu/data/receive";

const char* cmds[] = { "door_closed", "fan_on", "fan_off", "door_open" };  // Array of valid commands
const int numCmd = sizeof(cmds) / sizeof(cmds[0]);                         // Calculate number of commands



void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXp2, TXp2);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.println("Connecting to the WiFi...");
  }
  Serial.println("Connected");
  Serial.print("Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
}

void loop() {
  String cmdStr = Serial2.readString();
  cmdStr.trim();
  if(cmdStr.isEmpty()){
    return;
  }
  Serial.print("Recieved Command: ");
  Serial.println(cmdStr);

  //check command exists
  bool cmdFound = false;
  for (int i = 0; i < numCmd; i++) {
    if (cmdStr == cmds[i]) {
      cmdFound = true;
      break;
    }
  }
  if (cmdFound) {
    HTTPClient http;

    http.begin(transmitEP);
    http.addHeader("Content-Type", "application/json");

    // allocate the memory for the document
    const size_t CAPACITY = JSON_OBJECT_SIZE(1);
    StaticJsonDocument<CAPACITY> doc;

    JsonObject object = doc.to<JsonObject>();
    object["cmd"] = cmdStr;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(String(requestBody));

    if (httpResponseCode > 0) {
      Serial.print("Good HTTP response code: ");
    } else {
      Serial.print("Bad HTTP response code: ");
    }
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);

    http.end();
  } else {
    Serial.println("ERROR: Unknown Command");
  }
}