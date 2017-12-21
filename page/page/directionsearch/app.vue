<template>
	<div class="wapper">
		<header-components :title="headoptions.title"></header-components>
		<search-input></search-input>
	</div>
</template>
<script>
    import searchInput from './searchInput.vue'
    import headerComponents from '../../components/HeaderComponent' 
	export default {
		data() {
			return {
				headoptions:{
					title: '搜索',
	                rightmenus: {
	                    type: 'text',
	                    content: ''
	                }
				}
			}
		},
		created() {

		},
		methods:{

		},
		components:{
			searchInput,
			headerComponents
		}
	}
</script>
<style>
	
</style>