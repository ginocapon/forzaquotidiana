# Forza Quotidiana — Training App (Payload + Next.js)

Deploy consigliato: **Vercel** (app) + **Supabase** (PostgreSQL — stesso ecosistema di righettoimmobiliare.it).

## Progetto Supabase da riusare

| | |
|---|---|
| Dashboard | https://supabase.com/dashboard/project/ieeriszlalrsbfsnarih |
| Project ref | `ieeriszlalrsbfsnarih` |
| API URL | `https://ieeriszlalrsbfsnarih.supabase.co` |
| Uso precedente | raasautomazioni (non più necessario) |
| Nuovo uso | DB Postgres per Payload (`training-app/`) |

Riferimento anche in `data/supabase-forza-training.json` (root repo).

## 1. Recuperare il progetto Supabase (dashboard — 5 min)

1. Apri la [dashboard del progetto](https://supabase.com/dashboard/project/ieeriszlalrsbfsnarih).
2. **Password DB dimenticata?**  
   *Project Settings → Database → Reset database password* → salva la nuova password.
3. **Pulizia dati raasautomazioni** (solo Postgres per Payload; Auth/Storage Supabase non servono all’app):
   - *SQL Editor* → esegui:

```sql
-- ATTENZIONE: cancella tutte le tabelle nello schema public
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

   - In alternativa, elimina manualmente le tabelle da *Table Editor*.
4. **Connection string** → *Project Settings → Database → Connection string*:
   - Scegli **URI**
   - Per **Vercel/serverless**: usa **Transaction pooler** (porta **6543**, `?pgbouncer=true`)
   - Per **migrate locale**: puoi usare **Direct** (porta **5432**)
5. Copia la stringa in `DATABASE_URL` (sostituisci `[YOUR-PASSWORD]`).

Payload usa **solo Postgres** — non serve configurare Supabase Auth, Realtime o Storage per questa app.

## 2. Vercel (app Node)

1. [Importa il repo](https://vercel.com/new) `ginocapon/forzaquotidiana`.
2. **Root Directory:** `training-app`
3. **Environment variables** (Production):

| Variabile | Valore |
|-----------|--------|
| `DATABASE_URL` | URI pooler Supabase (porta 6543) |
| `PAYLOAD_SECRET` | stringa random ≥ 32 caratteri |
| `NEXT_PUBLIC_BASE_URL` | URL Vercel (es. `https://forza-training.vercel.app`) |
| `STRIPE_SECRET_KEY` | (opzionale) |
| `STRIPE_WEBHOOK_SECRET` | (opzionale) |

4. Deploy → `yarn payload migrate && yarn build` creano le tabelle Payload da zero sul DB pulito.

## 3. Sito statico (link Personal trainer)

Aggiorna `data/training-app.json` → `appBaseUrl` con l’URL Vercel. Push su `main` → GitHub Pages aggiorna `/personal-trainer/`.

## 4. Sviluppo locale

```bash
cd training-app
cp .env.example .env
# DATABASE_URL = URI Supabase (direct 5432) oppure Docker locale:
# docker compose up -d
# DATABASE_URL=postgresql://training:training@localhost:55432/training
yarn install && yarn payload migrate && yarn dev
```

## CI

`.github/workflows/training-app.yml` — build con Postgres effimero su GitHub Actions (non usa il progetto Supabase in CI).
