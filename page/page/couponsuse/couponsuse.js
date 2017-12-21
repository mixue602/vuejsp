import Vue from 'vue';
import App from './app';

new Vue({
	el: document.querySelector('.my'),
	template: '<App/>',
	components: { App },
	replace: false
})
