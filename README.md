This is a customised fork of [DMS-UI](https://github.com/overture-stack/dms-ui) from [Overture](https://www.overture.bio/), a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Feature flags

This is a simplified list of the available functionalities in this app,

| Variable Name                   | Default | Description                                                         |
| ------------------------------- | ------- | ------------------------------------------------------------------- |
| NEXT_PUBLIC_ENABLE_DOWNLOADS    | false   | Enables downloading data at "Exploration" and "Data Releases" pages |
| NEXT_PUBLIC_ENABLE_LOGIN        | false   | Allows submitters to login                                          |
| NEXT_PUBLIC_ENABLE_REGISTRATION | false   | Allows new submitters to register                                   |
