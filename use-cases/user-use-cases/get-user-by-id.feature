Feature: Use case to get a user

  Scenario Outline: It should successfully get a user
    Given userId: '<userId>' get-user
    When try to get a user
    Then It should return the result: '<result>' for getting a user

    Examples:
      | userId                               | result                                                                                                                                                                                                                                                                         |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"id":"7100582a-bcfd-439c-a401-af2c79e12dc1","name":"yuvraj","email":"yuvraj@example.com","password":"825037248b80d7865e9f1525628b714a","role":"user","balance":167,"referral_code":"8179101","created_at":"2024-06-01T10:41:59.000Z","updated_at":"2024-06-01T19:55:35.000Z"} |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>' get-user
    When try to get a user
    Then It should return the error: '<error>' for getting a user

    Examples:
      | userId                               | error                               |
      |                                      | "userId" is not allowed to be empty |
      |                   2100582a-bcfd-439c | "userId" must be a valid GUID       |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | User not found                      |
