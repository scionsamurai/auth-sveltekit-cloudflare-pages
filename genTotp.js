// genTotp.js
import {TOTP} from './src/lib/TOTP.js';
const secret = process.env.TOTP_SECRET;
const totp = new TOTP(secret);

totp.generateTOTP(Math.floor(Date.now() / 1000)).then(token => {
  console.log(token);
});