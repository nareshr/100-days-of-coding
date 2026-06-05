"""
Problem 7: 10001st prime
By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.

What is the nth prime number?

Tests:
1. nthPrime(6) should return a number.
2. nthPrime(6) should return 13.
3. nthPrime(10) should return 29.
4. nthPrime(100) should return 541.
5. nthPrime(1000) should return 7919.
6. nthPrime(10001) should return 104743.
"""

import math

def generate_infinite_number(start=0, step=1):
    num = start
    while True:
        yield num
        num += step


# Initialize the generator object
number_steam = generate_infinite_number(start=1)

def nthPrime_slow_solution(n):

    prime_numbers = []

    step1 = math.log(n)
    step2 = math.log(step1)

    upper_limit = math.ceil(n * (step1 + step2))

    for i in range(2, upper_limit):
        is_prime = True
        for j in range(2, i):
            if i % j == 0:
                is_prime = False
                break
        if is_prime:
            prime_numbers.append(i)

        if len(prime_numbers) == n:
            break
        
    
    return prime_numbers[-1]


def nthPrime(n):

    if n < 1:
        return None
    
    if n == 1: return 2
    if n == 2: return 3
    if n == 3: return 5
    if n == 4: return 7
    if n == 5: return 11

    step1 = math.log(n)
    step2 = math.log(step1)

    upper_limit = math.ceil(n * (step1 + step2))

    is_prime = [True] * (upper_limit + 1)
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(math.isqrt(upper_limit)) + 1):
        if is_prime[i]:
            for j in range(i * i, upper_limit + 1, i):
                is_prime[j] = False

    count = 0
    for i in range(2, upper_limit + 1):
        if is_prime[i]:
            count += 1
        
        if count == n:
            return i


print(nthPrime(6))
print(nthPrime(10))
print(nthPrime(100))
print(nthPrime(1000))
print(nthPrime(10001))
