export type EntryType = "coding" | "music" | "learning";

export type EntryBlock =
  | { type: "paragraph"; text: string }
  | { type: "video"; url: string; title: string }
  | { type: "code"; language: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export type Entry = {
  slug: string;
  type: EntryType;
  date: string;
  title: string;
  excerpt: string;
  body?: EntryBlock[];
};

export const entries: Entry[] = [
  
  {
    slug: "sap-c-hamod-study",
    type: "learning",
    date: "2026-08-29",
    title: "Certification Prep C_HAMOD SAP Certification",
    excerpt:
      "Prepping for a certification related to my work.",
    body: [
      {
        type: "paragraph",
        text: "I am trying to show more initiative at work. Even though I am not too interested in the current state of the job, I need to make sure I am doing all I can to learn the technologies that are placed in front of me. I think that showcases a good mentality not only to my current manager, but also to other companies when I switch jobs. Hopefully I can finish this certification soon -- I need it done by the end of the year anyway to maintain access to my SAP Learning Hub license.\n\nThis certification is all about data engineering things, specifically creating calculation views and other SAP HANA backend obejcts. Useful for my current day-to-day work..",
        
      },
    ],
  },
  {
    slug: "transcription-project-christmas-duet",
    type: "music",
    date: "2026-08-29",
    title: "Transcription Project - Christmas Duet",
    excerpt:
      "Transcribing a piano/vocal duet from one of my favorite duos.",
    body: [
      {
        type:"paragraph",
        text: "As far as I know, nobody really transcribes the works from Pepita Salim / Carol Kuswanto. I do not think they sell transcriptions either. Recently I have been interested in this particular arrangement below:\n"
      },
      {
      type: "video",
      url: "https://www.youtube.com/embed/3dSWv4R8ciY",
      title: "Christmas duet performance",
      },
      {
        type:"paragraph",
      text: "Planning to perform it with a friend for a Christmas recital, so working on a transcription."
      },
    ],
  },
  {
    slug: "lc-877-stone-game",
    type: "coding",
    date: "2026-08-28",
    title: "[LC877] Stone Game",
    excerpt:
      "DP Day 2 - Stone Game",
        body: [
      {
        type:"paragraph",
        text: "First try, but not optimal solution. 30 min time. I used a dp state of dp[i][j][player] to keep track of the state where the state is the maximum number of stones that \"player\" can get using only the stones from i to j. In this way, we maintain state for both players. This works, but is not the optimal dp setup.\nI needed to ask myself the question: What state would be sufficient to know who wins? Well we just need to maintain the difference between the two players. So at each step -- regardless of whose turn it is -- our state should be dp[i][j] = the maximum advantage the current player has over the opponent. My solution which maintains two states is below."
      },
      {
        type:"code",
        language:"py",
        code:`class Solution(object):
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
        return False`
      },
    ],
  },
  {
    slug: "lc-53-maximum-subarray",
    type: "coding",
    date: "2026-08-26",
    title: "[LC53] Maximum Subarray",
    excerpt:
      "DP Day 1 - Max Subarray",
    body: [
      {
        type: "paragraph",
        text: "First try! like 18 mins. haven't done LC in a while so struggled to come up with the intuition. But soon saw that we have no need to consider any subarray with a negative sum. Initially thought that there was going to be some sub-problem computation due to th DP tag.. but should've asked myself \"are we concerned with HOW(combinations, decisions) we get the answer?\" -- and the answer to that is no. We are looking for a subarray, we do not care how that subarray is composed/mid point, etc."
    ,
    },
  ],
},
];

export const typeLabel: Record<EntryType, string> = {
  coding: "coding",
  music: "music",
  learning: "learning",
};
