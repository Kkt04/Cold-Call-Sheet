// Business rules: who needs a call today, and how "warm" (urgent) a job is.
(function () {
    const NEXT = { new: "quote", quote: "sent", sent: "approved", approved: "sched", sched: "done" };
    const NEXTLBL = { new: "Start quote", quote: "Quote sent", sent: "They said yes", approved: "Booked a tech", sched: "Mark done" };
    const days = t => Math.floor((Date.now() - t) / Store.DAY);
  
    // Returns why this job needs a call today, or null if it can wait.
    function reason(j) {
      if (j.stage === "new") return days(j.created) >= 1 ? "Asked " + days(j.created) + " day(s) ago, still no call back" : "New request, call back";
      if (j.stage === "quote") return "Quote still to send";
      if (j.stage === "approved") return "Said yes, book a tech";
      if (j.stage === "sent" && days(j.last) >= 2) return "Quote out, " + days(j.last) + " days of silence";
      return null;
    }
    // Fridge-style temperature: starts at -18C, warms 6 degrees per day waiting, +10 if equipment is down.
    function temp(j) {
      const t = -18 + ((Date.now() - j.last) / Store.DAY) * 6 + (j.urgent ? 10 : 0);
      return Math.max(-18, Math.min(12, Math.round(t)));
    }
    const band = t => (t < -8 ? 0 : t < 0 ? 1 : t < 6 ? 2 : 3);
    const open = jobs => jobs.filter(j => j.stage !== "done");
    const callList = jobs => open(jobs).filter(reason).sort((a, b) => temp(b) - temp(a));
    function stats(jobs) {
      const o = open(jobs);
      return {
        open: o.length, calls: callList(jobs).length,
        waiting: jobs.filter(j => j.stage === "sent").length,
        value: o.reduce((s, j) => s + Number(j.val || 0), 0)
      };
    }
    window.Logic = { NEXT, NEXTLBL, reason, temp, band, callList, stats };
  })();