This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Windows

If you already have Node.js installed and next.js installed, you can
skip the following steps.

#### Install option 1 via script (using file explorer)

Navigate to the `start_server/windows` directory and right click on
`run_server.bat` and select `Run as administrator`.

You will only need to run as administrator if you are running this for the
first time.

#### Install option 2 via script (using cmd / terminal)

Open a command prompt or powershell window with admin privileges, navigate
to the root directory of the project and run the following command:

```bash
.\start_server\windows\run_server.bat
```

You will only need to run as administrator if you are running this for the
first time.

#### Run server

See either option 1 or option 2 instructions above.

### Linux / MacOS

If you already have Node.js installed and next.js installed, you can
skip the install steps.

#### Install option 1 via script

Open a terminal and navigate to the root directory of the project and run the
following command:

```bash
.\start_server\mac_or_linux\run_server.sh
```

#### Install option 2 manual Install

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22.14.0
nvm use 22.14.0
```

Navigate to the root directory of the project and run the following command:

```bash
npm install
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

Or run the server with the script:

```bash
.\start_server\mac_or_linux\run_server.sh
```

### Use the app (once the server is running)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Iterate on the app

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
