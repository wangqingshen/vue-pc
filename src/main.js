// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import global_ from '../src/components/public/Global'
// import stores from './store/store.js' 

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.GLOBAL = global_;
// axios.defaults.baseURL=global_.baseUrl;
axios.defaults.withCredentials=true;
Vue.prototype.$ajax=axios;
/* eslint-disable no-new */
/*全局获取权限函数*/ 
Vue.prototype.authority = function (a,b){//判断当前员工是否有当前操作权限
 	if(!(a instanceof Array)) return false;
    // if(a.length < b.length) return false;
    var aStr = a.toString();	    
     if(aStr.indexOf(b) == -1){
     	return false;
     }else{
     	return true;
     } 	   	    
}
Vue.filter('keepTwoNum', function(val){
	val = Number(val);
	return val.toFixed(2);
})
Vue.prototype._getAut = function (url){//获取操作权限
	// let arr = JSON.parse(localStorage.getItem("authorityAll")),
	// 	arr1 = JSON.parse(localStorage.getItem("authorityAllOnce")),	
	// 	that=this;					  			
	// if(!that.authority(arr,url)){	  		      				
	// 	if(that.authority(arr1,url)){   								
	// 	  	return true;	
	// 	}else{			      		
	// 		that.getAut=true;
	// 		that.url=url;
	// 		console.log(2)
	// 		return false;
	// 	}
	// }else{
	// 	return true;
	// }
	return true;	
}
router.beforeEach((to, from, next) => {
	// if(navigator.userAgent.indexOf('Wemew') != -1) {
	//     alert('请在指定的应用程序中打开该地址');
	//     return false;
	// }else{
		if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
	 		if (localStorage.getItem('username')) {// 判断是否登录
	  			next()
	 		} else {// 没登录则跳转到登录界面
	  			next({
				  	path: '/',
				  	query: {redirect: to.fullPath}
				})
	 		}
	 	} else if(to.matched.some(res => res.meta.requireLogin)){ 
	 		if(localStorage.getItem('username')) {
	 			//登录了则跳转home页面
		 		next({
				  	path: '/dinner',
				  	query: {redirect: to.fullPath}
				})
	 		}else{
	 			next()
	 		}
	 	}
	// }
})
// axios.interceptors.request.use(function(config){  
//     stores.dispatch('showloader')  
//     return config  
// },function(err){  
//     return Promise.reject(err)  
// });  
// axios.interceptors.response.use(function(response){  
//     stores.dispatch('hideloader')  
//     return response  
// },function(err){  
//     return Promise.reject(err)  
// });  

//提示信息
Vue.prototype.message = function(text,type='warning',time=2000){
	this.$message({
        showClose: false,
        message: text,
        type: type,
        center:true,
        duration:time
    });
}

new Vue({
  el: '#app',
  router,
  // store: stores,
  components: { App},
  template: '<App/>'
})

var timer = setInterval(()=>{
	if(localStorage.getItem('closeState') && localStorage.getItem('username')) {
		var ucode = localStorage.getItem('username');
		localStorage.removeItem("username");
	    localStorage.removeItem("userid");
	    localStorage.removeItem("user");
	    localStorage.removeItem("closeState");
		axios.get(localStorage.getItem('apiurl')+'/padinterface/logout').then((res)=>{}) 
		if(localStorage.getItem('tableID')) {
			axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=0&tableid=' + localStorage.getItem('tableID')+'&ucode=' + ucode).then(res => {})
		}  
		clearInterval(timer);       
	}
	
},100)

