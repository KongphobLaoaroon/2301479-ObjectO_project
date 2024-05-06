from flask import jsonify
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from OpenAIRecommendation import OpenAIRecommendation

import os
class Instructor : 

    def __init__(self, database_client, googleCloud, openAi_key) -> None:
        self.database = database_client
        self.gc = googleCloud
        self.db = database_client['recommendation_system']
        self.instructor_collection = self.db['instructor']
        self.fields_collection = self.db['fields']
        self.openAi = OpenAIRecommendation(openAi_key)
    
    def __serialize_id(instructor):
        if '_id' in instructor:
            instructor['_id'] = str(instructor['_id'])
        return instructor

    def add_instructor(self, request):
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        image = request.files['image']
        blob_name = secure_filename(image.filename)
        image_path = os.path.join('temporary', blob_name)

        # Save the image to a temporary location
        image.save(image_path)

        # Upload the image to Google Cloud and get the public URL
        image_url = self.gc.upload_image(image_path, blob_name)

        # Remove the temporary image file
        os.remove(image_path)

        if not image_url:
            return jsonify({'error': 'Failed to upload image'}), 500

        # Get the instructor data from the form
        data = request.form.to_dict()
        instructor = {
            "ThaiName": data.get("ThaiName"),
            "EnglishName": data.get("EnglishName"),
            "degree": data.get("degree"),
            "position": data.get("position"),
            "Office": data.get("Office"),
            "Phone": data.get("Phone"),
            "Fax": data.get("Fax"),
            "Email": data.get("Email"),
            "Educations": data.get("Educations", []),
            "Research_field": data.get("Research_field", []),
            "Papers": data.get("Papers", []),
            "picture": image_url
        }
        instructor['Research_field'] = instructor['Research_field'].split(',')
        # Insert the instructor into the database
        result = self.instructor_collection.insert_one(instructor)

        # Return the newly created instructor with its MongoDB ID
        return jsonify(self.__serialize_id(instructor)), 201
    
    def get_instructor(self):
        instructors = list(self.instructor_collection.find({}))
        return jsonify([self.__serialize_id(instructor) for instructor in instructors]), 200
    
    def delete_instructor(self, instructor_id) :
        instructor = self.instructor_collection.find_one({'_id' : ObjectId(instructor_id)})
        if not instructor :
            return jsonify({'error': 'Instructor not found'}), 404
        image_url = instructor.get('picture')
        blob_name = image_url.split('/')[-1]  # Extract the blob name from the URL
        self.gc.delete_image(blob_name)

        # Delete the instructor from the database
        self.instructor_collection.delete_one({'_id': ObjectId(instructor_id)})
        return jsonify({'message': 'Instructor deleted successfully'}), 200
    
    def edit_instructor(self, instructor_id, request):
        instructor = self.instructor_collection.find_one({'_id': ObjectId(instructor_id)})
        if not instructor:
            return jsonify({'error': 'Instructor not found'}), 404

        # Get the updated data from the request
        updated_data = request.json

        # Remove the '_id' field from the updated data if it exists
        updated_data.pop('_id', None)


        # Update the instructor's information in the database
        self.instructor_collection.update_one(
            {'_id': ObjectId(instructor_id)},
            {'$set': updated_data}
        )

        # Return a success message
        return jsonify({'message': 'Instructor updated successfully'}), 200
    
    def calculate_fields(self, request):
        data = request.json
        project_description = data.get('description')

        if not project_description:
            return jsonify({'error': 'Project description is required'}), 400

        # Get the list of fields of research from the database
        fields = list(self.fields_collection.find({}))
        fields_of_research = [field['field'] for field in fields]

        # Calculate the field of the project
        try:
            fields_list = self.openAi.get_field_of_project(project_description, fields_of_research)
            return jsonify({'fields': fields_list}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def get_instructor_by_fields(self, request) :
        data = request.json
        field_list = data.get('fields')
        print(field_list)

        if not field_list:
            return jsonify({'error': 'Field list is required'}), 400

        # Find instructors who have at least one field in the field_list
        instructors = list(self.instructor_collection.find({'Research_field': {'$in': field_list}}))
        print(instructors)

        # Serialize the instructor objects to make them JSON serializable
        serialized_instructors = [self.__serialize_id(instructor) for instructor in instructors]

        return jsonify(serialized_instructors), 200