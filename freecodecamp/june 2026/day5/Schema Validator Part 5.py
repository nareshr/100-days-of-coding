"""
Schema Validator Part 5
Given an object (JavaScript) or dictionary (Python), determine if it matches the following schema:

Roles = "user" | "creator" | "moderator" | "staff" | "admin"

{
  username: string,
  posts: number,
  verified: boolean,
  role: Roles,
  supporter?: boolean,
  badges: string[]
}
The pipe (|) symbol means "or". role must be one of the listed Roles values.
The question mark (?) after supporter means that the field is optional, but is the specified type if it exists.
The brackets [] after string means that badges should be an array of strings (or empty).
Extra keys are allowed
Tests:
1. is_valid_schema({"username": "gill", "posts": 12, "verified": False, "role": "creator", "supporter": False, "badges": ["early-adopter", "popular"]}) should return True.
2. is_valid_schema({"username": "tonya", "posts": 299, "verified": True, "role": "moderator", "supporter": True, "badges": ["streak-master", "veteran"], "followers": 1233}) should return True.
3. is_valid_schema({"username": "zara", "posts": 0, "verified": False, "role": "user", "supporter": False, "badges": []}) should return True.
4. is_valid_schema({"username": "nicole", "posts": 65, "verified": True, "role": "admin", "supporter": False, "badges": ["first-post", 18]}) should return False.
5. is_valid_schema({"username": "tim", "posts": 25, "verified": True, "role": "staff", "supporter": False}) should return False.
6. is_valid_schema({"username": "charlie", "posts": 0, "verified": False, "role": "user", "supporter": "no", "badges": ["first-post", "anniversary"]}) should return False.
7. is_valid_schema({"username": "wanda", "posts": 15, "verified": True, "role": "friend", "supporter": True, "badges": ["popular"]}) should return False.
8. is_valid_schema({"username": "guy", "posts": 5, "verified": "false", "role": "staff", "supporter": True, "badges": ["helper"]}) should return False.
9. is_valid_schema({"username": "carrie", "verified": True, "role": "moderator", "supporter": True, "badges": ["helper", "sharer"]}) should return False.
10. is_valid_schema({"username": True, "posts": 75, "verified": True, "role": "creator", "supporter": True, "badges": ["veteran"]}) should return False.
"""

def is_valid_schema(obj):

    Roles = ["user", "creator", "moderator", "staff", "admin"]

    if isinstance(obj, dict):
        username = obj.get('username')
        posts = obj.get('posts')        
        verified = obj.get('verified')
        role = obj.get('role')
        supporter = obj.get('supporter', None)
        badges = obj.get('badges')

        is_supporter = True
        if supporter is not None:
            if not isinstance(supporter, bool):
                is_supporter = False

        is_valid_badges = False
        if badges is not None:
            is_all_badges_str = True
            for bg in badges:
                if not isinstance(bg, str):
                    is_all_badges_str = False

            is_valid_badges = isinstance(badges, list) and is_all_badges_str

        if (username or username == "") and isinstance(username, str) and (isinstance(posts, int) and not isinstance(posts, bool)) and isinstance(verified, bool) and role in Roles and is_supporter and is_valid_badges:            
            return True
            
    return False


print("1", is_valid_schema({"username": "gill", "posts": 12, "verified": False, "role": "creator", "supporter": False, "badges": ["early-adopter", "popular"]}))
print("2", is_valid_schema({"username": "tonya", "posts": 299, "verified": True, "role": "moderator", "supporter": True, "badges": ["streak-master", "veteran"], "followers": 1233}))
print("3", is_valid_schema({"username": "zara", "posts": 0, "verified": False, "role": "user", "supporter": False, "badges": []}))
print("4", is_valid_schema({"username": "nicole", "posts": 65, "verified": True, "role": "admin", "supporter": False, "badges": ["first-post", 18]}))
print("5", is_valid_schema({"username": "tim", "posts": 25, "verified": True, "role": "staff", "supporter": False}))
print("6", is_valid_schema({"username": "charlie", "posts": 0, "verified": False, "role": "user", "supporter": "no", "badges": ["first-post", "anniversary"]}))
print("7", is_valid_schema({"username": "wanda", "posts": 15, "verified": True, "role": "friend", "supporter": True, "badges": ["popular"]}))
print("8", is_valid_schema({"username": "guy", "posts": 5, "verified": "false", "role": "staff", "supporter": True, "badges": ["helper"]}))
print("9", is_valid_schema({"username": "carrie", "verified": True, "role": "moderator", "supporter": True, "badges": ["helper", "sharer"]}))
print("10", is_valid_schema({"username": True, "posts": 75, "verified": True, "role": "creator", "supporter": True, "badges": ["veteran"]}))
