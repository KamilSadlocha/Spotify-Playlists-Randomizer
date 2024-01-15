const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const opn = require("opn");

const playlistIds = [
	"2Tx0ThEDBEVaGymMTS4cvq",
	"6yqP7AsF5t38ECTIFv9nnK",
	"1Lc8GVU2zM4DerCaE42BxC",
];

// Function for shuffling tracks in array - Fisher–Yates shuffle
function shuffleTracks(allTracks, numberOfTracks) {
	const shuffledTracks = allTracks.slice();
	for (let i = shuffledTracks.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledTracks[i], shuffledTracks[j]] = [
			shuffledTracks[j],
			shuffledTracks[i],
		];
	}
	return shuffledTracks.slice(0, numberOfTracks);
}

// Function for Spotify authorization
async function authorizeSpotify() {
	const clientId = "YOUR_CLIENT_ID";
	const clientSecret = "YOUR_CLIENT_SECRET";
	const redirectUri = "http://localhost:3000/callback";

	const spotifyApi = new SpotifyWebApi({
		clientId,
		clientSecret,
		redirectUri,
	});

	const authorizeURL = spotifyApi.createAuthorizeURL(
		["playlist-modify-public", "playlist-modify-private"],
		null,
		true
	);
	console.log(`Please log in at: ${authorizeURL}`);

	opn(authorizeURL);

	const authorizationCode = await new Promise((resolve) => {
		const app = express();
		const port = 3000;

		app.get("/callback", (req, res) => {
			const { code } = req.query;
			res.send("Authorization completed. You can close this window.");
			resolve(code);
			server.close();
		});

		const server = app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	});

	try {
		const data = await spotifyApi.authorizationCodeGrant(authorizationCode);
		console.log("Access token obtained");
		console.log("Authentication data:", data.body);

		spotifyApi.setAccessToken(data.body["access_token"]);
		spotifyApi.setRefreshToken(data.body["refresh_token"]);

		return spotifyApi;
	} catch (err) {
		console.error("Error during authorization:", err.message || err);
		console.error("Error details:", err);
		throw err;
	}
}

// Function for downloading tracks from playlists
async function downloadTracksFromPlaylists(spotifyApi) {
	let allTracks = [];

	for (const playlistId of playlistIds) {
		let offset = 0;
		let playlistTracks;

		do {
			playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, {
				offset: offset,
				limit: 100,
			});

			if (
				!playlistTracks ||
				!playlistTracks.body ||
				!playlistTracks.body.items
			) {
				throw new Error(
					`Error while retrieving tracks from playlist ${playlistId}`
				);
			}

			const tracks = playlistTracks.body.items;
			allTracks = allTracks.concat(tracks);
			console.log(`Downloading tracks... ${allTracks.length}`);
			offset += tracks.length;
		} while (offset < playlistTracks.body.total);
	}

	console.log(`All tracks downloaded: ${allTracks.length}`);
	return allTracks;
}

// Function for creating shuffled playlist
async function createShuffledPlaylist(numSongs, playlistName) {
	const spotifyApi = await authorizeSpotify();

	try {
		const targetPlaylist = await spotifyApi.createPlaylist(playlistName, {
			public: true,
		});
		const targetPlaylistId = targetPlaylist.body.id;

		const allTracks = await downloadTracksFromPlaylists(spotifyApi);

		const shuffledTracks = shuffleTracks(allTracks, numSongs);
		const trackUris = shuffledTracks.map((track) => track.track.uri);

		console.log(`Number of shuffled tracks: ${trackUris.length}`);

		try {
			const addedTracks = await spotifyApi.addTracksToPlaylist(
				targetPlaylistId,
				trackUris
			);
			console.log(
				`Successfully created playlist "${targetPlaylist.body.name}" (ID: ${targetPlaylist.body.id}). Enjoy!`
			);
		} catch (err) {
			console.error(
				"Error during adding tracks to the new playlist:",
				err.message || err
			);
		}
	} catch (err) {
		console.error("Error during playlist creation:", err);
	}
}

createShuffledPlaylist(20, "TEST 1");
