const { updateMatches } = require("../use-cases/match-use-cases");

const match = {
  _id: "6659c0be1b283595041e2144",
  format: "T20",
  isPtable: true,
  key: "MI_VS_CSK",
  matchStatus: "Finished",
  matchSuffix: "South Group",
  result: {},
  srs: "T20 Blast 2024",
  srsKey: "t20_blast_2024",
  teams: {
    t1: {
      key: "CSK",
      logo: "glam.png",
      name: "Chennai super kings",
      sName: "CSK",
      score: "200/3 (20.0)",
    },
    t2: {
      key: "MI",
      logo: "sus.png",
      name: "Mumbai Indians",
      sName: "MI",
      score: "180/8 (14.1)",
    },
  },
  time: 1717335000,
  venue: "Sophia Gardens, Cardiff, England",
};

async function check() {
  await updateMatches([match]);
}

check();
