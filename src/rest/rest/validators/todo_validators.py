def validate_todo(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."

    allowed_fields = {"title"}
    unexpected_fields = set(data) - allowed_fields

    if unexpected_fields:
        return None, f"Unexpected fields: {', '.join(sorted(unexpected_fields))}"

    title = data.get("title")

    if not isinstance(title, str):
        return None, "Title must be a string."

    title = title.strip()

    if not title:
        return None, "Title cannot be empty."

    if len(title) > 200:
        return None, "Title cannot exceed 200 characters."

    return {"title": title}, None
