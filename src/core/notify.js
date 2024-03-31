export const notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const enterAnimation = "a-notification--enter";
  function showNotification(text, elClass, duration = 1500, clickFn) {
    if (!GameUI.initialized) {
      setTimeout(showNotification, 500, text, elClass, duration, clickFn);
      return;
    }
    let leaveAnimation = "a-notification--leave";
    const el = template.cloneNode();
    el.textContent = text;
    el.classList.add(elClass, enterAnimation);
    const container = document.getElementById("notification-container");
    if (container.children.length === 1) {
      setTimeout(function() {
        showNotification(text, elClass, duration, clickFn)
      }, 100)
      return
    }
    let startPos = 0;
    let start = 0;
    let timeout = 0;
    let curPos = 0
    el.ontouchstart = event => {
      startPos = event.targetTouches[0].pageX;
      start = Date.now();
      clearTimeout(timeout);
    }
    el.ontouchmove = event => {
      const diff = Math.max(event.targetTouches[0].pageX - startPos, 0);
      curPos = event.targetTouches[0].pageX;
      el.style.transform = `translateX(${diff}px)`;
      el.style.opacity = `${(window.innerWidth - diff) / window.innerWidth}`;
    }
    el.ontouchend = () => {
      const diff = Math.max(curPos - startPos, 0);
      el.style.transform = "";
      el.style.opacity= "";
      if (diff > window.innerWidth * 0.6) {
        leaveAnimation = "a-notification--leave__manual";
        leave();
        event.stopPropagation();
        return;
      };
      const now = Date.now();
      left -= start - last;
      console.log(left);
      last = now;
      timeout = setTimeout(() => leave(), left);
    }
    container.appendChild(el);
    let entered = false;
    function stopEnter() {
      if (entered) return;
      entered = true;
      el.classList.remove(enterAnimation);
    }
    setTimeout(() => stopEnter(), 500);
    let leaving = false;
    function leave() {
      if (leaving) return;
      leaving = true;
      stopEnter();
      el.classList.add(leaveAnimation);
      setTimeout(() => el.remove(), 500);
    }
    let last = Date.now();
    let left = duration;
    timeout = setTimeout(() => leave(), duration);
    if (clickFn !== undefined) {
      el.onclick = clickFn;
    } else {
      el.onclick = () => leave();
    }
  }
  return {
    success: (text, duration, clickFn) => showNotification(text, "o-notification--success", duration, clickFn),
    error: (text, duration, clickFn) => showNotification(text, "o-notification--error", duration, clickFn),
    info: (text, duration, clickFn) => showNotification(text, "o-notification--info", duration, clickFn),
    infinity: (text, duration, clickFn) => showNotification(text, "o-notification--infinity", duration, clickFn),
    eternity: (text, duration, clickFn) => showNotification(text, "o-notification--eternity", duration, clickFn),
    reality: (text, duration, clickFn) => showNotification(text, "o-notification--reality", duration, clickFn),
    automator: (text, duration, clickFn) => showNotification(text, "o-notification--automator", duration, clickFn),
    blackHole: (text, duration, clickFn) => showNotification(text, "o-notification--black-hole", duration, clickFn),
    strike: (text, duration, clickFn) => showNotification(text, "o-notification--strike", duration, clickFn),
    showBlackHoles: true
  };
}())