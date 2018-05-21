<template>
  <div id="more">
  	<div class="header"><h5 class="title"><span></span>更多设置</h5><span class="close" @click="goDinner"></span></div>
  	<div class="main">
  		<div class="left">
  			<!-- <router-link tag="li" to="/more" >
  				<a>设备状态</a>
			</router-link> -->
			<router-link to="/more">
  				设备状态
			</router-link>
			<router-link to="/more/printSet" >打印机设置</router-link>
			<router-link to="/more/prodClear" v-if="authority == 'yes'">商品估清</router-link>
			<a href="javascript:void(0)" v-if="authority == 'no'" @click="authorityEvt">商品估清</a>
			<!-- <a href="http://192.168.5.187:8026/chain-newspicyway/login/login#" target="_Blank">系统设置</a> -->
			<router-link to="/more/changePwd">修改密码</router-link>
			<!-- <router-link to="/more/help">使用帮助</router-link> -->
  		</div>
  		<div class="right">
  			<router-view></router-view>
  		</div>
  	</div>
  </div>
</template>

<script>
export default {
  name: 'More',
  data() {
  	return {
  		authority:''
  	}
  },
  created(){
  	this.authority=localStorage.getItem('authority')
  },
  methods:{
  	goDinner:function(){
  		this.$router.push({
  		  	path:"/dinner"
  		})
  	},
  	authorityEvt() {
  		this.message('无商品估清操作权限！');
  	}
  }
}
</script>

<style>
	#more{
		width: 100%;
		height:100%;
		background: #f4f4f4;
	    overflow: hidden;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	}
	#more .header{
		width:100%;
		height:0.6rem;
		display:flex;
		-webkit-box-sizing: border-box;
	    box-sizing: border-box;
		justify-content: space-between;
		/*background: #ff7e4b;*/
		background: url('../../static/images/bg_header.png') no-repeat center center;
    	background-size: 100% 100%;
		margin:0 auto;
		padding: 0 0.3rem;
	}
	#more .header .title{
		font-size:0.2rem;
		line-height:0.6rem;
		color: #fff;	
	}
	#more .header .title span{
		color:#ff7e4b;
		color: white;

	}
	#more .header .close{
		cursor: pointer;
		width:0.2rem;
		height:0.6rem;
		background: url('../../static/images/ic_close.png') no-repeat center center;
		/*margin-right: 0.2rem; */
	}
	#more .main{
		display: flex; 
		/*width: 90%;*/
		width: 100%;
		height: calc(100% - 0.6rem);
		padding: 0.2rem 0.3rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	#more .main .left{
		width:1.5rem;
		height:100%;
		overflow: auto;
		margin-right: 0.2rem;
		background-color: #fff;
		border-right: 1px solid #f4f4f4;
	}
	.active{
		color:red;
	}
	#more .left li{
		list-style: none;
	}
	#more .left li.router-link-active {
		background-color: #ff7e4b;
	}
	#more .left li a{
		width:1rem;
		height:0.6rem;
		list-style: none;
		display: block;
		margin: 0 auto; 
		/*border-bottom: 1px solid #f4f4f4;*/
		border-radius: 5px;
		text-align: center;
		line-height: 0.6rem;
		font-size: 0.16rem; 
		color: #fff;
		/*margin-top: 0.2rem;*/
	}
	#more .left>a{
		width:1rem;
		height:0.6rem;
		display: block;
		margin: 0 auto; 
		border-bottom: 1px solid #f4f4f4;
		/*border-radius: 5px;*/
		text-align: center;
		line-height: 0.6rem;
		font-size: 0.16rem; 
		/*margin-top: 0.2rem;*/
	}
	#more .left>a:not(.router-link-exact-active):hover {
		color: #ff7e4b;
	}
	#more .left>a:last-child{
		border-bottom: none;
	}
	#more .left>a.router-link-exact-active {
		background-color: #ff7e4b;
		width: 100%;
		border-bottom: 0;
		color: #fff;
	}
	#more .right{
		width: calc(100% - 1.7rem);
		height:100%;
		overflow: auto;
		background-color: #fff;
		padding: 0.2rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
</style>
