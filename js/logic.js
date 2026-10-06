var NEXT = {
  new: "quote",
  quote: "sent",
  sent: "approved",
  approved: "sched",
  sched: "done"
};

var NEXTLBL = {
  new: "Start quote",
  quote: "Quote sent",
  sent: "They said yes",
  approved: "Booked a tech",
  sched: "Mark done"
};

function days(t) {
  return Math.floor((Date.now() - t) / DAY);
}

// -18 (fresh) up to +12 (spoiling).
// Waiting warms it. Equipment down adds 24, so it is red from the start.
// Scheduled and done jobs owe nothing, so they stay at -18.
function temp(j) {
  if (j.stage === "sched" || j.stage === "done") {
    return -18;
  }

  var t = -18 + (6 * days(j.last)) + (j.urgent ? 24 : 0);

  return Math.max(-18, Math.min(12, t));
}

// Plain-words label shown on each card instead of a number.
function heatLabel(j, t) {
  if (j.stage === "done") {
    return "Done";
  }

  if (j.stage === "sched") {
    return "Booked";
  }

  if (!reason(j)) {
    return "On track";
  }

  if (t >= 6) {
    return "Call now";
  }

  if (t >= 0) {
    return "Call soon";
  }

  return "Call today";
}

function tempColor(t) {
  if (t < -8) {
    return "#7cc4e8";
  }

  if (t < 0) {
    return "#1fa6a0";
  }

  if (t < 6) {
    return "#e8a317";
  }

  return "#d9482b";
}

// Returns why this job needs a call today,
// or null if it does not.
function reason(j) {
  var d = days(j.last);

  if (j.stage === "new") {
    return j.urgent
      ? "Equipment is down. Call now."
      : "Nobody has called them back yet.";
  }

  if (j.stage === "quote") {
    return "You owe them a quote.";
  }

  if (j.stage === "approved") {
    return "They said yes. Book a tech and tell them.";
  }

  if (j.stage === "sent" && d >= 2) {
    return "No word in " + d + " days. Nudge them for a yes.";
  }

  return null;
}

function callList() {
  return jobs
    .filter(function (j) {
      return reason(j);
    })
    .sort(function (a, b) {
      return temp(b) - temp(a);
    });
}

function money(n) {
  return "$" + Number(n || 0).toLocaleString();
}

function totals() {
  var open = jobs.filter(function (j) {
    return j.stage !== "done";
  });

  return {
    open: open.length,

    calls: callList().length,

    waiting: jobs.filter(function (j) {
      return j.stage === "sent";
    }).length,

    value: open.reduce(function (s, j) {
      return s + (Number(j.val) || 0);
    }, 0)
  };
}