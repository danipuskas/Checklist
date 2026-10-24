FLIGHT CHECKLISTS – OFFLINE SETUP (about 10 minutes, once)

1. Unzip this file in the Files app (tap it once).
2. Sign in or sign up at github.com in Safari.
3. Tap + > New repository. Give it a name (e.g. checklists), set it to Public, create it.
4. Tap "uploading an existing file" and add every file from the unzipped folder:
   index.html, airports.js, sw.js, manifest.webmanifest, icon-180.png, icon-192.png, icon-512.png,
   and the lib folder (pdf.js and pdf.worker.js, used to read the LIDO package).
   Tap Commit changes.
5. In the repository: Settings > Pages > Source: Deploy from a branch > Branch: main, folder / (root) > Save.
6. After a minute or two the page shows your address, e.g. https://yourname.github.io/checklists/
7. Open that address in Safari > Share > Add to Home Screen (keep "Open as Web App" on).
8. Open it once from the Home Screen while online. From then on it works offline.

Your checklists are stored on the iPad, not on GitHub. The files on GitHub are only the empty app.
Deleting the Home Screen icon deletes its data, so use Menu > Back up now and then.

UPDATING LATER: in the repository tap Add file > Upload files, upload the new files over the old ones and commit.
The installed app downloads the new version in the background while it's open and online, then shows
an Update button at the top left. Tap it to switch now; otherwise the new version is used the next time the app starts.

ONLINE BACKUP (optional): Menu > Settings > Online backup copies everything to a PRIVATE GitHub repository
while the app is open and online. You need a private repository and a fine-grained access token
limited to that repository with Contents: Read and write. The steps are shown in the app.

BRIEFING: Menu > New flight > Load the OFP opens the LIDO package PDF from Files. It fills in the flight
(From, To, alternates and their diversion times, ETD, scheduled arrival as ETA, call sign, TOD countdown)
and Menu > Briefing shows the NOTAMs for departure, destination, alternates and en-route airports, the
SIGMETs on your route, company alerts and the package weather. The PDF is read on the iPad; nothing is sent anywhere.
The NOTAMs that matter for your times and runways come first. The rest are folded, never hidden.

LIVE WEATHER (optional): Menu > Briefing can also show live METAR, TAF (aviationweather.gov) and US D-ATIS (atis.info)
through a small free Cloudflare Worker you create once. Paste weather-relay-worker.js into a new "Hello World" Worker,
deploy it, and enter its address (https://….workers.dev) in Menu > Briefing.
