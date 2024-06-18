Feature: Use case to get contest

  Scenario Outline: It should successfully get contest
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' get-contest
    When try to get contest
    Then It should return the result: '<result>' for getting contest

    Examples:
      | userId                               | userRole | contestId                            | result                                                                                                                                                                                                                                                                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"id":"7100582a-bcfd-439c-a401-af2c79e12dc1","name":"contest_2","contest_code":"2427","type":"private","status":"Finished","no_of_participants":8,"entry_fee":10,"total_winner":3,"created_by":"7100582a-bcfd-439c-a401-af2c79e12dc1","match_id":"6659c0be1b283595041e2144"} |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"id":"7100582a-bcfd-439c-a401-af2c79e12dc1","name":"contest_2","contest_code":"2427","type":"private","status":"Finished","no_of_participants":8,"entry_fee":10,"total_winner":3,"created_by":"7100582a-bcfd-439c-a401-af2c79e12dc1","match_id":"6659c0be1b283595041e2144"} |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' get-contest
    When try to get contest
    Then It should return the error: '<error>' for getting contest

    Examples:
      | userId                               | userRole | contestId                            | error                                               |
      |                                      | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userId" is not allowed to be empty                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userRole" must be one of [user, admin, superadmin] |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    |                                      | "contestId" is not allowed to be empty              |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | a401-af2c79e12dc5                    | "contestId" must be a valid GUID                    |
      |                   7100582a-bcfd-439c | user     | 2100582a-bcfd-439c-a401-af2c79e12dc2 | "userId" must be a valid GUID                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc2 | No contest found                                    |
