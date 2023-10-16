import Cryptr from 'cryptr';
import { getConfig } from '../config';

const { NEXT_PUBLIC_TOKEN_ENCRYPTION_SECRET } = getConfig();

const cryptr = new Cryptr(NEXT_PUBLIC_TOKEN_ENCRYPTION_SECRET);

export const encryptContent = (value: string) => {
    return cryptr.encrypt(value)
}

export const decryptContent = (encryptedValue: string) => {
    return cryptr.decrypt(encryptedValue)
}
