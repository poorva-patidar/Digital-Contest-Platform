Feature: Use case to reset password

  Scenario Outline: It should successfully reset password
    Given email: '<email>', password: '<password>' reset-password
    When try to reset password
    Then It should return the result: '<result>' for reset password

    Examples:
      | email            | password | result                        |
      | ross@example.com |   741852 | Password updated successfully |

  Scenario Outline: It should throw error for required fields
    Given email: '<email>', password: '<password>' reset-password
    When try to reset password
    Then It should return the error: '<error>' for reset password

    Examples:
      | email                  | password | error                                 |
      |                        |   741852 | "email" is not allowed to be empty    |
      | monica@example.com     |          | "password" is not allowed to be empty |
      | rossexample.com        |   741852 | "email" must be a valid email         |
      | usernotfound@email.com |   741852 | User not found                        |
