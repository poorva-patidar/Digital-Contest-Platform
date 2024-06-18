Feature: Use case to create contest

  Scenario Outline: It should successfully create contest
    Given userId: '<userId>', userRole: '<userRole>', contest: '<contest>' create-contest
    When try to create contest
    Then It should return the result: '<result>' for creating contest

    Examples:
      | userId                               | userRole | contest                                                                                                                | result                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"}        | Contest created successfully |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | {"name":"createByAdmin","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"} | Contest created successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', contest: '<contest>' create-contest
    When try to create contest
    Then It should return the error: '<error>' for creating contest

    Examples:
      | userId                               | userRole | contest                                                                                                         | error                                                        |
      |                                      | user     | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"} | "userId" is not allowed to be empty                          |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"} | "userRole" must be one of [user, admin, superadmin]          |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    |                                                                                                                 | You must provide all the required fields                     |
      |              7100582a-bcfd-439c-a401 | user     | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"} | "userId" must be a valid GUID                                |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2148"} | No match found                                               |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | {"name":"create","noOfParticipants":"12","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2149"} | Match already started or finished                            |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | {"name":"create","noOfParticipants":"2","entryFee":12, "totalWinner": 4, "matchId":"6659c0be1b283595041e2144"}  | Participant number needs to be greater than equal to winners |
