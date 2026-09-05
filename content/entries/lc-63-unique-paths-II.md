---
title: "[LC63] Unique Paths II"
type: coding
date: "2026-08-31"
excerpt: "DP Day 4 - Max Subarray"
series: "leetcode-dp"
seriesTitle: "LeetCode DP Practice"
---

Unique Paths has a pretty common DP setup and is really easy to spot.
I think the only interesting thing is that there is a way to solve the problem in O(n) space
instead of using a 2D DP state.

The thing to notice about these problems where we care about the state from above and from the left is that 
we can iterate top and down and accumulate answers. We treat dp[i] as a running state/accumulator. And because
we traverse dp from left to right, we have the updated left state as well. That is all we need.

I did not learn this O(n) solution on this problem, but see [LC64] Minimum Path Sum because I applied this learning there.