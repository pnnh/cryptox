# CryptoX

一个加密小工具，支持 AES、RSA 等常见加密算法的在线加密/解密操作。

## 功能特性

- **AES 加密/解密** — 支持随机密钥生成，密钥长度 16/24/32 字节
- **RSA 加密/解密** — 支持公钥/私钥密钥对生成与加解密
- **Base64 编码/解码** — 文本 Base64 编码与解码
- **Base32 编码/解码** — 文本 Base32 编码与解码
- **SHA256/SHA512 哈希** — 文本哈希编码
- **MD5 哈希** — 文本 MD5 编码
- **多语言支持** — 支持英语、简体中文、繁体中文、日语、西班牙语、法语、德语、葡萄牙语
- **深色/浅色主题** — 支持自动、深色、浅色主题切换
- **国际化路由** — 基于 `/[lang]` 的国际化 URL 路由

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (React 19, RSC) |
| 语言 | TypeScript 6 |
| 样式 | Tailwind CSS 4 + PandaCSS |
| UI 组件 | Radix UI + shadcn/ui (new-york style) |
| 状态管理 | Jotai |
| 加密算法 | @pnnh/atom (Node.js 服务端加密) |
| 部署 | Cloudflare Workers (@opennextjs/cloudflare) |
| 包管理 | pnpm |
| 测试 | Vitest + Testing Library |
| 日志 | Pino |

## 项目结构

```
cryptox/
├── config/                   # 环境配置
│   └── host.env              # 主机环境变量
├── public/                   # 静态资源
│   ├── icons/                # 图标 (favicon 等)
│   └── images/               # 图片资源
├── src/
│   ├── app/                  # Next.js App Router 页面
│   │   ├── [lang]/           # 国际化路由
│   │   │   ├── page.tsx      # AES 工具首页
│   │   │   └── rsa/          # RSA 工具页面
│   │   │       └── page.tsx
│   │   ├── global.css        # 全局样式
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 默认首页 (AES)
│   │   └── not-found.tsx     # 404 页面
│   │   └── global-error.tsx  # 全局错误处理
│   ├── components/
│   │   ├── aes/              # AES 加密组件
│   │   │   ├── aes.tsx       # AES 客户端交互组件
│   │   │   └── server.ts     # AES 服务端加密逻辑
│   │   ├── rsa/              # RSA 加密组件
│   │   │   ├── client.tsx    # RSA 客户端交互组件
│   │   │   └── server.ts     # RSA 服务端加密逻辑
│   │   ├── client/           # 客户端组件
│   │   │   ├── config/       # 客户端配置
│   │   │   ├── content/      # 客户端内容 (Provider, Search)
│   │   │   ├── tools/        # 客户端工具逻辑
│   │   │   ├── cookie.ts     # Cookie 操作
│   │   │   ├── theme.ts      # 主题切换
│   │   │   └── logger.ts     # 客户端日志
│   │   ├── common/           # 公共模块
│   │   │   ├── config.ts     # 浏览器配置接口
│   │   │   ├── language.tsx  # 语言支持与路由
│   │   │   ├── locales/      # 国际化翻译文本
│   │   │   ├── models/       # 数据模型 (account, tool, channel 等)
│   │   │   ├── protocol/     # 协议定义
│   │   │   └── theme.ts      # 主题定义
│   │   │   └── error.ts      # 错误处理
│   │   ├── server/           # 服务端组件
│   │   │   ├── config/       # 服务端配置与存储
│   │   │   ├── content/      # 服务端布局 (Navbar)
│   │   │   ├── cookie.ts     # 服务端 Cookie
│   │   │   ├── theme.ts      # 服务端主题
│   │   │   └── pathname.ts   # 路径名获取
│   │   │   └── logger.ts     # 服务端日志
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── alert.tsx
│   │   ├── utils/            # 工具函数
│   │   │   ├── page.ts       # 页面工具
│   │   │   └── path.ts       # 路径工具
│   │   ├── widget/           # 业务组件
│   │   │   ├── icons/        # 自定义图标
│   │   │   ├── empty.tsx     # 空状态
│   │   │   ├── loading.tsx   # 加载状态
│   │   │   ├── NoData.tsx    # 无数据状态
│   │   │   ├── pagination.tsx # 分页
│   │   │   └── image.tsx     # 图片组件
│   ├── gen/                  # PandaCSS 生成代码
│   │   └── styled/           # 样式类型定义
│   ├── lib/
│   │   └── utils.ts          # 通用工具函数
│   └── types/                # 类型定义
│       ├── types.d.ts        # 全局类型
│       └── css.d.ts          # CSS 类型
├── Dockerfile                # Docker 构建配置
├── components.json           # shadcn/ui 配置
├── next.config.mjs           # Next.js 配置
├── panda.config.ts           # PandaCSS 配置
├── postcss.config.mjs        # PostCSS 配置
├── open-next.config.ts       # OpenNext Cloudflare 配置
├── wrangler.jsonc            # Cloudflare Wrangler 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 项目依赖与脚本
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (端口 7111, Turbo 模式)
pnpm next

# PandaCSS 样式代码生成 (监听模式)
pnpm panda

# 构建生产版本
pnpm build
```

## 部署

### Docker 部署

```bash
docker build -t cryptox .
docker run -p 7100:7100 cryptox
```

### Cloudflare Workers 部署

```bash
# 构建 Cloudflare 适配器
pnpm adapter

# 本地预览
pnpm preview

# 部署到 Cloudflare
wrangler deploy
```

## 脚本说明

| 命令 | 说明 |
|------|------|
| `pnpm next` | 开发服务器 (端口 7111, --turbo) |
| `pnpm build` | PandaCSS 代码生成 + Next.js 构建 |
| `pnpm panda` | PandaCSS 监听模式代码生成 |
| `pnpm adapter` | Next.js 构建 + Cloudflare 适配 |
| `pnpm preview` | Cloudflare Workers 本地预览 |

## 架构设计

项目采用 **React Server Components (RSC)** 架构，加密运算通过 Server Actions 在服务端完成：

- 客户端组件 (`'use client'`) 负责 UI 交互与状态管理
- 服务端组件 (`'use server'`) 通过 `@pnnh/atom/nodejs` 执行加密/解密运算
- Jotai Provider 在根布局注入，管理客户端全局状态
- 国际化通过 URL 路径前缀 `/[lang]` 实现，支持 8 种语言

## 许可证

[GNU Affero General Public License v3.0](LICENSE)