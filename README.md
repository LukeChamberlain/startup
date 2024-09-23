# Clean Music +
start up project for CS 260

## Specification Deliverable
### Elevator Pitch

Have you ever listened to music in a public setting like at work or school, and songs that were not marked as explicit, ending up having words or lyrics that were not appropriate for the environment that you were in. Well that is because sometimes the streaming service is responsible for determining if a song is explicit, other times it is the artist or label, and because all of these indiviual entities have different standards for what they consider explicit. So in order to help you find a solution Clean Music +, puts the power in your hands. It allows you to select what you would like to be marked as explicit, by selecting certain words or phrases that you consider to be explicit so that you will no longer have the problem of not knowing for sure if a song is appropriate to play in a public setting.

### Design

<img width="657" alt="Screenshot 2024-09-11 at 6 50 05 PM" src="https://github.com/user-attachments/assets/09034f65-9ca0-4e59-8b0d-528f049ab9f5">

<img width="470" alt="Screenshot 2024-09-11 at 6 50 17 PM" src="https://github.com/user-attachments/assets/0a060d07-14e4-4dab-9305-298657979789">

<img width="485" alt="Screenshot 2024-09-11 at 6 50 23 PM" src="https://github.com/user-attachments/assets/d6cd23e3-53ec-48db-9ed4-79605bdc0cd6">

<img width="498" alt="Screenshot 2024-09-11 at 6 50 35 PM" src="https://github.com/user-attachments/assets/a9878bfa-ecdf-4cff-9a62-a122ea00be5e">

<img width="631" alt="Screenshot 2024-09-11 at 6 50 46 PM" src="https://github.com/user-attachments/assets/8798355c-76ff-4313-b3af-594d2883794a">

### Key features

- Secure login over HTTPS
- Search for songs
- Ability to select Songs from a list
- Ability to select a song
- Ability to select filters from a list
- Confirm if the song is clean or explict from the filters chosen
- Add the song to a database of songs that are clean according to your standards
- Ability to see other peoples preset filters that they have submitted

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Four HTML pages. One for login, one for searching, one for filters, and one for database of songs. Hyperlinks to choice artifact.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **React** - Provides login, Song choice display, applying filters, determining if the song is clean, and storing results
- **Service** - Backend service with endpoints for:
  - login
  - retrieving songs
  - submitting filters
  - storing songs in a database
- **DB/Login** - Store users, filters, and songs in database. Register and login users. Credentials securely stored in database. Can't filter songs unless authenticated.
- **WebSocket** - As each user searches and filters, they can share their filter presets.
