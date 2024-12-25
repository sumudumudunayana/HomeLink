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
        data = [
            {"id": 1, "context": "The quick brown fox jumps over the lazy dog."},
            {
                "id": 2,
                "context": "A journey of a thousand miles begins with a single step.",
            },
            {"id": 3, "context": "To be or not to be, that is the question."},
            {"id": 4, "context": "All that glitters is not gold."},
            {"id": 5, "context": "Where there's a will, there's a way."},
        ]

        # Encode all the contexts
        context_embeddings = self.model.encode(
            [item["context"] for item in data], convert_to_tensor=True
        )

        # Convert embeddings to list for JSON serialization
        serializable_embeddings = context_embeddings.tolist()

        # Prepare data for saving
        save_data = {"data": data, "embeddings": serializable_embeddings}

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

    def speak(self, text, language="en"):
        """Speaks without saving the audio file"""
        mp3_fo = BytesIO()
        tts = gTTS(text, lang=language)
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
                        self.speak(f"How can I help you {self.user_name}?")
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

    def handle(self, *args, **options):
        r = sr.Recognizer()

        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source)  # Adjust for ambient noise once

            self.stdout.write(f"Waiting for wake word: '{self.wake_word}'")

            while True:
                if not self.listen_for_wake_word(r, source):
                    continue

                try:
                    self.stdout.write("Listening for query...")
                    self.speak("Listening for query...")
                    audio = r.listen(
                        source, phrase_time_limit=5
                    )  # Listen for up to 5 seconds at a time

                    try:
                        recognized_text = r.recognize_whisper(audio, language="english")
                        self.stdout.write(f"You said: {recognized_text}")
                        self.speak(f"You said: {recognized_text}")

                        # Perform semantic search with the recognized text
                        search_results = self.semantic_search(recognized_text)
                        self.stdout.write("Search result:")
                        for result in search_results:
                            result_text = (
                                f"ID: {result['id']}, Context: {result['context']}"
                            )
                            self.stdout.write(result_text)
                            self.speak(result_text)

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
