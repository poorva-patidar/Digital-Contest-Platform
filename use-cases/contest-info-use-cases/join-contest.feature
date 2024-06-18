Feature: Use case to join contest

  Scenario Outline: It should successfully join contest
    Given userId: '<userId>', userRole: '<userRole>', userBalance: <userBalance>, contestId: '<contestId>', joinData: '<joinData>' join-contest
    When try to join contest
    Then It should return the result: '<result>' for joining contest

    Examples:
      | userId                               | userRole | userBalance | contestId                            | joinData                                                                  | result              |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | Joined successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', userBalance: <userBalance>, contestId: '<contestId>', joinData: '<joinData>' join-contest
    When try to join contest
    Then It should return the error: '<error>' for joining contest

    Examples:
      | userId                               | userRole | userBalance | contestId                            | joinData                                                                  | error                                               |
      |                                      | user     |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | "userId" is not allowed to be empty                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | "userRole" must be one of [user, admin, superadmin] |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 |                                      | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | "contestId" is not allowed to be empty              |
      | 7100582a-bcfd-439c-a401-af2c79e12dc3 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc4 |                                                                           | "joinData" must be of type object                   |
      |                   7100582a-bcfd-439c | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc5 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | "userId" must be a valid GUID                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | a401-af2c79e12dc5                    | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | "contestId" must be a valid GUID                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"chosenTeam":"Chennai super kings","scoreGuess":210}                     | Invalid code                                        |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"joiningCode":84769,"scoreGuess":210}                                    | "chosenTeam" is required                            |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"joiningCode":84769,"chosenTeam":"Chennai super kings"}                  | "scoreGuess" is required                            |
      | 7100582a-bcfd-439c-a401-af2c79e12dc3 | admin    |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc4 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | You are not authorized to perform this action       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc2 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | No contest found                                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc8 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | Contest is live or finished                         |
      | 7100582a-bcfd-439c-a401-af2c79e12dc5 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc6 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | You already joined the contest                      |
      | 7100582a-bcfd-439c-a401-af2c79e12dc4 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc9 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | Contest Full                                        |
      | 7100582a-bcfd-439c-a401-af2c79e12dc4 | user     |         100 | 2100582a-bcfd-439c-a401-af2c79e12dc7 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | Invalid code                                        |
      | 7100582a-bcfd-439c-a401-af2c79e12dc4 | user     |          10 | 2100582a-bcfd-439c-a401-af2c79e12dc5 | {"joiningCode":84769,"chosenTeam":"Chennai super kings","scoreGuess":210} | Not enough balance                                  |
