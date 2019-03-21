import Vue from "vue";
import Prompt from "./Prompt.vue";
import { isNotNull, isNull } from "../../../../isomorphism/fun";

let div;
let component;
let timeout;
let timeoutId = -1;

export function hidePrompt(callback?) {
  clearTimeout(timeoutId);
  if (isNotNull(div) && isNotNull(component)) {
    component.$destroy();
    if (component.$el) {
      component.$el.parentNode.removeChild(component.$el);
      div = null;
      component = null;
    }
    if (typeof callback === "function") {
      callback();
    }
  }
}
// 显示
export function showPrompt(param) {
  const config = typeof param === "string" ? { content: param } : param;
  timeout = typeof config.timeout === "undefined" ? (config.loading ? 150000 : 1500) : config.timeout;
  if (isNull(div) && isNull(component)) {
    div = document.createElement("div");
    document.body.appendChild(div);
    component = new Vue({
      render: h => h(Prompt, { props: config })
    }).$mount(div);
  }
  clearTimeout(timeoutId);
  if (timeout > 0) {
    timeoutId = window.setTimeout(() => {
      hidePrompt(config.callback);
    }, timeout);
  }
}
