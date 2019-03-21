<template>
  <div v-if="visible">
    <div class="g-dialog-mask"></div>
    <div class="g-dialog-wrap">
      <div class="g-dialog">
        <div class="hd" v-if="title">{title}</div>
        <div class="bd" v-html="content">
        </div>
        <div class="ft">
          <a v-for="item in button" class="btn" @click="onClick(item)" v-text="item.text"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import {hideDialog, isShowDialog} from "./dialogCtrl";
  import {isNull} from "../../../../isomorphism/fun";

  export default {
    data() {
      return {};
    },
    methods: {
      onClick(item) {
        if (isNull(item.callback) || item.callback() !== false) {
          isShowDialog(this) ? hideDialog() : this.$emit('close');
        }
      }
    },
    props: {
      visible: Boolean,
      title: String,
      content: String,
      button: {
        type: Array,
        default() {
          return [{text: 'OK'}];
        }
      }
    }
  };
</script>
<style lang="less">
  @import "../../../react/public/assets/style/dialog";
</style>
