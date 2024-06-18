Feature: Use case to get matches

  Scenario Outline: It should successfully get matches
    Given sort: '<sort>', order: '<order>', limit: <limit>, offset: <offset> get-matches
    When try to get matches
    Then It should return the result: '<result>' for getting matches

    Examples:
      | sort   | order | limit | offset | result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | status | DESC  |    10 |      0 | [{"id":"6598f3383fe3fde81aabdc8d","name":"t20_wc_2024_g1","status":"Upcoming","format":"T20","series":"Mens T20 World Cup 2024","team1_name":"United States","team2_name":"Canada","team1_score":null,"team2_score":null,"winner":null,"start_time":"2024-06-02T00:30:00.000Z"},{"id":"6659c0be1b283595041e21f4","name":"t20_blast_2024_sg17","status":"Upcoming","format":"T20","series":"T20 Blast 2024","team1_name":"Glamorgan","team2_name":"Sussex","team1_score":null,"team2_score":null,"winner":null,"start_time":"2024-06-02T13:30:00.000Z"},{"id":"66595f7b1b283595041e0d82","name":"t20_blast_2024_sg7","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Glamorgan","team2_name":"Surrey","team1_score":181,"team2_score":200,"winner":"Surrey","start_time":"2024-05-31T17:30:00.000Z"},{"id":"66595ff0f8240694f69a6c6e","name":"t20_blast_2024_ng8","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Leicestershire","team2_name":"Yorkshire","team1_score":155,"team2_score":148,"winner":"Leicestershire","start_time":"2024-05-31T17:30:00.000Z"}]  |
      |        |       |    10 |      0 | [{"id":"6598f3383fe3fde81aabdc8d","name":"t20_wc_2024_g1","status":"Upcoming","format":"T20","series":"Mens T20 World Cup 2024","team1_name":"United States","team2_name":"Canada","team1_score":null,"team2_score":null,"winner":null,"start_time":"2024-06-02T00:30:00.000Z"},{"id":"66595f7b1b283595041e0d82","name":"t20_blast_2024_sg7","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Glamorgan","team2_name":"Surrey","team1_score":181,"team2_score":200,"winner":"Surrey","start_time":"2024-05-31T17:30:00.000Z"},{"id":"66595ff0f8240694f69a6c6e","name":"t20_blast_2024_ng8","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Leicestershire","team2_name":"Yorkshire","team1_score":155,"team2_score":148,"winner":"Leicestershire","start_time":"2024-05-31T17:30:00.000Z"},{"id":"665965d4f8240694f69a6c88","name":"t20_blast_2024_sg9","status":"Finished","format":"T20","series":"T20 Blast 2024","team1_name":"Somerset","team2_name":"Essex","team1_score":197,"team2_score":193,"winner":"Somerset","start_time":"2024-05-31T17:30:00.000Z"}] |

  Scenario Outline: It should throw error for required fields
    Given sort: '<sort>', order: '<order>', limit: <limit>, offset: <offset> get-matches
    When try to get matches
    Then It should return the error: '<error>' for getting matches

    Examples:
      | sort | order | limit | offset | error            |
      |      |       |    10 |     20 | No matches found |
