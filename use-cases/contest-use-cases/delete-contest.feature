Feature: Use case to delete contest

  Scenario Outline: It should successfully delete contest
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' delete-contest
    When try to delete contest
    Then It should return the result: '<result>' for deleting contest

    Examples:
      | userId                               | userRole | contestId                            | result                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | Contest deleted successfully |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | 7100582a-bcfd-439c-a401-af2c79e12dc1 | Contest deleted successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>' delete-contest
    When try to delete contest
    Then It should return the error: '<error>' for deleting contest

    Examples:
      | userId                               | userRole | contestId                            | error                                               |
      |                                      | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userId" is not allowed to be empty                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          | 7100582a-bcfd-439c-a401-af2c79e12dc1 | "userRole" must be one of [user, admin, superadmin] |
      |                   7100582a-bcfd-439c | admin    | 2100582a-bcfd-439c-a401-af2c79e12dc5 | "userId" must be a valid GUID                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | a401-af2c79e12dc5                    | "contestId" must be a valid GUID                    |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    |                                      | "contestId" is not allowed to be empty              |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc2 | No contest found                                    |
