(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const nameInput = $("nameInput");
  const createBtn = $("createWishBtn");
  const wishSection = $("wishSection");
  const wishFromLine = $("wishFromLine");
  const shareBtn = $("shareBtn");
  const whatsappBtn = $("whatsappBtn");
  const copyBtn = $("copyBtn");
  const copyText = $("copyText");
  const copyMessage = $("copyMessage");
  const toast = $("toast");
  const toastText = $("toastText");
  const anotherNameInput = $("anotherNameInput");
  const anotherWishBtn = $("anotherWishBtn");

  const shareModal = $("shareModal");
  const closeShare = $("closeShare");
  const shareBackdrop = $("shareBackdrop");
  const nativeShare = $("nativeShare");
  const shareWhatsApp = $("shareWhatsApp");
  const shareTelegram = $("shareTelegram");
  const shareEmail = $("shareEmail");

  function cleanName(value) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
  }

  function getName() {
    const urlName = new URLSearchParams(location.search).get("name");
    return cleanName(nameInput.value) || cleanName(urlName) || "";
  }

  function makeURL(name) {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("name", name);
    return url.toString();
  }

  function messageFor(name, url) {
    return `🙏 જય શ્રી કૃષ્ણ 🙏\n${url}`;
  }

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function openShare() {
    shareModal.classList.add("show");
    shareModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeShareModal() {
    shareModal.classList.remove("show");
    shareModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  async function copyLink(url) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      }
    } catch (_) {}
    try {
      const area = document.createElement("textarea");
      area.value = url;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  function createWish(value, scroll = true) {
    const name = cleanName(value);
    if (!name) {
      showToast("કૃપા કરીને તમારું નામ લખો ✨");
      (anotherNameInput || nameInput).focus();
      return false;
    }

    nameInput.value = name;
    if (anotherNameInput) anotherNameInput.value = name;
    wishFromLine.textContent = name;
    document.title = `${name} તરફથી શ્રી કૃષ્ણ જન્માષ્ટમીની શુભેચ્છા`;

    history.replaceState({ name }, "", makeURL(name));
    wishSection.classList.add("show");
    document.body.classList.add("shared-view");

    if (scroll) {
      setTimeout(() => wishSection.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
    return true;
  }

  createBtn.addEventListener("click", () => createWish(nameInput.value, true));

  if (anotherWishBtn && anotherNameInput) {
    anotherWishBtn.addEventListener("click", () => {
      createWish(anotherNameInput.value, true);
    });

    anotherNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        createWish(anotherNameInput.value, true);
      }
    });
  }

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createWish(nameInput.value, true);
    }
  });

  shareBtn.addEventListener("click", () => {
    if (!getName()) {
      showToast("પહેલા તમારું નામ લખો ✨");
      nameInput.focus();
      return;
    }
    openShare();
  });

  nativeShare.addEventListener("click", async () => {
    const name = getName();
    if (!name) return;
    const url = makeURL(name);
    const data = {
      title: "શ્રી કૃષ્ણ જન્માષ્ટમીની શુભેચ્છા",
      text: "🙏 જય શ્રી કૃષ્ણ 🙏",
      url
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        closeShareModal();
        showToast("શુભેચ્છા શેર થઈ ગઈ ✨");
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }

    // Browser does not support native share: open the best available app choices.
    closeShareModal();
    showToast("નીચેના Share options માંથી પસંદ કરો ✨");
    setTimeout(openShare, 250);
  });

  function openApp(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    closeShareModal();
  }

  shareWhatsApp.addEventListener("click", () => {
    const name = getName();
    if (!name) return;
    const url = makeURL(name);
    openApp(`https://wa.me/?text=${encodeURIComponent(messageFor(name, url))}`);
  });

  shareTelegram.addEventListener("click", () => {
    const name = getName();
    if (!name) return;
    const url = makeURL(name);
    openApp(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("🙏 જય શ્રી કૃષ્ણ 🙏")}`);
  });

  shareEmail.addEventListener("click", () => {
    const name = getName();
    if (!name) return;
    const url = makeURL(name);
    const subject = "શ્રી કૃષ્ણ જન્માષ્ટમીની શુભેચ્છા 🦚";
    openApp(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageFor(name, url))}`);
  });

  closeShare.addEventListener("click", closeShareModal);
  shareBackdrop.addEventListener("click", closeShareModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeShareModal();
  });

  whatsappBtn.addEventListener("click", () => {
    const name = getName();
    if (!name) {
      showToast("પહેલા તમારું નામ લખો ✨");
      nameInput.focus();
      return;
    }
    const url = makeURL(name);
    openApp(`https://wa.me/?text=${encodeURIComponent(messageFor(name, url))}`);
  });

  copyBtn.addEventListener("click", async () => {
    const name = getName();
    if (!name) {
      showToast("પહેલા તમારું નામ લખો ✨");
      nameInput.focus();
      return;
    }

    const ok = await copyLink(makeURL(name));
    if (ok) {
      copyText.textContent = "Copied ✓";
      copyMessage.classList.add("show");
      showToast("Personalized link copied ✨");
      clearTimeout(window.__copyTimer);
      window.__copyTimer = setTimeout(() => {
        copyText.textContent = "Copy Link";
        copyMessage.classList.remove("show");
      }, 2200);
    } else {
      showToast("Link copy થઈ શકી નથી");
    }
  });

  const savedName = cleanName(new URLSearchParams(location.search).get("name"));
  if (savedName) {
    nameInput.value = savedName;
    createWish(savedName, false);
    if (anotherNameInput) anotherNameInput.value = "";
    setTimeout(() => {
      wishSection.scrollIntoView({ behavior: "auto", block: "start" });
    }, 80);
  }
})();
