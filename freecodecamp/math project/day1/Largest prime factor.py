"""
Problem 3: Largest prime factor
The prime factors of 13195 are 5, 7, 13 and 29.

What is the largest prime factor of the given number?

Tests:
1. largestPrimeFactor(2) should return a number.
2. largestPrimeFactor(2) should return 2.
3. largestPrimeFactor(3) should return 3.
4. largestPrimeFactor(5) should return 5.
5. largestPrimeFactor(7) should return 7.
6. largestPrimeFactor(8) should return 2.
7. largestPrimeFactor(13195) should return 29.
8. largestPrimeFactor(600851475143) should return 6857.
"""

def largestPrimeFactor(n):
    prime_factors = []
    sqrt = int(n ** 0.5)
    for i in range(2, sqrt + 1):
        is_prime = True
        if n % i == 0:
            for j in range(2, i):
                if i % j == 0:
                    is_prime = False
                    break
            if is_prime:
                prime_factors.append(i)

    if len(prime_factors) == 0:
        return n
    return max(prime_factors)

print(largestPrimeFactor(2))
print(largestPrimeFactor(3))
print(largestPrimeFactor(5))
print(largestPrimeFactor(7))
print(largestPrimeFactor(8))
print(largestPrimeFactor(13195))
print(largestPrimeFactor(600851475143))