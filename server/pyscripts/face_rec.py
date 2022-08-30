import os
import sys
import json
import pymysql
import liveness_scripts.fr_helper_02 as fr_helper

frs_folder = os.path.abspath(os.path.join(__file__, os.pardir, os.pardir, os.pardir))

db_config_file = os.path.join(frs_folder, "server", "db", "db_config.json")

with open(db_config_file, 'r') as f:
    db_configs = json.load(f)

host = db_configs['host']
user = db_configs["user"]
password = db_configs["password"]
database = db_configs["database"]

mydb = pymysql.connect(host=host, user=user, password=password, database=database)


imgloc = str(sys.argv[1])
in_out = str(sys.argv[2])

config_file = os.path.join(frs_folder, "server", "pyscripts", "config.json")

with open(config_file, 'r') as f:
    configs = json.load(f)

threshold = configs['threshold']
training_model = configs["model_1"]
fe_file_loc = configs["fe_file_loc"]

fe_file = os.path.join(frs_folder, fe_file_loc)

face_locations = fr_helper.detect_faces(imgloc)
face_liveness = fr_helper.detect_liveness_nn(imgloc, face_locations)
face_liveness1 = fr_helper.detect_liveness_hist(imgloc, face_locations)

with open(fe_file, 'r') as f:
        face_emb = json.load(f)

output = fr_helper.recognize_faces(imgloc, face_locations, face_liveness, face_liveness1, face_emb, mydb, threshold, in_out)

print(output)