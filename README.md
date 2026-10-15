# YLP Coach

A pocket leadership coach for Atomberg's Young Leaders Programme alumni.
Status: design system + three reference screens (home, scenario answer, MAIN recognition card). See `docs/canon-map.md` for content coverage.

## Run locally

Needs Node 20+ and internet access (fonts load from Google Fonts).

```bash
git clone https://github.com/faisal-2302/ylp-iceberg-model.git
cd ylp-iceberg-model
git checkout claude/ylp-coach-app-7d0cll
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`.
Phone test: open `http://<your-computer-ip>:3000` on the same Wi-Fi.

## Screens built so far

- `/` home
- `/scenarios` and `/scenarios/team-is-disengaged`, `/scenarios/two-team-members-fought`
- `/do/main-card` recognition card builder (exports 1080×1350 PNG)
- `/coach` and `/learn` are placeholders
