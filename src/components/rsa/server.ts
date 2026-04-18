'use server'

import {nodeDecodeRsa, nodeEncodeRsa, nodeGenerateRsaKeyPair} from "@pnnh/atom/nodejs";

export type CryptoResult = {
    ok: boolean;
    data?: string;
    error?: string;
}

export interface IRSAKey {
    publicKey: string;
    privateKey: string;
}

export async function rsaServerGenerateKey(keyLength: number = 2048): Promise<IRSAKey> {
    return nodeGenerateRsaKeyPair()
}

export async function rsaServerEncode(data: string, key: string): Promise<CryptoResult> {
    if (!data || !key) {
        return {ok: false, error: 'rsa_public_key_required'}
    }
    try {
        const encoded = await nodeEncodeRsa(data, key)
        return {ok: true, data: encoded}
    } catch (e) {
        return {ok: false, error: 'crypto_failed'}
    }
}

export async function rsaServerDecode(encryptedData: string, key: string): Promise<CryptoResult> {
    if (!encryptedData || !key) {
        return {ok: false, error: 'rsa_private_key_required'}
    }
    try {
        const decoded = await nodeDecodeRsa(encryptedData, key)
        return {ok: true, data: decoded}
    } catch (e) {
        return {ok: false, error: 'crypto_failed'}
    }
}