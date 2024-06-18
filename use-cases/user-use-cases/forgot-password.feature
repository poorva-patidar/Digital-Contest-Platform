Feature: Use case for forgot password

  Scenario Outline: It should successfully forgot password
    Given email: '<email>' forgot-password
    When try for forgot password
    Then It should return the result: '<result>' for forgot password

    Examples:
      | email             | result                  |
      | akhya@example.com | Email sent successfully |

  Scenario Outline: It should throw error for required fields
    Given email: '<email>' forgot-password
    When try for forgot password
    Then It should return the error: '<error>' for forgot password

    Examples:
      | email                  | error                              |
      |                        | "email" is not allowed to be empty |
      | akhya@examplecom       | "email" must be a valid email      |
      | usernotfound@email.com | User not found                     |
