# Write a list comprehension that returns all even squares from 1 to 100.

even_squares = [x**2 for x in range(1, 101) if x % 2 == 0]

print(even_squares)