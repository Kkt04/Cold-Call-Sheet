# Cold Call Sheet

**Live demo:** https://kkt04.github.io/Cold-Call-Sheet/

A one-screen follow-up tracker for a small commercial refrigeration repair shop.
Every morning it answers one question: **who do I need to call today?**

Built as a working prototype for a Forward Deployed Engineer task, based on a real-style
customer call with Denise, who owns a repair company with four field techs.

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

## 1b. Assumptions I made

- Denise's own words drive the stages: new request, quote to send, waiting on their yes, said yes (book a tech), scheduled, done.
- "Waiting on their yes" only shows on the call list after 2 days of silence, because calling too early annoys customers.
- Equipment that is down is treated as the most urgent, since that is how she lost the $2,000 job.
- Estimated value is optional. It exists only so her husband can see open value.
- At 15 to 20 new jobs a week, browser storage is enough for a first version she can try this week.

## 1c. Questions I would ask Denise next

1. Which tool sits behind the website form, and can it send each submission to a webhook instead of only an email?
2. Do you want the call list texted to you at 7am, or do you prefer opening the app?
3. Do you send quotes by email, text, or paper? Should the quote amount be tracked per job?
4. Does your husband need his own view, or just the numbers?
5. How do you decide a job is urgent? Is "equipment down" the only case?
6. Which phone do you use in the morning?

## 2. What this prototype does

- **Call list:** the jobs that need a call today, each with a one-tap phone link and the reason it is on the list.
- **Urgency as temperature:** each job has a thermometer gauge. The longer a job waits, the warmer it gets, so the most at-risk job is always at the top.
- **Stage board:** every job sits on a shelf for its stage, with a count and dollar value.
- **Numbers for her husband:** open jobs, calls to make today, jobs waiting on a yes, and open value.
- **One intake form:** phone, website, text, referral and repeat jobs are all added the same way. Paste a customer's text and the phone number and urgency are filled in.
- **One-tap updates:** "Called, no change" resets the waiting clock, and a next-stage button moves the job forward.

Deliberately left out: technician scheduling. Denise said she knows where everyone is
and it can wait until later.

## 3. How a job gets onto the call list

| Stage                 | On the call list?       | Why                                      |
| --------------------- | ----------------------- | ---------------------------------------- |
| New request           | Always                  | Nobody has called the customer back yet  |
| Quote to send         | Always                  | The quote is owed to the customer        |
| Waiting on their yes  | After 2 days of silence | Time to nudge them                       |
| Said yes, book a tech | Always                  | Customer is ready, a tech must be booked |
| Scheduled             | No                      | Nothing owed right now                   |
| Done                  | No                      | Finished                                 |

### The temperature score

    temperature = -18 + (6 x days since last contact) + (10 if equipment is down)

The value is capped between -18 and +12 degrees. Jobs are sorted warmest first.

| Range       | Color      | Meaning            |
| ----------- | ---------- | ------------------ |
| below -8    | light blue | Fresh              |
| -8 to -1    | teal       | Cooling off        |
| 0 to 5      | amber      | Warming, call soon |
| 6 and above | red        | Spoiling, call now |

Calling a customer ("Called, no change") or moving a job to the next stage resets its
clock to -18.

## 4. Run it

No install, no build step, no server.

1. Clone or download this repo and keep the folder structure below.
2. Open `index.html` in any modern browser, or use the live demo link above.

Data is saved in the browser (`localStorage`). The first time you open it, sample jobs
are loaded. To go back to the sample data, click **Reset demo** in the header.

## 4b. Quick demo script

1. Open the page and look at the top card: Harbor Grill (freezer down) is hottest.
2. Click **Called, no change** on a job. Its temperature drops back to -18.
3. Click **Start quote** on a new request. It moves to the "Quote to send" shelf.
4. Click **+ New job**, paste a text like `Walk-in cooler at Marco's not cooling, call 555-201-3344`. Phone and "Equipment is down" fill in. Save it and it jumps to the top.
5. Move a job to **Done** and watch the open value and counts update.

## 5. Project structure

    index.html        Page layout and the new/edit job dialog
    README.md         This file
    css/styles.css    All styling: gauges, shelves, dialog, responsive rules
    js/store.js       Stages, sample data, load/save (localStorage)
    js/logic.js       Business rules: call list, reasons, temperature, totals
    js/app.js         Draws the screen and handles clicks and the form
    js/extras.js      Paste-a-text autofill and the Reset demo button

Scripts load in this order (set in `index.html`): `store.js`, `logic.js`, `app.js`, `extras.js`.

## 6. Data model

    {
      id: 1,
      name: "Harbor Grill",
      phone: "555-0142",
      job: "Walk-in freezer down",
      src: "Phone",              // Phone, Website form, Text, Referral, Repeat customer
      val: 2000,                 // optional estimated value in dollars
      stage: "new",              // new, quote, sent, approved, sched, done
      urgent: true,              // equipment is down right now
      created: 1759600000000,
      last: 1759600000000,       // last time Denise contacted them
      notes: "Called Friday."
    }

## 7. Customize it

- **Follow-up delay:** in `logic.js`, change the `2` in `d >= 2`.
- **How fast jobs warm up:** in `logic.js`, change `6 * days(...)` inside `temp()`.
- **Add a stage:** add it to `STAGES` in `store.js`, then to `NEXT` and `NEXTLBL` in `logic.js`.
- **Colors and fonts:** the variables at the top of `styles.css`.

## 8. Known limits (prototype)

- Data lives in one browser on one device. It does not sync between Denise's phone and laptop.
- Jobs are added by hand or by pasting a text. Nothing is read from the website-form inbox or calls yet.
- No login, no multi-user access, no reminders.

## 9. Roadmap

1. **Backend:** Node with SQLite, or Supabase, so data syncs across devices. Only `store.js` changes.
2. **Auto-capture:** create jobs from the website-form inbox, missed calls and texts.
3. **Morning digest:** text or email Denise the call list at 7am.
4. **Quote tracking:** quote amount and send date per job.
5. **Tech scheduling:** the "later" feature Denise mentioned.

## 10. Why it is built this way

- **Plain HTML, CSS and JavaScript:** runs anywhere with nothing to install, so Denise or a reviewer can open it immediately.
- **Small JS files:** data, rules and screen are separate, so a backend or auto-capture can be added later.
- **One screen:** Denise asked for one thing, and said she would use it every morning if it did just that.