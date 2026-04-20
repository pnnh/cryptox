'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { transKey } from "@/components/common/locales/normal";
import {
    transToolsCommonInputPlaceholder,
    transToolsAesKeyPlaceholder,
    transToolsAesRandomKey,
    transToolsAesEncode,
    transToolsAesDecode,
    transToolsCommonResultPlaceholder,
    transToolsAesTitle,
    transCryptoErrorInput,
    transCryptoErrorAesKeyLength,
    transCryptoErrorCryptoFailed,
    transToolsAesMode,
    transToolsAesKeyLength,
    transToolsCopyResult,
    transToolsClearAll,
    transToolsCopied,
    transCryptoButtonLoading,
    transToolsHistoryTitle,
    transHistoryDisabled,
} from "@/components/common/locales/texts";
import { aesServerDecode, aesServerEncode, aesServerGenerateKey, AesMode, AesKeyLength, CryptoResult } from "./server";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Copy, Trash2, Loader2, History, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { css } from "@/gen/styled/css";
import { useAtom } from 'jotai';
import { cryptoHistoryAtom, addCryptoHistoryItem, CryptoHistoryItem, isHistoryEnabled } from "@/components/common/atoms/cryptoHistory";

const AES_MODES: { value: AesMode; label: string }[] = [
    { value: 'cbc', label: 'CBC' },
    { value: 'gcm', label: 'GCM' },
    { value: 'ecb', label: 'ECB' },
]

const AES_KEY_LENGTHS: { value: AesKeyLength; label: string }[] = [
    { value: 128, label: '128' },
    { value: 192, label: '192' },
    { value: 256, label: '256' },
]

export default function AesComponent({ lang, }: { lang: string, }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [aesKey, setAesKey] = React.useState('')
    const [aesMode, setAesMode] = React.useState<AesMode>('cbc')
    const [aesKeyLength, setAesKeyLength] = React.useState<AesKeyLength>(256)
    const [error, setError] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const [historyOpen, setHistoryOpen] = React.useState(false)
    const [history, setHistory] = useAtom(cryptoHistoryAtom)
    const [lastOperation, setLastOperation] = React.useState<'encode' | 'decode'>('encode')
    const [historyEnabled] = React.useState(() => isHistoryEnabled())

    const getErrorText = (errorCode: string): string => {
        switch (errorCode) {
            case 'input_empty':
                return transKey(lang, transCryptoErrorInput)
            case 'aes_key_length':
                return transKey(lang, transCryptoErrorAesKeyLength)
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
                tool: 'aes',
                operation: lastOperation,
                keyPreview: aesKey.substring(0, 16) + (aesKey.length > 16 ? '...' : ''),
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

    const encodeFunc = () => {
        if (!source || !aesKey) {
            setError(transKey(lang, transCryptoErrorInput))
            return
        }
        setError(null)
        setLoading(true)
        setLastOperation('encode')
        aesServerEncode(source, aesKey, aesMode, aesKeyLength)
            .then(handleResult)
            .catch(handleError)
    }

    const decodeFunc = () => {
        if (!source || !aesKey) {
            setError(transKey(lang, transCryptoErrorInput))
            return
        }
        setError(null)
        setLoading(true)
        setLastOperation('decode')
        aesServerDecode(source, aesKey, aesMode, aesKeyLength)
            .then(handleResult)
            .catch(handleError)
    }

    const generateKeyFunc = () => {
        const keyByteLength = aesKeyLength / 8
        aesServerGenerateKey(keyByteLength).then((newKey) => setAesKey(newKey))
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
        setAesKey('')
        setError(null)
    }

    return <div className={aesStyles.cryptoPage}>
        <h1 className={aesStyles.toolTitle}>{transKey(lang, transToolsAesTitle)}</h1>

        {error && <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>}

        <textarea className={aesStyles.sourceText} placeholder={
            transKey(lang, transToolsCommonInputPlaceholder)
        } value={source}
            onChange={(event) => setSource(event.target.value)} />

        <div className={aesStyles.configRow}>
            <label className={aesStyles.configLabel}>
                {transKey(lang, transToolsAesMode)}
                <select className={aesStyles.configSelect} value={aesMode}
                    onChange={(e) => setAesMode(e.target.value as AesMode)}>
                    {AES_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </label>
            <label className={aesStyles.configLabel}>
                {transKey(lang, transToolsAesKeyLength)}
                <select className={aesStyles.configSelect} value={aesKeyLength}
                    onChange={(e) => setAesKeyLength(Number(e.target.value) as AesKeyLength)}>
                    {AES_KEY_LENGTHS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
            </label>
        </div>

        <div className={aesStyles.toolButtons}>
            <Input id={'AesKeyInput'} className={aesStyles.keyInput}
                value={aesKey}
                placeholder={transKey(lang, transToolsAesKeyPlaceholder)}
                onChange={(event) => setAesKey(event.target.value)} />
            <Button size={'sm'} onClick={generateKeyFunc}>
                {transKey(lang, transToolsAesRandomKey)}
            </Button>
            <Button size={'sm'} onClick={encodeFunc} disabled={loading}>
                {loading ? transKey(lang, transCryptoButtonLoading) : transKey(lang, transToolsAesEncode)}
            </Button>
            <Button size={'sm'} onClick={decodeFunc} disabled={loading}>
                {loading ? transKey(lang, transCryptoButtonLoading) : transKey(lang, transToolsAesDecode)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
                const currentSource = source;
                setSource(output);
                setOutput(currentSource);
            }}>
                <ArrowUpDown size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={copyResult} title={transKey(lang, transToolsCopyResult)}>
                {copied ? <span className={aesStyles.copiedText}>{transKey(lang, transToolsCopied)}</span> :
                    <Copy size={16} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={clearAll} title={transKey(lang, transToolsClearAll)}>
                <Trash2 size={16} />
            </Button>
            {loading && <Loader2 size={16} className={aesStyles.spinner} />}
        </div>

        <textarea className={aesStyles.targetText} placeholder={
            transKey(lang, transToolsCommonResultPlaceholder)
        } value={output} onChange={(event) =>
            setOutput(event.target.value)} />

        {!historyEnabled
            ? <p className={aesStyles.historyDisabled}>{transKey(lang, transHistoryDisabled)}</p>
            : history.length > 0 && <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className={aesStyles.historyTrigger}>
                        <History size={14} />
                        {transKey(lang, transToolsHistoryTitle)}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className={aesStyles.historyList}>
                        {history.map((item) => (
                            <div key={item.timestamp} className={aesStyles.historyItem}>
                                <span className={aesStyles.historyOp}>
                                    {item.tool === 'aes' ? 'AES' : 'RSA'} {item.operation === 'encode' ? '🔒' : '🔓'}
                                </span>
                                <span className={aesStyles.historyKey}>{item.keyPreview}</span>
                                <span className={aesStyles.historyResult}>{item.resultPreview}</span>
                                <span className={aesStyles.historyTime}>
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

const aesStyles = {
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
    configRow: css`
        display: flex;
        flex-direction: row;
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
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        width: 100%;
    `,
    keyInput: css`
        width: 320px;
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