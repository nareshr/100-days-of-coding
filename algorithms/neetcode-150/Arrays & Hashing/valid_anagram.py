"""
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

 
Example 1:

    Input: s = "anagram", t = "nagaram"

    Output: true

Example 2:

    Input: s = "rat", t = "car"

    Output: false


Constraints:

1 <= s.length, t.length <= 5 * 104
s and t consist of lowercase English letters.
 

Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?

Prerequisites: python version 3.9+
"""

# Solution 1
class Solution1:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        return sorted(s) == sorted(t)


sol = Solution1()
s1 = "anagram"
t1 = "nagaram"
print(sol.isAnagram(s1, t1)) # True

s2 = "rat"
t2 = "car"
print(sol.isAnagram(s2, t2)) # False

s3 = "racecar"
t3 = "carrace"
print(sol.isAnagram(s3, t3)) # True

s4 = "jar"
t4 = "jam"
print(sol.isAnagram(s4, t4)) # False

print("=============================")
print()


# Solution 2
import unicodedata
from collections import Counter

class Solution2:

    def normalize_unicode_string(self, s: str) -> str:
        normalized = unicodedata.normalize("NFC", s)
        return "".join(ch for ch in normalized.casefold() if ch.isalnum())       

    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
            
        s_normal = self.normalize_unicode_string(s)
        t_normal = self.normalize_unicode_string(t)

        return Counter(s_normal) == Counter(t_normal)


sol2 = Solution2()
print(sol2.isAnagram("résumé", "sérumé"))   # True
print(sol2.isAnagram("Ångström", "mörtågns")) # True
print(sol2.isAnagram("Listen", "Silent"))    # True
print(sol2.isAnagram("hello", "helo"))       # False