import { generateOtp } from "../../src/auth/otpService";

describe("generateOtp", () => {
  it("generates a 6-digit OTP and expiration", () => {
    const { otp, otpExpires } = generateOtp();
    expect(otp).toMatch(/^\d{6}$/);
    expect(otpExpires).toBeInstanceOf(Date);
    expect(otpExpires.getTime()).toBeGreaterThan(Date.now());
  });
});