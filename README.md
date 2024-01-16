# Spotify Playlists Randomizer

This project is a simple Node.js application that allows you to create a new Spotify playlist by shuffling tracks from multiple existing playlists. It uses the Spotify Web API for playlist manipulation and track retrieval.

## How to Use

### 1. Obtain Spotify API Credentials

Before running the application, you need to obtain Spotify API credentials (Client ID and Client Secret) by creating a Spotify Developer account at [Spotify for Developers](https://developer.spotify.com/).

### 2. Configure the Application

Replace the placeholder values for `clientId` and `clientSecret` in the `authorizeSpotify` function with your actual Spotify API credentials.

```javascript
const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";

```

### 3. Replace Playlist IDs and Adjust Values for the New Playlist

In the playlistIds array at the beginning of your application file, replace the existing playlist IDs with the IDs of the playlists you want to shuffle together.

`
const playlistIds = [
	"your_playlist_id_1",
	"your_playlist_id_2",
	"your_playlist_id_3",
];
`

Adjust the values in the createShuffledPlaylist function to set the number of songs and the name of the new playlist. For example:

`createShuffledPlaylist(20, "Shuffled Playlist 1"); `

### 4. Install Dependencies
Run the following command to install the necessary Node.js packages:

`npm install`

### 5. Run the Application

Start the application by running:

`node SpotifyPlaylistRandomizer.js `

### 6. Log in to Spotify
The application will provide a URL to log in to Spotify. Open the URL in a web browser, log in to your Spotify account, and authorize the application.



## Enjoy your shuffled playlists!
