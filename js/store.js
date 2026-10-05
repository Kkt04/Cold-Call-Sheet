// Data layer: stages, sample data, and saving to the browser (localStorage).
// To go multi-device later, replace load()/save() with fetch() calls to a backend.
(function () {
    const KEY = "coldcall.jobs.v1", DAY = 864e5;
    const STAGES = [
      ["new", "New request"], ["quote", "Quote to send"], ["sent", "Waiting on their yes"],
      ["approved", "Said yes, book a tech"], ["sched", "Scheduled"], ["done", "Done"]
    ];
    function seed() {
      const d = n => Date.now() - n * DAY;
      return [
        { id: 1, name: "Harbor Grill", phone: "555-0142", job: "Walk-in freezer down", src: "Phone", val: 2000, stage: "new", urgent: true, created: d(3), last: d(3), notes: "Called Friday, freezer is down." },
        { id: 2, name: "Moreno's Taqueria", phone: "555-0177", job: "Ice machine not making ice", src: "Website form", val: 650, stage: "new", urgent: false, created: d(1), last: d(1), notes: "" },
        { id: 3, name: "Eastside Market", phone: "555-0120", job: "Walk-in cooler compressor", src: "Referral", val: 3400, stage: "sent", urgent: false, created: d(5), last: d(3), notes: "Quote emailed Tuesday." },
        { id: 4, name: "Luna Bistro", phone: "555-0161", job: "Cooler gasket and thermostat", src: "Text", val: 480, stage: "approved", urgent: false, created: d(4), last: d(2), notes: "Said yes by text. Wants Thursday." },
        { id: 5, name: "Dockside Seafood", phone: "555-0108", job: "Condenser fan replacement", src: "Phone", val: 1250, stage: "quote", urgent: false, created: d(2), last: d(2), notes: "" },
        { id: 6, name: "Sunrise Diner", phone: "555-0133", job: "Reach-in cooler leak", src: "Website form", val: 700, stage: "sched", urgent: false, created: d(6), last: d(1), notes: "Tech visit Wednesday morning." },
        { id: 7, name: "Greenleaf Grocery", phone: "555-0150", job: "Ice machine descale", src: "Repeat customer", val: 300, stage: "done", urgent: false, created: d(9), last: d(5), notes: "" }
      ];
    }
    window.Store = {
      DAY, STAGES,
      load() { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} return seed(); },
      save(jobs) { try { localStorage.setItem(KEY, JSON.stringify(jobs)); } catch (e) {} }
    };
  })();