# Forza Quotidiana — Training App (Payload + Next.js)

Deploy consigliato: **Vercel** (app) + **Neon** (PostgreSQL gratis).

## 1. Database (Neon)

1. Crea un progetto su [neon.tech](https://neon.tech) (region EU consigliata).
2. Copia la connection string `postgresql://...`.

## 2. Vercel

1. [Importa il repo](https://vercel.com/new) `ginocapon/forzaquotidiana`.
2. **Root Directory:** `training-app`
3. **Environment variables** (Production + Preview):

| Variabile | Valore |
|-----------|--------|
| `DATABASE_URL` | connection string Neon |
| `PAYLOAD_SECRET` | stringa random ≥ 32 caratteri |
| `NEXT_PUBLIC_BASE_URL` | URL Vercel (es. `https://forza-training.vercel.app`) |
| `STRIPE_SECRET_KEY` | (opzionale) chiave Stripe test/live |
| `STRIPE_WEBHOOK_SECRET` | (opzionale) webhook Stripe |

4. Deploy → al primo deploy Vercel esegue `yarn payload migrate && yarn build`.

## 3. Sito statico (link Personal trainer)

Dopo il deploy, aggiorna in **`data/training-app.json`** (root repo):

```json
{
  "appBaseUrl": "https://TUO-URL.vercel.app"
}
```

Push su `main` → GitHub Pages pubblica `/personal-trainer/` con i link corretti.

## 4. Sviluppo locale

```bash
cd training-app
cp .env.example .env
docker compose up -d          # Postgres locale (porta 55432)
# DATABASE_URL=postgresql://training:training@localhost:55432/training
yarn install && yarn payload migrate && yarn dev
```

## CI

Workflow `.github/workflows/training-app.yml` — build di verifica su ogni push che tocca `training-app/`.
