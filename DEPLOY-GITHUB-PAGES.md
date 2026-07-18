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
3. `git push` (CNAME e canonical già aggiornati nel repo)
4. Attendi check verde + **Enforce HTTPS**
5. Apri: **https://forzaquotidiana.it/**

---

## Sito provvisorio (prima del DNS)

https://ginocapon.github.io/forzaquotidiana/
