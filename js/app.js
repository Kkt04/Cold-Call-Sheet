var editingId = null;

var $ = function (id) {
  return document.getElementById(id);
};

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[c];
  });
}

function ageText(j) {
  var d = days(j.last);

  return d < 1 ? "today" : d + "d ago";
}

function card(j, compact) {
  var t = temp(j);
  var pct = Math.round((t + 18) / 30 * 100);
  var r = reason(j);

  var tel = j.phone
    ? '<a class="btn sm" href="tel:' +
      esc(j.phone.replace(/[^\d+]/g, "")) +
      '">Call ' +
      esc(j.phone) +
      "</a>"
    : "";

  var nx = NEXT[j.stage]
    ? '<button class="btn sm solid" data-a="next" data-id="' +
      j.id +
      '">' +
      NEXTLBL[j.stage] +
      "</button>"
    : "";

  var called =
    j.stage !== "done"
      ? '<button class="btn sm" data-a="called" data-id="' +
        j.id +
        '">Called, no change</button>'
      : "";

  return (
    '<article class="card' +
    (compact ? " compact" : "") +
    '">' +
    '<div class="gauge" title="' +
    t +
    ' degrees">' +
    '<i style="height:' +
    pct +
    "%;background:" +
    tempColor(t) +
    '"></i>' +
    "</div>" +
    '<div class="body">' +
    '<div class="top">' +
    '<button class="name" data-a="edit" data-id="' +
    j.id +
    '">' +
    esc(j.name) +
    "</button>" +
    '<span class="deg" style="color:' +
    tempColor(t) +
    '">' +
    t +
    "°</span>" +
    "</div>" +
    (r && !compact
      ? '<div class="why">' + esc(r) + "</div>"
      : "") +
    '<p class="job">' +
    esc(j.job) +
    "</p>" +
    '<p class="meta">' +
    (j.urgent && j.stage !== "done"
      ? '<span class="tag">Equipment down</span>'
      : "") +
    esc(j.src) +
    " · last contact " +
    ageText(j) +
    (j.val ? " · " + money(j.val) : "") +
    "</p>" +
    (j.notes
      ? '<p class="notes">' + esc(j.notes) + "</p>"
      : "") +
    '<div class="acts">' +
    tel +
    called +
    nx +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

function render() {
  $("date").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  var tt = totals();

  $("stats").innerHTML =
    '<div class="stat first">' +
    "<b>" +
    tt.calls +
    "</b>" +
    "<span>calls to make today</span>" +
    "</div>" +
    '<div class="stat">' +
    "<b>" +
    tt.open +
    "</b>" +
    "<span>open jobs</span>" +
    "</div>" +
    '<div class="stat">' +
    "<b>" +
    tt.waiting +
    "</b>" +
    "<span>waiting on a yes</span>" +
    "</div>" +
    '<div class="stat">' +
    "<b>" +
    money(tt.value) +
    "</b>" +
    "<span>open value</span>" +
    "</div>";

  var cl = callList();

  $("today").innerHTML = cl.length
    ? '<div class="cards">' +
      cl
        .map(function (j) {
          return card(j, false);
        })
        .join("") +
      "</div>"
    : '<div class="empty">Nobody is waiting on you. Nice work.</div>';

  $("board").innerHTML = STAGES.map(function (s) {
    var ls = jobs
      .filter(function (j) {
        return j.stage === s[0];
      })
      .sort(function (a, b) {
        return temp(b) - temp(a);
      });

    var v = ls.reduce(function (x, j) {
      return x + (Number(j.val) || 0);
    }, 0);

    return (
      '<section class="shelf">' +
      "<h3>" +
      s[1] +
      " (" +
      ls.length +
      ")" +
      "<span>" +
      money(v) +
      "</span>" +
      "</h3>" +
      '<div class="cards">' +
      (ls
        .map(function (j) {
          return card(j, true);
        })
        .join("") || '<div class="empty">Empty</div>') +
      "</div>" +
      "</section>"
    );
  }).join("");
}

function find(id) {
  return jobs.filter(function (j) {
    return j.id == id;
  })[0];
}

function openDialog(j) {
  editingId = j ? j.id : null;

  $("dt").textContent = j ? "Edit job" : "New job";

  $("f-paste").value = "";
  $("f-name").value = j ? j.name : "";
  $("f-phone").value = j ? j.phone : "";
  $("f-job").value = j ? j.job : "";
  $("f-src").value = j ? j.src : "Phone";
  $("f-val").value = j && j.val ? j.val : "";
  $("f-stage").value = j ? j.stage : "new";
  $("f-notes").value = j ? j.notes : "";
  $("f-urg").checked = j ? !!j.urgent : false;

  $("del").style.display = j ? "" : "none";

  $("dlg").showModal();
}

function saveJob() {
  var name = $("f-name").value.trim();

  if (!name) {
    alert("Add the customer's name first.");
    $("f-name").focus();
    return;
  }

  var data = {
    name: name,
    phone: $("f-phone").value.trim(),
    job: $("f-job").value.trim(),
    src: $("f-src").value,
    val: Number($("f-val").value) || 0,
    stage: $("f-stage").value,
    notes: $("f-notes").value.trim(),
    urgent: $("f-urg").checked
  };

  if (editingId) {
    var j = find(editingId);

    if (j.stage !== data.stage) {
      j.last = Date.now();
    }

    Object.keys(data).forEach(function (k) {
      j[k] = data[k];
    });
  } else {
    var id =
      jobs.reduce(function (m, x) {
        return Math.max(m, x.id);
      }, 0) + 1;

    data.id = id;
    data.created = Date.now();
    data.last = Date.now();

    jobs.push(data);
  }

  save();
  $("dlg").close();
  render();
}

document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-a]");

  if (!b) {
    return;
  }

  var j = find(b.dataset.id);

  if (!j) {
    return;
  }

  if (b.dataset.a === "called") {
    j.last = Date.now();
  }

  if (b.dataset.a === "next") {
    j.stage = NEXT[j.stage];
    j.last = Date.now();
  }

  if (b.dataset.a === "edit") {
    openDialog(j);
    return;
  }

  save();
  render();
});

$("add").onclick = function () {
  openDialog(null);
};

$("cancel").onclick = function () {
  $("dlg").close();
};

$("save").onclick = saveJob;

$("del").onclick = function () {
  if (confirm("Delete this job?")) {
    jobs = jobs.filter(function (j) {
      return j.id !== editingId;
    });

    save();
    $("dlg").close();
    render();
  }
};

$("f-stage").innerHTML = STAGES.map(function (s) {
  return '<option value="' + s[0] + '">' + s[1] + "</option>";
}).join("");

load();
render();