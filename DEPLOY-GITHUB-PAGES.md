# DNS Serverplan → GitHub Pages (forzaquotidiana.it — SENZA www)

## Dominio canonico

**https://forzaquotidiana.it** (apex, niente www)

---

## Su GitHub (Settings → Pages)

1. **Custom domain:** rimuovi `www.forzaquotidiana.it` se presente.
2. Inserisci solo: **`forzaquotidiana.it`**
3. Salva → attendi **DNS check verde**.
4. Attiva **Enforce HTTPS**.

Repo: file `CNAME` contiene `forzaquotidiana.it` (allineato).

---

## Su Serverplan — SOLO questi 4 record A

Nel pannello DNS del dominio **forzaquotidiana.it**:

| Tipo | Host / Nome | Valore |
|------|-------------|--------|
| **A** | **@** (o vuoto) | **185.199.108.153** |
| **A** | **@** | **185.199.109.153** |
| **A** | **@** | **185.199.110.153** |
| **A** | **@** | **185.199.111.153** |

**Non serve** CNAME `www` se usi solo apex.

### Se esiste già un record CNAME `www`

- **Rimuovilo** oppure lascialo solo se Serverplan ti chiede un redirect:
  - `www.forzaquotidiana.it` → redirect 301 → `https://forzaquotidiana.it`  
  (opzionale: così chi digita www arriva comunque al sito)

**Non toccare record MX** (email).

Propagazione: 15 min – 48 h.

---

## Ordine operazioni

1. Serverplan → 4 record **A** su `@`
2. GitHub → Custom domain **`forzaquotidiana.it`**
3. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions** (obbligatorio dal 20/07/2026)
4. `git push` su `main` → workflow `.github/workflows/deploy-pages.yml` pubblica il sito
5. Attendi check verde + **Enforce HTTPS**
6. Apri: **https://forzaquotidiana.it/** (Ctrl+F5 se cache vecchia)

### Se non vedi le modifiche online

- Controlla **Actions** su GitHub: workflow «Deploy GitHub Pages» deve essere verde.
- Se Pages usa ancora «Deploy from branch», passa a **GitHub Actions** come sopra.
- Hard refresh: Ctrl+F5 (Windows) o svuota cache browser.

---

## Sito provvisorio (prima del DNS)

https://ginocapon.github.io/forzaquotidiana/
