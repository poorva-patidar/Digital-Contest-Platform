Feature: Use case to update matches

  Scenario Outline: It should successfully update matches
    Given update-matches
    When try to update matches
    Then It should return the result: '<result>' for updating matches

    Examples:
      | result                       |
      | Matches updated successfully |
