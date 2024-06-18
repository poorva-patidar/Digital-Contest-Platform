Feature: Use case to get all referrals

  Scenario Outline: It should successfully get all user referrals
    Given referrerId: '<referrerId>' get-referrals
    When try to get all referrals
    Then It should return the result: '<result>' for getting all referrals

    Examples:
      | referrerId                           | result                                                                                                                                                                                                                            |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | [{"referrer_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","referred_email":"mohit@example.com","status":"accepted"},{"referrer_id":"7100582a-bcfd-439c-a401-af2c79e12dc1","referred_email":"shyam@example.com","status":"accepted"}] |

  Scenario Outline: It should unsuccessfully get all user referrals
    Given referrerId: '<referrerId>' get-referrals
    When try to get all referrals
    Then It should return the error: '<error>' for getting all referrals

    Examples:
      | referrerId                           | error                                   |
      |                                      | "referrerId" is not allowed to be empty |
      |                   7100582a-bcfd-439c | "referrerId" must be a valid GUID           |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | No referral found                       |
