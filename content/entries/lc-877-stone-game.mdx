---
title: "[LC877] Stone Game"
type: coding
date: "2026-08-28"
excerpt: "DP Day 2 - Stone Game"
series: "leetcode-dp"
seriesTitle: "LeetCode DP Practice"
---

First try, but not optimal solution. 30 min time. I used a dp state of dp[i][j][player] to keep track of the state where the state is the maximum number of stones that "player" can get using only the stones from i to j. In this way, we maintain state for both players. This works, but is not the optimal dp setup.
I needed to ask myself the question: What state would be sufficient to know who wins? Well we just need to maintain the difference between the two players. So at each step -- regardless of whose turn it is -- our state should be dp[i][j] = the maximum advantage the current player has over the opponent. My solution which maintains two states is below.

```py
class Solution(object):
    def stoneGame(self, piles):
        """
        :type piles: List[int]
        :rtype: bool
        """
        n = len(piles)
        dp = [[[0, 0] for _ in range(n)] for _ in range(n)]

        for i in range(n):
            dp[i][i] = (0, piles[i])

        for k in range(2, n+1):
            for i in range(0, n-k+1):
                j=i+k-1

                if k % 2 == 0:
                    dp[i][j][0] = (max(piles[i] + dp[i+1][j][0], piles[j]+ dp[i][j-1][0]),dp[i][j][1])
                if k % 2 == 1:
                    dp[i][j][1] = (dp[i][j][0], max(piles[i] + dp[i+1][j][1], piles[j] + dp[i][j-1][1]))
        if dp[0][n-1][0] > dp[0][n-1][1]:
            return True
        return False
```
