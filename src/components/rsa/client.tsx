'use client'

import * as React from 'react';
import {Button} from "@/components/ui/button";
import {transKey} from "@/components/common/locales/normal";
import {
    transToolsAesRandomKey,
    transToolsCommonInputPlaceholder,
    transToolsCommonResultPlaceholder,
    transToolsRsaDecode,
    transToolsRsaEncode,
    transToolsRsaKeyPlaceholder
} from "@/components/common/locales/texts";
import {IRSAKey, rsaServerDecode, rsaServerEncode, rsaServerGenerateKey} from "./server";
import {css} from "@/gen/styled/css";
import {ArrowUpDown} from "lucide-react";

export default function RsaComponent({lang,}: { lang: string }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [rsaKey, setAesKey] = React.useState<IRSAKey>({privateKey: '', publicKey: ''})

    const encodeFunc = () => {
        if (!source) {
            return;
        }
        rsaServerEncode(source, rsaKey.publicKey).then((encodedText) => {
            setOutput(encodedText);
        });
    }
    const decodeFunc = () => {
        if (!source || !rsaKey) {
            return;
        }
        rsaServerDecode(source, rsaKey.privateKey).then((decodedText) => {
            setOutput(decodedText);
        })
    }
    return <div className={rsaStyles.sha256Page}>
        <h1>RSA Tool</h1>
        <textarea className={rsaStyles.sourceText} placeholder={
            transKey(lang, transToolsCommonInputPlaceholder)
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={css`
            display: flex;
            flex-direction: row;
            gap: 16px;
        `}>

            <textarea style={{width: 400}} className={rsaStyles.sourceText}
                      value={rsaKey.publicKey} maxLength={64}
                      placeholder={transKey(lang, transToolsRsaKeyPlaceholder)}
                      onChange={(event) =>
                          setAesKey({
                              ...rsaKey,
                              publicKey: event.target.value
                          })}/>

            <textarea style={{width: 400}} className={rsaStyles.sourceText}
                      value={rsaKey.privateKey} maxLength={64}
                      placeholder={transKey(lang, transToolsRsaKeyPlaceholder)}
                      onChange={(event) =>
                          setAesKey({
                              ...rsaKey,
                              privateKey: event.target.value
                          })}/>
        </div>
        <div className={rsaStyles.toolButtons}>
            <Button size={'sm'}
                    onClick={() => {
                        rsaServerGenerateKey().then((newKey) => setAesKey(newKey))
                    }}>{transKey(lang, transToolsAesRandomKey)}</Button>
            <Button size={'sm'} onClick={encodeFunc}>
                {transKey(lang, transToolsRsaEncode)}
            </Button>
            <Button size={'sm'} onClick={decodeFunc}>
                {transKey(lang, transToolsRsaDecode)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
                const currentSource = source;
                setSource(output);
                setOutput(currentSource);
            }}>
                <ArrowUpDown size={20}/>
            </Button>
        </div>
        <textarea className={rsaStyles.targetText} placeholder={
            transKey(lang, transToolsCommonResultPlaceholder)
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}

const rsaStyles = {
    sha256Page: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        height: 100%;
        scrollbar-width: thin;
        overflow-y: auto;
        overflow-x: hidden;
    `,
    sourceText: css`
        width: 900px;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `,
    toolButtons: css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
    `,
    targetText: css`
        width: 900px;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `
}
