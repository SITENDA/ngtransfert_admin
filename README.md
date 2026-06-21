This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
or NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
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



##  Command for building a clean jar after making changes
./gradlew clean bootJar

##  Turning down docker compose
sudo docker compose down -v

##  Turning up docker compose
sudo docker compose up --build


##  Stopping process running on port 5432
#   1. Best (shows process + PID)
    sudo lsof -i :5432

#   2. Alternative (very clear output)
    sudo ss -ltnp | grep 5432

##  3. Docker-specific (very common cause)
### If it’s another container:
    docker ps --format "table {{.Names}}\t{{.Ports}}"

##  Quick fix options once identified
### If it's Docker:
    docker stop <container_id>

### If it's local PostgreSQL service:
    sudo systemctl stop postgresql


##  Clean restart of Docker (database all new)
    docker compose down -v
    docker compose up --build

##  Docker restart with database reuse (PREFERRED)
    docker compose down
    docker compose up --build -d