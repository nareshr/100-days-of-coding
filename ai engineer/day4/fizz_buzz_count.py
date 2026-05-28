"""
FizzBuzz Count
Given a start and end number, count the number of fizz and buzz appearances in the range (inclusive).

Numbers divisible by 3 count as a fizz.
Numbers divisible by 5 count as a buzz.
Numbers divisible by both 3 and 5 count as both a fizz and a buzz.
Return an object or dictionary with the counts in the format: { fizz, buzz }.

Tests:
1. fizz_buzz_count(1, 11) should return {"fizz": 3, "buzz": 2}.
2. fizz_buzz_count(14, 41) should return {"fizz": 9, "buzz": 6}.
3. fizz_buzz_count(24, 100) should return {"fizz": 26, "buzz": 16}.
4. fizz_buzz_count(-635, -14) should return {"fizz": 207, "buzz": 125}.
5. fizz_buzz_count(-5432, 6789) should return {"fizz": 4074, "buzz": 2444}.
"""

def fizz_buzz_count(start, end):
    fizz_buzz_count = {
        "fizz": 0,
        "buzz": 0
    }

    for i in range(start, end + 1):
        if i % 3 == 0 and i % 5 == 0:
            fizz_buzz_count["fizz"] += 1
            fizz_buzz_count["buzz"] += 1
        elif i % 3 == 0:
            fizz_buzz_count["fizz"] += 1
        elif i % 5 == 0:
            fizz_buzz_count["buzz"] += 1
        else:
            pass
    
    return fizz_buzz_count


print(fizz_buzz_count(1, 11))
print(fizz_buzz_count(14, 41))
print(fizz_buzz_count(24, 100))
print(fizz_buzz_count(-635, -14))
print(fizz_buzz_count(-5432, 6789))