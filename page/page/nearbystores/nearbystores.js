import Vue from 'vue';
import App from './app';

let vm=new Vue({
	el: document.querySelector('.my'),
	template: '<App/>',
	components: { App },
	replace: false
})