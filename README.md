# Cold Call Sheet

A one-screen follow-up tracker for a small commercial refrigeration repair shop.
Every morning it answers one question: **who do I need to call today?**

Built as a working prototype for a Forward Deployed Engineer task, based on a real-style
customer call with Denise, who owns a repair company with four field techs.

---

## 1. The problem

Denise fixes walk-in coolers, freezers and ice machines for restaurants, grocery stores
and warehouses. About 15 to 20 new requests arrive each week through five scattered
places: the office phone, a website form that emails an inbox, texts, referrals and a
paper notebook.

Because nothing is in one place, requests slip. One Friday a restaurant called about a
freezer that was down. She forgot to follow up, and by Monday they had hired someone
else. That was a $2,000 job lost. She also can't tell her husband how many jobs are open.

**What she asked for:** one screen that shows who to call today and where each job
stands (waiting on quote, waiting on their yes, scheduled, done). She said she does not
need anything fancy.

## 2. What this prototype does

- **Call list:** the jobs that need a call today, each with a one-tap phone link and the reason it is on the list.
- **Urgency as temperature:** each job has a thermometer gauge. The longer a job waits, the warmer it gets, so the most at-risk job is always at the top.
- **Stage board:** every job sits on a shelf for its stage, with a count and dollar value.
- **Numbers for her husband:** open jobs, calls to make today, jobs waiting on a yes, and open value.
- **One intake form:** phone, website, text, referral and repeat jobs are all added the same way, with the source recorded.
- **One-tap updates:** "Called, no change" resets the waiting clock, and a next-stage button moves the job forward.

Deliberately left out: technician scheduling. Denise said she knows where everyone is
and it can wait until later.

## 3. How a job gets onto the call list

| Stage | On the call list? | Why |
|---|---|---|
| New request | Always | Nobody has called the customer back yet |
| Quote to send | Always | The quote is owed to the customer |
| Waiting on their yes | After 2 days of silence | Time to nudge them |
| Said yes, book a tech | Always | Customer is ready, a tech must be booked |
| Scheduled | No | Nothing owed right now |
| Done | No | Finished |

### The temperature score

```
temperature = -18 + (6 x days since last contact) + (10 if equipment is down)
```

The value is capped between -18 and +12 degrees. Jobs are sorted warmest first.

| Range | Color | Meaning |
|---|---|---|
| below -8 | light blue | Fresh |
| -8 to -1 | teal | Cooling off |
| 0 to 5 | amber | Warming, call soon |
| 6 and above | red | Spoiling, call now |

Calling a customer ("Called, no change") or moving a job to the next stage resets its
clock to -18.

## 4. Run it

No install, no build step, no server.

1. Put all files in a folder named `call-today` using the structure below.
2. Open `index.html` in any modern browser.

Data is saved in the browser (`localStorage`). The first time you open it, sample jobs
are loaded so you can see how it works. To reset to the sample data, clear the site data
for the page in your browser.

## 4b. Quick demo script

1. Open the page and look at the top card: Harbor Grill (freezer down) is hottest.
2. Click **Call** on a job, then **Called, no change**. Its temperature drops back to -18.
3. Click **Start quote** on a new request. It moves to the "Quote to send" shelf.
4. Click **+ New job**, add a customer, tick "Equipment is down right now" and save. It jumps to the top of the list.
5. Move a job to **Done** and watch the open value and counts update.

## 5. Project structure

```
call-today/
├── index.html        Page layout and the new/edit job dialog
├── README.md         This file
├── css/
│   └── styles.css    All styling: gauges, shelves, dialog, responsive rules
└── js/
    ├── store.js      Stages, sample data, load/save (localStorage)
    ├── logic.js      Business rules: call list, reasons, temperature, totals
    └── app.js        Draws the screen and handles clicks and the form
```

Scripts are loaded in this order (set in `index.html`): `store.js`, then `logic.js`,
then `app.js`. Each one depends on the one before it.

| File | Job | Change it when... |
|---|---|---|
| `store.js` | Where data lives | You add a real backend or new stages |
| `logic.js` | The rules | Denise wants different follow-up timing |
| `app.js` | What's on screen | You change how cards or the form behave |
| `styles.css` | How it looks | You want a different design |

## 6. Data model

Each job is one object:

```js
{
  id: 1,                     // unique number
  name: "Harbor Grill",      // customer or business
  phone: "555-0142",
  job: "Walk-in freezer down",
  src: "Phone",              // Phone, Website form, Text, Referral, Repeat customer
  val: 2000,                 // estimated value in dollars
  stage: "new",              // new, quote, sent, approved, sched, done
  urgent: true,              // equipment is down right now
  created: 1759600000000,    // when the request came in (ms timestamp)
  last: 1759600000000,       // last time Denise contacted them (ms timestamp)
  notes: "Called Friday."
}
```

## 7. Customize it

- **Follow-up delay:** in `logic.js`, change the `2` in `days(j.last) >= 2`.
- **How fast jobs warm up:** in `logic.js`, change `* 6` inside `temp()`.
- **Add a stage:** add it to `STAGES` in `store.js`, then to `NEXT` and `NEXTLBL` in `logic.js`.
- **Colors and fonts:** the variables at the top of `styles.css`.

## 8. Known limits (prototype)

- Data lives in one browser on one device. It does not sync to Denise's phone and laptop.
- Jobs are typed in by hand. Nothing is read from the website-form inbox, texts or calls yet.
- No login, no multi-user access, no reminders.

## 9. Roadmap

1. **Backend:** Node with SQLite, or Supabase, so data syncs across devices. Only `store.js` changes.
2. **Auto-capture:** create jobs automatically from the website-form email inbox and from missed calls and texts, so the notebook is no longer needed.
3. **Morning digest:** text or email Denise the call list at 7am so she doesn't even need to open the app.
4. **Quote tracking:** attach the quote amount and send date to each job.
5. **Tech scheduling:** the "later" feature Denise mentioned, once the lead flow is solid.

## 10. Why it is built this way

- **Plain HTML, CSS and JavaScript:** it runs anywhere with nothing to install, so Denise or a reviewer can open it immediately.
- **Three small JS files:** data, rules and screen are separate, which makes the next steps (backend, auto-capture) easy to add.
- **One screen:** Denise asked for one thing, and said she'd use it every morning if it did just that.# Cold-Call-Sheet
