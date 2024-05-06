from flask import jsonify
from bson.objectid import ObjectId

class Field:

    def __init__(self, database_client) -> None:
        self.db = database_client['recommendation_system']
        self.fields_collection = self.db['fields']

    def __serialize_id(instructor):
        if '_id' in instructor:
            instructor['_id'] = str(instructor['_id'])
        return instructor

    def add_field(self, request):
        field = request.json
        result = self.fields_collection.insert_one(field)
        return jsonify({'message': 'Field created', 'id': str(result.inserted_id)}), 201
    
    def get_fields(self):
        fields = list(self.fields_collection.find({}))
        return jsonify([self.__serialize_id(field) for  field in fields]), 200
    
    def remove_field(self, field_id):
        field = self.fields_collection.find_one({'_id': ObjectId(field_id)})
        if not field:
            return jsonify({'error': 'Field not found'}), 404

        # Delete the field from the database
        self.fields_collection.delete_one({'_id': ObjectId(field_id)})

        # Return a success message
        return jsonify({'message': 'Field deleted successfully'}), 200