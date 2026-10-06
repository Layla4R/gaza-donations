# 4Relief

Standalone Next.js 14 application. Source, dependencies, build output, deployment and environment configuration belong to this application.

## Run

Copy .env.example to .env.local, configure credentials, then run:

```sh
npm ci
npm run dev
```

Development port: 3000. Production: npm run build, then npm start. Production output uses .next-production so an existing development server cannot overwrite it.

## Data

The server uses the fixed public Supabase schema. Host headers and SITE_ID cannot switch schemas or site identity. Only this application's schema is accessed.

Use a separate signing secret and payment/webhook credentials. Secrets are not included in this project. The original database has not been migrated or modified by this source separation.
