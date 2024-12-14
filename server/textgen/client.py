import speech_recognition as sr
import pyttsx3


class TextGenClient:
    def __init__(self):
        self.speech_recognizer_client = sr.Recognizer()
        self.speech_to_text_engine = pyttsx3.init()

    def speech_to_text(self, command):
        self.engine.say(command)
        self.engine.runAndWait()
