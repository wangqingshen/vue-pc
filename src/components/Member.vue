<template>
	<div id="member">
			<div id="memberHandle">
				<ul>
					<li v-for="(memHandle,index) in memHandles" :class="{memHandleCho:idx==index}" @click="memHandleClick(index)">{{memHandle}}</li>
				</ul>
			</div>
			<!-- 会员注册 -->
			<div id="addMember" v-show="idx==0">
				<div class='medium'>
					<form ref="form" :model="form" label-width="80px">
						<div class="form-item">
							<label>实体卡号</label>
	    					<input v-model="form.cardNum" type="text" name="" @focus="input($event)" :data-value=1 data-type=0 placeholder="非必填"></input>
						</div>
	  					<div class="form-item">
	  						<label>会员等级</label>
	  						<ul class="checkbox-item" v-if='levels'>
		  						<li class="memClass" v-for="(level,index) in levels" :class="{levelIdx:levelIdx==index}" @click="levelSel($event,index,level.id)" :key=index>{{level.levelname}}</li>
		  					</ul>
		  					<p v-if='!levels'>暂无可用会员等级！</p>
		  					<i>{{errorLevel}}</i>
	  					</div>
	  					<div class="form-item">
	  						<label>手机号</label>
	    					<input v-model="form.phone" type="text" name="" @focus="input($event)" :data-value=2 data-type=0 placeholder="必填"></input>
	    					<i>{{errorPhone}}</i>
	    					<!-- <el-checkbox-group v-model="phoneCheck">
					      		<el-checkbox label="验证手机号" name="type"></el-checkbox>
					    	</el-checkbox-group> -->
					    	<input v-model="form.verificationCode" placeholder="验证码" v-show="phoneCheck" @focus="codeInput"></input>
					    	<i v-show="phoneCheck">{{errorCode}}</i>
	  					</div>
	  					<div class="form-item">
	  						<label>姓名</label>
	    					<input v-model="form.name"  placeholder="必填" @focus="nameInput"></input><i>{{errorName}}</i>
	  					</div>
	  					<div class="form-item">
	  						<label>性别</label>
	  						<ul class="checkbox-item">
		  						<li class="memClass" data-num=0 @click="genderCho($event)" :class="{gender:gender==0}">男</li>
		  						<li class="memClass" data-num=1 :class="{gender:gender==1}" @click="genderCho($event)">女</li>
		  					</ul>
	  					</div>
	  					<div class="form-item">
	  						<label for="">生日</label>
		  					<el-form  label-width="280px">	 
		  						<el-form-item label-width="0px">
		    						<el-col :span="11" style='width:140%;'>
		      							<el-date-picker type="date" placeholder="非必填" v-model="form.birthday" style="width: 100%;"></el-date-picker>
		    						</el-col>						  						
								</el-form-item>				
							</el-form>
	  					</div>
	  					<div class="form-item">
	  						<a type="info" @click="registSubmit" class="btn">提交</a>	
	  					</div>
					</form>
					<div class="_keyboard">
						<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
					</div>
				</div>
			</div>
			<!-- 会员储值 -->
			<div class="memberRecharge" v-show="idx==1">
				<div class="box">
					<div class="memIfoSearch">
						<div class="mem-item">
							<label>卡号</label>
							<input v-model="form.value1" type="text" name="" @focus="input($event)" :data-value=1 data-type=0 placeholder="卡号/手机号"><button class="searchBtn" @click="searchMem($event, 1)" data-num='1'>查询</button>
							<i>{{errorCardNo}}</i>	
						</div>				
						<ul class="memIfo">
							<li><label>姓名</label><span>{{!member.name ? '--' : member.name}}</span></li>
							<li><label>等级</label><span>{{!member.levelname? '--' : member.levelname}}</span></li>
							<li><label>卡号</label><span>{{member.cardno?String(member.cardno).substr(-10):'--'}}</span></li>
							<li><label>手机</label><span>{{!member.mobile ? '--' : member.mobile}}</span></li>
							<li><label>状态</label><span>{{member.status?(member.status==1?'正常':'挂失'):"--"}}</span></li>
							<li><label>可用余额</label><span v-model="balance">{{!member.balance ? '--' : member.balance}}</span></li>
						</ul>						
					</div>
					<div class="_keyboard">
						<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
					</div>
				</div>
				<div class="mem-item">
					<label>充值金额</label>
					<input v-model="form.value2" type="number" name="" @focus="input($event)" data-value=2 data-type=1 @input='money'>
					<i>{{error}}</i>
				</div>
				<div class="mem-item">
					<label>赠送金额</label>
					<input v-model="form.value3" type="number" name="" disabled="disabled">
					
				</div>	
				<div class="mem-item">
					<button class="rechargeBtn" @click="editbalance">充值</button>
				</div>
			</div>
			<!-- 会员查询 -->
			<div id="memberSearch" v-show="idx==2">
				<div class="search-item">
					<input type="text" placeholder="手机/卡号/姓名" v-model="form.value1" @focus="input($event)">
					<button :data-num='0' @click="searchMem($event, 2)">查询</button>
					<i>{{errorSearchNo}}</i>		
				</div>
				<div class="mems">
					<ul class="memIfo">
						<li>姓名</li>
						<li>性别</li>
						<li>卡号</li>
						<li>手机号</li>
						<li>等级</li>
						<li>生日</li>
						<li>注册时间</li>
						<li>状态</li>
						<li>操作</li>
					</ul>
					<ul class="memDetail">
						<li v-for="member in members">
							<ul>
								<li>{{member.name}}</li>
								<li>{{member.gender==1?'女':(member.gender==0?'男':'--')}}</li>
								<li>{{member.cardno?String(member.cardno).substr(-10):'--'}}</li>
								<li>{{member.mobile}}</li>
								<li>{{member.levelname}}</li>
								<li>{{format(member.birthday)}}</li>
								<li>{{format(member.createtime)}}</li>
								<li>{{member.status==1?'正常':'挂失'}}</li>
								<li ><a href="javascript:void(0)" @click="lossHandle($event,member.cardno,member.mobile)" style="color:blue">{{member.status==1?'挂失':'解挂'}}</a></li>	
							</ul>	
						</li>											
					</ul>
				</div>				
			</div>		 
		<!-- 解挂弹窗,挂失弹窗-->
		<div v-show="memWindow" class="window">
			<div class="box">
		        <span></span>
		        <p v-show="disLoss">是否解除挂失？</p>
		        <p v-show="loss">是否挂失该会员？</p>
		        <div><button v-show="disLoss" @click="lossHandleConfirm('/chain-newspicyway/deal/UnCardLose','解除挂失')">确认</button><button v-show="loss" @click="lossHandleConfirm('/chain-newspicyway/deal/CardLose','挂失')">确认</button><button @click="close">放弃</button></div>
	        </div>
    	</div>
    	<router-view/> 
    	<!-- 权限弹窗 -->
    	<!-- <Authority @aut='_aut' :url='url' v-show='getAut'/> -->
		<Pay @editPayClose='_pay' v-if='editPay'/>
	</div>
</template>

<script>
import axios from 'axios';
import Keyboard from '../components/public/Keyboard'
import Authority from '../components/public/Authority'
import Pay from '../components/Pay'
export default {
  name: 'Member',
  components:{Keyboard,Authority,Pay},
  data(){
  	return {
	  		memHandles:["注册会员","会员储值","会员查询"],
	  		memWindow:false,
	  		disLoss:false,
	  		loss:true,
	  		idx:0,
	  		form: {
	          name: '',
	          delivery: false,
	          type:[],
	          phone:'',
	          verificationCode:'',
	          cardNum:'',
	          value1:'',
	          value2:'',
	          value3:'',
	          value4:'',
	          phone:'',
	          birthday:''
	        },
	        phoneCheck:'',
	        searchVal:'',
	        value:'',
	        radio: '',
	        checked:false,
	        inputType:'',
	        backMoney:'',
	        members:[],
	        member:{},
	        balance:'',//可用余额
	        error:'',
	        errorPhone:'',
	        errorLevel:'',
	        errorName:'',
	        errorCode:'',
	        errorCardNo:'',
	        errorSearchNo: '',
	        levels:'',
	        memLevel:'',
	        gender:0,
	        present:'',
	        levelIdx:100,
	        rate:[[],[]],//会员充值赠送比例
	        getAut:false,
	        url:'',
	        haveAut:false,
	        text:'',
	        flag:0,
	        handleCardNo:'',
	        editPay:false
  		}
  	},  	
    methods: {
	    levelSel(e,index,id){	    	
	    	this.errorLevel="";
	    	if(this.levelIdx==index){
	    		this.levelIdx='a'
	    		this.memLevel='';
	    	}else{
	    		this.levelIdx=index;
	    		this.memLevel=id;
	    	}	    	
	    },
	    genderCho(e){
	    	if(this.gender==e.target.dataset.num){
	    		this.gender=2
	    	}else{
	    		this.gender=e.target.dataset.num
	    	} 	    	
	    },
	    registSubmit() {//注册会员
	    	if(!this.memLevel) 
	    		this.errorLevel='请选择会员等级';
	    	if(!this.form.phone){
	    		this.errorPhone='请输入会员手机号';
	    	}else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.form.phone))){ 
	  			this.errorPhone="请输入11位正确的手机号";
	  			return
	  		}
	    	if(!this.form.name) 
	    		this.errorName='请输入会员姓名';
	    	if(this.phoneCheck && !this.form.verificationCode)
	    		this.errorCode='请输入手机验证码';
	    	if(!this.memLevel || !this.form.phone || !this.form.name || (this.phoneCheck && !this.form.verificationCode))
	    		return
	        if(this.gender==2)
	        	this.gender=''
	        axios.post(localStorage.getItem('apiurl')+'/account/getVip',
			    {
			    	'mobile':this.form.phone,
			    	'tenant_id':localStorage.getItem('tenantid'),//'100021',//集团号
			    	'cardno':this.form.cardNum,
			    	'name':this.form.name,
			    	'gender':this.gender,
			    	'level':this.memLevel,
			    	'birthday':this.form.birthday,
			    	'ydurl':'/chain-newspicyway/memberManager/save'
			    }
        	).then((res)=>{
           		if(res.data.Retcode=='0'){
           			this.form.phone='';
           			this.form.cardNum='';
           			this.form.name='';
           			this.form.birthday='';
           			this.levelIdx='a';
           			this.gender=0;
           			this.message('注册会员成功！','success');
           		}else if(res.data.Retcode=='1'){
           			this.form.phone='';
           			this.form.cardNum='';
           			this.message('该手机或实体卡号已注册会员！','error');
           		}
		  	}).catch(err=>{
		  		this.message('网络错误，不能进行会员注册！','error')
		  	})
	    },
	    close(){ 
	    	this.memWindow=false;
	    },
	    lossHandle(e,card_no,phone){
	    	this.handleCardNo=card_no?card_no:phone
	      	if(e.target.innerText=="挂失"){
	      		this.loss=true;
	      		this.disLoss=false;
	      	}else{
	      		this.disLoss=true;
	      		this.loss=false;
	      	}
	      	this.memWindow=true;
	    },
	    lossHandleConfirm(url,text){
	    	axios.post(localStorage.getItem('apiurl')+'/account/getVip',
	    		{
	    			"cardno":this.handleCardNo,
	    			"branch_id":localStorage.getItem('branchId'),
	    			"FMemo":text,
	    			"ydurl":url
	    		}
	    	).then(res=>{	    		
	    		if(res.data.Retcode==0){
	    			this.message('会员操作成功！','success')	    			
	    			this.memWindow=false	    			
	    			axios.post(localStorage.getItem('apiurl')+'/account/getVip',
						    {
						    	'orderid':'',
						    	'isOrder':0,
						    	'branchId':localStorage.getItem('branchId'),
						    	'queryCondition':this.form.value1,
						    	'ydurl':'/chain-newspicyway/api/member/queryMemberInfo'
						    }
					).then((res)=>{
						if(res.data.data.length!=0){			            	
			            	this.members=res.data.data;			            	            	
			            }
					})
	    		}
	    	}).catch(error=>{
	    		this.message('123！','error')
	    	})	      	
	    },
	    memHandleClick(index){//会员储值赠送优惠比例请求
	      	this.idx=index;
	      	this.form.cardNum='';
	      	this.form.value1='';
	      	this.form.name='';
	      	this.member='';
	      	this.members='';
	      	this.error='';
	      	// this.levels='';	      	
	      	if(index==0){
	      		// this._levels()
	      		this.levelIdx='a';
	      		this.errorCardNo='';
	      		this.errorSearchNo='';
	      		this.form.value2='';
	      		this.form.value3='';	      		
	      	}else if(index==1){
	      		this.errorPhone='';
	      		this.errorName='';
	      		this.errorLevel='';
	      		this.errorSearchNo='';	      		
	      		axios.post(localStorage.getItem('apiurl')+'/account/getVip',
		    		{	    			
		    			"branchid":localStorage.getItem('branchId'),
		    			"ydurl":'/chain-newspicyway/api/member/queryPreferentialList'
		    		}
		    	).then(res=>{
		    		if(res.data.code==1){
		    			let arr1=[],arr2=[];
		    			for(var i in res.data.list){
		    				arr1.push(Number(res.data.list[i].menkan))
		    				arr2.push(Number(res.data.list[i].present))
		    			}
		    			this.rate[0] = arr1.sort(function _sort(a,b){
		    				return a-b
		    			})
		    			this.rate[1] = arr2.sort(function _sort(a,b){
		    				return a-b
		    			})		    			
		    			console.log(this.rate)
		    		}else if(res.data.code=="0"){		            	
		            	this.rate=[[0],[0.00]]
		            } 
		    	}).catch(err=>{
	  				// this.message('网络错误，不能获取到会员储值赠送优惠！','error')
	  			})
	      	}else{	      		
	      		this.errorPhone='';
	      		this.errorName='';
	      		this.errorLevel='';
	      		this.errorCardNo='';
	      		this.form.value2='';
	      		this.form.value3='';
	      	}
	    },
	    codeInput(){
	    	this.errorCode='';
	    },
	    nameInput(){
	    	this.errorName='';
	    	this.value='a'
	    },
	    input(e){
	      	this.value = e.target.dataset.value;
	      	this.inputType = e.target.dataset.type;
	      	this.backMoney = e.target.value;
	      	this.error='';
	      	this.errorCardNo=''; 
	      	this.errorSearchNo = '';
	      	this.errorPhone='';   
	    },
	    money(){	    	    	
	    	let arr = this.rate,
	    		num = Number(this.form.value2),
	    		test = function(arr,num){	    			
    				for(var i=0;i<arr.length;i++){
				    	if(num>=arr[arr.length-1]){
				    		return arr.length-1
				    	}
				        if(arr[i]>num){
				        	return i-1;
				        }
				    }				    
				};
			if(arr[0].length){
				var _rate = test(arr[0],num)
				console.log(_rate)
				if(_rate!=-1){
					// if(arr[0][_rate]==0){
					// 	this.form.value3=Number(arr[1][_rate]).toFixed(2)
					// }else{}						
					this.form.value3=Number(arr[1][_rate]).toFixed(2)					
				}else{
					this.form.value3=0.00
				}				
			}else{
				this.form.value3=0.00
			}												
	    },
	    _confirmEvent(res){
	    	if(this.text&&this.flag==0){	    		
				res=res.slice(-1)
				this.backMoney=res	
				this.flag=1						
			}else{
				this.flag=0
			}		
	 		if(this.value==1){ 			
	 			this.form.value1=String(res).replace(/\./g,'');
	 			this.form.cardNum=String(res).replace(/\./g,'');
	 		}else if(this.value==2){
	 			this.form.value2=res;
	 			this.form.value3=Number(Number(this.form.value2)*Number(this.rate)).toFixed(2)
	 			this.form.phone=String(res).replace(/\./g,'');			
	 		}
	 		this.text=''
		},
		searchMem(e,t=2){
		  	if(!this.form.value1){
		  		if(t == 1) {
		  			this.errorCardNo='请输入会员卡号'
		  		}else if(t ==2) {
		  			this.errorSearchNo='请输入手机/卡号/姓名'
		  		}
		  		return
		  	}
		  	let isOrder = e.target.dataset.num;
		  	if(!isOrder) isOrder = '0'
		  	axios.post(localStorage.getItem('apiurl')+'/account/getVip',
				    {
				    	'orderid':'',
				    	'isOrder':isOrder,
				    	'branchId':localStorage.getItem('branchId'),
				    	'queryCondition':this.form.value1,
				    	'ydurl':'/chain-newspicyway/api/member/queryMemberInfo'
				    }
			).then((res)=>{
	            if(res.data.data.length!=0){
	            	if(isOrder==0){
	            		this.members=res.data.data;
	            	}else{
	            		this.member=res.data.data[0];
	            	}	            	
	            }else{
	            	if(t == 1) {
		  				this.errorCardNo='卡号错误，请重新查询'
		  				this.member=''
			  		}else if(t ==2) {
			  			this.errorSearchNo='卡号错误，请重新查询'
			  			this.members=''
			  		}
	            }	            
	  		}).catch(err=>{
	  			this.message('网络错误，不能查询会员！','error')
	  		})
		},
		editbalance(){//会员储值 	
		  	let value = Number(this.member.balance) + Number(this.form.value2) + Number(this.form.value3),
		  		card_no = this.member.cardno,
		  		branchId = localStorage.getItem('branchId'),
		  		userid = localStorage.getItem('username');
		  		console.log(this.member.cardno)
		  	if(!this.form.value2)
		  		this.error="请输入充值金额"
		  	if(card_no==''||card_no==undefined)
		  		this.errorCardNo='请输入手机/卡号查询需要储值的会员号'
		  	else if(this.member.status != 1)
		  		this.message('该会员已挂失，不能进行储值操作！','warning')
		  	if(!this.form.value2 || !card_no || this.member.status != 1){			  			  		
		  		return
		  	}		  				  	
		  	axios.post(localStorage.getItem('apiurl')+'/api/employee/createMemberOrder',
			    {
			    	'card_no':card_no,
			    	'value':String(value),//总的储值金额,赠送加储值加余额
			    	'branchId':branchId,
			    	'present_value':this.form.value3,//赠送金额100
			    	'actual_value':this.form.value2,//储值金额10
			    	'userid':userid
			    }
	     	).then(res=>{
	            if(res.data.success){
	            	localStorage.setItem('orderid',res.data.data.orderid)
	            	localStorage.setItem('isChangeBill','no')
	            	// this.$router.push({
	            	// 	path:'/dinner/member/pay'
	            	// })
	            	this.editPay=true
	            }           
	  		}).catch(err=>{
  				this.message('网络错误，不能进行会员储值操作！','error')
  			})
		},
		_aut(res){	 	
	    	if(res=='close'){
	    		this.getAut=false
	    	}else if(res=='aut'){
	    		this.haveAut = true
	    		this.getAut=false
	    	}
	    },
		format(timeStamp){
			if(timeStamp<0) return '--'
			let time = new Date(timeStamp),
				 y = time.getFullYear(),
				 m = time.getMonth()+1,
				 d = time.getDate();				 
			function add0(m){return m<10?'0'+m:m}
			return y+'-'+add0(m)+'-'+add0(d);	
	    },
	    _levels(){
	    	axios.post(//会员等级返回值		    
			    localStorage.getItem('apiurl')+'/account/getVip',
			    {
			    	"tenantid":localStorage.getItem('tenantid'),
			    	'ydurl':'/chain-newspicyway/memberdeal/findAll2'
			    }
	        ).then((res)=>{
	            if(res.data.success){
	            	this.levels=res.data.data
	            } 
	            if(!res.data.data.length){
	            	this.message('后台未查询到会员等级，不能进行会员注册操作！','error')
	            }           
	  		}).catch(err=>{
	  			// this.message('网络错误，不能操作会员！','error')
	  		})
	    },
	    _pay(res){	    	
    		this.editPay=false
	    }
    },    
    watch:{   	
    	present(){
    		// console.log(123)
    	},
    	form:{
    		handler:function(form){
    			let val = String(this.form.value2)
                if(this.form.phone.length>11){
               		this.errorPhone='手机号长度错误'
                }else{
               		this.errorPhone=''
                }
                if(val.length>1&&(val[0]==0||val[0]=='.')){
                	this.form.value2=val.slice(-(val.length-1))
                }
                if(Number(this.form.value2)/100000000>1){
               	    this.form.value2=this.form.value2.substr(0,9)
                } 
                if(this.value==2){
               		this.money()
                }                 
            },
            deep:true
    	}
    },
    created(){
    	this.value='4';
    	this._levels()   	
  		document.onkeydown = e=>{//监听键盘按下，快捷键操作
	    	if(e.keyCode==13){
	    		if(this.idx==0){
	    			this.registSubmit()
	    		}
	    // 		else if(this.idx==1){
					// this.editbalance()
	    // 		}   		   		
	    	}
    	}

    	document.onselect = ()=>{//input文字选中
	      if(window.getSelection) {
	        this.text = window.getSelection().toString()
	      }else if(document.selection && document.selection.createRange) {
	        this.text = document.selection.createRange().text;
	      }
    	} 
    }
}
</script>

<style >
	#member{
		width:100%;
		height:100%;
		background: #f4f4f4;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0.2rem;
	} 
	#memberHandle{
		width:100%;
		height:0.6rem;
		padding: 0 0.2rem;
    	box-sizing: border-box;
		border-bottom: 1px solid #ededed;
		background: white;	
	}
	#memberHandle ul{
		display:flex;
		width:3rem;
		height:0.4rem;
	}
	#memberHandle ul li{
		flex:1;
		height:0.4rem;
		text-align:center;
		line-height:0.4rem;
		font-size:0.15rem;
		margin-right: 0.1rem;
		border:1px solid #ededed;
		border-radius: 5px;
		color:#666666;
		margin-top: 0.1rem;
		cursor: pointer;
	}
	#memberHandle ul li:not(.memHandleCho):hover {
		color: #ff7e4b;
		border-color: #ff7e4b;
	}
	#memberHandle ul li.memHandleCho{
		background: #ff7e4b;
		color: white; 
		border:none;
	}
	#addMember{
		width: 100%;
		height: calc(100% - .6rem);
		background: white;
		box-sizing: border-box;
		padding: 0.2rem;		
		overflow:auto;
	}
	#addMember li.levelIdx{
		background: #ff7e4b;
		color:white;
	}
	#addMember li.gender{
		background: #ff7e4b;
		color: white;
		border: none;
	}
	#addMember .medium{
		display: flex;
	}
	#addMember .medium >form{
		width:3rem;
		height:100%;
		margin-right: 0.2rem;
	}
	#addMember .medium >form .form-item {
		margin-bottom: 10px;
	}
	#addMember .medium >form .form-item .checkbox-item {
		margin: 0.03rem 0;
	}
	#addMember .medium >form .form-item .checkbox-item li:not(.levelIdx):not(.gender):hover{
		color: #ff7e4b;
		border-color: #ff7e4b;
	}
	#addMember .medium >form label{
		display: block;
		font-size: 0.14rem;
		color:#999999;
	}	
	#addMember .medium form input{
		width: 2.5rem;
		height:0.3rem;
		box-sizing: border-box;
		padding: 0 0.1rem;
		border:1px solid #ededed;
		margin: 0.03rem 0;
		/*border-radius: 5px;*/
	}
	.el-checkbox__label {
		font-size: 0.12rem;
		color: #999;
		padding-left: 0.05rem;
	}
	.el-input__inner{
		/*width: 43% !important;*/
	}
	.el-form-item__content {
		line-height: inherit;
	}
	.el-date-editor .el-input__inner {
		padding: 0 .3rem !important;
	}
	.el-input__icon {
		line-height: inherit;
		color: #999;
		margin-top: 0;
	}
	/*#addMember .birthday{
		width: 30%;
		height:0.3rem;
		border:1px solid #ededed;
	}*/
	#addMember .member{
		display:inline-block;
		width:0.8rem;
		height:0.3rem;
		text-align: right;
    	vertical-align: middle;
    	font-size: 14px;
    	color: #606266;
    	line-height: 40px;
    	padding: 0 12px 0 0;
    	box-sizing: border-box;
		}
	#addMember .memClass{
		cursor: pointer;
		display:inline-block;
		width:0.8rem;
		height:0.3rem;
		line-height: 0.3rem;
		text-align:center;
		border:1px solid #dcdfe6;
		border-radius: 4px;
		margin: 5px 5px;
		font-size: 0.14rem;
		color: #aeaeae; 
	}
	#addMember .btn{
		display: block;		
		width:2rem;
		height:0.4rem;
		line-height: 0.4rem;
		text-align: center;		
		font-size:0.16rem;
		color:white;
		background: #ff7e4b;
		border-radius: 5px;
	}
	#member .memberRecharge{
		width: 100%;
		height: calc(100% - 0.6rem);
		/*height: auto;*/
		background: white;
		box-sizing: border-box;
		padding: 0.2rem;
		overflow: auto;
	}
	#member .memberRecharge .box{
		/*width: 8rem;*/
		width: 5.8rem;
		/*height: 50%;*/
		display: flex;
		padding-bottom: 0.2rem;
		border-bottom: 1px dashed #ededed;
	}
	._keyboard{
		width: 2.5rem;
		height: 2.5rem; 
	}
	#member .memberRecharge .memIfoSearch{
		width: auto;
		height: 100%;
		padding-right: .2rem;
	}
	#member .memberRecharge .mem-item {
		margin: 0.1rem 0;
	}
	#member .memberRecharge label{
		display: block;
		font-size: 0.14rem; 
		color:#a0a0a0;
	}
	#member .memberRecharge input{
		width: 2rem;
		box-sizing: border-box;
		padding: 0 0.1rem;
		height:0.3rem;
		border:1px solid #ededed;
		/*border-radius: 5px;*/		
	}
	#member .memberRecharge .memIfoSearch input{
		width: 2rem;
		box-sizing: border-box;
		padding: 0 0.1rem;
		margin: 0.03rem 0;
	}
	#member .memberRecharge .memIfoSearch .memIfo{
		width: 100%;
		height: 80%;
		margin-top: 0.15rem;
		display: flex;
		flex-wrap: wrap;
	}
	#member .memIfoSearch .memIfo li{
		width: 50%;
		color:#999999;
		font-size: 0.14rem;
		padding-bottom: .2rem;
	    padding-right: 0.2rem;
	    box-sizing: border-box;
	}
	#member .memIfoSearch .memIfo li span{
		color:#666;
		font-size: 0.12rem;
		font-weight: 600;
	}
	#member .memberRecharge .searchBtn{
		width: 0.8rem;
		height:0.3rem;
		line-height: 0.3rem;
		text-align: center;
		background: #ff7e4b;
		border-radius: 5px;
		margin-left: 0.1rem;
		font-size: 0.14rem;
		color:white; 
	}
	#member .memberRecharge .rechargeBtn{
		width: 2rem;
		height:0.4rem;
		line-height: 0.4rem;
		text-align: center;
		background: #ff7e4b;
		border-radius: 5px;
		font-size: 0.14rem;
		color:white;
	}
	#memberSearch{
		width: 100%;
		height: calc(100% - .6rem);
		background: white;
		box-sizing: border-box;
		padding: 0.2rem;
	}
	#memberSearch .search-item {
		margin-bottom: 0.2rem;
	}
	#memberSearch input{
		padding: 0 0.1rem;
		box-sizing: border-box;
		/*width: 20%;*/
		width: 2rem;
		height: 0.3rem;
		border:1px solid #ededed;
		/*border-radius: 5px;*/
		margin-bottom: 0.03rem;
	}
	#memberSearch button{
		width:0.8rem;
		height:0.3rem;
		line-height: 0.3rem;
		text-align: center;
		font-size:0.14rem;
		color:white;
		background: #ff7e4b;
		border-radius: 5px;
		margin-left: 0.1rem;
	}
	#memberSearch .mems{
		width: 100%;
		height: calc(100% - .5rem);
		border: 1px solid #f4f4f4;		
	}
	#memberSearch .mems .memIfo{
		width: 100%;
		height: 0.3rem;
		display: flex;
		background: #f4f4f4;
	}
	#memberSearch .mems .memIfo li{
		flex: 1;
		height: 0.3rem;
		line-height: 0.3rem;
		text-align: center;
		font-size: 0.14rem;
		color: #999999;
	}
	#memberSearch .mems .memDetail{
		width: 100%;
		height: calc(100% - .3rem);
		background: white;
		overflow: auto;
	}
	#memberSearch .mems .memDetail li{
		width:100%;		
	}
	#memberSearch .mems .memDetail li:hover{
		background-color: #eee;
	}
	#memberSearch .mems .memDetail li ul{
		display: flex;
		width:100%;
	}	
	#memberSearch .mems .memDetail li ul li{
		flex: 1;
		/*height: 0.3rem;*/
		display: inline-block;
		width: calc(100%/9.4);
		box-sizing: border-box;
		padding: 0.1rem 0;
		text-align: center;
		font-size: 0.14rem;
		color: #999999;
		white-space: normal;
	}	
	#member .window{
		width: 100%;
		height: 100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(52,52,52,0.5);
	}
	#member .window .box{
		width: 4.1rem;
		height:3rem;
		background: white;		
		margin:auto; 
		position: absolute;
		left:0;
		top:0;
		bottom: 0;
		right:0; 
		border-radius: 10px;
		text-align: center;
	}
	#member .window .box span{
		display: inline-block;
		width: 1rem;
		height: 1rem;
		margin: 0.2rem 0;
		background: url('../../static/images/notice_2.png') no-repeat  center center;
	}
	#member .window .box p{
		font-size: 0.18rem; 
		margin-bottom: 0.2rem;
	}
	#member .window .box button{
		width:1.5rem;
		height:0.3rem;
		line-height: 0.3rem;
		text-align: center;
		font-size:0.14rem;
		color:white;
		background: #ff7e4b;
		border-radius: 5px;
		margin: 0.3rem 0.1rem;
	}
	.confirmInput{
		background: #ff7e4b !important;
		border:none;		
	}
	.el-message-box__message p{
		color:red;
	}
	.confirmInput span{
		color:white;
	}
	i{
		display: table;
		color: #FF6347;
		font-style: normal;
	}
</style>