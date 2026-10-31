import os
from pymongo import MongoClient

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todos_collection = db["todos"]

def get_all_todos():
    return list(todos_collection.find().sort("_id", -1))


def create_todo(todo_data):
    result = todos_collection.insert_one(todo_data)

    return todos_collection.find_one(
        {"_id": result.inserted_id}
    )