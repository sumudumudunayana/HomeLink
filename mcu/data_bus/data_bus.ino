#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <WiFi.h>


#define RXp2 16
#define TXp2 17

const char* ssid = "XXXXXX";
const char* password = "XXXXX";
const char* websockets_server = "ws://XXX.XXX.XX.XX:8000/ws/control/mcu";  //server adress and port


using namespace websockets;

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Command from server: ");
  StaticJsonDocument<200> doc;
  deserializeJson(doc, message.data());
  const char* command = doc["status"];
  Serial.println(command);
  Serial2.println(command);
  delay(500);
}

void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    Serial.println("Connnection Opened");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("Connnection Closed");
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("Got a Ping!");
  } else if (event == WebsocketsEvent::GotPong) {
    Serial.println("Got a Pong!");
  }
}

WebsocketsClient client;
void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXp2, TXp2);

  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  Serial.print("Connecting to the WiFi");
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
    Serial.println(".");
    delay(1000);
  }
  Serial.println("Connected");
  Serial.print("Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");

  // Setup Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect to server
  client.connect(websockets_server);
}

void loop() {
  if(!client.available()) {
        client.connect(websockets_server);
  }
  client.poll();

  String cmdStr = Serial2.readString();
  cmdStr.trim();
  if (cmdStr.isEmpty()) {
    return;
  }
  Serial.print("Recieved Command: ");
  Serial.println(cmdStr);

  const size_t CAPACITY = JSON_OBJECT_SIZE(1024);
  StaticJsonDocument<CAPACITY> doc;

  JsonObject object = doc.to<JsonObject>();
  object["cmd"] = cmdStr;

  String payload;
  serializeJson(doc, payload);
  client.send(payload);
  delay(200);
}