export interface Quote {
  readonly text: string;
  readonly author: string;
  readonly role: string;
}

export const QUOTES: readonly Quote[] = [
  {
    text: "Zcash is the most interesting Bitcoin alternative. Bitcoin is great, but if it's not private, it's not safe.",
    author: "Edward Snowden",
    role: "Whistleblower & Privacy Advocate",
  },
  {
    text: "Privacy is not about something to hide. Privacy is about something to protect.",
    author: "Edward Snowden",
    role: "Whistleblower & Privacy Advocate",
  },
  {
    text: "Zcash is the first open, permissionless cryptocurrency that can fully protect the privacy of transactions using zero-knowledge cryptography.",
    author: "Zooko Wilcox",
    role: "Zcash Founder",
  },
  {
    text: "Privacy is a human right and a prerequisite for a free society.",
    author: "Zooko Wilcox",
    role: "Zcash Founder",
  },
  {
    text: "Privacy is necessary for an open society in the electronic age. Privacy is not secrecy.",
    author: "Eric Hughes",
    role: "A Cypherpunk's Manifesto, 1993",
  },
  {
    text: "Privacy is an inherent human right, and a requirement for maintaining the human condition with dignity and respect.",
    author: "Bruce Schneier",
    role: "Security Expert & Author",
  },
  {
    text: "Arguing that you don't care about privacy because you have nothing to hide is like arguing you don't care about free speech because you have nothing to say.",
    author: "Edward Snowden",
    role: "Whistleblower & Privacy Advocate",
  },
] as const;
