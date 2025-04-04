import jwt, { SignOptions } from 'jsonwebtoken';

const createToken = (
    payload: Record<string, unknown>,
    secret: jwt.Secret,
    expireTime: string | number 
): string => {
    const options: SignOptions = { expiresIn: expireTime as SignOptions['expiresIn'] }; 
    return jwt.sign(payload, secret, options);
};

const verifiedToken = (token: string, secret: jwt.Secret): jwt.JwtPayload => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};

export const jwtHelpers = {
    createToken,
    verifiedToken
};
