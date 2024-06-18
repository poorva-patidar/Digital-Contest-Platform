Feature: Use case to create user

  Scenario Outline: It should successfully create user
    Given name: '<name>', email: '<email>', password: '<password>', role: '<role>', appliedCode: '<appliedCode>' create-user
    When try to create user
    Then It should return the result: '<result>' for create user

    Examples:
      | name   | email              | password | role  | appliedCode | result                    |
      | ross   | ross@example.com   |   741852 | user  |     1583715 | User created successfully |
      | rachel | rachel@example.com |          | admin |             | User created successfully |

  Scenario Outline: It should throw error
    Given name: '<name>', email: '<email>', password: '<password>', role: '<role>', appliedCode: '<appliedCode>' create-user
    When try to create user
    Then It should return the error: '<error>' for create user

    Examples:
      | name   | email              | password | role  | appliedCode | error                              |
      |        | ross@example.com   |   741852 | user  |      234567 | "name" is not allowed to be empty  |
      | rachel |                    |   741852 | user  |      234567 | "email" is not allowed to be empty |
      | monica | monica@example.com |          | user  |      234567 | No password provided               |
      |        | ross@example.com   |   741852 | admin |             | "name" is not allowed to be empty  |
      | rachel |                    |   741852 | admin |             | "email" is not allowed to be empty |
      | poorva | poorva@example.com |   741852 | user  |      234567 | User already exists                |
      | poorva | poorva@example.com |   741852 | admin |             | User already exists                |
      | ross   | rossexample.com    |   741852 | user  |     1583715 | "email" must be a valid email      |
