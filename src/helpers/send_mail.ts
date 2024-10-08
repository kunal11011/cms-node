import nodemailer, { TransportOptions } from "nodemailer";
import { google } from "googleapis";
import { config } from "dotenv";
config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(userMail?: string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transportOptions: any = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "kunalk.webosmotic@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    };
    const transport = nodemailer.createTransport(transportOptions);

    const mailOptions = {
      from: "kunalk.webosmotic@gmail.com",
      to: userMail,
      subject: "Registration Successful",
      text: "Your registration was successful!!",
      html: "<h1>Your registration was successful!!</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

export default sendMail;
