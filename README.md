# CryptoX

一个加密小工具，支持 AES、RSA 等常见加密算法的在线加密/解密操作。

## 功能特性

- **AES 加密/解密** — 支持随机密钥生成，密钥长度 16/24/32 字节
- **RSA 加密/解密** — 支持公钥/私钥密钥对生成与加解密
- **多语言支持** — 支持英语、简体中文、繁体中文、日语、西班牙语、法语、德语、葡萄牙语
- **国际化路由** — 基于 `/[lang]` 的国际化 URL 路由

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (React 19, RSC) |
| 语言 | TypeScript 6.0.2 |
| 样式 | Tailwind CSS 4 + PandaCSS |
| UI 组件 | Radix UI + shadcn/ui (new-york style) |
| 状态管理 | Jotai |
| 加密算法 | @pnnh/atom (Node.js 服务端加密) |
| 部署 | Cloudflare Workers (@opennextjs/cloudflare) |
| 包管理 | pnpm |
| 测试 | Vitest + Testing Library |
| 日志 | Pino |

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