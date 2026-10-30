# Audit-Fixes

Ergebnis des Ponytail-Audits vom 2026-10-30. Die Punkte werden der Reihe nach abgearbeitet und abgehakt.

- [x] **1. Import ohne `sections` stürzt ab** – `src/lib/sanitize.ts` `normalizeResume`: Standardwerte für `sections` und `headings` setzen.
- [x] **2. Fehler/Laden unsichtbar** – `Preview.tsx`, `Form/index.tsx`: `isLoading`/`isError` anzeigen, `isError` zurücksetzen, alte Blob-URL freigeben, Fehler beim LaTeX-Download melden.
- [x] **3. Kaputte Import-Datei sperrt Generator** – `src/pages/index.tsx`, `Form/index.tsx`: Datei prüfen (gültiges JSON-Objekt), sonst Meldung. *Gemeinsame Prüfung: `parseResume` in `sanitize.ts`.*
- [x] **4. Keine Tests, CI baut nicht** – Test für alle 9 Vorlagen (Sonderzeichen, fehlende `sections`), `npm test` + `npm run build` in CI. *`src/lib/templates/templates.test.ts` mit `node:test` + `tsx`. Der Test fand einen neuen Fehler: Vorlage 2 und 3 schrieben `undefined` ins PDF, wenn ein Job keine Stichpunkte hat (behoben). Die Testdatei ist aus `tsconfig` ausgenommen, weil TypeScript 4.5 / `@types/node` 16 `node:test` nicht kennen.*
- [x] **5. GET auf API hängt** – `src/pages/api/generate-source.ts`: `res.status(405).end()`.
- [x] **6. Vorlage 6 macht geschützte Zeichen kaputt** – `template6.ts`: `\MakeUppercase{…}` statt `toUpperCase()`. *Im Test abgesichert (`/\\TEXT/`).*
- [x] **7. Datenschutz-Hinweis fehlt** – README + Startseite: Daten gehen zum Kompilieren an latex.ytotech.com.
- [x] **8. Abschnitts-Weiche 9× kopiert** – eine gemeinsame `renderSections` in `src/lib/templates`. *Eigene Datei `sections.ts`, weil `index.ts` die Vorlagen importiert (sonst Import-Kreis). Vorlagen 5, 7, 8 übergeben `profileSection: () => ''`, weil sie das Profil im Vorspann setzen. LaTeX-Ausgabe vorher/nachher für 30 Fälle byte-gleich.*
- [ ] **9. `getTemplateData` als 150-Zeilen-Switch** – Tabelle statt Switch, Konstanten entfallen.
- [ ] **10. Toter Code** – `atoms/progress.ts`, `TEMPLATE10`, `NEWLINE`, `FormState`, `interface Resume`, `prettyDoc`-Rest.
- [ ] **11. Griff-Symbole ohne Funktion** – `Sidebar.tsx`, `Highlights.tsx`: entfernen.
- [ ] **12. `/about`-Link führt auf 404** – `src/pages/index.tsx`: entfernen.
- [ ] **13. Jedes MAKE lädt alle Schriften hoch** – `src/lib/latex.ts`: Ressourcen per URL, falls die ytotech-API das kann.

(Audit-Fund „Blob-URLs werden nie freigegeben“ ist Teil von Punkt 2.)

## Nicht geprüft
- Vorlagen 3–9 nur gezielt durchsucht; `.cls`/`.sty`, `core/*`, `theme/*`, `Keywords.tsx` nicht gelesen.
- Ob geschützte Zeichen in `\href{…}` (`\_`, `\textasciitilde{}`) Links kaputt machen.
- Ob `<`, `>`, `|` in pdflatex-Vorlagen ohne `T1` falsche Zeichen zeigen.
- Ob `@types/react` 17 mit React 18 durch `next build` geht.
