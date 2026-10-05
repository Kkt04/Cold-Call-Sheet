// UI layer: draws the screen and wires up buttons.
(function () {
    const $ = id => document.getElementById(id);
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const money = n => "$" + Number(n || 0).toLocaleString();
    let jobs = Store.load(), editing = null;
    const commit = () => { Store.save(jobs); render(); };
  
    function card(j) {
      const t = Logic.temp(j), pct = Math.round(((t + 18) / 30) * 100);
      return `<article class="job t${Logic.band(t)}">
        <div class="gauge"><div class="tube"><i style="height:${pct}%"></i></div><div class="deg">${t > 0 ? "+" : ""}${t}°</div></div>
        <div>
          <div class="row"><div><span class="name">${esc(j.name)}</span>${j.urgent ? '<span class="down">DOWN NOW</span>' : ""}<div>${esc(j.job)}</div></div>
          <div class="meta">${j.val ? money(j.val) : ""}<br>${esc(j.src)}</div></div>
          <div class="why">${esc(Logic.reason(j))}</div>
          ${j.notes ? `<div class="meta">${esc(j.notes)}</div>` : ""}
          <div class="acts">
            <a class="call" href="tel:${esc(j.phone)}">Call ${esc(j.phone)}</a>
            <button class="btn" data-a="called" data-id="${j.id}">Called, no change</button>
            <button class="btn" data-a="next" data-id="${j.id}">${Logic.NEXTLBL[j.stage]}</button>
            <button class="btn" data-a="edit" data-id="${j.id}">Edit</button>
          </div></div></article>`;
    }
  
    function render() {
      $("date").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
      const s = Logic.stats(jobs);
      $("stats").innerHTML = [[s.open, "open jobs"], [s.calls, "to call today"], [s.waiting, "waiting on a yes"], [money(s.value), "open value"]]
        .map(x => `<div class="stat"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
      const list = Logic.callList(jobs);
      $("today").innerHTML = list.length ? list.map(card).join("") : '<div class="empty">Nobody is waiting on you today.</div>';
      $("board").innerHTML = Store.STAGES.map(([k, label]) => {
        const l = jobs.filter(j => j.stage === k), v = l.reduce((a, j) => a + Number(j.val || 0), 0);
        return `<div class="shelf"><h3>${label}</h3><small>${l.length} job(s)${v ? ", " + money(v) : ""}</small>` +
          l.map(j => `<button class="chip" data-a="edit" data-id="${j.id}">${esc(j.name)}</button>`).join("") + `</div>`;
      }).join("");
    }
  
    document.addEventListener("click", e => {
      const b = e.target.closest("button[data-a]"); if (!b) return;
      const j = jobs.find(x => x.id == b.dataset.id); if (!j) return;
      if (b.dataset.a === "edit") return openForm(j);
      if (b.dataset.a === "called") j.last = Date.now();
      if (b.dataset.a === "next") { j.stage = Logic.NEXT[j.stage]; j.last = Date.now(); if (j.stage === "done") j.urgent = false; }
      commit();
    });
  
    $("f-stage").innerHTML = Store.STAGES.map(s => `<option value="${s[0]}">${s[1]}</option>`).join("");
    function openForm(j) {
      editing = j || null; $("dt").textContent = j ? "Edit job" : "New job";
      $("f-name").value = j ? j.name : ""; $("f-phone").value = j ? j.phone : ""; $("f-job").value = j ? j.job : "";
      $("f-src").value = j ? j.src : "Phone"; $("f-val").value = j ? j.val : ""; $("f-stage").value = j ? j.stage : "new";
      $("f-notes").value = j ? j.notes : ""; $("f-urg").checked = j ? !!j.urgent : false;
      $("del").style.display = j ? "" : "none"; $("dlg").showModal(); $("f-name").focus();
    }
    $("add").onclick = () => openForm(null);
    $("cancel").onclick = () => $("dlg").close();
    $("del").onclick = () => { if (editing && confirm("Delete " + editing.name + "?")) { jobs = jobs.filter(x => x !== editing); commit(); $("dlg").close(); } };
    $("save").onclick = () => {
      const name = $("f-name").value.trim(); if (!name) return $("f-name").focus();
      const d = { name, phone: $("f-phone").value.trim(), job: $("f-job").value.trim(), src: $("f-src").value, val: Number($("f-val").value) || 0,
        stage: $("f-stage").value, notes: $("f-notes").value.trim(), urgent: $("f-urg").checked };
      if (editing) { if (editing.stage !== d.stage) editing.last = Date.now(); Object.assign(editing, d); }
      else jobs.push(Object.assign({ id: Date.now(), created: Date.now(), last: Date.now() }, d));
      commit(); $("dlg").close();
    };
    render();
  })();