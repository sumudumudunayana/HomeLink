// Callback for handling incoming WebSocket messages
void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Command from server: ");
  StaticJsonDocument<200> doc;
  deserializeJson(doc, message.data());
  const char* command = doc["status"];
  Serial.println(command);
  Serial2.println(command);
  delay(500);
}

// Callback for handling WebSocket events
void onEventsCallback(WebsocketsEvent event, String data) {
  switch (event) {
    case WebsocketsEvent::ConnectionOpened:
      Serial.println("Connection Opened");
      break;
    case WebsocketsEvent::ConnectionClosed:
      Serial.println("Connection Closed");
      break;
    case WebsocketsEvent::GotPing:
      Serial.println("Got a Ping!");
      break;
    case WebsocketsEvent::GotPong:
      Serial.println("Got a Pong!");
      break;
  }
}