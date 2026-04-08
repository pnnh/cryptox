import React, {CSSProperties} from "react";
import {css} from "@/gen/styled/css";
import {transTodo} from "@/components/common/locales/normal";
import {getPathname} from "@/components/server/pathname";
import {pageTitle} from "@/components/utils/page";

export async function SiteNavMenu({lang, searchParams}: {
    lang: string,
    searchParams: Record<string, string>
}) {
    const pathname = await getPathname()

    const siteLinks = [
        {name: pageTitle(lang), href: `/${lang}`},
    ]
    return <div className={styles.siteNavMenu}>
        <div className={styles.roleButtonContainer}>
            {
                siteLinks.map((link) => {
                    let style: CSSProperties = {}
                    if (pathname === link.href) {
                        style = {
                            color: '#4A95DD',
                        }
                    }
                    return <a key={link.name} className={styles.siteLink} style={style} href={link
                        .href}>{link.name}</a>
                })
            }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C6C6C6">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
        <ArticleNavbar pathname={pathname} lang={lang}/>
    </div>
}

function ArticleNavbar({lang, pathname}: {
    lang: string, pathname: string
}) {
    const homeUrl = `/${lang}`
    const navLinks = [
        {name: transTodo("AES"), href: homeUrl},
        {name: transTodo("RSA"), href: `${homeUrl}/rsa`},
    ]
    return <>
        {navLinks.map((link) => {
            let style: CSSProperties = {}
            if (link.href === pathname || (pathname.startsWith(link.href) && link.href !== homeUrl)) {
                style = {
                    color: '#4A95DD',
                }
            }
            return <a key={link.name} className={styles.navLink} style={style} href={link.href}>{link.name}</a>
        })}
    </>
}


const styles = {
    siteNavMenu: css`
        display: none;
        @media screen and (min-width: 48rem) {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.25rem;
        }
    `,
    selectorBox: css`
        border: solid 1px var(--border-color);
        border-radius: 8px;
        background: var(--background-color);
        display: flex;
        flex-direction: column;
        gap: 0;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    `,
    navLink: css`
        color: var(--text-secondary-color);
        text-decoration: none;
        font-size: 0.9rem;
        padding: 4px 10px;
        border-radius: 6px;
        transition: color 0.2s ease, background-color 0.2s ease;

        &:hover {
            color: var(--text-primary-color);
            background-color: var(--action-hover-color);
        }
    `,
    navLinkInBox: css`
        color: var(--text-primary-color);
        padding: 8px 16px;
        text-decoration: none;
        font-size: 0.95rem;
        border-bottom: solid 1px var(--divider-color);
        transition: background-color 0.15s ease;

        &:hover {
            background-color: var(--action-hover-color);
        }

        &:last-child {
            border-width: 0;
        }
    `,
    roleButtonContainer: css`
        display: flex;
        flex-direction: row;
        gap: 4px;
        justify-content: center;
        align-items: center;
    `,
    siteLink: css`
        text-decoration: none;
        color: var(--text-primary-color);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        padding: 4px 10px;
        border-radius: 6px;
        transition: color 0.2s ease, background-color 0.2s ease;

        &:hover {
            background-color: var(--action-hover-color);
        }
    `,
    toolsLink: css`
        text-decoration: none;
        color: var(--text-secondary-color);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 400;
        padding: 4px 10px;
        border-radius: 6px;
        transition: color 0.2s ease, background-color 0.2s ease;

        &:hover {
            color: var(--text-primary-color);
            background-color: var(--action-hover-color);
        }
    `,
};
