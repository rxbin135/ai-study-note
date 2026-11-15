/* ==========================================================================
   AI 강의노트 — 공통 스크립트
   · 테마 전환(라이트/다크)  · 모바일 목차  · 코드 복사
   · 레슨 진도 체크(localStorage)  · 자가 점검 퀴즈  · 현재 위치 표시
   외부 라이브러리 없이 동작합니다. GitHub Pages 하위 경로에서도 그대로 씁니다.
   ========================================================================== */
(function () {
  "use strict";

  var LS_THEME = "ai-notes:theme";
  var LS_DONE = "ai-notes:done:v1";

  var root = document.documentElement;
  var page = root.getAttribute("data-page") || "page";

  /* ---------------------------------------------------------------- util */
  function safeParse(raw, fallback) {
    try {
      var v = JSON.parse(raw);
      return v && typeof v === "object" ? v : fallback;
    } catch (e) {
      return fallback;
    }
  }

  var done = safeParse(localStorage.getItem(LS_DONE), {});
  function saveDone() {
    try {
      localStorage.setItem(LS_DONE, JSON.stringify(done));
    } catch (e) {
      /* 저장 공간이 막혀 있어도 화면 기능은 유지 */
    }
  }
  function keyOf(id) {
    return page + "#" + id;
  }
  function isDone(id) {
    return done[keyOf(id)] === 1;
  }

  /* --------------------------------------------------------------- theme */
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function paintThemeButton() {
    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    var dark = currentTheme() === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
    btn.setAttribute("title", dark ? "라이트 모드" : "다크 모드");
  }
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    paintThemeButton();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(LS_THEME, next);
      } catch (e) {}
      paintThemeButton();
    });
  }

  /* ----------------------------------------------------------- mobile nav */
  var menuBtn = document.getElementById("menuBtn");
  var backdrop = document.getElementById("backdrop");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setNav(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) setNav(false);
  });

  /* ------------------------------------------------------- code blocks */
  var LANG_LABEL = {
    python: "Python",
    py: "Python",
    bash: "Shell",
    sh: "Shell",
    shell: "Shell",
    json: "JSON",
    jsonc: "JSON",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    markdown: "Markdown",
    text: "Text",
    html: "HTML",
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    sql: "SQL",
    diff: "Diff",
    xml: "XML"
  };

  function enhanceCode() {
    var pres = document.querySelectorAll(".doc pre");
    for (var i = 0; i < pres.length; i++) {
      var pre = pres[i];
      if (pre.parentNode && pre.parentNode.classList.contains("codeblock")) continue;

      var code = pre.querySelector("code");
      var lang = "";
      var cls = code ? code.className || "" : "";
      var m = cls.match(/lang(?:uage)?-([a-z0-9+#]+)/i);
      if (m) lang = m[1].toLowerCase();
      if (!lang && pre.getAttribute("data-lang")) lang = pre.getAttribute("data-lang").toLowerCase();

      var wrap = document.createElement("div");
      wrap.className = "codeblock";

      var bar = document.createElement("div");
      bar.className = "codeblock-bar";

      var label = document.createElement("span");
      label.textContent = LANG_LABEL[lang] || (lang ? lang.toUpperCase() : "CODE");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "복사";

      btn.addEventListener("click", function (ev) {
        var b = ev.currentTarget;
        var target = b.closest(".codeblock").querySelector("pre");
        var text = target.innerText.replace(/\u00a0/g, " ");
        function ok() {
          b.textContent = "복사됨 ✓";
          b.classList.add("copied");
          setTimeout(function () {
            b.textContent = "복사";
            b.classList.remove("copied");
          }, 1600);
        }
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            ok();
          } catch (e) {}
          document.body.removeChild(ta);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok, fallback);
        } else {
          fallback();
        }
      });

      bar.appendChild(label);
      bar.appendChild(btn);
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(bar);
      wrap.appendChild(pre);
    }
  }

  /* -------------------------------------------------------- lesson check */
  function enhanceLessons() {
    var heads = document.querySelectorAll(".doc h2[id]");
    for (var i = 0; i < heads.length; i++) {
      (function (h) {
        var id = h.getAttribute("id");
        if (h.querySelector(".lesson-check")) return;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lesson-check";
        btn.setAttribute("aria-pressed", isDone(id) ? "true" : "false");
        btn.setAttribute("data-lesson", id);
        btn.innerHTML = '<span class="box" aria-hidden="true"></span><span>' +
          (isDone(id) ? "학습 완료" : "학습 완료로 표시") + "</span>";
        btn.setAttribute("aria-label", (h.textContent || "").trim() + " 학습 완료로 표시");
        btn.addEventListener("click", function () {
          var on = btn.getAttribute("aria-pressed") === "true";
          if (on) {
            delete done[keyOf(id)];
          } else {
            done[keyOf(id)] = 1;
          }
          btn.setAttribute("aria-pressed", on ? "false" : "true");
          btn.lastChild.textContent = on ? "학습 완료로 표시" : "학습 완료";
          saveDone();
          paintProgress();
          syncSubNav();
        });
        h.appendChild(btn);
      })(heads[i]);
    }
  }

  /* ----------------------------------------------------------- progress */
  function lessonIds() {
    var out = [];
    var heads = document.querySelectorAll(".doc h2[id]");
    for (var i = 0; i < heads.length; i++) out.push(heads[i].getAttribute("id"));
    return out;
  }

  function paintProgress() {
    var ids = lessonIds();
    var total = ids.length;
    var n = 0;
    for (var i = 0; i < total; i++) if (isDone(ids[i])) n++;
    var pct = total ? Math.round((n / total) * 100) : 0;

    var fill = document.querySelector("[data-progress-fill]");
    var text = document.querySelector("[data-progress-text]");
    var chip = document.querySelector("[data-progress-chip]");
    if (fill) fill.style.width = pct + "%";
    if (text) text.textContent = n + " / " + total;
    if (chip) {
      chip.textContent = pct + "%";
      chip.setAttribute("title", "이 페이지 진도 " + n + "/" + total);
    }
  }

  /* --------------------------------------------------------- sub nav list */
  function syncSubNav() {
    var activeItem = document.querySelector(".nav-item.active");
    if (!activeItem) return;
    var group = activeItem.closest(".nav-group");
    if (!group) return;
    var holder = group.querySelector(".nav-sub");
    if (!holder) return;

    var links = holder.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute("data-href-id");
      links[i].classList.toggle("done", !!done[keyOf(id)]);
    }
  }

  function buildSubNav() {
    var activeItem = document.querySelector(".nav-item.active");
    if (!activeItem) return;
    var group = activeItem.closest(".nav-group");
    if (!group) return;
    var holder = group.querySelector(".nav-sub");
    if (!holder) return;
    holder.innerHTML = "";

    var heads = document.querySelectorAll(".doc h2[id]");
    for (var i = 0; i < heads.length; i++) {
      (function (h) {
        var id = h.getAttribute("id");
        var label = h.textContent
          .replace(/학습 완료로 표시|학습 완료/g, "")
          .replace(/#/g, "")
          .trim();
        var a = document.createElement("a");
        a.href = "#" + id;
        a.textContent = label;
        a.setAttribute("data-href-id", id);
        if (isDone(id)) a.classList.add("done");
        a.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 900px)").matches) setNav(false);
        });
        holder.appendChild(a);
      })(heads[i]);
    }
  }

  /* -------------------------------------------------------- scroll spy */
  function scrollSpy() {
    var heads = Array.prototype.slice.call(document.querySelectorAll(".doc h2[id], .doc h3[id]"));
    if (!heads.length) return;
    var links = document.querySelectorAll(".nav-sub a");
    var map = {};
    for (var i = 0; i < links.length; i++) {
      map[links[i].getAttribute("data-href-id")] = links[i];
    }

    function update() {
      var y = window.scrollY + 110;
      var activeId = heads[0].getAttribute("id");
      for (var j = 0; j < heads.length; j++) {
        if (heads[j].offsetTop <= y) activeId = heads[j].getAttribute("id");
      }
      for (var k = 0; k < links.length; k++) links[k].classList.remove("current");
      if (map[activeId]) map[activeId].classList.add("current");
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------- anchor links */
  function addAnchors() {
    var heads = document.querySelectorAll(".doc h2[id], .doc h3[id]");
    for (var i = 0; i < heads.length; i++) {
      (function (h) {
        var a = document.createElement("a");
        a.className = "anchor";
        a.href = "#" + h.getAttribute("id");
        a.textContent = "#";
        a.setAttribute("aria-label", "이 절 링크");
        h.appendChild(a);
      })(heads[i]);
    }
  }

  /* -------------------------------------------------------------- quizzes */
  function enhanceQuizzes() {
    var all = document.querySelectorAll(".quiz");
    for (var i = 0; i < all.length; i++) {
      (function (quiz) {
        var opts = quiz.querySelectorAll(".quiz-opt");
        var why = quiz.querySelector(".quiz-why");
        var status = quiz.querySelector(".quiz-status");
        for (var j = 0; j < opts.length; j++) {
          opts[j].addEventListener("click", function () {
            var picked = this;
            if (picked.classList.contains("correct") || picked.classList.contains("wrong")) return;

            var correct = picked.getAttribute("data-correct") === "true";
            picked.classList.add(correct ? "correct" : "wrong");
            if (correct) {
              picked.insertAdjacentText("beforeend", "  ✓");
              if (status) {
                status.textContent = "정답";
                status.style.color = "var(--ok)";
              }
            } else {
              picked.insertAdjacentText("beforeend", "  ✕");
              if (status) {
                status.textContent = "다시 생각해 보세요";
                status.style.color = "var(--err)";
              }
              // 정답도 함께 표시해서 바로 확인할 수 있게 한다
              for (var k = 0; k < opts.length; k++) {
                if (opts[k].getAttribute("data-correct") === "true" && !opts[k].classList.contains("correct")) {
                  opts[k].classList.add("correct");
                  opts[k].insertAdjacentText("beforeend", "  ✓ 정답");
                }
              }
            }
            if (why) {
              why.hidden = false;
              if (correct) setTimeout(function () { why.scrollIntoView({ block: "nearest" }); }, 30);
            }
          });
        }
      })(all[i]);
    }
  }

  /* --------------------------------------------------------------- reset */
  function wireReset() {
    var reset = document.querySelector("[data-reset-progress]");
    if (!reset) return;
    reset.addEventListener("click", function () {
      if (!window.confirm("이 페이지의 학습 완료 표시를 모두 지웁니다. 계속할까요?")) return;
      var ids = lessonIds();
      for (var i = 0; i < ids.length; i++) delete done[keyOf(ids[i])];
      saveDone();
      var marks = document.querySelectorAll(".lesson-check");
      for (var j = 0; j < marks.length; j++) {
        marks[j].setAttribute("aria-pressed", "false");
        marks[j].lastChild.textContent = "학습 완료로 표시";
      }
      paintProgress();
      syncSubNav();
      buildSubNav();
    });
  }

  /* ------------------------------------------------------------ bootstrap */
  function init() {
    enhanceCode();
    if (page === "home") {
      // 홈의 h2는 레슨이 아니다 — 체크박스·진도 표시를 쓰지 않는다
      var chip = document.querySelector("[data-progress-chip]");
      var foot = document.querySelector(".sidebar-foot");
      if (chip) chip.style.display = "none";
      if (foot) foot.style.display = "none";
    } else {
      enhanceLessons();
    }
    addAnchors();
    buildSubNav();
    paintProgress();
    enhanceQuizzes();
    wireReset();
    scrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
