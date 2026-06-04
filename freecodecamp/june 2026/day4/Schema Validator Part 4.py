"""
Schema Validator Part 4
Given an object (JavaScript) or dictionary (Python), determine if it matches the following schema:

Roles = "user" | "creator" | "moderator" | "staff" | "admin"

{
  username: string,
  posts: number,
  verified: boolean,
  role: Roles,
  supporter?: boolean
}
The pipe (|) symbol means "or". role must be one of the listed Roles values.
The question mark (?) after supporter means that the field is optional, but is the specified type if it exists.
Extra keys are allowed

Tests:
1. is_valid_schema({"username": "vivian", "posts": 1, "verified": False, "role": "user", "supporter": True}) should return True.
2. is_valid_schema({"username": "rudolph", "posts": 15, "verified": True, "role": "creator"}) should return True.
3. is_valid_schema({"username": "hernandez", "posts": 35, "verified": True, "role": "moderator", "supporter": False, "followers": 55}) should return True.
4. is_valid_schema({"username": "julia", "posts": 50, "verified": True, "role": "admin", "supporter": "true"}) should return False.
5. is_valid_schema({"username": "bernard", "posts": 0, "verified": True, "role": "friend", "supporter": True}) should return False.
6. is_valid_schema({"username": "felix", "posts": 40, "verified": "yes", "role": "staff", "supporter": False}) should return False.
7. is_valid_schema({"username": "jimmy", "posts": True, "verified": False, "role": "creator", "supporter": True}) should return False.
8. is_valid_schema({"username": True, "posts": 30, "verified": True, "role": "moderator", "supporter": False}) should return False.
"""

def is_valid_schema(obj):

    Roles = ["user", "creator", "moderator", "staff", "admin"]

    if isinstance(obj, dict):
        username = obj.get('username')
        posts = obj.get('posts')        
        verified = obj.get('verified')
        role = obj.get('role')
        supporter = obj.get('supporter', None)
        is_supporter = True
        if supporter is not None:
            if not isinstance(supporter, bool):
                is_supporter = False

        if (username or username == "") and isinstance(username, str) and (isinstance(posts, int) and not isinstance(posts, bool)) and isinstance(verified, bool) and role in Roles and is_supporter:            
            return True
            
    return False


print(is_valid_schema({"username": "vivian", "posts": 1, "verified": False, "role": "user", "supporter": True}))
print(is_valid_schema({"username": "rudolph", "posts": 15, "verified": True, "role": "creator"}))
print(is_valid_schema({"username": "hernandez", "posts": 35, "verified": True, "role": "moderator", "supporter": False, "followers": 55}))
print(is_valid_schema({"username": "julia", "posts": 50, "verified": True, "role": "admin", "supporter": "true"}))
print(is_valid_schema({"username": "bernard", "posts": 0, "verified": True, "role": "friend", "supporter": True}))
print(is_valid_schema({"username": "felix", "posts": 40, "verified": "yes", "role": "staff", "supporter": False}))
print(is_valid_schema({"username": "jimmy", "posts": True, "verified": False, "role": "creator", "supporter": True}))
print(is_valid_schema({"username": True, "posts": 30, "verified": True, "role": "moderator", "supporter": False}))
