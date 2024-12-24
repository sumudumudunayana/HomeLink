from pathlib import Path
import os
import datetime

from django.core.management import BaseCommand
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

import pytz
import face_recognition
import cv2
import numpy as np

from home_link import device_manager
from home_link.enum import ShieldCommands, AlarmCommands

COMMANDS_DIR = Path(__file__).resolve().parent
FACES_DIR = f"{COMMANDS_DIR}/faces"
BIOMETRICS_DIR = COMMANDS_DIR.parent.parent
ALLOWED_IMG_EXTENTIONS = ("jpg", "png", "webp", "jpeg")
ADDRESS = "https://XXX.XXX.X.X:8080/video"
TIMEZONE = pytz.timezone("Asia/Colombo")


class Command(BaseCommand):
    help = "Run face recognition on security camera."

    def __init__(self):
        super().__init__()
        self.last_alert = None

    def handle(self, *args, **options):
        images = []
        myList = os.listdir(FACES_DIR)
        namesList = []
        for img in myList:
            if img.endswith(ALLOWED_IMG_EXTENTIONS):
                curImg = cv2.imread(f"{FACES_DIR}/{img}")
                namesList.append(img.split(".")[0])
                images.append(curImg)

        encodeListKnown = findEncodings(images)
        print("Encoding Complete")

        cap = cv2.VideoCapture(ADDRESS)

        while True:
            success, img = cap.read()
            imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
            imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

            facesCurFrame = face_recognition.face_locations(imgS)
            encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

            for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
                matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
                faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
                matchIndex = np.argmin(faceDis)
                if faceDis[matchIndex] < 0.60:
                    name = namesList[matchIndex]
                else:
                    name = "Unknown"
                    current_time = datetime.datetime.now()
                    if (
                        self.last_alert is None
                        or (current_time - self.last_alert).total_seconds() > 300
                    ) and device_manager.shield == ShieldCommands.MANUAL_ON.value:
                        self.trigger_alarm()
                        self.trigger_alert()
                        self.last_alert = current_time

                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                if name == "Unknown":
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
                    cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 0, 255), cv2.FILLED)
                    cv2.putText(
                        img,
                        name,
                        (x1 + 6, y2 - 6),
                        cv2.FONT_HERSHEY_COMPLEX,
                        1,
                        (255, 255, 255),
                        2,
                    )
                else:
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                    cv2.putText(
                        img,
                        name,
                        (x1 + 6, y2 - 6),
                        cv2.FONT_HERSHEY_COMPLEX,
                        1,
                        (255, 255, 255),
                        2,
                    )
            cv2.imshow("Security Camera", img)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        # Release resources
        cap.release()
        cv2.destroyAllWindows()

    @staticmethod
    def trigger_alarm():
        device_manager.alarm = AlarmCommands.MANUAL_ON.value

    @staticmethod
    def trigger_alert():
        current_time = datetime.datetime.now(TIMEZONE)
        context = {
            "receiver_name": "Ishanka Senevirathne",
            "detection_time": current_time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        receiver_email = "ishankadsenevirathne@gmail.com"
        template_name = f"{BIOMETRICS_DIR}/templates/security_alert.html"
        convert_to_html_content = render_to_string(
            template_name=template_name, context=context
        )
        plain_message = strip_tags(convert_to_html_content)
        send_mail(
            subject="Receiver information from a form",
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[
                receiver_email,
            ],
            html_message=convert_to_html_content,
            fail_silently=False,
        )


def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList
