# COAGPT prototype

Klikbaar prototype van COAGPT: de intake als gesprek, de eerste taak samen, en een persoonlijke werkruimte per functie. Gebouwd op de tokens en componenten van het Shelter design system (v2.1.0, mxds.nl).

Het prototype staat achter een inlog met één gedeelde toegangscode.

## Wat zit erin

| Pad | Wat |
| --- | --- |
| `public/index.html` | Het prototype (één bestand, geen build nodig) |
| `public/login.html` | Inlogpagina in Shelter-stijl |
| `middleware.js` | Stuurt iedereen zonder geldige sessie naar `/login` |
| `api/login.js` | Controleert de toegangscode en zet een ondertekende cookie (7 dagen) |
| `api/logout.js` | Logt uit |

## Online zetten via Vercel

1. Zet deze map in een Git-repository (GitHub, GitLab, Bitbucket of Azure DevOps via GitHub-mirror) en push.
2. Kies in Vercel **Add New › Project** en importeer de repository. Framework preset: **Other**. Build- en install-instellingen mag je leeg laten.
3. Ga naar **Settings › Environment Variables** en zet:
   - `PROTOTYPE_PASSWORD`: de toegangscode die je met testers deelt
   - `AUTH_SECRET`: een lange willekeurige string, bijvoorbeeld de uitvoer van `openssl rand -hex 32`
4. Deploy opnieuw (Deployments › Redeploy), want environment variables gelden pas na een nieuwe deploy.
5. Deel de link en de toegangscode apart van elkaar.

Toegang intrekken: verander `PROTOTYPE_PASSWORD` en `AUTH_SECRET` en deploy opnieuw. Alle bestaande sessies vervallen dan.

## Lokaal draaien

```bash
npm install
npx vercel dev
```

Zet de twee variabelen dan in een `.env.local` (zie `.env.example`).

## Goed om te weten

- Dit is een eenvoudige afscherming voor een prototype, geen vervanging voor Entra. Er is één gedeelde code en geen limiet op het aantal pogingen.
- Pagina's worden niet geïndexeerd door zoekmachines (`X-Robots-Tag: noindex`).
- De inhoud (rollen, taken, e-learnings, documenten) is voorbeeldinhoud. Waar echte gegevens horen staan placeholders zoals `[locatie]`.
- De koppen gebruiken `Supreme` als dat lettertype op het apparaat staat, anders Noto Sans. Supreme wordt niet meegeleverd zolang de licentie niet is uitgezocht.
- Beweging gebruikt prototype-tokens (`--sh-motion-*`, `--sh-ease-*` in `public/index.html`), omdat de motion-richtlijnen van Shelter op mxds.nl achter een inlog staan. Vervang ze door de officiële waarden zodra die bekend zijn. Met `prefers-reduced-motion` staat alle beweging uit, behalve laadindicatoren.
