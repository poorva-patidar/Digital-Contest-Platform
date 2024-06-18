const { makeMatch } = require("../../entities");

module.exports = function buildUpdateMatches({
  matchDb,
  constants,
  CustomError,
  getMatchUpdates,
  updateContests,
}) {
  return async function updateMatches() {
    try {
      const matches = await getMatchUpdates();
      for (const match of matches) {
        const dbMatch = await matchDb.findById({ matchId: match._id });

        // Match not in database
        if (!dbMatch) {
          let team1Score;
          let team2Score;

          // If match is finished, fill score also
          if (match.matchStatus === constants.matchStatus.FINISHED) {
            team1Score = match.teams.t1.score.split("/")[0];
            team2Score = match.teams.t2.score.split("/")[0];
            match.winner =
              team1Score > team2Score
                ? match.teams.t1.name
                : match.teams.t2.name;
          }

          const newMatch = await makeMatch({  
            id: match._id,
            name: match.key,
            status: match.matchStatus,
            format: match.format,
            series: match.srs,
            team1Name: match.teams.t1.name,
            team2Name: match.teams.t2.name,
            team1Score: team1Score ?? null,
            team2Score: team2Score ?? null,
            winner: match.winner ?? null,
            startTime: new Date(match.time * 1000),
          });

          // After validations, create new match
          await matchDb.insert({
            id: newMatch.getId(),
            name: newMatch.getName(),
            status: newMatch.getStatus(),
            format: newMatch.getFormat(),
            series: newMatch.getSeries(),
            team1Name: newMatch.getTeam1Name(),
            team2Name: newMatch.getTeam2Name(),
            team1Score: newMatch.getTeam1Score(),
            team2Score: newMatch.getTeam2Score(),
            winner: newMatch.getWinner(),
            startTime: newMatch.getStartTime(),
          });
        } else if (
          match.matchStatus !== constants.matchStatus.UPCOMING &&
          match.matchStatus !== dbMatch.status
        ) {
          const matchData = {};

          // If match finished, update scores
          if (match.matchStatus === constants.matchStatus.FINISHED) {
            let team1Score = match.teams.t1.score.split("/")[0];
            let team2Score = match.teams.t2.score.split("/")[0];
            matchData.team1_score = team1Score;
            matchData.team2_score = team2Score;
            match.winner =
              team1Score > team2Score
                ? match.teams.t1.name
                : match.teams.t2.name;
            matchData.winner = match.winner;
            matchData.status = constants.matchStatus.FINISHED;
          } else if (match.matchStatus === constants.matchStatus.LIVE) {
            matchData.status = constants.matchStatus.LIVE;
          } else if (match.matchStatus === constants.matchStatus.ABANDONED) {
            matchData.status = constants.matchStatus.ABANDONED;
          } else {
            throw new CustomError(
              constants.error.UNSUPPORTED_FORMAT,
              constants.status.NOT_FOUND
            ); 
          }
          await matchDb.update({id: match._id, data: matchData});
          await updateContests(match);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};
