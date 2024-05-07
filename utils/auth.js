const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const app = express();

// Load client secrets from a local file.
const credentialsPath = path.join(__dirname, 'client_secret.json');
if (!fs.existsSync(credentialsPath)) {
  console.error('Error: client_secret.json file not found.');
  process.exit(1);
}

try {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath));
  const { client_id, client_secret, redirect_uris } = credentials.web || {};
  if (!client_id || !client_secret || !redirect_uris || !redirect_uris[0]) {
    console.error('Error: Required properties missing in client_secret.json.');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Multer configuration for handling file uploads
  const upload = multer({ dest: 'uploads/' });

  // Redirects to Google's consent page
  app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',  // Important to ensure you get a refresh token
      scope: ['https://www.googleapis.com/auth/youtube.upload']
    });
    res.redirect(url);
  });

  // Handles the OAuth2 callback
  app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Error: No code returned');
    }
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      res.send('Authentication successful! Refresh token: ' + tokens.refresh_token);
    } catch (error) {
      res.status(500).send('Authentication failed: ' + error.message);
    }
  });

  // Handle file upload
  app.post('/upload', upload.single('video'), (req, res) => {
    // Handle file upload logic here
    res.send('File uploaded successfully!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

} catch (error) {
  console.error('Error parsing client_secret.json:', error);
  process.exit(1);
}
