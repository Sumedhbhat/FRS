# imports
import face_recognition as fr
import numpy as np
import json
import cv2
import os
from datetime import datetime
import time
import tensorflow as tf
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