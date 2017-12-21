<template>
  <div class="hello">
      <h2>{{msg}}</h2>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'hi',
  data:function () {
    return {
      msg: '我是练习练习练习hihihihihihi'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
