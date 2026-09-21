# About

Tipohiz is a sleek and customizable typing test platform designed to enhance your typing skills. Our user-friendly interface offers a variety of test modes to challenge typists of all levels. Whether you're a beginner looking to boost your typing speed or a seasoned typist aiming to break your personal record, Tipohiz offers the tools and features you need to succeed. Start your typing journey with Tipohiz today and watch your skills soar!

> **Note**
>
> -  This project is built using Nextjs <br>
> -  Inspired by MonkeyType

# Features

-  minimalistic design
-  live errors, wpm, and accuracy displays
-  punctuation and numbers modes
-  timed tests: 15 / 30 / 60 / 120 seconds
-  typing languages: English, Spanish, French (home-page selector; word lists in `modules/TextFiles/`)
-  themes and optional key sounds
-  optional accounts (credentials + Google / GitHub / Twitter) via NextAuth v5 + Prisma/MongoDB — typing works without signing in
-  config persistence in `localStorage` (Zustand persist key `userConfig`)

# Future Features

-  quotes mode
-  real-time typing challenges with other users
-  UI chrome translations (word lists are live; `lib/i18n/translations.ts` is not wired into settings/header yet)

# Local development

Package manager is **pnpm@9.12.0** (`package.json` `packageManager` field). There is no `install-all` / `install-win` script.

```bash
pnpm install          # postinstall runs prisma generate
cp .env.example .env  # required only for auth / MongoDB
pnpm prisma:push      # only if you set MONGODB_URI
pnpm dev              # http://localhost:3000
```

Typing tests run with **no env vars**. Auth needs:

| Variable | Required for |
|----------|----------------|
| `MONGODB_URI` | Prisma (MongoDB) |
| `AUTH_SECRET` | NextAuth JWT signing (`NEXTAUTH_SECRET` in `.env.example` is a leftover alias) |
| `GOOGLE_CLIENT_ID` / `SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth |
| `TWITTER_CLIENT_ID` / `SECRET` | Twitter/X OAuth |

`middleware.ts` exports NextAuth `auth` but does **not** gate routes. Anonymous use is expected.

Prisma client is generated to `prisma/generated/prisma` (`output` in `prisma/schema.prisma`). `pnpm build` runs `prisma generate && next build`.

Docker (`Dockerfile` + `docker-compose.yaml`) is npm-based and does not inject env or MongoDB — not the recommended local path. See [CONTRIBUTING.md](CONTRIBUTING.md).

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Nextjs](https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-brown?style=for-the-badge&logo=zustand&logoColor=black)
![Tailwind](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![RadixUI](https://img.shields.io/badge/radixui-161618?style=for-the-badge&logo=radixui&logoColor=white)

## Do you like to see how tipoHiZ looks like?

Use the link below:
[https://tipohiz.vercel.app/](https://tipohiz.vercel.app/)

For contributers, you merged PRs do not immediately go live. Instead, they are deployed on a preview link first and if it looks okay, they are pushed to main.
**Preview Link**: https://tipohiz-preview.vercel.app/

# Bug report or Feature request

If you encounter a bug or have a feature request, [create an issue](https://github.com/jhohannesK/tipohiz/issues),
[create a discussion thread](https://github.comjhohannesK/tipohiz/discussions) <br/>

# Want to Contribute?

-  Contributions make the open source community such an amazing place to learn, inspire, and create.
-  Any contributions you make are **truly appreciated**.

Refer to [CONTRIBUTING.md](CONTRIBUTING.md).

# Code of Conduct

Before contributing to this repository, please read the [code of conduct](CODE_OF_CONDUCT.md).

## 🛡️ License

TipoHiZ is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE](LICENSE) file for details.

# Security

To report a security vulnerability, please refer to [SECURITY.md](SECURITY.md).

## 🙏 Support

This project needs a ⭐️ from you. Don't forget to leave a star ⭐️ <br/>

Join our [discord](https://discord.gg/8Z67Fv8z)

## 💪 Thanks to all Contributors

Thanks a lot for spending your time helping TipoHiz grow. Thanks a lot! Keep on code-jamming 🍻

[![Contributors](https://contrib.rocks/image?repo=JhohannesK/TipoHiz)](https://github.com/JhohannesK/TipoHiz/graphs/contributors)

## Credits

Logo Credit - [Puneet Upadhyay](https://github.com/debianbaker) <br/>
Designs - [Kwaw Kumi Miezah](https://github.com/Kay-kwaw)
