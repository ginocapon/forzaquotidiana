# DNS Serverplan → GitHub Pages (forzaquotidiana.it)

## IMPORTANTE — repo Private

GitHub **non attiva Pages** su repo **Private** con account gratuito.  
Messaggio: *"Upgrade or make this repository public to enable Pages"*.

**Soluzione consigliata (gratis):** rendi il repo **Public**  
https://github.com/ginocapon/forzaquotidiana/settings  
→ in fondo **Danger Zone** → **Change visibility** → Public  

(Il sito è già pubblico sul web; il codice HTML non è segreto.)

**Alternativa:** GitHub Pro a pagamento e resti Private.

---

## Dove vanno i DNS (non su GitHub)

| Dove | Cosa inserisci |
|------|----------------|
| **Serverplan** (pannello DNS dominio) | Record A e CNAME (tabella sotto) |
| **GitHub** Settings → Pages → Custom domain | Solo testo: `www.forzaquotidiana.it` |

GitHub **non** ha un campo per IP o record DNS — solo il nome dominio, **dopo** che Pages è attivo.

---

## Record DNS da inserire su Serverplan

Copia questi (standard ufficiale GitHub Pages):

### Sottodominio www (obbligatorio per iniziare)

| Tipo | Host / Nome | Valore / Punta a | TTL |
|------|-------------|------------------|-----|
| **CNAME** | **www** | **ginocapon.github.io** | 3600 (o default) |

### Dominio root forzaquotidiana.it (senza www)

| Tipo | Host / Nome | Valore | TTL |
|------|-------------|--------|-----|
| **A** | **@** (o vuoto) | **185.199.108.153** | 3600 |
| **A** | **@** | **185.199.109.153** | 3600 |
| **A** | **@** | **185.199.110.153** | 3600 |
| **A** | **@** | **185.199.111.153** | 3600 |

Se Serverplan permette **solo un redirect** per `@`, usa:  
`forzaquotidiana.it` → redirect 301 → `https://www.forzaquotidiana.it`  
e tieni solo il CNAME `www`.

---

## Ordine operazioni (corretto)

1. **Repo Public** (o Pro) → attiva Pages: branch **main**, cartella **/**  
   https://github.com/ginocapon/forzaquotidiana/settings/pages  

2. **Serverplan** → inserisci record DNS sopra (NON toccare MX email).

3. **GitHub Pages** → Custom domain: `www.forzaquotidiana.it` → attendi check verde.

4. Attiva **Enforce HTTPS**.

5. Verifica: https://www.forzaquotidiana.it/

Propagazione DNS: 15 min – 48 h.

---

## Cosa NON modificare su Serverplan

- Record **MX** (email)
- Record **mail.** / SPF se usi posta
- Altri servizi già attivi sul dominio

Solo record **A/CNAME** per il sito web.
