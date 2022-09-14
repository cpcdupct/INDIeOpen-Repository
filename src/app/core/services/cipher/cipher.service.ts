import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as forge from 'node-forge';

/**
 * Services that provides funcionality for ciphering and deciphering strings
 */
@Injectable({
    providedIn: 'root',
})
export class CipherService {
    /** Secret key */
    private key: string = environment.secretKey;
    /** Initialization vector */
    private iv: string = environment.iv;

    constructor() {}

    /**
     * Encrtyps a string and encodes it in base64
     *
     * @param plainString String to be encryoted
     */
    public encrypt(plainString: string): string {
        const cipher = forge.cipher.createCipher('MY_CIPHER', this.key);
        cipher.start({ iv: this.iv });
        cipher.update(forge.util.createBuffer(plainString));
        cipher.finish();
        return forge.util.encode64(cipher.output.data);
    }

    /**
     * Deciphers a base64 string
     *
     * @param encryptedString Base64 string to be decrypted
     */
    public decrypt(encryptedString: string): string {
        const decipher = forge.cipher.createDecipher('MY_CIPHER', this.key);
        const decodedB64 = forge.util.decode64(encryptedString);
        decipher.start({ iv: this.iv });
        decipher.update(forge.util.createBuffer(decodedB64));
        decipher.finish();

        return decipher.output.data;
    }
}
