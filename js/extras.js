(function () {
    var $ = function (id) {
      return document.getElementById(id);
    };
  
    var paste = $("f-paste");
    var lastAuto = "";
  
    // Paste a text or email:
    // fill phone, job and the equipment-down flag
    if (paste) {
      paste.addEventListener("input", function () {
        var t = paste.value;
  
        var p = t.match(/(\+?\d[\d\-\s().]{8,}\d)/);
  
        if (p && !$("f-phone").value) {
          $("f-phone").value = p[1].trim();
        }
  
        if (
            /\bdown\b|not cooling|stopped cooling|no cool|too warm|leak|emergency|urgent|asap|spoil/i.test(
            t
          )
        ) {
          $("f-urg").checked = true;
        }
  
        var job = $("f-job");
  
        if (job.value === "" || job.value === lastAuto) {
          lastAuto = t.trim().slice(0, 120);
          job.value = lastAuto;
        }
      });
    }
  
    $("dlg").addEventListener("close", function () {
      if (paste) {
        paste.value = "";
      }
  
      lastAuto = "";
    });
    // Refresh when the tab comes back, so days waiting are up to date each morning
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden && typeof render === "function") {
            render();
        }
        });
    // Reset to the sample data
    $("reset").addEventListener("click", function () {
      if (confirm("Reset to sample data? Your changes will be lost.")) {
        try {
          localStorage.removeItem(KEY);
        } catch (e) {}
  
        location.reload();
      }
    });
  })();