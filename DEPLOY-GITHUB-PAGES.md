# GitHub Pages — forzaquotidiana.it

Repo: https://github.com/ginocapon/forzaquotidiana (privato)

## 1. Attiva Pages su GitHub (2 minuti)

1. Apri: https://github.com/ginocapon/forzaquotidiana/settings/pages  
2. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** · cartella **/ (root)**
3. Salva.
4. Attendi 1–3 minuti: compare l’URL temporaneo  
   `https://ginocapon.github.io/forzaquotidiana/` (solo finché non colleghi il dominio).

## 2. Dominio custom

1. Sempre in **Settings → Pages → Custom domain**  
2. Inserisci: **`www.forzaquotidiana.it`**  
3. Attendi check DNS verde.
4. Attiva **Enforce HTTPS** (compare dopo propagazione DNS).

Il file `CNAME` in repo contiene già `www.forzaquotidiana.it`.

## 3. DNS su Serverplan (solo record web — non toccare MX email)

Nel pannello DNS del dominio **forzaquotidiana.it**:

### Record obbligatorio per www

| Tipo  | Nome | Valore              |
|-------|------|---------------------|
| CNAME | www  | ginocapon.github.io |

### Apex (forzaquotidiana.it senza www) — consigliato

**Opzione A — Redirect** (più semplice): nel pannello Serverplan reindirizza  
`forzaquotidiana.it` → `https://www.forzaquotidiana.it`

**Opzione B — Record A** (apex diretto su GitHub):

| Tipo | Nome | Valore           |
|------|------|------------------|
| A    | @    | 185.199.108.153  |
| A    | @    | 185.199.109.153  |
| A    | @    | 185.199.110.153  |
| A    | @    | 185.199.111.153  |

Poi in GitHub Custom domain puoi usare `forzaquotidiana.it` e aggiornare `CNAME` in repo.

Propagazione DNS: da pochi minuti a 24–48 ore.

## 4. Dopo ogni modifica al sito

```powershell
cd c:\Users\Utente\progetti\forzaquotidiana
git add .
git commit -m "Aggiornamento sito"
git push
```

GitHub Pages si aggiorna da solo in 1–2 minuti.

## 5. Verifica

- https://www.forzaquotidiana.it/
- https://ginocapon.github.io/forzaquotidiana/ (fallback)
