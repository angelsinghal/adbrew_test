from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, os

from .repositories.todo_repository import (
    get_all_todos,
    create_todo,
)

from pymongo.errors import PyMongoError
from .validators.todo_validators import validate_todo

def serialize_todo(todo):
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
    }

def error_response(code, message, http_status):
    return Response(
        {
            "error": {
                "code": code,
                "message": message,
            }
        },
        status=http_status,
    )

class TodoListView(APIView):

    def get(self, request):
        try:
            todos = get_all_todos()

            return Response(
                {"todos": [serialize_todo(todo) for todo in todos]},
                status=status.HTTP_200_OK,
            )

        except PyMongoError:
            return error_response(
                "DATABASE_UNAVAILABLE",
                "Unable to retrieve TODOs right now.",
                status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def post(self, request):
        todo_data = request.data
        validated_data, error = validate_todo(todo_data)
        if error:
            return error_response("INVALID_INPUT", error, status=status.HTTP_400_BAD_REQUEST)

        try:
            created_todo = create_todo(validated_data)

            return Response(
                serialize_todo(created_todo),
                status=status.HTTP_201_CREATED,
            )

        except PyMongoError:
            return error_response(
                "DATABASE_UNAVAILABLE",
                "Unable to create TODO right now.",
                status.HTTP_503_SERVICE_UNAVAILABLE,
            )

