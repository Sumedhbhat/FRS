# imports
import face_recognition as fr
import numpy as np
import cv2
import os
from tensorflow import keras

def detect_faces(img_path_to_img):
    # function to detect faces in given image
    # outputs a list of tuples
    
    # get image
    if type(img_path_to_img) == str:
        img = fr.load_image_file(img_path_to_img)
    else:
        img = img_path_to_img
    
    # get face locations
    face_locations = fr.face_locations(img)
    
    # return face loc
    return face_locations


def detect_liveness(img_path_to_img, face_locations):
    # function to detect liveness of faces
    # outputs a dict with keys=faces and values being face liveness and confidence
    
    # get image
    if type(img_path_to_img) == str:
        img = fr.load_image_file(img_path_to_img)
    else:
        img = img_path_to_img
    # face extraction 
    faces = []
    img_mode = 'BGR'
    for face in face_locations:
        if img_mode == 'RGB':
            faces.append(img[face[0]:face[2], face[3]:face[1]])
        elif img_mode == 'BGR':
            faces.append(img[face[0]:face[2], face[3]:face[1], ::-1]) # invertion
    
    # initialize a dict
    face_liveness = []
    
    # load the liveness detector model
    model_path = os.path.join(os.path.dirname(__file__), 'liveness.model')
    model = keras.models.load_model(model_path)

    # loop over all faces
    for index in range(len(faces)):
        
        faces[index] = cv2.resize(faces[index], (32, 32)) # model requirement
        faces[index] = faces[index].astype("float") / 255.0
        faces[index] = np.expand_dims(faces[index], axis=0)
    
        # pass the face ROI through the trained liveness detector model to determine if the face is "real" or "fake"
        preds = model.predict(faces[index])[0]
        j = np.argmax(preds)
        if j == 0: # spoof
            face_liveness.append({'liveness_status': 'spoof', 'confidence': preds[j]})
        else: # j == 1 implies live
            face_liveness.append({'liveness_status': 'live', 'confidence': preds[j]})
        
    return face_liveness

def recognize_faces(imgloc, face_locations, face_liveness, face_emb, mydb, threshold, in_out):
    output = {"result":[]}
    already_found_user_ids = []

    given_image = fr.load_image_file(imgloc)
    imgname = imgloc[imgloc.rindex("/")+1:]
    cv2_img = cv2.imread(imgloc)

    face_encoding = fr.face_encodings(given_image, face_locations)
    if len(face_locations) == 0:
        output['errmsg'] = 'no face'
    else:

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
                    if(known_faces[best_match] not in already_found_user_ids):
                        already_found_user_ids.append(known_faces[best_match])
                        cv2.rectangle(cv2_img, (x_min, y_min),(x_max, y_max), col_acp, recThic)
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
                            "date_created": myresult[0][7].strftime("%Y-%m-%d %H:%M:%S"),
                            "face_liveness_status": face_liveness[i]["liveness_status"],
                            "face_liveness_confidence": face_liveness[i]["confidence"]
                        })
                        cv2.putText(cv2_img, myresult[0][2], (x_min, int(y_max + scale*30)), fontType, scale, col_acp, fontThic, cv2.LINE_AA)
                else:
                    cv2.rectangle(cv2_img, (x_min, y_min), (x_max, y_max), col_rej, recThic)
                    mycursor.execute("CALL record_user_capture(%s, %s, %s)", [imgname, "unrecognized", in_out])
                    myresult = mycursor.fetchall()
                    cv2.putText(cv2_img, "no match", (x_min, int(y_max + scale*30)), fontType, scale, col_rej, fontThic)

                mydb.commit()

    cv2.imwrite(imgloc, cv2_img)
    return output