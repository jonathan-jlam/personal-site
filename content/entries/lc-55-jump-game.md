---
title: "[LC55] Jump Game"
type: coding
date: "2026-08-30"
excerpt: "DP Day 3 - Jump Game"
series: "leetcode-dp"
seriesTitle: "LeetCode DP Practice"
---

Originally tried a DP solution here because of the tag, but ran into a TLE error.
The key mistake in my solution is the introduction of the second for loop.
That loop was meant to find the first instance of a path to the end of the array, denoted by True
```py
class Solution(object):
    def canJump(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        n = len(nums)
        dp = [False for _ in range(n)]

        dp[-1] = True
        for i in range(n-2, -1, -1):
            for j in range(1, nums[i]+1):
                if dp[i+j]:
                    dp[i]=True
                    break
        return dp[0]
```



The second solution is a lot better because it just maintains the minimum True value as we traverse down the array.
This is the value that we know has a path to the end, and as long as the current element is able to "see" the minTrue, we have a path to the end.
We just use a simple >= to determine this "sight".

```py
class Solution(object):
    def canJump(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        n = len(nums)
        minTrue = n-1

        for i in range(n-2, -1, -1):
            if i + nums[i] >= minTrue:
                minTrue = i
        return minTrue == 0
```