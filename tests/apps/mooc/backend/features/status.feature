Feature: API status
  In order to know the server is up and running
  As a health check
  I want to check the API status

  Scenario: Check the API status
    Given I send a GET request to "/status"
    Then the response status code should be 200
