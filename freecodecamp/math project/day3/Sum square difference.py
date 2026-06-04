"""
Problem 6: Sum square difference
The sum of the squares of the first ten natural numbers is,

12 + 22 + ... + 102 = 385
The square of the sum of the first ten natural numbers is,

(1 + 2 + ... + 10)2 = 552 = 3025
Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.

Find the difference between the sum of the squares of the first n natural numbers and the square of the sum.

Tests:
1. sumSquareDifference(10) should return a number.
2. sumSquareDifference(10) should return 2640.
3. sumSquareDifference(20) should return 41230.
4. sumSquareDifference(100) should return 25164150.
"""

def sumSquareDifference(n):
    sum_of_the_square = 0
    total_sum = 0

    for i in range(1, n + 1):
        sum_of_the_square += (i ** 2)
        total_sum += i
    
    difference = (total_sum ** 2) - sum_of_the_square

    return difference


print(sumSquareDifference(10))
print(sumSquareDifference(20))
print(sumSquareDifference(100))