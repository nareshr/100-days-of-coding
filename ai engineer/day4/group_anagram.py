"""
Anagram Groups
Given an array of words, return a 2d array of the words grouped into anagrams.

Words are anagrams if they contain the same letters in any order.
Each word belongs to exactly one group.
Return order doesn't matter.
For example, 

given ["listen", "silent", "hello", "enlist", "world"], 

return [["listen", "silent", "enlist"], ["hello"], ["world"]].

Tests:

1. groupAnagrams(["listen", "silent", "hello", "enlist", "world"]) 
    
    should return [["listen", "silent", "enlist"], ["hello"], ["world"]].

2. groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
    
    should return [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]].

3. groupAnagrams(["care", "race", "acre", "pots", "stop", "tops", "opts", "post", "spot", "evil", "vile", "live", "veil"])
    
    should return [["acre", "care", "race"], ["evil", "live", "veil", "vile"], ["opts", "post", "pots", "spot", "stop", "tops"]].

4. groupAnagrams(["algorithms", "logarithms", "education", "cautioned", "auctioned", "triangle", "integral", "alerting", "relating"])
    
    should return [["alerting", "integral", "relating", "triangle"], ["algorithms", "logarithms"], ["auctioned", "cautioned", "education"]].
"""

from collections import defaultdict

def group_anagrams(words):
    grouped_dict = defaultdict(list)
    for word in words:
        wd = sorted(word.lower().replace(" ", ""))
        sorted_word = "".join(wd)
        grouped_dict[sorted_word].append(word)

    final_list = list(grouped_dict.values())
    return final_list


print(group_anagrams(["listen", "silent", "hello", "enlist", "world"]))
print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
print(group_anagrams(["care", "race", "acre", "pots", "stop", "tops", "opts", "post", "spot", "evil", "vile", "live", "veil"]))
print(group_anagrams(["algorithms", "logarithms", "education", "cautioned", "auctioned", "triangle", "integral", "alerting", "relating"]))