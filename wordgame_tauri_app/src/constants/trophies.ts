import PentagonSVG from "../assets/trophies/pentagon.svg";

interface OneTrophyConfig {
  key: string,
  icon: string, // SVG String
  blurb: string,
  howToEarn: string,
}

export const allTrophies: OneTrophyConfig[] = [
  {
    key: "fast-board",
    icon: PentagonSVG,
    blurb: "Late for an appointment",
    howToEarn: "Complete a board in under a minute.",
  },
  {
    key: "elementary",
    icon: PentagonSVG,
    blurb: "Elementary",
    howToEarn: "Find the 7-letter word first.",
  },
  {
    key: "boards-100",
    icon: PentagonSVG,
    blurb: "",
    howToEarn: "Complete 100 boards.",
  },
  {
    key: "friends-5",
    icon: PentagonSVG,
    blurb: "A friend in need...",
    howToEarn: "Complete 5 boards with a friend's help.",
  },
  {
    key: "secret",
    icon: PentagonSVG,
    blurb: "",
    howToEarn: "Discover the secret on the home page.",
  },
  {
    key: "words-500",
    icon: PentagonSVG,
    blurb: "",
    howToEarn: "Place 500 words.",
  },
  {
    key: "letters-5000",
    icon: PentagonSVG,
    blurb: "",
    howToEarn: "Place 5,000 letters.",
  },
  {
    key: "cheat-one-board",
    icon: PentagonSVG,
    blurb: "Down on your luck",
    howToEarn: "Cheat 3 times on the same board.",
  },
  {
    key: "make-friend",
    icon: PentagonSVG,
    blurb: "'ello chum!",
    howToEarn: "Make a friend.",
  },
  {
    key: "dont-cheat",
    icon: PentagonSVG,
    blurb: "When they go low, we go high",
    howToEarn: "Complete 10 boards in a row without cheating.",
  },
  {
    key: "cheat-25",
    icon: PentagonSVG,
    blurb: "If you ain't cheatin', you ain't tryin'",
    howToEarn: "Cheat a total of 25 times.",
  },
  {
    key: "week-days",
    icon: PentagonSVG,
    blurb: "",
    howToEarn: "Complete a board on each day of the week.",
  },
]