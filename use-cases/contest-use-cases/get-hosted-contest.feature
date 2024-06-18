Feature: Use case to get hosted contest

  Scenario Outline: It should successfully get hosted contest
    Given userId: '<userId>' get-hosted-contest
    When try to get hosted contest
    Then It should return the result: '<result>' for getting hosted contest

    Examples:
      | userId                               | result                                                                                                                                                                                                                                   |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | [{"id":"7100582a-bcfd-439c-a401-af2c79e12dc1","name":"contest_3","contest_code":"17084","type":"mega","status":"Finished","no_of_participants":8,"entry_fee":10,"total_winner":3,"created_by":28,"match_id":"6659c0be1b283595041e2144"}] |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>' get-hosted-contest
    When try to get hosted contest
    Then It should return the error: '<error>' for getting hosted contest

    Examples:
      | userId                               | error                               |
      |                                      | "userId" is not allowed to be empty |
      |              2100582a-bcfd-439c-a401 | "userId" must be a valid GUID       |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | No contests found                   |
