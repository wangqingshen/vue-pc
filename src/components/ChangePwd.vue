<template>
	<form class="changePwd">
	  	<label>原密码</label><input type="password" name="" v-model="oldpass" @focus="inputEvt"/><br/>
	  	<label>新密码</label><input type="password" name="" v-model="newpass" @focus="inputEvt"/><br/>
	  	<label>确认密码</label><input type="password" name="" v-model="confirmpass" @focus="inputEvt"/><br/>
	  	<div class="errorMsg" v-if="errorMsg">{{msg}}</div>
		<el-button class="btn disabled" v-show="!(this.oldpass && this.newpass && this.confirmpass)">提交</el-button>
		<el-button class="btn" @click.prevent="checkForm" v-show="this.oldpass && this.newpass && this.confirmpass">提交</el-button>
  	</form>
</template>

<script>
import axios from 'axios'
import Global from '../components/public/Global'
export default {
  name: 'ChangePwd',
  data(){
  	return{
  		apiurl: localStorage.getItem('apiurl'),
  		errorMsg: false,
  		msg: '',
  		oldpass: '', //原密码
  		newpass: '', //新密码
  		confirmpass: '', //确认密码
  		msgtext: ['两次密码不一致','原密码不正确', '修改密码成功'],
  	}
  },
  methods:{
  	checkForm () {
  		if(this.newpass !== this.confirmpass) {
  			this.msg = this.msgtext[0];
  			this.errorMsg = true;
  			return false;
  		}
  		this.submitEvt();
  	},
  	inputEvt () {
  		this.msg = '';
  	},
  	submitEvt() {
  		let self = this;
  		axios({
          method:"GET",
          url: this.apiurl + '/padinterface/uppass?oldpass='+this.oldpass+'&&newpass='+this.newpass+'&jobNumber='+localStorage.getItem('username'),
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
             if(res.data.data == '-1') {
             	this.msg = this.msgtext[1];
  				this.errorMsg = true;
             }else if(res.data.data == '0') {
             	this.msg = '';
             	this.errorMsg = false;
             	// this.oldpass = '';
             	// this.newpass = '';
             	// this.confirmpass = '';
             	this.logout();  	
             }
        })
  	},
  	logout () {
  		let self = this;
  		axios.get(this.apiurl+'/padinterface/logout').then((res)=>{
	        if(res.data.code==0){
	          	localStorage.removeItem("username");
	          	localStorage.removeItem("userid");
	          	localStorage.removeItem("user");
	          	self.message(self.msgtext[2], 'success');
              	self.$router.push({
				  	path:'/' 		
				})
	        }
      })                 
  	}
  }
}
</script>

<style>
	.changePwd{
		/*width: 80%;
		height:80%;
		padding-top: 0.2rem;*/
		width: 100%;
		height: 100%;
	}
	.changePwd label{
		display: block;
		/*width: 0.8rem;*/
		/*height:0.4rem;*/
		width: 100%;
		text-align: left;
		line-height: 0.2rem;
		font-size: 0.14rem;
		color: #999;
	}
	.changePwd input{
		width: 2.6rem;
		height:0.35rem;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border: 1px solid #ccc;
		/*margin: 0.2rem;*/
		margin-bottom: 0.15rem;
		padding: 0 0.1rem;
	}
	.changePwd button.el-button {
		width: 2.6rem;
		background-color: #ff7e4b;
		border-radius: 0.05rem;
		margin: 0.2rem 0;
	}
	.changePwd button.el-button.disabled {
		background-color: #ccc;
		cursor: default;
	}
	.changePwd button.el-button>span{
		color: #fff;
	}
	.changePwd .errorMsg {
		color: #f00;
	}
</style>