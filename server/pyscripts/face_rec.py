import os
import sys
import cv2
import json
import numpy as np
import face_recognition as fr
import pymysql

frs_folder = os.path.abspath(os.path.join(__file__, os.pardir, os.pardir, os.pardir))

db_config_file = os.path.join(frs_folder, "server/db/db_config.json")

with open(db_config_file, 'r') as f:
    db_configs = json.load(f)

host = db_configs['host']
user = db_configs["user"]
password = db_configs["password"]
database = db_configs["database"]

mydb = pymysql.connect(host=host, user=user, password=password, database=database)


imgloc = str(sys.argv[1])
in_out = str(sys.argv[2])

imgname = imgloc[imgloc.rindex("/")+1:]

config_file = os.path.join(frs_folder, "server/pyscripts/config.json")

with open(config_file, 'r') as f:
    configs = json.load(f)

threshold = configs['threshold']
training_model = configs["model_1"]
fe_file_loc = configs["fe_file_loc"]

fe_file = os.path.join(frs_folder, fe_file_loc)

output = {"result":[]}

img = cv2.imread(imgloc)

given_image = fr.load_image_file(imgloc)
face_locations = fr.face_locations(given_image, model="hog")
face_encoding = fr.face_encodings(given_image, face_locations)

if len(face_locations) == 0:
    output['errmsg'] = 'no face'
else:

    with open(fe_file, 'r') as f:
        face_emb = json.load(f)

    known_faces = list(face_emb.keys())
    known_face_encodings = list(face_emb.values())

    for i in range(len(face_encoding)):
        y_min, x_max, y_max, x_min = face_locations[i]
        fontType = cv2.FONT_HERSHEY_TRIPLEX
        recThic = 3
        fontThic = 1
        col_acp = (0, 255, 0)
        col_rej = (0, 0, 255)

        scale = (x_max-x_min)/130

        face_distances = fr.face_distance(
            known_face_encodings, face_encoding[i])
        best_match = np.argmin(face_distances)

        with mydb.cursor() as mycursor:

            if(face_distances[best_match] < threshold):
                cv2.rectangle(img, (x_min, y_min),(x_max, y_max), col_acp, recThic)
                mycursor.execute("CALL record_user_capture(%s, %s, %s)", [imgname, known_faces[best_match], in_out])
                myresult = mycursor.fetchall()
                output["result"].append({
                    "user_id": known_faces[best_match],
                    "img": myresult[0][1],
                    "name": myresult[0][2],
                    "mob_no": myresult[0][3],
                    "gender": myresult[0][4],
                    "city": myresult[0][5],
                    "department": myresult[0][6],
                    "date_created": myresult[0][7].strftime("%Y-%m-%d %H:%M:%S")
                })
                cv2.putText(img, myresult[0][2], (x_min, int(y_max + scale*30)), fontType, scale, col_acp, fontThic)
            else:
                cv2.rectangle(img, (x_min, y_min), (x_max, y_max), col_rej, recThic)
                mycursor.execute("CALL record_user_capture(%s, %s, %s)", [imgname, "unrecognized", in_out])
                myresult = mycursor.fetchall()
                cv2.putText(img, "no match", (x_min, int(y_max + scale*30)), fontType, scale, col_rej, fontThic)

            mydb.commit()

cv2.imwrite(imgloc, img)
print(output)