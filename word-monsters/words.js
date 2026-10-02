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
      { w: "A", type: "letter", letter: "A", icon: "🍎", anchor: "apple", color: "#e63946", label: "Aa", alts: ["B", "C", "M"] },
      { w: "B", type: "letter", letter: "B", icon: "🐻", anchor: "bear", color: "#3a86ff", label: "Bb", alts: ["A", "D", "P"] },
      { w: "C", type: "letter", letter: "C", icon: "🐱", anchor: "cat", color: "#fb5607", label: "Cc", alts: ["O", "G", "S"] },
      { w: "D", type: "letter", letter: "D", icon: "🦆", anchor: "duck", color: "#27ae60", label: "Dd", alts: ["B", "P", "T"] },
      { w: "E", type: "letter", letter: "E", icon: "🐘", anchor: "elephant", color: "#8338ec", label: "Ee", alts: ["F", "L", "H"] },
      { w: "F", type: "letter", letter: "F", icon: "🐟", anchor: "fish", color: "#00b4d8", label: "Ff", alts: ["E", "T", "P"] },
      { w: "G", type: "letter", letter: "G", icon: "🍇", anchor: "grapes", color: "#7209b7", label: "Gg", alts: ["C", "O", "Q"] },
      { w: "H", type: "letter", letter: "H", icon: "🐴", anchor: "horse", color: "#ffbe0b", label: "Hh", alts: ["N", "M", "E"] },
      { w: "I", type: "letter", letter: "I", icon: "🍦", anchor: "ice cream", color: "#ff70a6", label: "Ii", alts: ["L", "T", "J"] },
      { w: "J", type: "letter", letter: "J", icon: "🦘", anchor: "jump", color: "#fb5607", label: "Jj", alts: ["I", "L", "U"] },
      { w: "K", type: "letter", letter: "K", icon: "🪁", anchor: "kite", color: "#3a86ff", label: "Kk", alts: ["X", "H", "R"] },
      { w: "L", type: "letter", letter: "L", icon: "🦁", anchor: "lion", color: "#ffbe0b", label: "Ll", alts: ["I", "T", "J"] },
      { w: "M", type: "letter", letter: "M", icon: "👾", anchor: "monster", color: "#8338ec", label: "Mm", alts: ["N", "W", "H"] },
      { w: "N", type: "letter", letter: "N", icon: "🐦", anchor: "nest", color: "#27ae60", label: "Nn", alts: ["M", "H", "U"] },
      { w: "O", type: "letter", letter: "O", icon: "🐙", anchor: "octopus", color: "#fb5607", label: "Oo", alts: ["C", "Q", "G"] },
      { w: "P", type: "letter", letter: "P", icon: "🐶", anchor: "puppy", color: "#ff70a6", label: "Pp", alts: ["B", "D", "R"] },
      { w: "Q", type: "letter", letter: "Q", icon: "👑", anchor: "queen", color: "#ffd166", label: "Qq", alts: ["O", "G", "P"] },
      { w: "R", type: "letter", letter: "R", icon: "🐰", anchor: "rabbit", color: "#ff3b5c", label: "Rr", alts: ["P", "B", "K"] },
      { w: "S", type: "letter", letter: "S", icon: "☀️", anchor: "sun", color: "#ffbe0b", label: "Ss", alts: ["C", "Z", "O"] },
      { w: "T", type: "letter", letter: "T", icon: "🐯", anchor: "tiger", color: "#fb5607", label: "Tt", alts: ["I", "L", "F"] },
      { w: "U", type: "letter", letter: "U", icon: "☂️", anchor: "umbrella", color: "#00b4d8", label: "Uu", alts: ["V", "O", "W"] },
      { w: "V", type: "letter", letter: "V", icon: "🚐", anchor: "van", color: "#8338ec", label: "Vv", alts: ["U", "W", "Y"] },
      { w: "W", type: "letter", letter: "W", icon: "🐳", anchor: "whale", color: "#3a86ff", label: "Ww", alts: ["M", "V", "N"] },
      { w: "X", type: "letter", letter: "X", icon: "🩻", anchor: "x-ray", color: "#e63946", label: "Xx", alts: ["K", "Y", "Z"] },
      { w: "Y", type: "letter", letter: "Y", icon: "🪀", anchor: "yo-yo", color: "#ff70a6", label: "Yy", alts: ["V", "X", "U"] },
      { w: "Z", type: "letter", letter: "Z", icon: "🦓", anchor: "zebra", color: "#27ae60", label: "Zz", alts: ["S", "N", "X"] }
    ]
  },
  {
    id: "reef",
    name: "Rainbow Reef",
    subtitle: "More Colors",
    labelColor: "#0d8a84",
    sky: ["#b8f3ff", "#e6fffb"],
    ground: "#f6d98b",
    words: [
      // Decoys are close cousins on purpose (teal vs green vs blue) so the eye has to really look.
      { w: "brown", type: "color", color: "#9a5b2e", label: "Brown", say: "Find BROWN!", successSay: "Brown! Like chocolate!", alts: ["orange", "black", "maroon"] },
      { w: "black", type: "color", color: "#2a2833", label: "Black", say: "Find BLACK!", successSay: "Black! Like the night sky!", alts: ["gray", "navy", "brown"] },
      { w: "white", type: "color", color: "#ffffff", text: "#8a87a0", label: "White", say: "Find WHITE!", successSay: "White! Like snow!", alts: ["gray", "peach", "black"] },
      { w: "gray", type: "color", color: "#9ea3ad", label: "Gray", say: "Find GRAY!", successSay: "Gray! Like an elephant!", alts: ["white", "black", "lavender"] },
      { w: "teal", type: "color", color: "#17b3a9", label: "Teal", say: "Find TEAL!", successSay: "Teal! Blue and green together!", alts: ["green", "blue", "lime"] },
      { w: "peach", type: "color", color: "#ffbf9e", text: "#e07a4f", label: "Peach", say: "Find PEACH!", successSay: "Peach! Soft and fuzzy!", alts: ["pink", "orange", "white"] },
      { w: "lavender", type: "color", color: "#c4a8ff", label: "Lavender", say: "Find LAVENDER!", successSay: "Lavender! A light purple!", alts: ["purple", "pink", "gray"] },
      { w: "gold", type: "color", color: "#e9b824", text: "#c18f00", label: "Gold", say: "Find GOLD!", successSay: "Gold! Shiny like treasure!", alts: ["yellow", "orange", "brown"] },
      { w: "navy", type: "color", color: "#26388a", label: "Navy", say: "Find NAVY!", successSay: "Navy! A dark, dark blue!", alts: ["blue", "black", "purple"] },
      { w: "lime", type: "color", color: "#a3d930", text: "#6a9a0e", label: "Lime", say: "Find LIME!", successSay: "Lime! A bright yellow green!", alts: ["green", "yellow", "teal"] },
      { w: "maroon", type: "color", color: "#8a1f3b", label: "Maroon", say: "Find MAROON!", successSay: "Maroon! A dark red!", alts: ["red", "brown", "purple"] }
    ]
  },
  {
    id: "castle",
    name: "Shape Castle",
    subtitle: "Tricky Shapes",
    labelColor: "#c2410c",
    sky: ["#ffe1c7", "#fff6ea"],
    ground: "#e7c48a",
    words: [
      { w: "rectangle", type: "shape", shape: "rectangle", color: "#3a86ff", label: "Rectangle", say: "Find the RECTANGLE! Two long sides, two short sides.", successSay: "Rectangle! Like a door!", alts: ["square", "parallelogram", "trapezoid"] },
      { w: "pentagon", type: "shape", shape: "pentagon", color: "#ff70a6", label: "Pentagon", say: "Find the PENTAGON! It has five sides.", successSay: "Pentagon! Five sides!", alts: ["hexagon", "octagon", "triangle"] },
      { w: "hexagon", type: "shape", shape: "hexagon", color: "#ffbe0b", label: "Hexagon", say: "Find the HEXAGON! It has six sides.", successSay: "Hexagon! Six sides, like a honeycomb!", alts: ["pentagon", "octagon", "circle"] },
      { w: "octagon", type: "shape", shape: "octagon", color: "#e63946", label: "Octagon", say: "Find the OCTAGON! It has eight sides.", successSay: "Octagon! Eight sides, like a stop sign!", alts: ["hexagon", "pentagon", "circle"] },
      { w: "trapezoid", type: "shape", shape: "trapezoid", color: "#27ae60", label: "Trapezoid", say: "Find the TRAPEZOID!", successSay: "Trapezoid! Like a little hill!", alts: ["triangle", "rectangle", "parallelogram"] },
      { w: "parallelogram", type: "shape", shape: "parallelogram", color: "#8338ec", label: "Parallelogram", say: "Find the PARALLELOGRAM! A leaning rectangle.", successSay: "Parallelogram! It leans over!", alts: ["rectangle", "trapezoid", "diamond"] },
      { w: "crescent", type: "shape", shape: "crescent", color: "#f4c430", label: "Crescent", say: "Find the CRESCENT! Like the moon.", successSay: "Crescent! Like a banana moon!", alts: ["semicircle", "circle", "oval"] },
      { w: "semicircle", type: "shape", shape: "semicircle", color: "#00b4d8", label: "Semicircle", say: "Find the SEMICIRCLE! Half a circle.", successSay: "Semicircle! Half of a circle!", alts: ["circle", "crescent", "trapezoid"] }
    ]
  },
  {
    id: "garden",
    name: "Giant's Garden",
    subtitle: "Big & Small",
    labelColor: "#b45309",
    sky: ["#d6f5c9", "#fffbe6"],
    ground: "#9bd36b",
    words: [
      // group: which comparison picture to draw. Each card shows the same thing at a different amount.
      { w: "big", type: "cmp", group: "size", label: "Big", say: "Which one is BIG?", successSay: "Big! That one is BIG!" },
      { w: "small", type: "cmp", group: "size", label: "Small", say: "Which one is small?", successSay: "Small! That one is teeny tiny!" },
      { w: "tall", type: "cmp", group: "height", label: "Tall", say: "Which tower is TALL?", successSay: "Tall! Up, up, up!" },
      { w: "short", type: "cmp", group: "height", label: "Short", say: "Which tower is short?", successSay: "Short! Just a little one!" },
      { w: "more", type: "cmp", group: "count", label: "More", say: "Which one has MORE?", successSay: "More! Lots and lots!" },
      { w: "less", type: "cmp", group: "count", label: "Less", say: "Which one has LESS?", successSay: "Less! Just a few!" },
      { w: "full", type: "cmp", group: "fill", label: "Full", say: "Which cup is FULL?", successSay: "Full! All the way to the top!" },
      { w: "empty", type: "cmp", group: "fill", label: "Empty", say: "Which cup is EMPTY?", successSay: "Empty! Nothing inside!" },
      { w: "biggest", type: "cmp", group: "size3", label: "Biggest", say: "Which one is the BIGGEST?", successSay: "Biggest! The biggest of all!" },
      { w: "smallest", type: "cmp", group: "size3", label: "Smallest", say: "Which one is the SMALLEST?", successSay: "Smallest! The tiniest one!" },
      { w: "tallest", type: "cmp", group: "height3", label: "Tallest", say: "Which tower is the TALLEST?", successSay: "Tallest! Touching the sky!" },
      { w: "shortest", type: "cmp", group: "height3", label: "Shortest", say: "Which tower is the SHORTEST?", successSay: "Shortest! The littlest tower!" }
    ]
  },
  {
    id: "lagoon",
    name: "Echo Lagoon",
    subtitle: "Letter Sounds",
    labelColor: "#0369a1",
    sky: ["#c4ecff", "#f0fbff"],
    ground: "#7fd1a8",
    words: [
      // The picture is shown on the sign; the child taps the letter it starts with.
      // Pictures differ from Sparkle Cave on purpose so he matches the sound, not a memorized picture.
      { w: "/a/", type: "sound", letter: "a", icon: "🐜", pic: "ant", color: "#e63946" },
      { w: "/b/", type: "sound", letter: "b", icon: "🍌", pic: "banana", color: "#f4a100" },
      { w: "/c/", type: "sound", letter: "c", icon: "🥕", pic: "carrot", color: "#fb5607" },
      { w: "/d/", type: "sound", letter: "d", icon: "🐶", pic: "dog", color: "#9a5b2e" },
      { w: "/e/", type: "sound", letter: "e", icon: "🥚", pic: "egg", color: "#8338ec" },
      { w: "/f/", type: "sound", letter: "f", icon: "🐸", pic: "frog", color: "#27ae60" },
      { w: "/g/", type: "sound", letter: "g", icon: "🐐", pic: "goat", color: "#7209b7" },
      { w: "/h/", type: "sound", letter: "h", icon: "🎩", pic: "hat", color: "#2b2440" },
      { w: "/i/", type: "sound", letter: "i", icon: "🐛", pic: "inchworm", color: "#2fbf5f" },
      { w: "/j/", type: "sound", letter: "j", icon: "✈️", pic: "jet", color: "#3a86ff" },
      { w: "/k/", type: "sound", letter: "k", icon: "🔑", pic: "key", color: "#e9b824" },
      { w: "/l/", type: "sound", letter: "l", icon: "🍋", pic: "lemon", color: "#c9a800" },
      { w: "/m/", type: "sound", letter: "m", icon: "🐒", pic: "monkey", color: "#9a5b2e" },
      { w: "/n/", type: "sound", letter: "n", icon: "👃", pic: "nose", color: "#ff70a6" },
      { w: "/o/", type: "sound", letter: "o", icon: "🐂", pic: "ox", color: "#fb5607" },
      { w: "/p/", type: "sound", letter: "p", icon: "🐷", pic: "pig", color: "#ff70a6" },
      { w: "/r/", type: "sound", letter: "r", icon: "🌈", pic: "rainbow", color: "#e63946" },
      { w: "/s/", type: "sound", letter: "s", icon: "🐍", pic: "snake", color: "#27ae60" },
      { w: "/t/", type: "sound", letter: "t", icon: "🐢", pic: "turtle", color: "#17b3a9" },
      { w: "/u/", type: "sound", letter: "u", icon: "☂️", pic: "umbrella", color: "#00b4d8" },
      { w: "/v/", type: "sound", letter: "v", icon: "🎻", pic: "violin", color: "#8338ec" },
      { w: "/w/", type: "sound", letter: "w", icon: "🍉", pic: "watermelon", color: "#e63946" },
      { w: "/y/", type: "sound", letter: "y", icon: "🧶", pic: "yarn", color: "#ff70a6" },
      { w: "/z/", type: "sound", letter: "z", icon: "🤐", pic: "zipper", color: "#3a86ff" }
    ]
  }
];

// Letter sounds: fill in the spoken prompt, celebration, and look-alike decoys.
// Text-to-speech can't say isolated sounds ("buh" comes out "boo"), so prompts only ever say whole words.
(() => {
  const lagoon = window.WM_REGIONS.find((r) => r.id === "lagoon");
  const TRICKY = { b: ["d", "p"], d: ["b", "p"], p: ["b", "d"], m: ["n", "w"], n: ["m", "h"], u: ["n", "v"], w: ["m", "v"], c: ["k", "s"], k: ["c", "g"], i: ["e", "l"], e: ["i", "a"] };
  const NAME = { a: "ay" };
  const cave = window.WM_REGIONS.find((r) => r.id === "cave");
  cave.words.forEach((e) => {
    const name = NAME[e.letter.toLowerCase()] || e.letter;
    e.say = `Find letter ${name}! ${name} is for ${e.anchor}.`;
    e.successSay = `Letter ${name}! ${name} is for ${e.anchor}!`;
  });
  lagoon.words.forEach((e) => {
    const word = e.pic.charAt(0).toUpperCase() + e.pic.slice(1);
    const name = NAME[e.letter] || e.letter.toUpperCase();
    e.label = e.letter;
    e.say = `${word}. What letter does ${e.pic} start with? ${word}.`;
    e.successSay = `Yes! ${word} starts with ${name}!`;
    e.alts = (TRICKY[e.letter] || []).map((l) => `/${l}/`);
  });
})();
