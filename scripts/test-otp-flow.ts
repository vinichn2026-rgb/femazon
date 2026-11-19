import 'dotenv/config';
import { generateOtp, createOtpChallenge, verifyOtpCode, checkRateLimit, storeOtp } from '../src/lib/sms';

async function runOtpTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE FEMAZON OTP SECURITY & FLOW TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  }

  const testEmail = 'customer_test_' + Date.now() + '@subdomain.example.com';

  // 1. Generate OTP test
  const otp = generateOtp();
  assert(/^\d{6}$/.test(otp), `OTP is 6 numeric digits: ${otp}`);

  // 2. Rate limit test
  const rate1 = checkRateLimit(testEmail);
  assert(rate1.allowed === true, 'Initial request allowed by rate limiter');

  storeOtp(testEmail, otp);
  const challenge = createOtpChallenge(testEmail, otp);
  assert(typeof challenge === 'string' && challenge.length > 20, 'Challenge token generated as base64url payload');

  // Request immediately again should be rate limited (30s cooldown)
  const rate2 = checkRateLimit(testEmail, challenge);
  assert(rate2.allowed === false, `Immediate resend request rate limited (remaining: ${rate2.remainingSecs}s)`);

  // 3. Reject incorrect OTP
  const wrongRes = verifyOtpCode(testEmail, '999999', challenge);
  assert(wrongRes.success === false, 'Incorrect OTP was correctly rejected');

  // 4. Reject backdoor/demo codes
  const bypass1 = verifyOtpCode(testEmail, '1234', challenge);
  assert(bypass1.success === false, 'Legacy demo code "1234" is strictly rejected');
  const bypass2 = verifyOtpCode(testEmail, '123456', challenge);
  assert(bypass2.success === false, 'Legacy demo code "123456" is strictly rejected');

  // 5. Correct OTP verifies successfully
  const correctRes = verifyOtpCode(testEmail, otp, challenge);
  assert(correctRes.success === true, 'Correct OTP verifies successfully');

  // 6. Prevention of OTP reuse
  const reuseRes = verifyOtpCode(testEmail, otp, challenge);
  assert(reuseRes.success === false, 'Replaying/reusing the exact same OTP challenge is strictly rejected');

  // 7. Expired OTP test
  const secret = process.env.NEXTAUTH_SECRET || 'femazon-otp-secret';
  const crypto = await import('crypto');
  const pastTime = Date.now() - 10 * 60 * 1000;
  const expiredOtpHmac = crypto
    .createHmac('sha256', secret)
    .update(`${testEmail}:${otp}:${pastTime}`)
    .digest('hex');
  const expiredPayloadStr = `${testEmail}|${pastTime}|${pastTime}|${expiredOtpHmac}`;
  const expiredSig = crypto.createHmac('sha256', secret).update(expiredPayloadStr).digest('hex');
  const expiredChallenge = Buffer.from(JSON.stringify({
    id: testEmail,
    exp: pastTime,
    sent: pastTime,
    h: expiredOtpHmac,
    s: expiredSig
  }), 'utf8').toString('base64url');

  const expiredRes = verifyOtpCode(testEmail, otp, expiredChallenge);
  assert(expiredRes.success === false && expiredRes.message.includes('expired'), 'Expired challenge token is rejected with expiration notice');

  console.log('\n====================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runOtpTests().catch(console.error);
