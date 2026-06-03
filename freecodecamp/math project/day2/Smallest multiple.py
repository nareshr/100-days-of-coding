"""
Problem 5: Smallest multiple
2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.

What is the smallest positive number that is evenly divisible by all of the numbers from 1 to n?

Tests:
1. smallestMult(5) should return a number.
2. smallestMult(5) should return 60.
3. smallestMult(7) should return 420.
4. smallestMult(10) should return 2520.
5. smallestMult(13) should return 360360.
6. smallestMult(20) should return 232792560.
"""

def smallestMult(n):
    # 1. find the prime factors of all the numbers from 1 to n
    prime_factors = []
    for i in range(2, n + 1):        
        is_prime = True
        for j in range(2, i):
            if i % j == 0:
                is_prime = False
                break
        if is_prime:
            prime_factors.append(i)

    # 2. Find the highest power of each prime that is <= n
    prime_factors_powers = []
    if prime_factors:        
        for x in prime_factors:
            p = 0
            for y in range(1, n):
                if (x ** y) > n:
                    break
                p = x ** y
            prime_factors_powers.append(p)

    # 3. Multiply all the highest powers together
    smallest_multiple = 1
    if prime_factors_powers:
        for k in prime_factors_powers:
            smallest_multiple *= k
    
    return smallest_multiple

print(smallestMult(5))
print(smallestMult(7))
print(smallestMult(10))
print(smallestMult(13))
print(smallestMult(20))