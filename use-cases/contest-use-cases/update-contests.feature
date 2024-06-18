Feature: Use case to update contests

  Scenario Outline: It should successfully update contests
    Given match: '<match>' update-contests
    When try to update contests
    Then It should return the result: '<result>' for updating contests

    Examples:
      | match                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | result                        |
      | {"_id":"659906db75678ee810aa54a5","format":"T20","isPtable":true,"key":"t20_wc_2024_g10","matchStatus":"Finished","matchSuffix":"10th Match, Group B","result":{"message":"Australia won by 39 runs","wT":"aus"},"srs":"Mens T20 World Cup 2024","srsKey":"t20_wc_2024","teams":{"t1":{"key":"aus","logo":"aus.png","name":"Australia","sName":"AUS","score":"164/5 (20.0)"},"t2":{"key":"omn","logo":"omn.png","name":"Oman","sName":"OMN","score":"125/9 (20.0)"}}} | Contests updated successfully |

  Scenario Outline: It should throw error for required fields
    Given match: '<match>' update-contests
    When try to update contests
    Then It should return the error: '<error>' for updating contests

    Examples:
      | match | error            |
      |       | "match" must be of type object |
