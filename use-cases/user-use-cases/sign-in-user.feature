Feature: Use case to sign in user

  Scenario Outline: It should successfully sign in user
    Given email: '<email>', password: '<password>' sign-in-user
    When try to sign in user
    Then It should return the result: '<result>' for sign in user

    Examples:
      | email            | password | result                      |
      | ross@example.com |   741852 | User logged in successfully |

  Scenario Outline: It should throw error for required fields
    Given email: '<email>', password: '<password>' sign-in-user
    When try to sign in user
    Then It should return the error: '<error>' for sign in user

    Examples:
      | email                  | password        | error                                 |
      |                        |          741852 | "email" is not allowed to be empty    |
      | monica@example.com     |                 | "password" is not allowed to be empty |
      | rossexample.com        |          741852 | "email" must be a valid email         |
      | invalid@example.com    | invalidPassword | Invalid password                      |
      | usernotfound@email.com |          741852 | User not found                        |
