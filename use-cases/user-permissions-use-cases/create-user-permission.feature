Feature: Use case to create user permissions

  Scenario Outline: It should successfully create user permissions
    Given userId: '<userId>', permissions: '<permissions>' create-user-permissions
    When try to create user permissions
    Then It should return the result: '<result>' for creating user permissions

    Examples:
      | userId                               | permissions                                                                                                                  | result                                |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"create_user":true,"update_user":true,"delete_user":true,"create_contest":true,"update_contest":true,"delete_contest":true} | User permissions created successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', permissions: '<permissions>' create-user-permissions
    When try to create user permissions
    Then It should return the error: '<error>' for creating user permissions

    Examples:
      | userId                               | permissions                                                                                                                  | error                                |
      |                                      | {"create_user":true,"update_user":true,"delete_user":true,"create_contest":true,"update_contest":true,"delete_contest":true} | "userId" is not allowed to be empty  |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 |                                                                                                                              | "permissions" must be of type object |
      |                   9b1e63a4-15c8-46d3 | {"create_user":true,"update_user":true,"delete_user":true,"create_contest":true,"update_contest":true,"delete_contest":true} | "userId" must be a valid GUID        |
