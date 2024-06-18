Feature: Use case to send contest invite

  Scenario Outline: It should successfully send contest invite
    Given userId: '<userId>', contestId: '<contestId>', email: '<email>' send-contest-invite
    When try to send contest invite
    Then It should return the result: '<result>' for sending contest invite

    Examples:
      | userId                               | contestId                            | email            | result                  |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | 8200582a-bcfd-439c-a401-af2c79e12dc1 | ross@example.com | Email sent successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', contestId: '<contestId>', email: '<email>' send-contest-invite
    When try to send contest invite
    Then It should return the error: '<error>' for sending contest invite

    Examples:
      | userId                               | contestId                            | email            | error                                  |
      |                                      | 8200582a-bcfd-439c-a401-af2c79e12dc1 | ross@example.com | "userId" is not allowed to be empty    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |                                      | ross@example.com | "contestId" is not allowed to be empty |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | 8200582a-bcfd-439c-a401-af2c79e12dc1 |                  | "email" is not allowed to be empty     |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | 2200582a-bcfd-439c-a401-af2c79e12dc2 | ross@example.com | No contest found                       |
      |                7100582a-bcfd-439c-a4 | 8200582a-bcfd-439c-a401-af2c79e12dc1 | ross@example.com | "userId" must be a valid GUID                |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |                     401-af2c79e12dc1 | ross@example.com | "contestId" must be a valid GUID                |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | 8200582a-bcfd-439c-a401-af2c79e12dc1 | rossexamplecom   | "email" must be a valid email               |
