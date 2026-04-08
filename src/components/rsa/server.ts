'use server'

import {nodeDecodeRsa, nodeEncodeRsa} from "@pnnh/atom/nodejs";
import {transTodo} from "@/components/common/locales/normal";

export async function rsaServerEncode(data: string, key: string): Promise<string> {
    if (!data || !key) {
        return transTodo("input error")
    }
    return nodeEncodeRsa(data, key);
}

export async function rsaServerDecode(encryptedData: string, key: string): Promise<string> {
    if (!encryptedData || !key) {
        return transTodo("input error")
    }
    return nodeDecodeRsa(encryptedData, key);
}
