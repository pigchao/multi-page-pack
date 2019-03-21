<template>
  <div class="container">
    This is vue test
    <button @click="show">show</button>
    <button @click="show1">show1</button>
    <button @click="hide">hide</button>
    <button @click="start">start</button>
    <button @click="stop">stop</button>
    <Dialog :visible="visible" @close="visible=false" :button="[{text:'OK', callback:okClick},{text:'Cancel', callback: cancelClick}]" content="hello hello"></Dialog>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        isStop: false,
        visible: false,
      };
    },
    methods:{
      okClick(){
        alert('ok click')
      },
      cancelClick(){
        alert('cancel click')
      },
      show(){
        showDialog({
          content: 'hello show',
          button: [
            {text:'OK', callback: this.okClick},
            {text:'Cancel', callback: this.cancelClick}
          ]
        });
      },
      show1(){
        // showDialog('hello');
        this.visible = true;
      },
      hide(){
        hideDialog();
      },
      start(){
        if(!this.isStop){
          this.show();
          this.hide();
          setTimeout(this.start, 50);
        }
      },
      stop(){
        this.isStop = true;
      }
    },
    components: {Dialog}
  };
</script>
