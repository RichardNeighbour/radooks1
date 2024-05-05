const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { OAuth2 } = google.auth;

const youtubeUploader = async (videoFilePath, title, description) => {
  // Ensure your environment variables are set in your environment or a .env file
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  try {
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title,
          description: description,
          tags: ['Radooks', 'Animation'],
          categoryId: '22' // Category for People & Blogs
        },
        status: {
          privacyStatus: 'public', // Make the video public
        },
      },
      media: {
        body: fs.createReadStream(path.resolve(videoFilePath)),
      },
    });

    console.log(`Video uploaded successfully. Video ID: ${response.data.id}`);
    return `https://www.youtube.com/watch?v=${response.data.id}`;
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw new Error(`Failed to upload video: ${error}`);
  }
};

module.exports = youtubeUploader;

