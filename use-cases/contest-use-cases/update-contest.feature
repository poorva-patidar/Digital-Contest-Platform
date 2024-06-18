Feature: Use case to update contest

  Scenario Outline: It should successfully update contest
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>', contestData: '<contestData>' update-contest
    When try to update contest
    Then It should return the result: '<result>' for updating contest

    Examples:
      | userId                               | userRole | contestId                            | contestData                                              | result                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"name":"updated","noOfParticipants":"12","entryFee":12} | Contest updated successfully |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"name":"updated","noOfParticipants":"15"}               | Contest updated successfully |

  Scenario Outline: It should throw error for required fields
    Given userId: '<userId>', userRole: '<userRole>', contestId: '<contestId>', contestData: '<contestData>' update-contest
    When try to update contest
    Then It should return the error: '<error>' for updating contest

    Examples:
      | userId                               | userRole | contestId                            | contestData                                | error                                               |
      |                                      | user     | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"name":"updated","noOfParticipants":"15"} | "userId" is not allowed to be empty                 |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 |          | 7100582a-bcfd-439c-a401-af2c79e12dc1 | {"name":"updated","noOfParticipants":"15"} | "userRole" must be one of [user, admin, superadmin] |
      | 9b1e63a4-15c8-46d3-b493-c5125ef4d009 | admin    |                                      | {"name":"updated","noOfParticipants":"15"} | "contestId" is not allowed to be empty              |
      |                   7100582a-bcfd-439c | admin    | 2100582a-bcfd-439c-a401-af2c79e12dc5 | {"name":"updated","noOfParticipants":"15"} | "userId" must be a valid GUID                       |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | admin    | a401-af2c79e12dc5                    | {"name":"updated","noOfParticipants":"15"} | "contestId" must be a valid GUID                    |
      | 7100582a-bcfd-439c-a401-af2c79e12dc1 | user     | 2100582a-bcfd-439c-a401-af2c79e12dc2 | {"name":"updated","noOfParticipants":"15"} | No contest found                                    |
