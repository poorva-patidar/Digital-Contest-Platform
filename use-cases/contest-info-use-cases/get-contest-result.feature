Feature: Use case to get contest result

  Scenario Outline: It should successfully get contest result
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' get-contest-result
    When try to get contest result
    Then It should return the result: '<result>' for getting contest result

    Examples:
      | userId                               | userRole | contestId                            | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | [{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"4d21c2e5-d9d2-4206-b1b1-53694f3452eb","chosen_team":"Chennai super kings","score_guess":200,"points":1200,"participant_rank":1,"prize_amount":21},{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"2b7a9b6d-75a7-4f92-b8cb-235e59c7d5e1","chosen_team":"Chennai super kings","score_guess":190,"points":1190,"participant_rank":2,"prize_amount":17},{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"a6fb825e-ff5f-45cb-b80f-542bd805cb16","chosen_team":"Mumbai Indians","score_guess":175,"points":995,"participant_rank":3,"prize_amount":0}] |
      | 6bf95e59-af0c-420d-a131-6628c3e89a85 | admin    | 7100582a-bcfd-439c-a401-af2c79e12dc1 | [{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"4d21c2e5-d9d2-4206-b1b1-53694f3452eb","chosen_team":"Chennai super kings","score_guess":200,"points":1200,"participant_rank":1,"prize_amount":21},{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"2b7a9b6d-75a7-4f92-b8cb-235e59c7d5e1","chosen_team":"Chennai super kings","score_guess":190,"points":1190,"participant_rank":2,"prize_amount":17},{"contest_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","participant_id":"a6fb825e-ff5f-45cb-b80f-542bd805cb16","chosen_team":"Mumbai Indians","score_guess":175,"points":995,"participant_rank":3,"prize_amount":0}] |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' get-contest-result
    When try to get contest result
    Then It should return the error: '<error>' for getting contest result

    Examples:
      | userId                               | userRole | contestId                            | error                                               |
      |                                      | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userId" is not allowed to be empty                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userRole" must be one of [user, admin, superadmin] |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    |                                      | "contestId" is not allowed to be empty              |
      |                   7100582a-bcfd-439c | admin    | 2100582a-bcfd-439c-a401-af2c79e12dc5 | "userId" must be a valid GUID                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | a401-af2c79e12dc5                    | "contestId" must be a valid GUID                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc2 | No contest found                                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc3 | No participants found                               |
      | 7100582a-bcfd-439c-a401-af2c79e12dc3 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc4 | You are not authorized to perform this action       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | 2100582a-bcfd-439c-a401-af2c79e12dc5 | Contest not finished yet!                           |
