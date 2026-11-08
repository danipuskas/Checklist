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

THE BAR AT THE BOTTOM: Checklist, Timers (countdowns and crew rest on one page), Briefing, Airports and More
(flight log, checklists, untick all, new flight, search, settings). Away from Timers, its tab shows the time left to the
next countdown, or to your rest. The bar steps aside while you edit or type.

Your checklists are stored on the iPad, not on GitHub. The files on GitHub are only the empty app.
Deleting the Home Screen icon deletes its data, so use More > Settings > Back up now and then.

UPDATING LATER: in the repository tap Add file > Upload files, upload the new files over the old ones and commit.
The installed app downloads the new version in the background while it's open and online, then shows
an Update button at the top left. Tap it to switch now; otherwise the new version is used the next time the app starts.
It looks for a new version at most every 10 to 15 minutes, and never while the iPad is offline, so airplane mode
doesn't bring up the iPadOS "Turn Off Airplane Mode" alert.

ONLINE BACKUP (optional): More > Settings > Online backup copies everything to a PRIVATE GitHub repository
while the app is open and online. You need a private repository and a fine-grained access token
limited to that repository with Contents: Read and write. The steps are shown in the app.

SYNC BETWEEN iPAD AND iPHONE (optional, needs Online backup): on the iPad, More > Settings > Online backup and sync >
turn on "Sync with your other devices". On the iPhone, open the same address in Safari > Share > Add to Home Screen,
open it, then More > Settings > Online backup and sync, enter the same repository and token and choose
"Use the synced checklists". From then on checklists, airport notes, the flight log, countdown and crew rest set-up
and photos stay the same on both, while the app is open and online: a change is sent a few seconds after you make it,
and the other device checks every 20 seconds and whenever it is opened. Changes made offline are sent when you are
back online. Edits to different items on both devices are combined; if the same item was changed on both, the later
change wins. Ticks, answers, filled-in fields, times, reminders and folding always stay on each device.

EDITING: tap the pencil at the top. The checklist shows as an outline: one line per section, header and item, with small tags
for notes, links and photos. Tap anything to open it as a page (text, note, type, sub-items, links, photos, reminder, in or out
a level, duplicate, move, delete); Cancel and Done stay at the top. In a new item, Return keeps it and starts the next one. Drag ≡
to move a line, or hold it over an item to put it inside. "+ Add item or header" ends each section. Select picks several items
to move, indent, duplicate, change or delete at once. The round arrow next to Done undoes your edits one step at a time.
On an iPad in full screen the outline stays on the left and the page opens on the right.
QUICK CHANGES: without Edit, press and hold an item for Edit, add a note, a link, a sub-item or an item below, duplicate,
move or delete.
Write a check and its response with dots between them, like "Parking brake .... SET", and the response lines up on the right.

BRIEFING: More > New flight > Load the OFP takes the LIDO package. iPadOS doesn't hand a copied PDF to web apps, so
either make a one-time Shortcut (Shortcuts > + > name it "Copy for Checklists" > details: Show in Share Sheet, receive PDFs >
actions: Base64 Encode with Line Breaks None, then Copy to Clipboard) and use Share > Copy for Checklists in Lido, then touch
and hold the box and Paste; or paste copied text; or drag the PDF in; or open it from Files. It fills in the flight
(From, To, alternates and their diversion times, ETD, scheduled arrival as ETA, call sign, TOD countdown)
and the Briefing tab shows the NOTAMs for departure, destination, alternates and en-route airports, the
SIGMETs on your route, company alerts and the package weather. The PDF is read on the iPad; nothing is sent anywhere.
The NOTAMs that matter for your times and runways come first. The rest are folded, never hidden.
Pasting only NOTAMs or weather later (the Briefing's load button) updates the briefing for those airports.
Tap the bookmark on a NOTAM to keep it. Kept NOTAMs show in a NOTAMs block you add to any checklist section
(Edit > NOTAMs), for the airports you choose: departure, destination, alternates, en route, company alerts.

LIVE WEATHER (optional): the Briefing tab can also show live METAR, TAF (aviationweather.gov) and US D-ATIS (atis.info)
through a small free Cloudflare Worker you create once. Paste weather-relay-worker.js into a new "Hello World" Worker,
deploy it, and enter its address (https://….workers.dev) in Briefing.
