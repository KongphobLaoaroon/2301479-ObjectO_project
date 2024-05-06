from flask import Flask, request, jsonify, url_for, redirect, session
from flask_cors import CORS
from dotenv import load_dotenv
from OpenAIRecommendation import OpenAIRecommendation
from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
from GoogleCloudHadle import GoogleCloud
from werkzeug.utils import secure_filename
# from authlib.integrations.flask_client import OAuth
from bson.objectid import ObjectId
from instructor import Instructor
from field import Field

import os

#load env
load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
UNIVERSITY_DOMAIN = 'student.chula.ac.th'

app = Flask(__name__)
CORS(app)

#cerate an object
google_credentials = os.getenv("CREDENTIALS_FILE")
bucket_name = os.getenv("BUCKET_NAME")
gc = GoogleCloud(bucket_name, google_credentials)


#Database setup
database_username = os.getenv("DATABASE_USERNAME")
database_password = os.getenv("DATABASE_PASSWORD")
database_ip = f"mongodb://localhost:27017"
client = MongoClient(database_ip)


# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

instructor = Instructor(client, gc, os.getenv("OPENAI_API_KEY"))
field = Field(client)


@app.route('/instructor', methods=['POST'])
def create_instructor():
   return instructor.add_instructor(request)

@app.route('/instructors', methods=['GET'])
def get_instructors():
    return instructor.get_instructor()

@app.route('/field', methods= ['POST'])
def create_field() :
    return field.add_field(request)

@app.route('/fields', methods = ['GET'])
def get_fields():
   return field.get_fields()

@app.route('/instructor/<instructor_id>', methods=['DELETE'])
def delete_instructor(instructor_id):
    return instructor.delete_instructor(instructor_id)

@app.route('/instructor/<instructor_id>', methods=['PUT'])
def update_instructor(instructor_id):
    return instructor.edit_instructor(instructor_id, request)

@app.route('/field/<field_id>', methods=['DELETE'])
def delete_field(field_id):
    return field.remove_field(field_id)

@app.route('/calculate_field', methods=['POST'])
def calculate_field():
    return instructor.calculate_fields(request)

@app.route('/instructors_by_fields', methods=['POST'])
def get_instructors_by_fields():
    return instructor.get_instructor_by_fields(request)


if __name__ == '__main__':
    app.run(debug=True)