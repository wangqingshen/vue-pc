<template>
<div id="login">
	<div class="loginBox" v-if="loginBox">
		<h4>微喵收银系统</h4>		
		<div class="box">			
			<!-- 从机模式登录 -->
			<div class="loginAssist inputBox" v-show="loginMain">
				<span></span>
				<input type="text" v-model.trim="branchId" name="" placeholder="商户ID" class="input branchIdInput" @blur="searchID" @focus="input($event)" data-type=0 data-value=1 :readonly='branch?true:false'>
				<em>{{branchName}}</em>				
			</div>
			<!-- 主机模式登录 -->
			<div class="loginMain inputBox" v-show="loginAssist"><span></span>
				<input type="text" v-model.trim="ip" name="" placeholder="输入服务器主机IP" class="input" @focus="input($event,2)" @blur="ipCheck" data-type=0 data-value=2>
					<!-- <option v-for="serverIp in serverIps">{{serverIp}}</option> -->
				</select>
				<!-- <span @click="refresh"></span> -->
			</div>
			<div class="staffId inputBox"><span></span><input type="text" v-model.trim="jobNumber" name="" placeholder="员工ID" class="input" @focus="input($event)" data-type=0 data-value=3></div>
			<div class="pwd inputBox"><span></span><input type="password" autocomplete="new-password" v-model.trim="password" name="" placeholder="登录密码" class="input" @focus="input($event)" data-type=0 data-value=4></div>
			<p>{{error}}{{error1}}</p>
		</div>
		<button type="primary" class="btn" v-show="((loginAssist && !ip) || (loginMain && !branchId)) || !jobNumber || !password">登录</button>
		<button type="primary" @click="onSubmit" class="btn btnLog" v-show="((loginAssist && ip) || (loginMain && branchId)) && jobNumber && password">登录</button>
		<p>本机IP:{{localIP}}</p>
		<p type="primary" v-show="loginAssist&&first==0" class="pattern" @click="assistLogin">主机模式<span></span></p>
		<p type="primary" v-show="loginMain&&first==0" class="pattern" @click="mainLogin">从机模式<span></span></p>
		<div class="_keyboard">
			<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"/>
		</div>
	</div>
	<div class="open" v-if="open">
		<div class="header"><h5>开班确认</h5><span @click="closeOpen"></span></div>
		<div class="box">
			<div class="left">
				<label>领取备用金</label><br/>
				<input type="text" name="" v-model="pettyCash" ref='input' @focus="input($event)" data-type=1 data-value=5>
				<button @click="confirmOpen">确认</button>
			</div>
			<div class="right">
				<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"/>
			</div>
		</div>
	</div>
	<loading v-show="showLoad && loginMain"></loading>
</div>

</template>

<script>
import axios from 'axios';
import Bus from '../bus.js';
import Keyboard from '../components/public/Keyboard';
import Loading from '../components/Loading';
export default {
  name: 'Login',
  components:{Keyboard, Loading},
  data(){
    return {
    	loginBox:true,
    	loginMain:true,
    	loginAssist:false,   	
    	open:false,
    	ip:'',
    	localIP: '127.0.0.1',
    	apiurl: '',
    	branchId:'',
    	branch:'',
    	jobNumber:'',
    	password:'',
    	branchName:'',
    	pettyCash:'',
    	error:'',
    	error1:'',
    	value:'',
		inputType:'',
        backMoney:'',
        port: ':8022',
        ipError: '无法连接主机，请检查主机程序是否启动',
        first:0,
        showLoad: false,
        text:'',
        flag:0
    }
  }, 
  methods:{
  	onSubmit(){
  		var username = this.jobNumber,
  			password = this.password,
  			loginType = '',
  			loginForm = {},
  			authorityAll=[];
  		var that = this;
  		if(this.loginMain){// 主机模式		
  			this.showLoad = true;	
  			loginForm = {
  				'loginType':"main",
  				'branchId':this.branchId,
  				'username':username,
  	 			'password':password
  			}
  			loginType="main"	
  			axios.post(this.apiurl+'/padinterface/login.json',
  				loginForm,
	     	).then((res)=>{  
	     		this.showLoad = false;    	
            	if(res.data.code==0){//登陆成功,记录登录用户名，登录模式，商户ID
			   		// console.log(res)
			   		let arr = res.data.authority;
			   		if(arr.length){
			   			for(var i in arr){
			   				authorityAll.push(arr[i].url)
			   			}
			   		}			   						   				    
			   		this.ip=res.data.ip//返回主机ip并显示
				    localStorage.setItem("username",username)
				    localStorage.setItem('name',res.data.user.name)
				    localStorage.setItem("loginType",loginType)	
				    localStorage.setItem("ip",this.localIP)
				    localStorage.setItem("apiurl", this.apiurl);
				    localStorage.setItem("branchId",this.branchId)
				    localStorage.setItem('tenantid',res.data.user.tenantid)
				    localStorage.setItem('branch',this.branchName)
				    if(res.data.cashier=='true'||res.data.cashier){
				    	localStorage.setItem('authority','yes')//权限
				    }else{
				    	localStorage.setItem('authority','no')
				    }
					// localStorage.setItem('authorityAll',JSON.stringify(authorityAll))//全部权限
					localStorage.setItem('first',1)
				    if(res.data.jb){
				    	if(res.data.cashier){
					   	  	this.loginBox=false;
		  				 	this.open=true; 
					    }else{
					   	 	this.$router.push({
					   	  		path:'/dinner'
					   		})
					    }
				    }else{
				    	this.$router.push({
				   	  		path:'/dinner'
				   		})
				    }				    			   	 
			    }else if(res.data.code==1){
			   		this.error=res.data.msg
			    }else if(res.data.code == '-2'){
			    	this.error='请勿重复登录'
			    }else{
			    	this.error=res.data.msg;
           //  		this.$message({
			        //   message: res.data.msg,
			        //   type: 'warning',
			        //   center: true,
	          // 		  duration:2000
			        // });
            		return
            	}
            }).catch(function(error){
            	that.showLoad = false;
            })
  		}else if(this.loginAssist){//丛机模式
  			let bool = this.ipCheck()  			
  			if(!bool) return
  	 		loginForm = {
  				'loginType':"assist",
  				'username':username,
  	 			'password':password,
  	 			'ip':this.ip
  			}
  			loginType="assist"
  			axios.post('http://'+this.ip+this.port+'/padinterface/login.json',
			    loginForm
	        ).then((res)=>{
        	    if(res.data.code==0){//登陆成功,记录登录用户名，登录模式，ip
			   		let arr = res.data.authority;
			   		if(arr.length){
			   			for(var i in arr){
			   				authorityAll.push(arr[i].url)
			   			}
			   		}
				    localStorage.setItem("username",username)
				    localStorage.setItem('name',res.data.user.name)
				    localStorage.setItem("loginType",loginType)
				    localStorage.setItem("ip",this.ip)
				    localStorage.setItem("apiurl", 'http://'+this.ip+this.port);
				    this.apiurl = 'http://' + this.ip + this.port;
    				this.localIP = this.ip;
				    localStorage.setItem("branchId",res.data.user.branchid)
				    localStorage.setItem('tenantid',res.data.user.tenantid)
				    if(res.data.cashier=='true'||res.data.cashier){
				    	localStorage.setItem('authority','yes')//权限
				    }else{
				    	localStorage.setItem('authority','no')
				    }					    	
				    localStorage.setItem('authorityAll',JSON.stringify(authorityAll))//全部权限	
				    localStorage.setItem('first',1) 	 
				    if(res.data.jb){
				    	if(res.data.cashier){
					   	  	this.loginBox=false;
		  				 	this.open=true; 
					    }else{
					   	 	this.$router.push({
					   	  		path:'/dinner'
					   		})
					    }
				    }else{
				    	this.$router.push({
				   	  		path:'/dinner'
				   		})
				    }			   	 
			    }else if(res.data.code==1){
			   		this.error=res.data.msg
			    }else if(res.data.code=='-2'){
			   		this.error='请勿重复登录'
			    }else{  
			    	this.error=res.data.msg         		
           //          this.$message({
			        //   message: res.data.msg,
			        //   type: 'warning',
			        //   center: true,
	          // 		  duration:2000
			        // });
            		return
            	}
	        }).catch(function(res){
            	that.error=that.ipError;
            })
  		}			
  	},
  	assistLogin(){
  		this.loginMain=true;
    	this.loginAssist=false;
    	this.searchID()
    	this.value=''
  	},
  	mainLogin:function(){
  		this.loginMain=false;
    	this.loginAssist=true;
  	},
  	closeOpen(){
  		this.open=false;
  		this.loginBox=true;
  	},
  	searchID(){
  		// if(this.branch) return
  		if(!this.branchId){
  			return 		
  		}else{
			axios.post(this.apiurl+'/padinterface/selectBranchById',
		    	{'branchId':this.branchId}
		    ).then((res)=>{	  			
	  			if (res.data.code==0){	  					  				
	  				// localStorage.setItem("branchId",this.branchId)
	  				this.branchName= res.data.branchName	  				
	  			}else if(res.data.code==1){
	  				this.branchName = "未找到商户信息请重新输入!";
	  				this.branchId=''
	  			}else if(res.data.code==2){
	  				this.branchName = "";
	  				this.branchId='';
	  				this.error = res.data.msg;
	  				// this.$message({
			    //       message: res.data.msg,
			    //       type: 'warning',
			    //       center: true,
	      //     		  duration:2000
			    //     });
            		return
	  			}else{
	  				this.branchName = "";
	  			}
            })	

  		}  		
  	},
  	inputId(){
  		this.branchName=''
  	},
  	loginInput(){
  		this.error=""
  	},
  	//refresh:function(){//自动检测主机IP地址 
		// axios.post('/',{
		// 	'branchId':this.branchId  				
		// }).then(function(res){
	 //  		console.log(res);
	 //  		if(){
  // 				this.branchName="大象酒吧"
  // 			}else{//查询商户ID是否存在，存在则显示	  			
  // 				this.branchName='没找到商户信息，请重新输入';
  // 			}
		// })
  	//},
  	confirmOpen(){
  		if(!this.pettyCash){ 				
		    this.message('请输入备用金金额','warning');
  			return
  		}else{
			axios.post(this.apiurl+'/padinterface/insertTellerCash',
		    	{
		    		'username':localStorage.getItem('username'),
		    		'cashamount':this.pettyCash,
		    		"branchid":localStorage.getItem('branchId')	
		    	}
		    ).then((res)=>{            	
        		console.log(res);
	  			if (!res.data.code){
	  				this.$router.push({
		  				path:'/dinner'
		  			})
	  			}else{	  				
			        this.message('备用金输入失败，请重新输入','warning');
	  			}
            })			
  		}
  	},
  	ipCheck(){
  		let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  		if(this.ip&&!reg.test(this.ip)){
  			this.ip='';
  			this.error1 = 'ip格式有误';
  			return false
  		}else{
  			return true
  		} 
  	},
  	input(e){ 		
      	this.inputType = e.target.dataset.type;
      	this.backMoney = e.target.value;
      	this.value = e.target.dataset.value;     	
      	if(this.value==1&&!this.branch) this.branchName=''
      	if(this.value==2){
      		this.error1=''
      	}else if(this.value==3 || this.value==4){
      		 this.error=""
      	}
    },
    _confirmEvent(res){     	
     	if(this.text!=''&&this.flag==0){
			res=res.slice(-1)
			this.backMoney=res
			this.text=''
			this.flag=1								
		}else{
			this.flag=0
		}
		this.text=''
      	if(this.value==1){
      		this.branchId=res
      	}else if(this.value==2){
      		this.ip=res
      	}else if(this.value==3){
      		this.jobNumber=res
      	}else if(this.value==4){
      		this.password=res
      	}else if(this.value==5){
      		this.pettyCash=res
      	}		 		 	
	}
  },
  created(){
  	this.first=localStorage.getItem("first")?localStorage.getItem("first"):0;	
  	axios.get('http://192.168.11.159'+this.port+'/padinterface/currentip').then(res=>{
    	this.apiurl = 'http://' + res.data.ip + this.port;
    	this.localIP = res.data.ip;
    	// localStorage.setItem("ip",this.ip); 
    	// localStorage.setItem("apiurl", this.apiurl);      		
    }).catch(err=>{
    	this.message('获取ip失败！','error')
    })
   	let type = localStorage.getItem("loginType");
   	let bid = localStorage.getItem("branchId");
   	this.branch = localStorage.getItem('branch')	  				
   	bid == null ? this.branchId = '' : this.branchId = bid; //获取上一次的商户ID，并验证是否存在
   	this.ip = localStorage.getItem("ip")?localStorage.getItem("ip"):'';
   	if(type == null) {
   		if(bid) {//有商户id，自动查询商户名
			let timer = setInterval(()=>{			
	    		if(this.apiurl)	{
	    			this.searchID()
	    			clearInterval(timer)
	    		}
	    	},100) 
		}
   	}else if(type == 'main'){
   		this.loginMain=true;
        this.loginAssist=false;
        if(bid) {//有商户id，自动查询商户名
			let timer = setInterval(()=>{			
	    		if(this.apiurl)	{
	    			this.searchID()
	    			clearInterval(timer)	    			
	    		}
	    	},100) 
		}
   	}else if(type == 'assist') {
   		this.loginMain=false;
      	this.loginAssist=true;	
   	}
    document.onkeydown = e=>{//监听键盘按下，快捷键操作
    	if(e.keyCode==13){
    		if((this.loginAssist && this.ip) || (this.loginMain && this.branchId) && this.jobNumber && this.password){
    			this.onSubmit()
    		}   		
    	}
    } 


    document.onselect = ()=>{//input文字选中
	      if(window.getSelection) {
	        this.text = window.getSelection().toString()
	      }else if(document.selection && document.selection.createRange) {
	        this.text = document.selection.createRange().text;
	      }
    	}   
  },
  watch:{  	
  	branchId(){
      	this.backMoney=this.branchId
    },
    ip(){
  		this.backMoney=this.ip
    },
  	jobNumber(){
  		this.backMoney=this.jobNumber
  	},
  	password(){
  		this.backMoney=this.password
  	},
  	pettyCash(){
  		this.backMoney=this.pettyCash;
  		if(Number(this.pettyCash)<0)
  			this.pettyCash=''
  		if(Number(this.pettyCash)/100000>1)
  			this.pettyCash=500
  	}
  }
}
</script>

<style>
	#login{
		width: 100%;
		height:100%;
		background: url('../../static/images/bg_login.png') no-repeat center center;
		background-size: 100% 100%;
		position: relative;
	}
	#login .loginBox{
		width: 6.6rem;
		height: 5rem;	
		border-radius: 10px;	
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		background: white;
		text-align: center;		
	}
	#login .loginBox h4{
		color: #333333;
		font-size:0.21rem;
		margin-top: 0.4rem;
	}
	#login .loginBox .box{
		width: 45%;
		height: 38%;
		border:1px solid rgba(121, 121, 121, 0.5);
		border-radius: 5px; 
		margin: 0.4rem 0.6rem;
		
	}
	#login .loginBox ._keyboard{
		position: absolute;
		width: 2.3rem;
		height: 1.95rem;
		right: 0.6rem;
		top:1.05rem;
	}
	#login .loginBox .box>p{
		width: 100%;
		text-align: left;
		color:red;
	}
	#login .loginBox .box .inputBox{
		position: relative;
		width: 100%;
		height: 33.2%;
		border-bottom: 1px solid rgba(121, 121, 121, 0.5);
		text-align: left;
		display: flex;
		box-sizing: border-box;
	}
	#login .loginBox .box .pwd{
		border-bottom: none;
	}
	#login .loginBox .box .inputBox span{
		display: inline-block;
		width: 15%;
		height:100%; 
	} 
	#login .loginBox .box .inputBox .input{
		width: 79%;
		height: 100%;
		display: inline-block;
	}
	#login .loginBox .box .inputBox .branchIdInput{
		width: 50% !important;
	}
	#login .loginBox .box .inputBox .branchIdInput+em{
		position: absolute;
		right: 0;
		display: block;
		/*width: 50%;*/
		height: 100%;
		box-sizing: border-box;
		/*padding-top: 5%;*/
		padding-left: .1rem;
		padding-right: .1rem;
		text-align: right;
		font-size: 0.12rem;
		line-height: 0.6rem;
		font-style:normal;
	}
	#login .loginBox .box .inputBox select{
		appearance:none;
		background: url('../../static/images/ic_pull.png') no-repeat center right;
	}
	#login .loginBox .box .loginMain span:nth-child(1){
		background: url('../../static/images/ic_computer.png') no-repeat center center;
	} 
	#login .loginBox .box .loginMain span:nth-child(3){
		background: url('../../static/images/ic_login_search.png') no-repeat center center;
	}
	#login .loginBox .box .loginAssist span{
		background: url('../../static/images/ic_shop.png') no-repeat center center;
	}
	#login .loginBox .box .staffId span{
		background: url('../../static/images/ic_staff.png') no-repeat center center;
	}
	#login .loginBox .box .pwd span{
		background: url('../../static/images/ic_pwd.png') no-repeat center center;
	}
	#login .loginBox .btn{
		width: 82%;
		height: 13.2%; 
		background: #ffbea5;
		border-radius: 5px;
		color: white;
		margin-bottom: 0.2rem;
		font-size: 0.18rem;
	}
	#login .loginBox .btnLog{
		background: #ff7e4b;
		font-size: 0.18rem;
	}
	#login .loginBox .pattern{
		font-size: 0.12rem;
		color: #ff7e4b;
	}
	#login .loginBox .pattern span{
		display: inline-block;
		width: 0.16rem;
		height: 0.08rem; 
		background: url('../../static/images/ic_changePattern.png') no-repeat center center;
	}
	#login .open{
		width: 4rem;
		height:3rem;	
		border-radius: 5px;	
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		background: white;
	}
	#login .open .header{
		width: 100%;
		height:0.72rem;
		line-height: 0.72rem;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 0.3rem; 
	}
	#login .open .header h5{
		font-size: 0.16rem;
		color: #333333; 
	}
	#login .open .header span{
		display: block;
		width: 0.14rem;
		height: 0.72rem;
		background: url('../../static/images/ic_close.png') no-repeat center center;
	}
	#login .open .box{
		width: 100%;
		height: 72%;
		display: flex;
	}
	#login .open .box>div{
		width: 50%;
		height: 100%;
		box-sizing: border-box;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		position: relative;
	}
	#login .open .box div.right{
		height:80%;
	}
	#login .open .box .left label{
		font-size: 0.14rem;
		color: #999999;
	}
	#login .open .box .left input{
		width: 100%;
		height: 0.3rem;
		display: block;
		border:1px solid #ededed;  
		appearance:none;
	}
	#login .open .box .left button{
		width: 90%;
		height: 0.4rem;
		display: block;
		background: #ff7e4b;
		color: #fff;
		border-radius: 5px;
		position: absolute;
		bottom: 0;  
	}
	.confirmInput{
		background: #ff7e4b !important;
		border:none;		
	}
	
</style>
