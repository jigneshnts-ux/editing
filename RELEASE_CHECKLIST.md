# CreatorX Studio Release Checklist

Status: MVP release candidate.

Core flow:
- Dashboard opens first
- Simple and Advanced mode selection works
- Editor opens from dashboard
- Back to dashboard works

Editor basics:
- Left toolbar changes active tool
- Canvas creates placeholder layers
- Layer list updates when layers are added
- Layer selection works
- Layer duplicate, delete, update, and clear actions work

Specific area editing:
- Select Area tool creates an editable area
- Area panel shows selected area state
- Blur, erase, highlight, and darken area actions apply visual state
- Clear area works

Project save/load:
- Save Project stores the current canvas snapshot in browser storage
- Load Project restores saved layers and area note
- Export File downloads project JSON
- Import JSON restores project data

Presets:
- Post, Reel, and Wide presets are available
- Applied preset updates canvas preview ratio
- Applied preset is included in saved project data

Preview/export:
- Generate Preview reads current canvas state
- Text export downloads preview summary
- Image export creates PNG/JPEG from browser canvas
- Compact, Standard, and High quality options work
- Exported image uses selected preset dimensions
- Layer cards and selected-area marker are drawn in the exported image

Final manual checks:
- Run npm install
- Run npm run dev
- Test in Chrome
- Test Save Project and Load Project
- Test Export File and Import JSON
- Test PNG/JPEG export for Post, Reel, and Wide presets
