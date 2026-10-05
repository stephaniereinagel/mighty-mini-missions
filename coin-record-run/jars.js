// The four jars, in the order coins are sorted. Max can rename or restyle them.
window.CRR_JARS = {
  order: ["tithe", "invest", "save", "spend"],
  jars: {
    tithe: { name: "Tithe", sub: "God", img: "assets/jar_tithe.png", color: "#f5c542" },
    invest: { name: "Invest", sub: "Grow", img: "assets/jar_invest.png", color: "#4cc38a" },
    save: { name: "Save", sub: "Big goal", img: "assets/jar_save.png", color: "#58a6ff" },
    spend: { name: "Spend", sub: "Store", img: "assets/jar_spend.png", color: "#ff7eb6" }
  },

  // 1 cent for every 10 cents earned goes to Tithe first.
  titheEvery: 10,

  // Every 5 runs, Invest earns 1 cent for every 10 cents inside.
  // Money put in has to stay lockRuns runs before it can be taken out. Growth is ready right away.
  invest: { everyRuns: 5, centsPer10: 1, lockRuns: 5 },

  causes: [
    {
      id: "church", name: "My church", img: "assets/church.png",
      thanks: "Your gift helps your church worship God and care for people."
    },
    {
      id: "missions", name: "Missionaries", img: "assets/missions.png",
      thanks: "Your gift helps missionaries tell people about Jesus all around the world."
    },
    {
      id: "food", name: "Feed hungry people", img: "assets/food.png",
      thanks: "Your gift helps hungry families have good food to eat."
    },
    {
      id: "families", name: "Help families in need", img: "assets/families.png",
      thanks: "Your gift helps families who need warm clothes and a safe home."
    }
  ],
  verse: "God loves a cheerful giver. Second Corinthians 9:7",

  giverBadges: [
    { gifts: 1, id: "giver1", name: "Cheerful Giver", img: "assets/giver1.png" },
    { gifts: 5, id: "giver5", name: "Faithful Giver", img: "assets/giver5.png" },
    { gifts: 10, id: "giver10", name: "Generous Heart", img: "assets/giver10.png" }
  ],

  trophies: [
    { id: "invest100", jar: "invest", amount: 100, name: "Growing Money", img: "assets/invest100.png" },
    { id: "invest500", jar: "invest", amount: 500, name: "Money Tree", img: "assets/invest500.png" },
    { id: "save100", jar: "save", amount: 100, name: "Super Saver", img: "assets/save100.png" },
    { id: "save500", jar: "save", amount: 500, name: "Mega Saver", img: "assets/save500.png" },
    { id: "save1000", jar: "save", amount: 1000, name: "Saving Champion", img: "assets/save1000.png" }
  ]
};
