import Vue from "vue";
import { isNotNull, isNull } from "../../../../isomorphism/fun";
import Dialog from "./Dialog.vue";

let div;
let vm;

export function hideDialog() {
  if (isNotNull(div) && isNotNull(vm)) {
    vm.$destroy();
    if (vm.$el) {
      vm.$el.parentNode.removeChild(vm.$el);
      div = null;
      vm = null;
    }
  }
}

export function showDialog(param) {
  const config = typeof param === "string" ? { content: param } : param;
  if (isNull(div) && isNull(vm)) {
    div = document.createElement("div");
    document.body.appendChild(div);
    vm = new Vue({
      render: h => h(Dialog, { props: { ...config, visible: true } })
    }).$mount(div);
  }
}

export function isShowDialog(vmComponent) {
  return vm && vmComponent && vm.$el === vmComponent.$el;
}
