import { getUserId, getUserRole, getUserEmail, userHasRole, getUserRefreshToken } from "../../src/auth/requestHelpers";

describe("requestHelpers", () => {
  const req: any = {
    user: {
      id: "user123",
      role: "admin",
      email: "test@example.com",
      refreshToken: "refresh-token-abc"
    }
  };

  it("getUserId returns user id", () => {
    expect(getUserId(req)).toBe("user123");
  });

  it("getUserRole returns user role", () => {
    expect(getUserRole(req)).toBe("admin");
  });

  it("getUserEmail returns user email", () => {
    expect(getUserEmail(req)).toBe("test@example.com");
  });  

  it("userHasRole returns true for matching role", () => {
    expect(userHasRole(req, "admin")).toBe(true);
  });

  it("userHasRole returns false for non-matching role", () => {
    expect(userHasRole(req, "editor")).toBe(false);
  });

  it("getUserRefreshToken returns refresh token", () => {
    expect(getUserRefreshToken(req)).toBe("refresh-token-abc");
  });

  it("returns undefined if user is missing", () => {
    const emptyReq: any = {};
    expect(getUserId(emptyReq)).toBeUndefined();
    expect(getUserRole(emptyReq)).toBeUndefined();
    expect(getUserEmail(emptyReq)).toBeUndefined();    
    expect(getUserRefreshToken(emptyReq)).toBeUndefined();
  });
});