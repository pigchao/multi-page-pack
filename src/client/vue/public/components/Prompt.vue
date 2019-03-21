<template>
  <div>
    <div class="g-prompt-mask" v-if="showMask"></div>
    <div class="g-prompt-wrap">
      <div class='g-prompt'>
        <div class="loading" v-if="loading">
          <span class="loading-spinners">
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
            <i class="loading-spinner"></i>
          </span>
        </div>
        <span class="content" v-html="content"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Prompt",
    data(){
      return{

      }
    },
    props:{
      content: String,
      timeout: Number,
      showMask: Boolean,
      loading: Boolean
    }
  }
</script>
<style lang="less">
  @import "../../../react/public/assets/style/prompt";
</style>

