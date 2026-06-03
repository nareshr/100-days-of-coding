"""
Problem 4: Largest palindrome product
A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.

Find the largest palindrome made from the product of two n-digit numbers.

Tests:
1. largestPalindromeProduct(2) should return a number.
2. largestPalindromeProduct(2) should return 9009.
3. largestPalindromeProduct(3) should return 906609.
"""

def largestPalindromeProduct(n):
    max_number = 10 ** (n - 1)
    min_number = (10 ** n) - 1
    max_palindrome = 0
    factor1 = 0
    factor2 = 0

    def is_palindrome(number):
        return str(number) == str(number)[::-1]

    for i in range(max_number, min_number + 1):
        for j in range(i, min_number + 1):
            product = i * j

            if product <= max_palindrome:
                break

            if is_palindrome(product) and product > max_palindrome:
                max_palindrome = product
                factor1 = i
                factor2 = j


    print(factor1, factor2)
    return max_palindrome



print(largestPalindromeProduct(2))
print(largestPalindromeProduct(3))
