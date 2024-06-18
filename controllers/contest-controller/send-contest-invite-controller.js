const { sendContestInvite } = require('../../use-cases/contest-use-cases');

module.exports =  function sendContestInviteController(response, constants, CustomError) {
    return async function sendContestInviteController(req, res) {
        const user = req.user;
        const { contestId } = req.params;
        const { email } = req.body;
        try {
            await sendContestInvite(user.id, contestId, email);
            response.success(res, constants.success.EMAIL_SENT, constants.status.OK);
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                response.error(res, error.message, error.statusCode);
            } else {
                response.error(res, constants.error.SERVER_ERROR, constants.status.SERVER_ERROR);
            }
        }
    };
}