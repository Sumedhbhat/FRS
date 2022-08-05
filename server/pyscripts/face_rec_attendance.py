import os
import sys
import cv2
import json
import numpy as np
import face_recognition as fr
import pymysql
import uuid

frs_folder = os.path.abspath(os.path.join(__file__, os.pardir, os.pardir, os.pardir))
attendance_folder = os.path.join(frs_folder, "user_images/attendance/")

db_config_file = os.path.join(frs_folder, "server/db/db_config.json")

with open(db_config_file, 'r') as f:
    db_configs = json.load(f)

host = db_configs['host']
user = db_configs["user"]
password = db_configs["password"]
database = db_configs["database"]

mydb = pymysql.connect(host=host, user=user, password=password, database=database)

config_file = os.path.join(frs_folder, "server/pyscripts/config.json")

with open(config_file, 'r') as f:
    configs = json.load(f)

threshold = configs['threshold']
training_model = configs["model_1"]
fe_file_loc = configs["fe_file_loc"]

fe_file = os.path.join(frs_folder, fe_file_loc)

images = str(sys.argv[1]).split(",")

output = {"uploaded": len(images), "detected": 0, "recognized": 0, "recognizedNames": []}

with open(fe_file, 'r') as f:
    face_emb = json.load(f)

known_faces = list(face_emb.keys())
known_face_encodings = list(face_emb.values())

faces_in_given_images = {}


for image in images:
    given_image = fr.load_image_file(image)
    face_locations = fr.face_locations(given_image, model=training_model)
    face_encodings = fr.face_encodings(given_image, face_locations)

    for face_encoding in face_encodings:
        found_encodings = list(faces_in_given_images.values())
        if faces_in_given_images:
            distances = fr.face_distance(found_encodings, face_encoding)
        if not faces_in_given_images or min(distances) > threshold:
            output["detected"] += 1
            distances = fr.face_distance(known_face_encodings, face_encoding)
            matchIndex = np.argmin(distances)
            if distances[matchIndex] < threshold:
                faces_in_given_images[known_faces[matchIndex]] = face_encoding
                mycursor = mydb.cursor()
                sql = "SELECT name FROM user WHERE user_id = '"+known_faces[matchIndex]+"'"
                mycursor.execute(sql)
                myresult = mycursor.fetchall()
                if myresult[0][0] not in output["recognizedNames"]:
                    output["recognizedNames"].append(myresult[0][0])
                    output["recognized"] += 1
            else:
                faces_in_given_images[uuid.uuid4()] = face_encoding



print(output)
