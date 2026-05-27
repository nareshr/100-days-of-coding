# Given an array, return the index of the maximum element without using max().

def max_idx(arr): 
    mi = 0
    for i in range(1, len(arr)):
        if arr[i] > arr[mi]: mi = i 
    return mi

nums = [10, 5, 20, 15, 8]

print(max_idx(nums))