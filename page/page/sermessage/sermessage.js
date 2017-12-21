import Vue from 'vue';
import App from './app';

Vue.use(VueLazyload, {  
	preLoad: 1.3,  
	error: '//gfs13.gomein.net.cn/T1clLvByWT1RCvBVdK.png',  
	loading: '//gfs13.gomein.net.cn/T1clLvByWT1RCvBVdK.png', 
	attempt: 1
});

new Vue({
	el: document.querySelector('.my'),
	template: '<App/>',
	components: { App },
	replace: false
})
