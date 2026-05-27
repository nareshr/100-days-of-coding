# Rotate an array to the right by k steps in-place.

def rotate(nums, k):
    k %= len(nums) 
    nums.reverse() 
    nums[:k] = nums[:k][::-1] 
    nums[k:] = nums[k:][::-1]

arr = [1, 2, 3, 4, 5, 6, 7]
rotate(arr, 3)
print(arr)  # Output: [5, 6, 7, 1, 2, 3, 4]