"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const googleapis_1 = require("googleapis");
const credentials_json_1 = __importDefault(require("./credentials/credentials.json"));
// const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = './credentials/token.json';
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/'];
const getAccessToken = () => {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(credentials_json_1.default.web.client_id, credentials_json_1.default.web.client_secret, credentials_json_1.default.web.redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error retrieving access token', err);
            fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                console.log('Token stored to:', TOKEN_PATH);
            });
        });
    });
};
