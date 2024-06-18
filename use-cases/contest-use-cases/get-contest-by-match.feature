Feature: Use case to get contest by match

  Scenario Outline: It should successfully get contest by match
    Given userId: '<userId>', matchId: '<matchId>' get-contest-by-match
    When try to get contest by match
    Then It should return the result: '<result>' for getting contest by match

    Examples:
      | userId                               | matchId                  | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | 6659c0be1b283595041e2144 | [{"id":"8200582a-bcfd-439c-a401-af2c79e12dc1","name":"contest_2","contest_code":"2427","type":"mega","status":"Finished","no_of_participants":8,"entry_fee":10,"total_winner":3,"created_by":"7100582a-bcfd-439c-a401-af2c79e12dc1","match_id":"6659c0be1b283595041e2144"},{"id":"8200582a-bcfd-439c-a401-af2c79e12dc2","name":"contest_3","contest_code":"17084","type":"mega","status":"Finished","no_of_participants":8,"entry_fee":10,"total_winner":3,"created_by":"7100582a-bcfd-439c-a401-af2c79e12dc1","match_id":"6659c0be1b283595041e2144"}] |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', matchId: '<matchId>' get-contest-by-match
    When try to get contest by match
    Then It should return the error: '<error>' for getting contest by match

    Examples:
      | userId                               | matchId                  | error                                |
      |                                      | 6659c0be1b283595041e2144 | "userId" is not allowed to be empty  |
      |                   7100582a-bcfd-439c | 6659c0be1b283595041e2144 | "userId" must be a valid GUID        |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |                          | "matchId" is not allowed to be empty |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | 8859c0be1b283595041e2144 | No contests found                    |
