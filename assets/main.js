/* SD Fast Notary — site script (no third-party dependencies) */
(function () {
  "use strict";

  // Set FORM_ENDPOINT to a form backend (e.g. "https://formspree.io/f/xxxxxx") to receive
  // booking requests by email. Left empty, the form opens a pre-filled text message instead.
  var FORM_ENDPOINT = "";
  var PHONE = "+18588591779";

  document.documentElement.classList.remove("no-js");

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Price estimators ($15 per notarized signature, California maximum)
  var FEE = 15;
  function money(n) { return "$" + n.toLocaleString("en-US"); }
  document.querySelectorAll("[data-estimator]").forEach(function (box) {
    var svc = box.querySelector("[data-est='service']");
    var signers = box.querySelector("[data-est='signers']");
    var sigs = box.querySelector("[data-est='sigs']");
    var out = {};
    box.querySelectorAll("[data-est-out]").forEach(function (el) { out[el.getAttribute("data-est-out")] = el; });

    function val(el) {
      var v = parseInt(el.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 50) v = 50;
      return v;
    }
    function update() {
      var s = val(signers), g = val(sigs), count = s * g, total = count * FEE, type = svc.value;
      var detail = s + (s === 1 ? " signer" : " signers") + " × " + g + (g === 1 ? " signature" : " signatures") +
        " × $" + FEE + " = " + count + (count === 1 ? " notarized signature" : " notarized signatures");
      var notes = {
        mobile: "+ travel fee, quoted upfront before you book",
        nontravel: "No travel fee when no travel is needed. Call to arrange.",
        apostille: "+ California Secretary of State fee and our apostille service fee, quoted upfront",
        hospital: "+ travel fee for the facility visit, quoted upfront",
        loan: "Loan signings are one flat rate per package, usually paid by title or escrow. Call for a quote."
      };
      if (type === "loan") {
        out.label.textContent = "Loan signing package";
        out.total.textContent = "Flat rate";
        out.detail.textContent = "One price for the whole package, including printing on request";
      } else {
        out.label.textContent = "Estimated notary fees";
        out.total.textContent = money(total);
        out.detail.textContent = detail;
      }
      out.note.textContent = notes[type] || notes.mobile;
    }
    box.querySelectorAll("[data-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = box.querySelector("[data-est='" + btn.getAttribute("data-for") + "']");
        input.value = Math.min(50, Math.max(1, val(input) + parseInt(btn.getAttribute("data-step"), 10)));
        update();
      });
    });
    [svc, signers, sigs].forEach(function (el) {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    });
    signers.addEventListener("blur", function () { signers.value = val(signers); });
    sigs.addEventListener("blur", function () { sigs.value = val(sigs); });
    update();
  });

  // Booking forms
  function clean(v) { return String(v || "").replace(/[<>]/g, "").trim().slice(0, 500); }

  document.querySelectorAll("form.booking-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.textContent = ""; status.className = "form-status"; }

      // Honeypot: bots fill hidden fields, people don't
      var hp = form.querySelector("input[name='company_website']");
      if (hp && hp.value) return;

      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {
        name: clean(form.elements["name"] && form.elements["name"].value),
        phone: clean(form.elements["phone"] && form.elements["phone"].value),
        service: clean(form.elements["service"] && form.elements["service"].value),
        location: clean(form.elements["location"] && form.elements["location"].value),
        when: clean(form.elements["when"] && form.elements["when"].value),
        notes: clean(form.elements["notes"] && form.elements["notes"].value)
      };

      if (FORM_ENDPOINT) {
        var btn = form.querySelector("button[type='submit']");
        if (btn) btn.disabled = true;
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error("bad status");
          form.reset();
          if (status) { status.textContent = "Thanks! We'll call or text you shortly to confirm."; status.classList.add("ok"); }
        }).catch(function () {
          if (status) { status.textContent = "Sorry, that didn't go through. Please call or text (858) 859-1779."; status.classList.add("err"); }
        }).finally(function () { if (btn) btn.disabled = false; });
        return;
      }

      var body = "Hi SD Fast Notary! I'd like to book: " + data.service +
        ". Name: " + data.name + ". Phone: " + data.phone +
        (data.location ? ". Location: " + data.location : "") +
        (data.when ? ". When: " + data.when : "") +
        (data.notes ? ". Notes: " + data.notes : "");
      var sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? "&" : "?";
      window.location.href = "sms:" + PHONE + sep + "body=" + encodeURIComponent(body);
      if (status) {
        status.textContent = "Opening your messages app. If nothing happens, call or text (858) 859-1779.";
        status.classList.add("ok");
      }
    });
  });
})();
