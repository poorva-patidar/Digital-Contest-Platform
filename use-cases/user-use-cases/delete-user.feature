Feature: Use case to delete a user

  Scenario Outline: It should successfully delete a user
    Given userId: '<userId>' delete-user
    When try to delete a user
    Then It should return the result: '<result>' for deleting a user

    Examples:
      | userId                               | result                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | User deleted successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>' delete-user
    When try to delete a user
    Then It should return the error: '<error>' for deleting a user

    Examples:
      | userId                               | error                               |
      |                                      | "userId" is not allowed to be empty |
      |            7100582a-bcfd-439c-a401-a | "userId" must be a valid GUID       |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | User not found                      |
