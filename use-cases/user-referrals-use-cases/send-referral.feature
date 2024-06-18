Feature: Use case to send referral

  Scenario Outline: It should successfully send referral
    Given referrerId: '<referrerId>', referredEmail: '<referredEmail>', referralCode: '<referralCode>' send-referral
    When try to send referral
    Then It should return the result: '<result>' for sending referral

    Examples:
      | referrerId                           | referredEmail        | referralCode | result                     |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | referred@example.com |       741852 | Referral sent successfully |

  Scenario Outline: It should unsuccessfully send referral
    Given referrerId: '<referrerId>', referredEmail: '<referredEmail>', referralCode: '<referralCode>' send-referral
    When try to send referral
    Then It should return the error: '<error>' for sending referral

    Examples:
      | referrerId                           | referredEmail            | referralCode | error                                      |
      |                                      | referred@example.com     |       741852 | "referrerId" is not allowed to be empty    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |                          |       741852 | "referredEmail" is not allowed to be empty |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | referred@example.com     |              | "referralCode" is required                 |
      | 2100582a-bcfd-439c-a401-af2c79e12dc2 | alreadyexist@example.com |       741852 | Already referred                           |
      |                     401-af2c79e12dc1 | referred@example.com     |       741852 | "referrerId" must be a valid GUID          |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | referredexamplecom       |       741852 | "referredEmail" must be a valid email      |
