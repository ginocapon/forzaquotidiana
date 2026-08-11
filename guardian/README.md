# Forza Quotidiana — Premortem Guardian

Entry point unico per controlli, premortem e report del sito.

## Comandi

```bash
node guardian/scripts/guardian.mjs init
node guardian/scripts/guardian.mjs doctor
node guardian/scripts/guardian.mjs run
node guardian/scripts/guardian.mjs run --job weekly_strategy
```

## Obiettivo

Crescita **newsletter** (PDF scheda gratuita), integrità tecnica, SEO e contenuti allenamento/diario — non lead immobiliari.

## Documentazione

- `docs/GUARDIAN-INTEGRATION.md` — analisi architettura e piano
- `guardian/skill/SKILL.md` — skill operativa agente
- `guardian/sequences/master-sequence.md` — sequenza cognitiva

## Cron

Schedula sempre lo stesso comando (`run`). Il dispatcher in `config/cron-matrix.yaml` decide quali job eseguire.
