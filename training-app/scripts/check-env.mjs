#!/usr/bin/env node
/**
 * Valida .env prima di migrate/dev — evita "Invalid URL" opachi da pg.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

function fail(msg) {
  console.error(`\n❌ ${msg}\n`)
  process.exit(1)
}

if (!existsSync(envPath)) {
  fail('Manca .env — esegui: copy .env.example .env  poi compila DATABASE_URL e PAYLOAD_SECRET.')
}

const raw = readFileSync(envPath, 'utf8')
const vars = {}
for (const line of raw.split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i === -1) continue
  vars[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const db = vars.DATABASE_URL
if (!db) {
  fail(
    'DATABASE_URL è vuoto.\n' +
      'Supabase → Settings → Database → Connection string → URI → Direct (5432).\n' +
      'Incolla la stringa intera in .env (senza virgolette, senza [PASSWORD]).',
  )
}

if (/[\[\]]/.test(db)) {
  fail('DATABASE_URL contiene [ ] — sostituisci con password reale da Supabase.')
}

if (/REPLACE|YOUR-PASSWORD|xxxxxxxx/i.test(db)) {
  fail('DATABASE_URL contiene ancora un placeholder — incolla la URI dalla dashboard Supabase.')
}

try {
  const u = new URL(db)
  if (!['postgresql:', 'postgres:'].includes(u.protocol)) {
    fail(`DATABASE_URL deve iniziare con postgresql:// — trovato: ${u.protocol}`)
  }
} catch {
  fail(
    'DATABASE_URL non è un URL valido.\n' +
      'Cause comuni: password con @ # : non codificata, virgolette intorno alla stringa, spazi.\n' +
      'Codifica URL password: https://www.urlencoder.org/',
  )
}

const secret = vars.PAYLOAD_SECRET
if (!secret || secret.length < 32) {
  fail('PAYLOAD_SECRET mancante o < 32 caratteri. Esempio: una frase lunga o 32+ caratteri random.')
}

if (vars.NEXT_PUBLIC_BASE_URL && /STRIPE_|DATABASE_|PAYLOAD_/i.test(vars.NEXT_PUBLIC_BASE_URL)) {
  fail(
    'NEXT_PUBLIC_BASE_URL attaccato ad altra riga nel .env (manca a capo).\n' +
      'Esegui: .\\fix-env.ps1  oppure riscrivi .env con una variabile per riga.',
  )
}

if (Object.keys(vars).some((k) => k.includes('=') || k.startsWith('http'))) {
  fail('.env malformato — ogni variabile deve essere su una riga: NOME=valore')
}

console.log('✅ .env OK — puoi eseguire: corepack yarn payload migrate')
