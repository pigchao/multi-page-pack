interface Window {
  Vue: any;
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.json";
