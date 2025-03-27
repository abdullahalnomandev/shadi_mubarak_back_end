import jwt, { SignOptions } from 'jsonwebtoken';

const createToken = (
    payload: Record<string, unknown>,
    secret: jwt.Secret,
    expireTime: string | number 
): string => {
    const options: SignOptions = { expiresIn: expireTime as SignOptions['expiresIn'] }; 
    return jwt.sign(payload, secret, options);
};

export const jwtHelpers = {
    createToken
};
