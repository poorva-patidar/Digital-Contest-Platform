// Purpose: Define the match entity.
module.exports = function buildMakeMatch(Joi) {
  return async function makeMatch({
    id,
    name,
    status,
    format,
    series,
    team1Name,
    team2Name,
    team1Score = null,
    team2Score = null,
    winner = null,
    startTime,
  } = {}) {
    
    // Validate match data
    const schema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().min(2).required(),
      status: Joi.string()
        .valid("Upcoming", "Live", "Finished", "Abandoned")
        .required(),
      format: Joi.string().required(),
      series: Joi.string().min(2).required(),
      team1Name: Joi.string().min(2).required(),
      team2Name: Joi.string().min(2).required(),
      team1Score: Joi.number().min(0).allow(null),
      team2Score: Joi.number().min(0).allow(null),
      winner: Joi.string().allow(null),
      startTime: Joi.date().required(),
    });

    const { error } = schema.validate({
      id,
      name,
      status,
      format,
      series,
      team1Name,
      team2Name,
      team1Score,
      team2Score,
      winner,
      startTime,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    return Object.freeze({
      getId: () => id,
      getName: () => name,
      getStatus: () => status,
      getFormat: () => format,
      getSeries: () => series,
      getTeam1Name: () => team1Name,
      getTeam2Name: () => team2Name,
      getTeam1Score: () => team1Score,
      getTeam2Score: () => team2Score,
      getWinner: () => winner,
      getStartTime: () => startTime,
    });
  };
};
