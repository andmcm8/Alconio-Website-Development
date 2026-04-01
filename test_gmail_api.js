const { google } = require('googleapis');
require('dotenv').config();

async function testGmailAPI() {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
        const auth = new google.auth.JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/gmail.send']
        });
        
        if (credentials.private_key) {
            console.log('Private key length:', credentials.private_key.length);
            console.log('Private key preview:', credentials.private_key.substring(0, 50));
        } else {
            console.error('ERROR: private_key is missing!');
        }

        const gmail = google.gmail({ version: 'v1', auth });

        const emailHtml = `<h1>Gmail API Test</h1><p>This is a test from the Alconio Website Service Account.</p>`;
        const subject = 'GMAIL API TEST RUN';
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        
        const messageParts = [
            `From: "Alconio Admin" <${credentials.client_email}>`,
            `To: hello@alconio.com`,
            `Content-Type: text/html; charset=utf-8`,
            `MIME-Version: 1.0`,
            `Subject: ${utf8Subject}`,
            '',
            emailHtml,
        ];
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        console.log(`Attempting Gmail API send via: ${credentials.client_email}...`);
        
        await auth.authorize();
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('SUCCESS! Gmail API Response:', res.data);
    } catch (err) {
        console.error('GMAIL API CRITICAL ERROR:', err.message);
        if (err.message.includes('Gmail API has not been used')) {
            console.log('\nTIP: You may need to enable the Gmail API in your Google Cloud Console.');
        }
    }
}

testGmailAPI();
