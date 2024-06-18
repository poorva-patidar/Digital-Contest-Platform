Feature: Use case to activate user

  Scenario Outline: It should successfully activate user
    Given email: '<email>', password: '<password>' activate-user
    When try to activate user
    Then It should return the result: '<result>' for activate user

    Examples:
      | email            | password | result                      |
      | ross@example.com |   741852 | User activated successfully |

  Scenario Outline: It should throw error for required fields
    Given email: '<email>', password: '<password>' activate-user
    When try to activate user
    Then It should return the error: '<error>' for activate user

    Examples:
      | email                        | password | error                                 |
      |                              |   741852 | "email" is not allowed to be empty    |
      | monica@example.com           |          | "password" is not allowed to be empty |
      | rossexample.com              |   741852 | "email" must be a valid email         |
      | alreadyactivated@example.com |   741852 | User already activated                |
      | usernotfound@email.com       |   741852 | User not found                        |
