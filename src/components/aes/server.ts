'use server'

import {nodeDecodeAes, nodeEncodeAes, nodeGenerateAesKey} from "@pnnh/atom/nodejs";
import {transTodo} from "@/components/common/locales/normal";

export async function aesServerGenerateKey(): Promise<string> {
    return nodeGenerateAesKey()
}

export async function aesServerEncode(data: string, key: string): Promise<string> {
    if (!data || !key) {
        return transTodo("input error")
    }
    return nodeEncodeAes(data, key);
}

export async function aesServerDecode(encryptedData: string, key: string): Promise<string> {
    if (!encryptedData || !key) {
        return transTodo("input error")
    }
    return nodeDecodeAes(encryptedData, key);
}
