const axios = require("axios");
const { API_KEY, API_HOST } = require("../config/environment");

async function getMatchUpdates() {
  const url = "https://free-cricket-live-score1.p.rapidapi.com/matches";
  const headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.res.matches;
  } catch (error) {
    console.error(error);
  }
}


module.exports = getMatchUpdates;

