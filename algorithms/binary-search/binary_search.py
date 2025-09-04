def binary_search(arr, target):
    """
    Perform binary search on a sorted list to find the target element.
    
    Args:
        arr (list): A sorted list of elements (ascending order).
        target: The element to search for.
    
    Returns:
        int: The index of the target element if found, otherwise -1.
    """
    
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2  # Find the middle index
        
        if arr[mid] == target:
            return mid  # Target found
        
        elif arr[mid] < target:
            left = mid + 1  # Search in the right half
        else:
            right = mid - 1  # Search in the left half
    
    return -1  # Target not found


# Example usage:
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(numbers, 7))   # Output: 3 (index of 7)
print(binary_search(numbers, 2))   # Output: -1 (not found)