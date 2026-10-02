// Word data for Word Monsters.
//
// w:      the word as shown
// tricky: the word with its "sneaky" letters in [brackets] (shown with a heart after a catch)
// alts:   look-alike / sound-alike decoys. Must be real words with distinct sounds
//         (no homophones like some/sum, would/wood) because they are also spoken aloud.
// say:    optional override for how text-to-speech should pronounce it
// easy:   true for decodable words he can already sound out (mixed in so sight words
//         never look "special")
//
// Sight words come from the Dolch pre-primer / primer lists and common Fry words.

window.WM_REGIONS = [
  {
    id: "meadow",
    name: "Giggle Meadow",
    emoji: "\u{1F33C}",
    sky: ["#bdf2ff", "#e9fff0"],
    ground: "#8fdc7a",
    words: [
      { w: "the", tricky: "th[e]", alts: ["then", "them", "he"] },
      { w: "a", tricky: "[a]", alts: ["at", "an", "I"], say: "uh" },
      { w: "I", tricky: "I", alts: ["in", "it", "is"], say: "eye" },
      { w: "to", tricky: "t[o]", alts: ["top", "go", "so"] },
      { w: "you", tricky: "y[ou]", alts: ["yes", "yum", "yak"] },
      { w: "said", tricky: "s[ai]d", alts: ["sad", "sand", "sit"] },
      { w: "of", tricky: "[o][f]", alts: ["off", "on", "if"] },
      { w: "was", tricky: "w[a][s]", alts: ["wax", "saw", "wag"] },
      { w: "is", tricky: "i[s]", alts: ["it", "in", "his"] },
      { w: "he", tricky: "h[e]", alts: ["hen", "hat", "me"] },
      { w: "we", tricky: "w[e]", alts: ["wet", "web", "me"] },
      { w: "my", tricky: "m[y]", alts: ["map", "mud", "me"] },
      { w: "cat", easy: true, alts: ["cot", "cut", "can"] },
      { w: "sun", easy: true, alts: ["sit", "sand", "fun"] },
      { w: "big", easy: true, alts: ["bag", "bug", "dig"] },
      { w: "run", easy: true, alts: ["ran", "rug", "sun"] },
      { w: "fish", easy: true, alts: ["dish", "fist", "wish"] },
      { w: "jump", easy: true, alts: ["bump", "jam", "lump"] }
    ]
  },
  {
    id: "woods",
    name: "Wobble Woods",
    emoji: "\u{1F332}",
    sky: ["#c9f0d8", "#f3ffe9"],
    ground: "#5fb36a",
    words: [
      { w: "she", tricky: "sh[e]", alts: ["shed", "ship", "he"] },
      { w: "have", tricky: "hav[e]", alts: ["hat", "hand", "hive"] },
      { w: "from", tricky: "fr[o]m", alts: ["frog", "fan", "frame"] },
      { w: "are", tricky: "[are]", alts: ["arm", "art", "ran"] },
      { w: "they", tricky: "th[ey]", alts: ["then", "the", "hey"] },
      { w: "what", tricky: "wh[a]t", alts: ["hat", "wet", "wish"] },
      { w: "do", tricky: "d[o]", alts: ["dog", "go", "dot"] },
      { w: "one", tricky: "[one]", alts: ["on", "ten", "owl"] },
      { w: "two", tricky: "t[wo]", alts: ["twin", "tub", "top"] },
      { w: "come", tricky: "c[o]m[e]", alts: ["cone", "came", "cup"] },
      { w: "here", tricky: "h[ere]", alts: ["her", "hen", "hat"] },
      { w: "where", tricky: "wh[ere]", alts: ["when", "wet", "wire"] },
      { w: "kite", easy: true, alts: ["kit", "bite", "cat"] },
      { w: "frog", easy: true, alts: ["fog", "flag", "fig"] },
      { w: "ship", easy: true, alts: ["shop", "sip", "chip"] },
      { w: "ring", easy: true, alts: ["rug", "sing", "rang"] },
      { w: "cake", easy: true, alts: ["cane", "lake", "cap"] },
      { w: "bike", easy: true, alts: ["bake", "like", "bit"] }
    ]
  },
  {
    id: "cave",
    name: "Sparkle Cave",
    emoji: "\u{1F48E}",
    sky: ["#d9ccff", "#f6efff"],
    ground: "#9b86d6",
    words: [
      { w: "there", tricky: "th[ere]", alts: ["three", "then", "tree"] },
      { w: "were", tricky: "w[ere]", alts: ["wet", "west", "wore"] },
      { w: "some", tricky: "s[o]m[e]", alts: ["same", "sock", "sap"] },
      { w: "want", tricky: "w[a]nt", alts: ["went", "wand", "ant"] },
      { w: "put", tricky: "p[u]t", alts: ["pot", "pat", "pin"] },
      { w: "could", tricky: "c[oul]d", alts: ["cold", "cloud", "cub"] },
      { w: "would", tricky: "w[oul]d", alts: ["wild", "word", "wolf"] },
      { w: "does", tricky: "d[oe][s]", alts: ["dogs", "dots", "dish"] },
      { w: "any", tricky: "[a]ny", alts: ["and", "ant", "an"] },
      { w: "many", tricky: "m[a]ny", alts: ["man", "mane", "map"] },
      { w: "again", tricky: "ag[ai]n", alts: ["gain", "grin", "game"] },
      { w: "says", tricky: "s[ay][s]", alts: ["sags", "set", "stays"] },
      { w: "shell", easy: true, alts: ["shed", "sell", "bell"] },
      { w: "king", easy: true, alts: ["kick", "sing", "wing"] },
      { w: "rope", easy: true, alts: ["ripe", "rose", "rip"] },
      { w: "lamp", easy: true, alts: ["limp", "lump", "camp"] },
      { w: "swim", easy: true, alts: ["swam", "slim", "skim"] },
      { w: "home", easy: true, alts: ["hose", "hum", "hop"] }
    ]
  }
];
