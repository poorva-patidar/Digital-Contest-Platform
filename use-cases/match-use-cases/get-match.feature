Feature: Use case to get a match

  Scenario Outline: It should successfully get a match
    Given matchId: '<matchId>' get-match
    When try to get a match
    Then It should return the result: '<result>' for getting a match

    Examples:
      | matchId                  | result                                                                                                                                                                                                                                                                  |
      | 66595f7b1b283595041e0d82 | {"id":"66595f7b1b283595041e0d82","name":"t20_blast_2024_sg7","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Glamorgan","team2_name":"Surrey","team1_score":181,"team2_score":200,"winner":"Surrey","start_time":"2024-05-31T17:30:00.000Z"} |

  Scenario Outline: It should throw error for required fields
    Given matchId: '<matchId>' get-match
    When try to get a match
    Then It should return the error: '<error>' for getting a match

    Examples:
      | matchId                  | error                                |
      |                          | "matchId" is not allowed to be empty |
      | 663228a4c4f7dd33f8b72793 | No match found                       |
