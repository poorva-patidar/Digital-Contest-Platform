Feature: Use case to check admin permissions

  Scenario Outline: It should successfully check admin permissions
    Given userId: '<userId>', userRole: '<userRole>', permission: '<permission>' check-admin-permissions
    When try to check admin permissions
    Then It should return the result: '<result>' for checking admin permissions

    Examples:
      | userId                               | userRole | permission  | result  |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | create_user | Allowed |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', permission: '<permission>' check-admin-permissions
    When try to check admin permissions
    Then It should return the error: '<error>' for checking admin permissions

    Examples:
      | userId                               | userRole | permission     | error                                                                                                               |
      |                                      | admin    | create_user    | "userId" is not allowed to be empty                                                                                 |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 |          | update_contest | "userRole" must be one of [user, admin, superadmin]                                                                 |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    |                | "permission" must be one of [create_user, update_user, delete_user, create_contest, update_contest, delete_contest] |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | CreateUser     | "permission" must be one of [create_user, update_user, delete_user, create_contest, update_contest, delete_contest] |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | update_contest | You are not authorized to perform this action                                                                       |
      |              7100582a-bcfd-439c-a401 | admin    | update_contest | "userId" must be a valid GUID                                                                                       |

