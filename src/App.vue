<template>
  <div id="app">
  	<!-- <Loading v-show="showLoading"></Loading>   -->
    <router-view/>
  </div>
</template>

<script>
// import Loading from './components/Loading.vue' 
// import {mapGetters} from 'vuex'
export default {
	// components:{  
	//     Loading  
	// },  
  	name: 'App',
  	// computed:mapGetters([
  	// 	'showLoading'
  	// ])
}
</script>

<style>
#app {} 
</style>
