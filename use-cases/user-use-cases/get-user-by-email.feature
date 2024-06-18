Feature: Use case to get user by email

  Scenario Outline: It should successfully get user by email
    Given email: '<email>' get-user-by-email
    When try to get user by email
    Then It should return the result: '<result>' for getting user by email

    Examples:
      | email             | result                                                                                                                                                                                                                                                                            |
      | akhya@example.com | {"id":"7100582a-bcfd-439c-a401-af2c79e12dc1","name":"Akhya B","email":"akhya@example.com","password":"5e2b266c0259ab352c5750139329551a","role":"admin","balance":"100","referral_code":"4042573","created_at":"2024-06-03T11:18:49.663Z","updated_at":"2024-06-03T11:42:17.572Z"} |

  Scenario Outline: It should throw error for required fields
    Given email: '<email>' get-user-by-email
    When try to get user by email
    Then It should return the error: '<error>' for getting user by email

    Examples:
      | email                  | error                                  |
      |                        | "email" is not allowed to be empty     |
      | akhya@examplecom       | "email" must be a valid email      |
      | usernotfound@email.com | User not found                         |
