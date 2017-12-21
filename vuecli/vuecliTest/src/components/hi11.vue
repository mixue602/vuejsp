<template>
  <div class="hello">
      <h2>{{msg}}{{$route.params.username}}/{{$route.params.id}}</h2>
  </div>
</template>

<script>
export default {
  name: 'hi',
  data:function () {
    return {
      msg: '我是练习练习练习hi111111111111'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
