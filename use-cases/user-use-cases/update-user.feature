Feature: Use case to update a user

  Scenario Outline: It should successfully update a user
    Given userId: '<userId>', userData: '<userData>' update-user
    When try to update a user
    Then It should return the result: '<result>' for updating a user

    Examples:
      | userId                               | userData                                                                           | result                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"name":"Akhya B","email":"juhi@example.com","permissions":{"createContest":true}} | User updated successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userData: '<userData>' update-user
    When try to update a user
    Then It should return the error: '<error>' for updating a user

    Examples:
      | userId                               | userData                                                                           | error                               |
      |                                      | {"name":"Akhya B","email":"juhi@example.com","permissions":{"createContest":true}} | "userId" is not allowed to be empty |
      |                  7100582a-bcfd-439c1 | {"name":"Akhya B","email":"juhi@example.com","permissions":{"createContest":true}} | "userId" must be a valid GUID       |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | {"name":"Akhya B","email":"juhi@example.com","permissions":{"createContest":true}} | User not found                      |
