This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Windows
If you already have Node.js installed and next.js installed, you can
skip the following steps.

#### Install option 1 (via UI)
Navigate to the `start_server/windows` directory and right click on
`run_server.bat` and select `Run as administrator`.

You will only need to run as administrator if you are running this for the
first time.

#### Install option 1 (via CLI)
Open a command prompt or powershell window with admin privileges, navigate
to the root directory of the project and run the following command:

```bash
.\start_server\windows\run_server.bat
```

You will only need to run as administrator if you are running this for the
first time.

#### Run server

See either the UI or CLI instructions above.

### Linux / MacOS

If you already have Node.js installed and next.js installed, you can
skip the install steps.

#### Install

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Make sure you have next.js installed:

```bash
npm install next
```
#### Run server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
