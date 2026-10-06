var DAY = 864e5;
var KEY = "cold-call-sheet-v1";

var STAGES = [
  ["new", "New request"],
  ["quote", "Quote to send"],
  ["sent", "Waiting on their yes"],
  ["approved", "Said yes, book a tech"],
  ["sched", "Scheduled"],
  ["done", "Done"]
];

var jobs = [];

function seedJobs() {
  var n = Date.now();

  function ago(d) {
    return n - d * DAY;
  }

  return [
    {
      id: 1,
      name: "Harbor Grill",
      phone: "555-0142",
      job: "Walk-in freezer down, food at risk",
      src: "Phone",
      val: 2000,
      stage: "new",
      urgent: true,
      created: ago(0.3),
      last: ago(0.3),
      notes: "Called Friday evening."
    },

    {
      id: 2,
      name: "Marco's Pizza",
      phone: "555-0177",
      job: "Walk-in cooler running warm",
      src: "Text",
      val: 600,
      stage: "new",
      urgent: false,
      created: ago(1),
      last: ago(1),
      notes: ""
    },

    {
      id: 3,
      name: "Greenfield Market",
      phone: "555-0123",
      job: "Ice machine not making ice",
      src: "Website form",
      val: 450,
      stage: "quote",
      urgent: false,
      created: ago(3),
      last: ago(2),
      notes: "Waiting on part price."
    },

    {
      id: 4,
      name: "Lakeside Diner",
      phone: "555-0155",
      job: "Condenser fan replacement",
      src: "Referral",
      val: 900,
      stage: "quote",
      urgent: false,
      created: ago(2),
      last: ago(1),
      notes: ""
    },

    {
      id: 5,
      name: "Metro Cold Storage",
      phone: "555-0190",
      job: "Maintenance contract, 3 units",
      src: "Repeat customer",
      val: 1450,
      stage: "sent",
      urgent: false,
      created: ago(6),
      last: ago(3),
      notes: "Quote sent."
    },

    {
      id: 6,
      name: "Sunrise Bakery",
      phone: "555-0111",
      job: "Display cooler door gasket",
      src: "Text",
      val: 320,
      stage: "sent",
      urgent: false,
      created: ago(2),
      last: ago(0.5),
      notes: ""
    },

    {
      id: 7,
      name: "Pho Saigon",
      phone: "555-0166",
      job: "Reach-in freezer replacement",
      src: "Website form",
      val: 3200,
      stage: "approved",
      urgent: false,
      created: ago(5),
      last: ago(1),
      notes: "They said yes."
    },

    {
      id: 8,
      name: "Dock 9 Warehouse",
      phone: "555-0188",
      job: "Evaporator coil cleaning",
      src: "Referral",
      val: 700,
      stage: "sched",
      urgent: false,
      created: ago(8),
      last: ago(2),
      notes: "Tech booked Thursday."
    },

    {
      id: 9,
      name: "Corner Deli",
      phone: "555-0133",
      job: "Walk-in door seal",
      src: "Text",
      val: 280,
      stage: "done",
      urgent: false,
      created: ago(12),
      last: ago(5),
      notes: ""
    }
  ];
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(jobs));
  } catch (e) {}
}

function load() {
  var s = null;

  try {
    s = localStorage.getItem(KEY);
  } catch (e) {}

  try {
    jobs = s ? JSON.parse(s) : seedJobs();
  } catch (e) {
    jobs = seedJobs();
  }

  if (!s) {
    save();
  }
}