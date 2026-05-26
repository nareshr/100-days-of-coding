# Write a decorator @timer that prints the execution time of any function it wraps.

from functools import wraps
import time

def timer(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = fn(*args, **kwargs)
        end = time.time()
        print(f"{fn.__name__} took {end - start:.4f}s")
        return result
    return wrapper

