# Given two lists, return a new list with elements that appear in both (intersection) without using set().

def intersect(a, b): 

    intersection = [item for item in a if item in b]

    print(intersection)

    b_counts = {} 
    for x in b: 
        b_counts[x] = b_counts.get(x, 0) + 1 

    result = [] 
    for x in a:
        if b_counts.get(x, 0) > 0: 
            result.append(x); 
            b_counts[x] -= 1 
    return result


list1 = [1, 2, 3, 4]
list2 = [3, 4, 5, 6]

print(intersect(list1, list2))