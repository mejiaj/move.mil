@javascript @api
Feature: Locator Maps
  In order to contact a PPPO
  As an anonymous user
  I need to be able to use the Locator Maps

  Background:
    Given I am an anonymous user
    And I visit "/resources/locator-maps"
    And I wait 10 seconds until I see text "Search"

  Scenario: Search using zipcode
    Given I fill in "search" with "62225"
    When I press "Search"
    Then I should see "Scott AFB"

  Scenario: Fields need to be fill in
    Given I visit "/resources/locator-maps"
    When I press "Search"
    Then I should see "Please fill out this field."
