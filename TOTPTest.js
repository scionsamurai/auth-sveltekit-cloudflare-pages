import { TOTP } from './src/lib/TOTP.js';

const secret = 'JBSWY3DPEHPK3PXP';  // Example base32-encoded secret
const totp = new TOTP(secret);

async function runTests() {
  // Test token generation
  const testTime = 1624044672;
  const generatedToken = await totp.generateTOTP(testTime);
  console.log(`Generated token at time ${testTime}:`, generatedToken);

  // Test valid token verification
  const validToken = await totp.generateTOTP(Math.floor(Date.now() / 1000));  // Generate a token based on current time
  const isValid = await totp.verify(validToken);
  console.log(`Verification result for token ${validToken}:`, isValid);

  // Test invalid token verification
  const invalidToken = '123456';
  const isInvalidValid = await totp.verify(invalidToken);
  console.log(`Verification result for invalid token ${invalidToken}:`, isInvalidValid);
}

runTests();