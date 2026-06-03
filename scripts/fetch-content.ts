#!/usr/bin/env tsx
/**
 * Fetches structured content (jobs, projects, skills, educations, tabs)
 * from the legacy Strapi BO at `bo2.polemil.dev/graphql` and writes JSON
 * snapshots under `src/content/`. The Astro build then imports these
 * snapshots — the site stays fully static, no runtime BO dependency.
 *
 * Re-run manually (no cron) whenever the BO changes:
 *
 *     pnpm fetch-content
 *
 * Snapshots are committed to the repo so the build is reproducible without
 * network access.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BO_GRAPHQL = 'https://bo2.polemil.dev/graphql';
const LOCALES = ['fr', 'en'] as const;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'src/content');

interface GraphQLResponse<T> {
  data?: T;
  errors?: ReadonlyArray<{ message: string }>;
}

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(BO_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${json.errors.map((e) => e.message).join(' / ')}`);
  }
  if (!json.data) throw new Error('GraphQL response missing data');
  return json.data;
}

const Q_TABS =
  'query($locale: I18NLocaleCode){tabs(locale: $locale, sort: "order"){documentId order key label icon url}}';
const Q_JOBS =
  'query($locale: I18NLocaleCode){jobs(locale: $locale, sort: "dateStart"){documentId key title company dateStart dateEnd}}';
const Q_EDUCATIONS =
  'query($locale: I18NLocaleCode){educations(locale: $locale){documentId key name school city}}';
const Q_PROJECTS =
  'query($locale: I18NLocaleCode){projects(locale: $locale, pagination: { limit: 100 }, sort: "order"){documentId key name description link order}}';
const Q_SKILLS =
  'query($locale: I18NLocaleCode){skillCategories(locale: $locale){documentId key name subCategories{id name skills{documentId key name level}}}}';

const QUERIES = {
  tabs: Q_TABS,
  jobs: Q_JOBS,
  educations: Q_EDUCATIONS,
  projects: Q_PROJECTS,
  skills: Q_SKILLS,
} as const;

async function fetchAll() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    for (const [name, query] of Object.entries(QUERIES)) {
      const data = await gql<Record<string, unknown>>(query, { locale });
      const path = resolve(OUT_DIR, `${name}-${locale}.json`);
      writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
      console.info(`  ✓ ${name}-${locale}.json`);
    }
  }
}

fetchAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
