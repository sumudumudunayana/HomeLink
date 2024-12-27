import json
import speech_recognition as sr
from django.core.management.base import BaseCommand

import time
from sentence_transformers import SentenceTransformer, util
import torch
from gtts import gTTS
from io import BytesIO
import pygame
import os

from home_link import device_manager

COMMAND_DATA = [
    {
        "id": 1,
        "context": "Open the door. Unlock the door. Let me in. Open the gate. Entry access.",
        "response_text": "Opening the door.",
        "cmd": "door_open_manual",
    },
    {
        "id": 2,
        "context": "Close the door. Lock the door. Shut the door. Secure the entrance. Close the gate.",
        "response_text": "Closing the door.",
        "cmd": "door_closed_manual",
    },
    {
        "id": 3,
        "context": "Turn the fan on. Start the fan. I'm hot. It's hot. Turn the air on. Need some air.",
        "response_text": "Turning the fan on.",
        "cmd": "fan_on_manual",
    },
    {
        "id": 4,
        "context": "Turn the fan off. Stop the fan. I'm cold. It's cold. Turn the air off. No more air.",
        "response_text": "Turning the fan off.",
        "cmd": "fan_off_manual",
    },
    {
        "id": 5,
        "context": "Activate the shield. Engage the shield. Turn on the shield. Protect us. Shield up.",
        "response_text": "Activating shield.",
        "cmd": "shield_on",
    },
    {
        "id": 6,
        "context": "Deactivate the shield. Disengage the shield. Turn off the shield. Lower the shield. Shield down.",
        "response_text": "Deactivating shield.",
        "cmd": "shield_off",
    },
    {
        "id": 7,
        "context": "Turn the light on. Turn on the light. It's dark. I can't see. Need light. Lights on. illuminate. It's dark in here do something.",
        "response_text": "Turning the light on.",
        "cmd": "light_on_manual",
    },
    {
        "id": 8,
        "context": "Turn the light off. Turn off the light. It's too bright. Lights off. I don't need light. It's bright.",
        "response_text": "Turning the light off.",
        "cmd": "light_off_manual",
    },
    {
        "id": 9,
        "context": "Introduce yourself. Tell me about Gaia. What is Gaia? What can you do? Give me an introduction. What are you?",
        "response_text": "I am Gaia, a cutting-edge home automation system designed to simplify your life. I can control your home with voice commands, personalize your environment, help you save energy, enhance your security, and provide a seamless user experience.",
        "cmd": "gaia_introduction",
    },
]
BACKEND_COMMANDS = [i["cmd"] for i in COMMAND_DATA if i["id"] < 9]


class Command(BaseCommand):
    help = "Continuously listens for wake word, then transcribes audio, performs semantic search, and speaks the results"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.encode_and_save_dataset()
        self.data, self.embeddings = self.load_encoded_dataset()
        pygame.init()
        pygame.mixer.init()
        self.wake_word = "gaia"
        self.similar_wake_words = [
            "guy",
            "gaia",
            "gaya",
            "gaia",
            "guya",
            "gaiya",
            "guyya",
        ]
        self.user_name = "Ishanka"

    def encode_and_save_dataset(self, output_file="encoded_data.json"):
        # Sample data: dictionary of objects with 'context' field

        # Encode all the contexts
        context_embeddings = self.model.encode(
            [item["context"] for item in COMMAND_DATA], convert_to_tensor=True
        )

        # Convert embeddings to list for JSON serialization
        serializable_embeddings = context_embeddings.tolist()

        # Prepare data for saving
        save_data = {"data": COMMAND_DATA, "embeddings": serializable_embeddings}

        # Save to JSON file
        with open(output_file, "w") as f:
            json.dump(save_data, f)

        self.stdout.write(f"Encoded data saved to {output_file}")

    def load_encoded_dataset(self, input_file="encoded_data.json"):
        if not os.path.exists(input_file):
            self.encode_and_save_dataset(input_file)

        with open(input_file, "r") as f:
            loaded_data = json.load(f)

        # Convert list back to tensor
        embeddings = torch.tensor(loaded_data["embeddings"])

        return loaded_data["data"], embeddings

    def semantic_search(self, query, top_k=1):
        # Encode the query
        query_embedding = self.model.encode(query, convert_to_tensor=True)

        # Compute cosine similarities
        cos_scores = util.cos_sim(query_embedding, self.embeddings)[0]

        # Get the top_k results
        top_results = torch.topk(cos_scores, k=top_k)

        return [self.data[idx] for idx in top_results.indices]

    def wait(self):
        while pygame.mixer.get_busy():
            time.sleep(0.1)

    def speak(self, text, language="en", tld="co.uk"):
        """Speaks without saving the audio file"""
        mp3_fo = BytesIO()
        tts = gTTS(text, lang=language, tld=tld)
        tts.write_to_fp(mp3_fo)
        mp3_fo.seek(0)
        sound = pygame.mixer.Sound(mp3_fo)
        sound.play()
        self.wait()

    def listen_for_wake_word(self, recognizer, source):
        while True:
            try:
                self.stdout.write("Listening for wake word...")
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=3)
                try:
                    text = recognizer.recognize_whisper(
                        audio, language="english"
                    ).lower()
                    if self.is_similar_to_wake_word(text):
                        self.stdout.write("Wake word detected!")
                        self.speak("How can I help you?")
                        return True
                except sr.UnknownValueError:
                    pass  # Ignore unrecognized audio
            except sr.WaitTimeoutError:
                pass  # Continue listening if timeout occurs
            except Exception as e:
                self.stderr.write(f"Error in wake word detection: {e}")
                return False

    def is_similar_to_wake_word(self, text):
        text = text.lower()
        if self.wake_word in text:
            return True
        for word in self.similar_wake_words:
            if word.lower() in text:
                return True
        return False

    @staticmethod
    def set_command(command):
        if command in BACKEND_COMMANDS:
            if "door" in command:
                device_manager.door = command
            elif "fan" in command:
                device_manager.fan = command
            elif "shield" in command:
                device_manager.shield = command
            elif "light" in command:
                device_manager.light = command

    def handle(self, *args, **options):
        r = sr.Recognizer()

        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source)  # Adjust for ambient noise once

            self.speak("Hello, Good afternoon, I am Gaia, your personal assistant.")
            self.stdout.write(f"Waiting for wake word: '{self.wake_word}'")
            while True:
                if not self.listen_for_wake_word(r, source):
                    continue

                try:
                    self.stdout.write("Listening for query...")
                    audio = r.listen(
                        source, phrase_time_limit=5
                    )  # Listen for up to 5 seconds at a time

                    try:
                        recognized_text = r.recognize_whisper(audio, language="english")
                        self.stdout.write(f"You said: {recognized_text}")

                        # Perform semantic search with the recognized text
                        search_results = self.semantic_search(recognized_text)
                        self.stdout.write("Search result:")
                        for result in search_results:
                            self.stdout.write(result["response_text"])
                            self.speak(result["response_text"])
                            self.set_command(result["cmd"])

                    except sr.UnknownValueError:
                        self.stdout.write("Could not understand audio.")
                        self.speak("Could not understand audio.")
                    except sr.RequestError as e:
                        error_message = f"Could not request results from Whisper; {e}"
                        self.stderr.write(error_message)
                        self.speak(error_message)
                    except Exception as e:
                        error_message = f"An unexpected error occurred during recognition or search: {e}"
                        self.stderr.write(error_message)
                        self.speak(error_message)

                except KeyboardInterrupt:
                    self.stdout.write("Stopping transcription and search.")
                    self.speak("Stopping transcription and search.")
                    break
                except OSError as e:
                    error_message = f"Error accessing microphone: {e}. Is the microphone available and permissions granted?"
                    self.stderr.write(error_message)
                    self.speak(error_message)
                    break  # Exit the loop if microphone error occurs
                except (
                    sr.WaitTimeoutError
                ):  # Handle cases where no speech is detected in the time limit
                    self.stdout.write("No speech detected. Listening again...")
                    self.speak("No speech detected. Listening again...")
                    continue  # Continue to the next loop iteration
                except Exception as e:
                    error_message = (
                        f"An unexpected error occurred during listening: {e}"
                    )
                    self.stderr.write(error_message)
                    self.speak(error_message)
                    break  # Exit the loop if a critical error happens

                time.sleep(0.2)  # Small delay to prevent excessive CPU usage
