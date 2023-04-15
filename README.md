# NoSQL Social Network API

## User Story
**AS A** social media startup<br>
**I WANT** an API for my social network that uses a NoSQL database<br>
**SO THAT** my website can handle large amounts of unstructured data

## Acceptance Criteria
**GIVEN** a social network API
- **WHEN** I enter the command to invoke the application<br>
**THEN** my server is started and the Mongoose models are synced to the MongoDB database
- **WHEN** I open API GET routes in Insomnia for users and thoughts<br>
**THEN** the data for each of these routes is displayed in a formatted JSON response
- **WHEN** I test API POST, PUT, and DELETE routes in Insomnia<br>
**THEN** I am able to successfully create, update, and delete users and thoughts in my database
- **WHEN** I test API POST and DELETE routes in Insomnia
**THEN** I am able to successfully create and delete reactions to thoughts and add and remove friends to a user's friend list