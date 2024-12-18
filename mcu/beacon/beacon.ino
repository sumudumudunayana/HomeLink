#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

#include "config.h"
#include "envs.h"

using namespace websockets;

WebsocketsClient client;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

  // Connect to Wi-Fi
  connectToWiFi();

  // Print the device's IP address
  Serial.print("Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");

  // Setup WebSocket Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect to WebSocket server
  client.connect(WEBSOCKET_SERVER);
}

void loop() {
  // Reconnect if WebSocket connection is lost
  if (!client.available()) {
    client.connect(WEBSOCKET_SERVER);
  }
  client.poll();

  // Read command from Serial2
  String cmdStr = Serial2.readString();
  cmdStr.trim();
  if (cmdStr.isEmpty()) {
    return;
  }

  Serial.print("Received Command: ");
  Serial.println(cmdStr);

  // Send command to WebSocket server as JSON
  const size_t CAPACITY = JSON_OBJECT_SIZE(1024);
  StaticJsonDocument<CAPACITY> doc;
  JsonObject object = doc.to<JsonObject>();
  object["cmd"] = cmdStr;

  String payload;
  serializeJson(doc, payload);
  client.send(payload);
  delay(200);
}