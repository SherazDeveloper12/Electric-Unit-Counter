# Bijli — Meter Tracker (Frontend)

Next.js frontend jo tumhare Node.js/Puppeteer backend (mepco-tracker) ke sath kaam karta hai.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Backend (`mepco-tracker`) alag se `npm run dev` (port 5000) pe already chalna chahiye.

## Kaise kaam karta hai

- **Auth nahi hai.** Naam sirf localStorage mein save hota hai, personalize karne ke liye.
- **Meters aur readings** poori tarah `localStorage` + Redux mein rehte hain (`store/localStorageMiddleware.js`). Browser change karoge to data nahi milega — abhi ke liye single-device use ke liye hai.
- **Bill data** (previous/present reading, bill month, grand total) backend se aata hai — `POST /api/meters` phir `POST /api/meters/:id/sync-bill`.
- **Manual readings** kabhi bhi backend ko nahi jatin, sirf client-side calculate hoti hain: `unitsConsumed = nayi reading - pichli reading` (pichli reading ya to last manual entry hai, ya agar cycle mein koi entry nahi to official bill ki present reading).
- **Month rollover**: jab tum "↻ Resync" dabate ho aur MEPCO ka naya bill month pichle se different nikle, current cycle automatically `history` mein chala jata hai aur naya cycle official reading se shuru hota hai.

## Theme control

Sara color/spacing scheme ek hi jagah se control hota hai: `app/globals.css` ke top wala `:root` block. Wahan values badlo, poori app update ho jayegi (Tailwind config unhi CSS variables ko reference karta hai).

## Structure

```
app/            → pages, layout, global styles
components/     → UI pieces (cards, modals, onboarding)
store/          → Redux Toolkit store + slices + localStorage middleware
lib/api.js      → backend calls
```
