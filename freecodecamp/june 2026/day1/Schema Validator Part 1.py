"""
Schema Validator Part 1
Given an object (JavaScript) or dictionary (Python), determine if it matches the following schema:

{
  username: string
}
Extra keys are allowed

Tests:
1. is_valid_schema({"username": "bob"}) should return True.
2. is_valid_schema({"username": "jen", "posts": 30}) should return True.
3. is_valid_schema({"username": ""}) should return True.
4. is_valid_schema({"username": 7}) should return False.
5. is_valid_schema({"posts": 25}) should return False.
"""

def is_valid_schema(obj):
    if isinstance(obj, dict):
        username = obj.get('username')
        if (username or username == "") and isinstance(username, str):
            return True

    return False


print(is_valid_schema({"username": "bob"}))
print(is_valid_schema({"username": "jen", "posts": 30}))
print(is_valid_schema({"username": ""}))
print(is_valid_schema({"username": 7}))
print(is_valid_schema({"posts": 25}))