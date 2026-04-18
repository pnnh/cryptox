import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {headers} from "next/headers";
import {getTargetLang, langEnUS} from "@/components/common/language";
import {css} from "@/gen/styled/css";
import AesComponent from "@/components/aes/aes";

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = getTargetLang(acceptLang, langEnUS)

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}>

        <div className={pageStyles.pageContainer}>
            <AesComponent lang={lang}/>
        </div>
    </ContentLayout>
}

const pageStyles = {
    pageContainer: css`
        max-width: 960px;
        width: 100%;
        margin: 0 auto;
        padding: 0 1rem;
    `
}
