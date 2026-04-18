'use server'

import {nodeDecodeAes, nodeEncodeAes, nodeGenerateAesKey} from "@pnnh/atom/nodejs";
import crypto from "crypto";

export type CryptoResult = {
    ok: boolean;
    data?: string;
    error?: string;
}

export type AesMode = 'cbc' | 'gcm' | 'ecb'
export type AesKeyLength = 128 | 192 | 256

export async function aesServerGenerateKey(keyByteLength: number = 32): Promise<string> {
    return crypto.randomBytes(keyByteLength).toString('hex')
}

export async function aesServerEncode(data: string, key: string, mode: AesMode = 'cbc', keyLength: AesKeyLength = 256): Promise<CryptoResult> {
    if (!data || !key) {
        return {ok: false, error: 'input_empty'}
    }

    const keyByteLength = keyLength / 8
    const keyBytes = Buffer.from(key, 'hex')
    if (keyBytes.length !== keyByteLength) {
        return {ok: false, error: 'aes_key_length'}
    }

    try {
        if (mode === 'gcm') {
            const iv = crypto.randomBytes(12)
            const cipher = crypto.createCipheriv(`aes-${keyLength}-gcm`, keyBytes, iv)
            let encrypted = cipher.update(data, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            const authTag = cipher.getAuthTag().toString('hex')
            return {ok: true, data: iv.toString('hex') + ':' + authTag + ':' + encrypted}
        } else if (mode === 'ecb') {
            const cipher = crypto.createCipheriv(`aes-${keyLength}-ecb`, keyBytes, null as unknown as Buffer)
            let encrypted = cipher.update(data, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            return {ok: true, data: encrypted}
        } else {
            const iv = crypto.randomBytes(16)
            const cipher = crypto.createCipheriv(`aes-${keyLength}-cbc`, keyBytes, iv)
            let encrypted = cipher.update(data, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            return {ok: true, data: iv.toString('hex') + ':' + encrypted}
        }
    } catch (e) {
        return {ok: false, error: 'crypto_failed'}
    }
}

export async function aesServerDecode(encryptedData: string, key: string, mode: AesMode = 'cbc', keyLength: AesKeyLength = 256): Promise<CryptoResult> {
    if (!encryptedData || !key) {
        return {ok: false, error: 'input_empty'}
    }

    const keyByteLength = keyLength / 8
    const keyBytes = Buffer.from(key, 'hex')
    if (keyBytes.length !== keyByteLength) {
        return {ok: false, error: 'aes_key_length'}
    }

    try {
        if (mode === 'gcm') {
            const parts = encryptedData.split(':')
            if (parts.length !== 3) {
                return {ok: false, error: 'crypto_failed'}
            }
            const iv = Buffer.from(parts[0], 'hex')
            const authTag = Buffer.from(parts[1], 'hex')
            const encrypted = parts[2]
            const decipher = crypto.createDecipheriv(`aes-${keyLength}-gcm`, keyBytes, iv)
            decipher.setAuthTag(authTag)
            let decrypted = decipher.update(encrypted, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return {ok: true, data: decrypted}
        } else if (mode === 'ecb') {
            const decipher = crypto.createDecipheriv(`aes-${keyLength}-ecb`, keyBytes, null as unknown as Buffer)
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return {ok: true, data: decrypted}
        } else {
            const parts = encryptedData.split(':')
            if (parts.length !== 2) {
                return {ok: false, error: 'crypto_failed'}
            }
            const iv = Buffer.from(parts[0], 'hex')
            const encrypted = parts[1]
            const decipher = crypto.createDecipheriv(`aes-${keyLength}-cbc`, keyBytes, iv)
            let decrypted = decipher.update(encrypted, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return {ok: true, data: decrypted}
        }
    } catch (e) {
        return {ok: false, error: 'crypto_failed'}
    }
}