<template>
  <div>
    <div v-if="showMask" class="g-loading-mask"/>
    <div class="g-loading g-loading-circle"/>
  </div>
</template>
<script>
  export default {
    name:'Loading',
    componentName:'Loading',
    data(){
      return{}
    },
    props:{
      showLoading:{
        type:Boolean,
        default(){
          return false
        }
      },
      showMask:{
        type:Boolean,
        default(){
          return false
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../../../react/public/assets/style/loading";
</style>
