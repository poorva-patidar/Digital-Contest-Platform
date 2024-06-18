module.exports = function buildCalculateAndUpdateResult({
  contestInfoDb,
  userDb,
}) {
  return async function calculateAndUpdateResult(match, contest, participants) {
    const totalWinners = contest.total_winner;
    const noOfParticipants = contest.no_of_participants;
    const entryFee = contest.entry_fee;
    const money = noOfParticipants * entryFee;
    let superAdminMoney = Math.round(0.05 * money);
    const hostMoney = Math.round(0.02 * money);
    const totalMoney = money - superAdminMoney - hostMoney;
    let winners = [];
    let rank = 1;

    participants.forEach((participant) => {
      let points = 0;
      if (participant.chosen_team === match.winner) {
        points += 200;
      }

      let chosenTeamScore =
        participant.chosen_team === match.teams.t1.name
          ? match.teams.t1.score
          : match.teams.t2.score;

      chosenTeamScore = chosenTeamScore.split("/")[0];
      points += 1000 - Math.abs(participant.score_guess - chosenTeamScore);
      participant.points = points;
    });

    participants.sort((a, b) => b.points - a.points);
    participants[0].participant_rank = rank;

    for (let i = 1; i < participants.length; i++) {
      if (participants[i - 1].points !== participants[i].points) rank++;
      participants[i].participant_rank = rank;
    }

    if (totalWinners >= participants.length) {
      const initialWinnerRatio = totalWinners / noOfParticipants;
      let winnerRatio = initialWinnerRatio * participants.length;
      totalWinners = Math.ceil(winnerRatio);
    }

    let index = totalWinners - 1;
    while (
      index < noOfParticipants &&
      participants[index].points === participants[index + 1].points
    )
      index++;
    winners = participants.slice(0, index + 1);

    const n = winners.length;
    const sum = winners.reduce(
      (acc, winner) => acc + (n - winner.participant_rank + 1),
      0
    );
    const moneyRatio = totalMoney / sum;

    winners.forEach((winner) => {
      winner.prize_amount = Math.round(
        moneyRatio * (n - winner.participant_rank + 1)
      );
    });

    const totalSum = winners.reduce(
      (acc, winner) => acc + winner.prize_amount,
      0
    );
    const difference = totalMoney - totalSum;
    superAdminMoney += difference;

    try {
      await userDb.updateBalanceByRole({
        role: "superadmin",
        amount: superAdminMoney,
      });
      await userDb.updateBalance({ id: contest.created_by, amount: hostMoney });

      for (let winner of winners) {
        await userDb.updateBalance({
          id: winner.participant_id,
          amount: winner.prize_amount,
        });
        await contestInfoDb.updateWinners({
          contestId: winner.contest_id,
          participantId: winner.participant_id,
          prizeAmount: winner.prize_amount,
        });
      }

      for (let participant of participants) {
        await contestInfoDb.updateParticipants({
          contestId: participant.contest_id,
          participantId: participant.participant_id,
          points: participant.points,
          participantRank: participant.participant_rank,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
