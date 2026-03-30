# Mighty Mini Missions

**Purpose**: a *screen-to-world launcher* for Max — tap once, pick a mission, then go play.

## Publish to GitHub + Netlify

### 1) Create a GitHub repo and push this folder
From `mighty-mini-missions/`:

```bash
git init
git add .
git commit -m "Initial Mighty Mini Missions app"
git branch -M main
git remote add origin https://github.com/<your-username>/mighty-mini-missions.git
git push -u origin main
```

### 2) Connect in Netlify
1. Go to [Netlify](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
2. Choose **GitHub** and select `mighty-mini-missions`.
3. Build settings:
   - **Base directory**: *(leave blank)*
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`
4. Click **Deploy site**.

### 3) Open from any device
- Netlify gives you a URL like: `https://mighty-mini-missions-xyz.netlify.app`
- Open that URL on phone/tablet/computer.
- Optional: in Netlify, set a custom subdomain (Site settings -> Domain management) so it is easier to remember.

### Important note about image generation
- The app deploys as a static site on Netlify.
- The "Generate Illustration" button uses `/api/image`, which currently exists only in `server/server.js` for local use.
- On Netlify, core mission features work normally; illustration generation will show the fallback message unless you later add a Netlify Function.

## Run it

### Option A (recommended): run the local app server (also enables image generation)
This serves the app **and** (optionally) exposes `/api/image` for safe AI image generation (API key stays on the server).

From the `mighty-mini-missions/server/` folder:

```bash
npm install

# Create mighty-mini-missions/server/.env with your OpenAI key:
#   OPENAI_API_KEY=...
#   PORT=8787

npm run dev
```

Then open:
- `http://localhost:8787/`

### Option B: run a tiny static server (no image generation)
This makes sure `missions.json` loads correctly on all browsers.

From the `mighty-mini-missions/` folder:

```bash
python3 -m http.server 8787
```

Then open:
- `http://localhost:8787/`

### Option C: open `index.html` directly
You can double-click `index.html`. If your browser blocks loading `missions.json` under `file://`, the app will automatically fall back to the built-in `missions-data.js`.

## How to use
- **Mission now**: picks one mission immediately.
- **Give me 2 choices**: shows two options so Max can choose (bounded choice).
- **Quick picks**: jump straight to a category.
- **Try #2 (easier)**: automatically offers an easier mission in the same category (or an “easier remix” if needed).
- **🔊**: reads the mission aloud (turn on in Settings).
- **☆ / ★**: favorites (stored locally on this device only).
- **Print**: printable “Mission Deck” (no-device backup).

## Edit / add missions
Edit `missions.json` (preferred). Refresh the page.

Each mission looks like:

```json
{
  "id": "unique-id-here",
  "category": "build",
  "difficulty": "easy",
  "minutes": "10–20",
  "title": "Mission title",
  "prompt": "What to do…",
  "materials": ["..."],
  "steps": ["..."],
  "siblingStation": "Optional parallel station for littles."
}
```

### Categories
Use one of:
- `build`
- `phonics`
- `math`
- `nature`
- `social`
- `responsibility`

### Difficulty
Use one of:
- `easy`
- `medium`
- `hard`

### Optional templates (for variety)
You can use:
- `{{SOUND}}`, `{{LETTER}}`, `{{N1}}`, `{{N2}}`

These pull from `templateVariables` at the bottom of `missions.json`.

## Design constraints (on purpose)
- No streaks, no leaderboards, no “you missed a day” vibes.
- The goal metric is **time spent off-screen** and **willing re-tries**.

