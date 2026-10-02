// Learning Content for Connor (3), Kyler (almost 3), and Ethan (2).
//
// 1. Giggle Meadow: Colors & Shapes (Ethan & Kyler friendly!)
// 2. Wobble Woods:  Numbers 1 to 10 (Connor counting friendly!)
// 3. Sparkle Cave:  Letters A to Z (Preschool letter readiness!)
//
// All 3 regions are open from day 1 so toddlers can choose what they want.

window.WM_REGIONS = [
  {
    id: "meadow",
    name: "Giggle Meadow",
    subtitle: "Colors & Shapes",
    labelColor: "#2e8b22",
    sky: ["#bdf2ff", "#e9fff0"],
    ground: "#8fdc7a",
    words: [
      // Colors
      { w: "red", type: "color", color: "#ff3b5c", label: "Red", say: "Find RED!", successSay: "Red!", alts: ["blue", "yellow", "green"] },
      { w: "blue", type: "color", color: "#2f80ed", label: "Blue", say: "Find BLUE!", successSay: "Blue!", alts: ["red", "yellow", "green"] },
      { w: "yellow", type: "color", color: "#ffbe0b", label: "Yellow", say: "Find YELLOW!", successSay: "Yellow!", alts: ["red", "blue", "purple"] },
      { w: "green", type: "color", color: "#27ae60", label: "Green", say: "Find GREEN!", successSay: "Green!", alts: ["blue", "orange", "pink"] },
      { w: "orange", type: "color", color: "#fb5607", label: "Orange", say: "Find ORANGE!", successSay: "Orange!", alts: ["red", "yellow", "purple"] },
      { w: "purple", type: "color", color: "#8338ec", label: "Purple", say: "Find PURPLE!", successSay: "Purple!", alts: ["blue", "pink", "green"] },
      { w: "pink", type: "color", color: "#ff70a6", label: "Pink", say: "Find PINK!", successSay: "Pink!", alts: ["red", "purple", "yellow"] },

      // Shapes
      { w: "circle", type: "shape", shape: "circle", color: "#ff3b5c", label: "Circle", say: "Find the round CIRCLE!", successSay: "Circle!", alts: ["square", "triangle", "star"] },
      { w: "square", type: "shape", shape: "square", color: "#2f80ed", label: "Square", say: "Find the SQUARE!", successSay: "Square!", alts: ["circle", "triangle", "diamond"] },
      { w: "triangle", type: "shape", shape: "triangle", color: "#27ae60", label: "Triangle", say: "Find the TRIANGLE!", successSay: "Triangle!", alts: ["circle", "square", "star"] },
      { w: "star", type: "shape", shape: "star", color: "#ffbe0b", label: "Star", say: "Find the shiny STAR!", successSay: "Star!", alts: ["circle", "heart", "triangle"] },
      { w: "heart", type: "shape", shape: "heart", color: "#ff70a6", label: "Heart", say: "Find the cute HEART!", successSay: "Heart!", alts: ["star", "circle", "square"] },
      { w: "diamond", type: "shape", shape: "diamond", color: "#8338ec", label: "Diamond", say: "Find the DIAMOND!", successSay: "Diamond!", alts: ["triangle", "square", "oval"] },
      { w: "oval", type: "shape", shape: "oval", color: "#fb5607", label: "Oval", say: "Find the OVAL!", successSay: "Oval!", alts: ["circle", "diamond", "square"] }
    ]
  },
  {
    id: "woods",
    name: "Wobble Woods",
    subtitle: "Numbers 1 to 10",
    labelColor: "#1e7232",
    sky: ["#c9f0d8", "#f3ffe9"],
    ground: "#5fb36a",
    words: [
      { w: "1", type: "number", count: 1, color: "#ff3b5c", label: "1", say: "Find number 1!", successSay: "One!", alts: ["2", "3", "4"] },
      { w: "2", type: "number", count: 2, color: "#fb5607", label: "2", say: "Find number 2!", successSay: "Two! One, two!", alts: ["1", "3", "5"] },
      { w: "3", type: "number", count: 3, color: "#ffbe0b", label: "3", say: "Find number 3!", successSay: "Three! One, two, three!", alts: ["1", "2", "4"] },
      { w: "4", type: "number", count: 4, color: "#27ae60", label: "4", say: "Find number 4!", successSay: "Four! One, two, three, four!", alts: ["3", "5", "6"] },
      { w: "5", type: "number", count: 5, color: "#00b4d8", label: "5", say: "Find number 5!", successSay: "Five! High five!", alts: ["4", "6", "2"] },
      { w: "6", type: "number", count: 6, color: "#3a86ff", label: "6", say: "Find number 6!", successSay: "Six!", alts: ["5", "7", "8"] },
      { w: "7", type: "number", count: 7, color: "#7209b7", label: "7", say: "Find number 7!", successSay: "Seven! Lucky seven!", alts: ["6", "8", "9"] },
      { w: "8", type: "number", count: 8, color: "#8338ec", label: "8", say: "Find number 8!", successSay: "Eight!", alts: ["7", "9", "10"] },
      { w: "9", type: "number", count: 9, color: "#ff70a6", label: "9", say: "Find number 9!", successSay: "Nine!", alts: ["8", "10", "6"] },
      { w: "10", type: "number", count: 10, color: "#e63946", label: "10", say: "Find big number 10!", successSay: "Ten! Double high five!", alts: ["9", "8", "5"] }
    ]
  },
  {
    id: "cave",
    name: "Sparkle Cave",
    subtitle: "Letters A to Z",
    labelColor: "#613bbd",
    sky: ["#d9ccff", "#f6efff"],
    ground: "#9b86d6",
    words: [
      { w: "A", type: "letter", letter: "A", icon: "🍎", anchor: "apple", color: "#e63946", label: "Aa", say: "Find letter A! Ah-ah-Apple!", successSay: "Letter A! Ah-ah-Apple!", alts: ["B", "C", "M"] },
      { w: "B", type: "letter", letter: "B", icon: "🐻", anchor: "bear", color: "#3a86ff", label: "Bb", say: "Find letter B! Buh-buh-Bear!", successSay: "Letter B! Buh-buh-Bear!", alts: ["A", "D", "P"] },
      { w: "C", type: "letter", letter: "C", icon: "🐱", anchor: "cat", color: "#fb5607", label: "Cc", say: "Find letter C! Cuh-cuh-Cat!", successSay: "Letter C! Cuh-cuh-Cat!", alts: ["O", "G", "S"] },
      { w: "D", type: "letter", letter: "D", icon: "🦆", anchor: "duck", color: "#27ae60", label: "Dd", say: "Find letter D! Duh-duh-Duck!", successSay: "Letter D! Duh-duh-Duck!", alts: ["B", "P", "T"] },
      { w: "E", type: "letter", letter: "E", icon: "🐘", anchor: "elephant", color: "#8338ec", label: "Ee", say: "Find letter E! Eh-eh-Elephant!", successSay: "Letter E! Eh-eh-Elephant!", alts: ["F", "L", "H"] },
      { w: "F", type: "letter", letter: "F", icon: "🐟", anchor: "fish", color: "#00b4d8", label: "Ff", say: "Find letter F! Fff-Fish!", successSay: "Letter F! Fff-Fish!", alts: ["E", "T", "P"] },
      { w: "G", type: "letter", letter: "G", icon: "🍇", anchor: "grapes", color: "#7209b7", label: "Gg", say: "Find letter G! Guh-guh-Grapes!", successSay: "Letter G! Guh-guh-Grapes!", alts: ["C", "O", "Q"] },
      { w: "H", type: "letter", letter: "H", icon: "🐴", anchor: "horse", color: "#ffbe0b", label: "Hh", say: "Find letter H! Huh-huh-Horse!", successSay: "Letter H! Huh-huh-Horse!", alts: ["N", "M", "E"] },
      { w: "I", type: "letter", letter: "I", icon: "🍦", anchor: "ice cream", color: "#ff70a6", label: "Ii", say: "Find letter I! Eye-Ice Cream!", successSay: "Letter I! Eye-Ice Cream!", alts: ["L", "T", "J"] },
      { w: "J", type: "letter", letter: "J", icon: "🦘", anchor: "jump", color: "#fb5607", label: "Jj", say: "Find letter J! Juh-juh-Jump!", successSay: "Letter J! Juh-juh-Jump!", alts: ["I", "L", "U"] },
      { w: "K", type: "letter", letter: "K", icon: "🪁", anchor: "kite", color: "#3a86ff", label: "Kk", say: "Find letter K! Kuh-kuh-Kite!", successSay: "Letter K! Kuh-kuh-Kite!", alts: ["X", "H", "R"] },
      { w: "L", type: "letter", letter: "L", icon: "🦁", anchor: "lion", color: "#ffbe0b", label: "Ll", say: "Find letter L! Lll-Lion!", successSay: "Letter L! Lll-Lion!", alts: ["I", "T", "J"] },
      { w: "M", type: "letter", letter: "M", icon: "👾", anchor: "monster", color: "#8338ec", label: "Mm", say: "Find letter M! Mmm-Monster!", successSay: "Letter M! Mmm-Monster!", alts: ["N", "W", "H"] },
      { w: "N", type: "letter", letter: "N", icon: "🐦", anchor: "nest", color: "#27ae60", label: "Nn", say: "Find letter N! Nnn-Nest!", successSay: "Letter N! Nnn-Nest!", alts: ["M", "H", "U"] },
      { w: "O", type: "letter", letter: "O", icon: "🐙", anchor: "octopus", color: "#fb5607", label: "Oo", say: "Find letter O! Ah-ah-Octopus!", successSay: "Letter O! Ah-ah-Octopus!", alts: ["C", "Q", "G"] },
      { w: "P", type: "letter", letter: "P", icon: "🐶", anchor: "puppy", color: "#ff70a6", label: "Pp", say: "Find letter P! Puh-puh-Puppy!", successSay: "Letter P! Puh-puh-Puppy!", alts: ["B", "D", "R"] },
      { w: "Q", type: "letter", letter: "Q", icon: "👑", anchor: "queen", color: "#ffd166", label: "Qq", say: "Find letter Q! Qu-qu-Queen!", successSay: "Letter Q! Qu-qu-Queen!", alts: ["O", "G", "P"] },
      { w: "R", type: "letter", letter: "R", icon: "🐰", anchor: "rabbit", color: "#ff3b5c", label: "Rr", say: "Find letter R! Rrr-Rabbit!", successSay: "Letter R! Rrr-Rabbit!", alts: ["P", "B", "K"] },
      { w: "S", type: "letter", letter: "S", icon: "☀️", anchor: "sun", color: "#ffbe0b", label: "Ss", say: "Find letter S! Sss-Sun!", successSay: "Letter S! Sss-Sun!", alts: ["C", "Z", "O"] },
      { w: "T", type: "letter", letter: "T", icon: "🐯", anchor: "tiger", color: "#fb5607", label: "Tt", say: "Find letter T! Tuh-tuh-Tiger!", successSay: "Letter T! Tuh-tuh-Tiger!", alts: ["I", "L", "F"] },
      { w: "U", type: "letter", letter: "U", icon: "☂️", anchor: "umbrella", color: "#00b4d8", label: "Uu", say: "Find letter U! Uh-uh-Umbrella!", successSay: "Letter U! Uh-uh-Umbrella!", alts: ["V", "O", "W"] },
      { w: "V", type: "letter", letter: "V", icon: "🚐", anchor: "van", color: "#8338ec", label: "Vv", say: "Find letter V! Vvv-Van!", successSay: "Letter V! Vvv-Van!", alts: ["U", "W", "Y"] },
      { w: "W", type: "letter", letter: "W", icon: "🐳", anchor: "whale", color: "#3a86ff", label: "Ww", say: "Find letter W! Wuh-wuh-Whale!", successSay: "Letter W! Wuh-wuh-Whale!", alts: ["M", "V", "N"] },
      { w: "X", type: "letter", letter: "X", icon: "🦊", anchor: "fox", color: "#e63946", label: "Xx", say: "Find letter X! Eks-eks-Fox!", successSay: "Letter X! Eks-eks-Fox!", alts: ["K", "Y", "Z"] },
      { w: "Y", type: "letter", letter: "Y", icon: "🪀", anchor: "yo-yo", color: "#ff70a6", label: "Yy", say: "Find letter Y! Yuh-yuh-Yo-yo!", successSay: "Letter Y! Yuh-yuh-Yo-yo!", alts: ["V", "X", "U"] },
      { w: "Z", type: "letter", letter: "Z", icon: "🦓", anchor: "zebra", color: "#27ae60", label: "Zz", say: "Find letter Z! Zzz-Zebra!", successSay: "Letter Z! Zzz-Zebra!", alts: ["S", "N", "X"] }
    ]
  }
];
