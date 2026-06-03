"""
Schema Validator Part 3
Given an object (JavaScript) or dictionary (Python), determine if it matches the following schema:

Roles = "user" | "creator" | "moderator" | "staff" | "admin"

{
  username: string,
  posts: number,
  verified: boolean,
  role: Roles
}
The pipe (|) symbol means "or". role must be one of the listed Roles values.
Extra keys are allowed
Tests:
1. is_valid_schema({"username": "henry", "posts": 0, "verified": True, "role": "staff"}) should return True.
2. is_valid_schema({"username": "sara", "posts": 45, "verified": False, "role": "creator", "followers": 70}) should return True.
3. is_valid_schema({"username": "penelope", "posts": 20, "verified": True, "role": "admin"}) should return True.
4. is_valid_schema({"username": "kevin", "posts": 0, "verified": False, "role": "user"}) should return True.
5. is_valid_schema({"username": "george", "posts": 15, "verified": True, "role": "moderator"}) should return True.
6. is_valid_schema({"username": "david", "posts": 0, "verified": False, "role": "guest"}) should return False.
7. is_valid_schema({"username": "wendy", "posts": 10, "verified": True}) should return False.
8. is_valid_schema({"username": "fabian", "posts": 1, "verified": True, "role": True}) should return False.
9. is_valid_schema({"username": 8, "posts": 1, "verified": True, "role": "user"}) should return False.
10. is_valid_schema({"username": "penny", "posts": "10", "verified": True, "role": "staff"}) should return False.
11. is_valid_schema({"username": "john", "posts": "1", "verified": "true", "role": "admin"}) should return False.
"""

def is_valid_schema(obj):

    Roles = ["user", "creator", "moderator", "staff", "admin"]

    if isinstance(obj, dict):
        username = obj.get('username')
        posts = obj.get('posts')
        verified = obj.get('verified')
        role = obj.get('role')
        if (username or username == "") and isinstance(username, str) and isinstance(posts, int) and isinstance(verified, bool) and role in Roles:
            return True

    return False


print(is_valid_schema({"username": "henry", "posts": 0, "verified": True, "role": "staff"}))
print(is_valid_schema({"username": "sara", "posts": 45, "verified": False, "role": "creator", "followers": 70}))
print(is_valid_schema({"username": "penelope", "posts": 20, "verified": True, "role": "admin"}))
print(is_valid_schema({"username": "kevin", "posts": 0, "verified": False, "role": "user"}))
print(is_valid_schema({"username": "george", "posts": 15, "verified": True, "role": "moderator"}))
print(is_valid_schema({"username": "david", "posts": 0, "verified": False, "role": "guest"}))
print(is_valid_schema({"username": "wendy", "posts": 10, "verified": True}))
print(is_valid_schema({"username": "fabian", "posts": 1, "verified": True, "role": True}))
print(is_valid_schema({"username": 8, "posts": 1, "verified": True, "role": "user"}))
print(is_valid_schema({"username": "penny", "posts": "10", "verified": True, "role": "staff"}))
print(is_valid_schema({"username": "john", "posts": "1", "verified": "true", "role": "admin"}))