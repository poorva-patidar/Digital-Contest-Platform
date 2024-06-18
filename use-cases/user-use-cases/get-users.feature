Feature: Use case to get users

  Scenario Outline: It should successfully get users
    Given sort: '<sort>', order: '<order>', limit: <limit>, offset: <offset> get-users
    When try to get users
    Then It should return the result: '<result>' for getting users

    Examples:
      | sort | order | limit | offset | result                                                                                                                                                                                                                                                                                                                                  |
      | name | DESC  |    10 |      0 | [{"id":24,"name":"yuvraj","email":"yuvraj@example.com","role":"user","balance":167,"created_at":"2024-06-01T10:41:59.000Z","updated_at":"2024-06-01T19:55:35.000Z"},{"id":21,"name":"Vansh","email":"vansh@example.com","role":"user","balance":121,"created_at":"2024-06-01T10:38:17.000Z","updated_at":"2024-06-01T19:55:35.000Z"}]   |
      |      |       |    10 |      0 | [{"id":14,"name":"Poorva","email":"poorva@example.com","role":"superadmin","balance":105,"created_at":"2024-06-01T10:25:17.000Z","updated_at":"2024-06-01T19:55:35.000Z"},{"id":15,"name":"Ram","email":"ram@example.com","role":"user","balance":400,"created_at":"2024-06-01T10:26:20.000Z","updated_at":"2024-06-01T19:41:15.000Z"}] |

  Scenario Outline: It should throw error for required fields
    Given sort: '<sort>', order: '<order>', limit: <limit>, offset: <offset> get-users
    When try to get users
    Then It should return the error: '<error>' for getting users

    Examples:
      | sort | order | limit | offset | error          |
      |      |       |    10 |     20 | No users found |
