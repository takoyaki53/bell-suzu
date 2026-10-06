(function () {
  const games = window.GAMES || [];
  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const panel = modal.querySelector(".modal__panel");
  let lastFocus = null;

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- helpers ----
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => node.append(c));
    return node;
  }

  function thumb(game) {
    const t = el("div", { class: "thumb", "aria-hidden": "true" });
    if (game.thumbnail) {
      t.style.backgroundImage = `url("${game.thumbnail}")`;
    } else {
      const c = game.colors || ["#2b4a8a", "#0f1b33"];
      t.style.background = `linear-gradient(160deg, ${c[0]}, ${c[1]})`;
      t.textContent = game.icon || "🔔";
    }
    return t;
  }

  function tagList(game) {
    return el("div", { class: "tags" }, (game.tags || []).map((t) => el("span", { class: "tag", text: t })));
  }

  // ---- list & filter ----
  function renderFilters() {
    const genres = ["すべて", ...new Set(games.map((g) => g.genre))];
    genres.forEach((name, i) => {
      const b = el("button", { class: "chip", type: "button", "aria-pressed": String(i === 0), text: name });
      b.addEventListener("click", () => {
        filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        renderGrid(i === 0 ? null : name);
      });
      filters.append(b);
    });
  }

  function renderGrid(genre) {
    grid.replaceChildren();
    games.filter((g) => !genre || g.genre === genre).forEach((g) => {
      const card = el("button", { class: "card", type: "button", "aria-haspopup": "dialog" }, [
        thumb(g),
        el("div", { class: "card__body" }, [
          el("span", { class: "card__genre", text: g.genre }),
          el("h3", { class: "card__title", text: g.title }),
          el("p", { class: "card__summary", text: g.summary }),
          tagList(g)
        ])
      ]);
      card.addEventListener("click", () => openModal(g));
      grid.append(card);
    });
  }

  // ---- modal ----
  function playArea(game) {
    const wrap = el("div", {});
    const actions = el("div", { class: "actions" });
    const player = el("div", { class: "player" });
    player.hidden = true;

    (game.play || []).forEach((p) => {
      const ready = Boolean(p.url);
      if (p.type === "embed") {
        const b = el("button", { class: "btn btn--primary", type: "button", text: "▶ ブラウザで遊ぶ" });
        if (!ready) b.setAttribute("aria-disabled", "true");
        b.addEventListener("click", () => {
          if (!ready) return showNotice(wrap, "このゲームは準備中です。もうしばらくお待ちください。");
          if (player.hidden) {
            const frame = el("iframe", { src: p.url, title: game.title + " のプレイ画面", allowfullscreen: "", allow: "fullscreen; autoplay; gamepad" });
            const full = el("button", { class: "btn", type: "button", text: "全画面" });
            full.addEventListener("click", () => frame.requestFullscreen && frame.requestFullscreen());
            player.replaceChildren(frame, el("div", { class: "player__bar" }, [full]));
            player.hidden = false;
            player.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
        actions.append(b);
      } else {
        const isDl = p.type === "download";
        const a = el("a", { class: "btn", text: p.label || (isDl ? "⬇ ダウンロード" : "外部サイトで見る") });
        if (ready) {
          a.href = p.url;
          if (isDl) a.setAttribute("download", "");
          else { a.target = "_blank"; a.rel = "noopener"; }
        } else {
          a.href = "#";
          a.setAttribute("aria-disabled", "true");
          a.addEventListener("click", (e) => { e.preventDefault(); showNotice(wrap, "このリンクは準備中です。"); });
        }
        actions.append(a);
      }
    });
    wrap.append(actions, player);
    return wrap;
  }

  function showNotice(wrap, msg) {
    let n = wrap.querySelector(".notice");
    if (!n) { n = el("p", { class: "notice", role: "status" }); wrap.append(n); }
    n.textContent = msg;
  }

  function openModal(game) {
    lastFocus = document.activeElement;
    panel.setAttribute("aria-labelledby", "modal-title");
    const shots = (game.screenshots || []).length
      ? el("div", { class: "shots" }, game.screenshots.map((s) => el("img", { src: s, alt: game.title + " のスクリーンショット", loading: "lazy" })))
      : null;
    const detail = el("div", { class: "detail" }, [
      el("span", { class: "card__genre", text: game.genre }),
      el("h3", { id: "modal-title", text: game.title }),
      el("p", { text: game.description }),
      tagList(game),
      ...(shots ? [shots] : []),
      el("dl", {}, [el("dt", { text: "操作方法" }), el("dd", { text: game.controls || "-" })]),
      playArea(game)
    ]);
    modalBody.replaceChildren(thumb(game), detail);
    modal.hidden = false;
    document.body.classList.add("is-locked");
    modal.querySelector(".modal__close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    modalBody.replaceChildren(); // iframeも破棄してゲームを止める
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") return closeModal();
    if (e.key === "Tab") { // フォーカストラップ
      const f = [...panel.querySelectorAll("button, a[href], iframe")].filter((n) => !n.hidden && n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---- mobile nav ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  renderFilters();
  renderGrid(null);
})();
