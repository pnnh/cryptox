'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { transKey } from "@/components/common/locales/normal";
import {
    transToolsAesRandomKey,
    transToolsCommonInputPlaceholder,
    transToolsCommonResultPlaceholder,
    transToolsRsaDecode,
    transToolsRsaEncode,
    transToolsRsaKeyPlaceholder,
    transToolsRsaTitle,
    transToolsRsaPublicKeyPlaceholder,
    transCryptoErrorInput,
    transCryptoErrorCryptoFailed,
    transCryptoErrorRsaPublicKeyRequired,
    transCryptoErrorRsaPrivateKeyRequired,
    transCryptoErrorRsaTextTooLong,
    transToolsRsaKeyLength,
    transToolsRsaViewKeyDetail,
    transToolsRsaPublicKey,
    transToolsRsaPrivateKey,
    transToolsCopyResult,
    transToolsClearAll,
    transToolsCopied,
    transCryptoButtonLoading,
    transToolsHistoryTitle,
    transHistoryDisabled,
} from "@/components/common/locales/texts";
import { IRSAKey, rsaServerDecode, rsaServerEncode, rsaServerGenerateKey, CryptoResult } from "./server";
import { css } from "@/gen/styled/css";
import { ArrowUpDown, Copy, Trash2, Loader2, Eye, History, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAtom } from 'jotai';
import { cryptoHistoryAtom, addCryptoHistoryItem, CryptoHistoryItem, isHistoryEnabled } from "@/components/common/atoms/cryptoHistory";

const RSA_KEY_LENGTHS: { value: number; label: string }[] = [
    { value: 2048, label: '2048' },
    { value: 4096, label: '4096' },
]

export default function RsaComponent({ lang, }: { lang: string }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [rsaKey, setRsaKey] = React.useState<IRSAKey>({ privateKey: '', publicKey: '' })
    const [rsaKeyLength, setRsaKeyLength] = React.useState(2048)
    const [error, setError] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const [textTooLong, setTextTooLong] = React.useState(false)
    const [historyOpen, setHistoryOpen] = React.useState(false)
    const [history, setHistory] = useAtom(cryptoHistoryAtom)
    const [lastOperation, setLastOperation] = React.useState<'encode' | 'decode'>('encode')
    const [historyEnabled] = React.useState(() => isHistoryEnabled())

    const getErrorText = (errorCode: string): string => {
        switch (errorCode) {
            case 'input_empty':
                return transKey(lang, transCryptoErrorInput)
            case 'rsa_public_key_required':
                return transKey(lang, transCryptoErrorRsaPublicKeyRequired)
            case 'rsa_private_key_required':
                return transKey(lang, transCryptoErrorRsaPrivateKeyRequired)
            case 'crypto_failed':
                return transKey(lang, transCryptoErrorCryptoFailed)
            default:
                return transKey(lang, transCryptoErrorCryptoFailed)
        }
    }

    const handleResult = (result: CryptoResult) => {
        setLoading(false)
        if (result.ok && result.data) {
            setOutput(result.data)
            setError(null)
            setHistory(addCryptoHistoryItem({
                tool: 'rsa',
                operation: lastOperation,
                keyPreview: (lastOperation === 'encode' ? rsaKey.publicKey : rsaKey.privateKey).substring(0, 16) + '...',
                resultPreview: result.data.substring(0, 40) + (result.data.length > 40 ? '...' : ''),
                timestamp: Date.now(),
            }, history))
        } else {
            setError(result.error ? getErrorText(result.error) : transKey(lang, transCryptoErrorCryptoFailed))
        }
    }

    const handleError = () => {
        setLoading(false)
        setError(transKey(lang, transCryptoErrorCryptoFailed))
    }

    const checkTextLength = (text: string) => {
        const maxBytes = rsaKeyLength === 2048 ? 245 : 501
        const byteLength = new TextEncoder().encode(text).length
        setTextTooLong(byteLength > maxBytes)
    }

    const encodeFunc = () => {
        if (!source) {
            setError(transKey(lang, transCryptoErrorInput))
            return
        }
        if (!rsaKey.publicKey) {
            setError(transKey(lang, transCryptoErrorRsaPublicKeyRequired))
            return
        }
        setError(null)
        setLoading(true)
        setLastOperation('encode')
        rsaServerEncode(source, rsaKey.publicKey)
            .then(handleResult)
            .catch(handleError)
    }

    const decodeFunc = () => {
        if (!source) {
            setError(transKey(lang, transCryptoErrorInput))
            return
        }
        if (!rsaKey.privateKey) {
            setError(transKey(lang, transCryptoErrorRsaPrivateKeyRequired))
            return
        }
        setError(null)
        setLoading(true)
        setLastOperation('decode')
        rsaServerDecode(source, rsaKey.privateKey)
            .then(handleResult)
            .catch(handleError)
    }

    const generateKeyFunc = () => {
        rsaServerGenerateKey(rsaKeyLength).then((newKey) => setRsaKey(newKey))
    }

    const copyResult = () => {
        if (!output) return
        navigator.clipboard.writeText(output).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const clearAll = () => {
        setSource('')
        setOutput('')
        setRsaKey({ privateKey: '', publicKey: '' })
        setError(null)
        setTextTooLong(false)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const downloadKey = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    return <div className={rsaStyles.cryptoPage}>
        <h1 className={rsaStyles.toolTitle}>{transKey(lang, transToolsRsaTitle)}</h1>

        {error && <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>}

        {textTooLong && <Alert>
            <AlertDescription>{transKey(lang, transCryptoErrorRsaTextTooLong)}</AlertDescription>
        </Alert>}

        <textarea className={rsaStyles.sourceText} placeholder={
            transKey(lang, transToolsCommonInputPlaceholder)
        } value={source}
            onChange={(event) => {
                setSource(event.target.value)
                checkTextLength(event.target.value)
            }} />

        <div className={rsaStyles.keyArea}>
            <textarea className={rsaStyles.keyTextarea}
                value={rsaKey.publicKey}
                placeholder={transKey(lang, transToolsRsaPublicKeyPlaceholder)}
                onChange={(event) =>
                    setRsaKey({
                        ...rsaKey,
                        publicKey: event.target.value
                    })} />
            <textarea className={rsaStyles.keyTextarea}
                value={rsaKey.privateKey}
                placeholder={transKey(lang, transToolsRsaKeyPlaceholder)}
                onChange={(event) =>
                    setRsaKey({
                        ...rsaKey,
                        privateKey: event.target.value
                    })} />
        </div>

        <div className={rsaStyles.configRow}>
            <label className={rsaStyles.configLabel}>
                {transKey(lang, transToolsRsaKeyLength)}
                <select className={rsaStyles.configSelect} value={rsaKeyLength}
                    onChange={(e) => setRsaKeyLength(Number(e.target.value))}>
                    {RSA_KEY_LENGTHS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
            </label>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!rsaKey.publicKey && !rsaKey.privateKey}>
                        <Eye size={14} />
                        {transKey(lang, transToolsRsaViewKeyDetail)}
                    </Button>
                </DialogTrigger>
                <DialogContent className={rsaStyles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle>{transKey(lang, transToolsRsaViewKeyDetail)}</DialogTitle>
                    </DialogHeader>
                    <div className={rsaStyles.dialogKeySection}>
                        <h4>{transKey(lang, transToolsRsaPublicKey)}</h4>
                        <div className={rsaStyles.dialogButtonRow}>
                            <Button variant="outline" size="sm"
                                onClick={() => copyToClipboard(rsaKey.publicKey)}>
                                <Copy size={14} />
                                {transKey(lang, transToolsCopyResult)}
                            </Button>
                            <Button variant="outline" size="sm"
                                onClick={() => downloadKey(rsaKey.publicKey, 'rsa_public.pem')}>
                                Download PEM
                            </Button>
                        </div>
                        <textarea className={rsaStyles.dialogTextarea} value={rsaKey.publicKey} readOnly />
                    </div>
                    <div className={rsaStyles.dialogKeySection}>
                        <h4>{transKey(lang, transToolsRsaPrivateKey)}</h4>
                        <div className={rsaStyles.dialogButtonRow}>
                            <Button variant="outline" size="sm"
                                onClick={() => copyToClipboard(rsaKey.privateKey)}>
                                <Copy size={14} />
                                {transKey(lang, transToolsCopyResult)}
                            </Button>
                            <Button variant="outline" size="sm"
                                onClick={() => downloadKey(rsaKey.privateKey, 'rsa_private.pem')}>
                                Download PEM
                            </Button>
                        </div>
                        <textarea className={rsaStyles.dialogTextarea} value={rsaKey.privateKey} readOnly />
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        <div className={rsaStyles.toolButtons}>
            <Button size={'sm'} onClick={generateKeyFunc}>
                {transKey(lang, transToolsAesRandomKey)}
            </Button>
            <Button size={'sm'} onClick={encodeFunc} disabled={loading}>
                {loading ? transKey(lang, transCryptoButtonLoading) : transKey(lang, transToolsRsaEncode)}
            </Button>
            <Button size={'sm'} onClick={decodeFunc} disabled={loading}>
                {loading ? transKey(lang, transCryptoButtonLoading) : transKey(lang, transToolsRsaDecode)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
                const currentSource = source;
                setSource(output);
                setOutput(currentSource);
            }}>
                <ArrowUpDown size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={copyResult} title={transKey(lang, transToolsCopyResult)}>
                {copied ? <span className={rsaStyles.copiedText}>{transKey(lang, transToolsCopied)}</span> :
                    <Copy size={16} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={clearAll} title={transKey(lang, transToolsClearAll)}>
                <Trash2 size={16} />
            </Button>
            {loading && <Loader2 size={16} className={rsaStyles.spinner} />}
        </div>

        <textarea className={rsaStyles.targetText} placeholder={
            transKey(lang, transToolsCommonResultPlaceholder)
        } value={output} onChange={(event) =>
            setOutput(event.target.value)} />

        {!historyEnabled
            ? <p className={rsaStyles.historyDisabled}>{transKey(lang, transHistoryDisabled)}</p>
            : history.length > 0 && <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className={rsaStyles.historyTrigger}>
                        <History size={14} />
                        {transKey(lang, transToolsHistoryTitle)}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className={rsaStyles.historyList}>
                        {history.map((item) => (
                            <div key={item.timestamp} className={rsaStyles.historyItem}>
                                <span className={rsaStyles.historyOp}>
                                    {item.tool === 'aes' ? 'AES' : 'RSA'} {item.operation === 'encode' ? '🔒' : '🔓'}
                                </span>
                                <span className={rsaStyles.historyKey}>{item.keyPreview}</span>
                                <span className={rsaStyles.historyResult}>{item.resultPreview}</span>
                                <span className={rsaStyles.historyTime}>
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                                <Button variant="ghost" size="icon"
                                    onClick={() => setHistory(history.filter(h => h.timestamp !== item.timestamp))}>
                                    <X size={12} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>}
    </div>
}

const rsaStyles = {
    cryptoPage: css`
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
    toolTitle: css`
        font-size: 18px;
        font-weight: bold;
        margin-top: 8px;
    `,
    sourceText: css`
        width: 100%;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary-color);
        resize: vertical;
        min-height: 80px;
        max-height: 400px;
    `,
    keyArea: css`
        display: flex;
        flex-direction: row;
        gap: 16px;
        width: 100%;
        @media screen and (max-width: 48rem) {
            flex-direction: column;
        }
    `,
    keyTextarea: css`
        width: 100%;
        height: 100px;
        padding: 8px;
        flex-shrink: 0;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary-color);
        resize: vertical;
        min-height: 60px;
        max-height: 300px;
        font-size: 12px;
    `,
    configRow: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        width: 100%;
    `,
    configLabel: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--text-secondary-color);
    `,
    configSelect: css`
        height: 28px;
        padding: 0 8px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--background-color);
        color: var(--text-primary-color);
        font-size: 13px;
    `,
    toolButtons: css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    `,
    copiedText: css`
        font-size: 11px;
        color: var(--success-color);
    `,
    spinner: css`
        animation: spin 1s linear infinite;
    `,
    targetText: css`
        width: 100%;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary-color);
        resize: vertical;
        min-height: 80px;
        max-height: 400px;
    `,
    dialogContent: css`
        max-width: 600px;
        width: 100%;
    `,
    dialogKeySection: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
        & h4 {
            font-size: 14px;
            font-weight: 600;
        }
    `,
    dialogButtonRow: css`
        display: flex;
        flex-direction: row;
        gap: 8px;
    `,
    dialogTextarea: css`
        width: 100%;
        height: 120px;
        padding: 8px;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-primary-color);
        font-size: 12px;
        resize: vertical;
    `,
    historyTrigger: css`
        width: 100%;
        justify-content: flex-start;
        color: var(--text-secondary-color);
    `,
    historyDisabled: css`
        font-size: 12px;
        color: var(--text-disabled-color);
        text-align: center;
        padding: 6px 0;
    `,
    historyList: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    `,
    historyItem: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 6px;
        background: var(--action-hover-color);
        font-size: 12px;
        color: var(--text-secondary-color);
    `,
    historyOp: css`
        font-weight: 600;
        color: var(--text-primary-color);
        min-width: 60px;
    `,
    historyKey: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 120px;
    `,
    historyResult: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    `,
    historyTime: css`
        font-size: 11px;
        color: var(--text-disabled-color);
        white-space: nowrap;
    `,
}