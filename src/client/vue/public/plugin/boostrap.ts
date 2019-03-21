import Vue from "vue";

/**
 * 切换title指令
 */
const isMobile =
  typeof navigator !== "undefined"
    ? /mobile|iphone|android/i.test(navigator.userAgent)
    : userAgent => /mobile|iphone|android/i.test(userAgent);
const setDocumentTitle = title => {
  if (title === undefined || document.title === title) {
    return;
  }
  document.title = title;
  if (isMobile) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    const callback = () => {
      setTimeout(() => {
        iframe.removeEventListener("load", callback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener("load", callback);
    document.body.appendChild(iframe);
  }
};

Vue.directive("title", (el, data) => {
  setDocumentTitle(data.value);
});
