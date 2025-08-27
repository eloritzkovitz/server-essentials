
import jwt from 'jsonwebtoken';
import config from '../../config/config';

type tTokens = {
    accessToken: string,
    refreshToken: string
}

/**
 * Generates access and refresh JWT tokens for a user.
 * @param userId - The user's unique identifier.
 * @param role - (Optional) The user's role.
 * @returns An object containing accessToken and refreshToken, or null if TOKEN_SECRET is missing.
 */
export const generateToken = (userId: string, role?: string): tTokens | null => {
    if (!config.jwt.secret) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: userId,
        role: role,
        random: random
    },
        config.jwt.secret,
        { expiresIn: config.jwt.expires });

    const refreshToken = jwt.sign({
        _id: userId,
        role: role,
        random: random
    },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpires });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

/**
 * Verifies a refresh token and checks its validity against the user's stored tokens.
 * @param refreshToken - The refresh token to verify.
 * @param userModel - The user model (should support findById and save).
 * @returns A Promise that resolves with the user if valid, or rejects with an error message.
 */
export const verifyRefreshToken = async (
    refreshToken: string | undefined,
    userModel: any
) => {
    return new Promise<any>((resolve, reject) => {
        if (!refreshToken) {
            reject("Refresh token is required");
            return;
        }
        if (!config.jwt.secret) {
            reject("Token secret is missing");
            return;
        }
        jwt.verify(refreshToken, config.jwt.secret, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return;
            }
            const userId = payload._id;
            try {
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken!.filter((token: string) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject("fail");
                return;
            }
        });
    });
};