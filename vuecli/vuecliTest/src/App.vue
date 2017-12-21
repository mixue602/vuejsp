<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <router-link to="/">首页</router-link> |
      <router-link to="/hi">练习hi</router-link> |
      <router-link :to="{name:'hi11',params:{username:'mixuehua',id:'666'}}">练习hi11</router-link> |
      <router-link to="/hi/hi22">练习hi22</router-link> |
    </div>
    <p>{{$router.name}}</p>
    <router-view></router-view>
    <router-view name="left" style="float:left;width:50%;height:300px;background:#dedede;"></router-view>
    <router-view name="right" style="float:left;width:50%;height:300px;background:#f6f6f6;"></router-view>
    
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
