<template>
<div class="container" @click="inputFocus">
  <div id="pay">
    <ul class="header">
    	<li class="title">结账</li>
    	<li class="close" @click="payClose"></li>
    </ul>
    <div class="acount">
    	<p v-if='isChangeBill=="no"' class="accountp">应收：
    	<span v-if='isChangeBill=="no"'>￥{{Number(Number(dueamount)-Number(vipFree)-Number(jmMoney2)).toFixed(2)}}</span>
    	<!-- <span v-if='isChangeBill=="yes"'>￥{{Number(dueamount).toFixed(2)}}</span> -->
    	<b class="original" v-if='isChangeBill=="no" && (vipFree||jmMoney2)'>￥{{Number(dueamount).toFixed(2)}}</b></p>
    	<!-- 反结账 -->
    	<p v-if='isChangeBill=="yes"'><em>反结后应收：</em><span>￥{{Number(dueamount).toFixed(2)}}</span></p>
    	<p v-if='isChangeBill=="yes" && balance>=0.01'><em style="color: #666;">还需要补钱：</em><span style="color: #666;">￥{{Number(balance).toFixed(2)}}</span></p>
    	<p v-if='isChangeBill=="yes"'><em>反结前已收：</em><span>￥{{Number(oldprice).toFixed(2)}}</span></p>
    	<ul>
    		<li @click="jmMem" v-if='(ordertype!=7)'>会员
    			<span class="jmIfo">{{memberinfo.name?'('+memberinfo.name+'|':''}}{{memberinfo.name?(vipFree?vipFree:'0.00')+')':''}}</span>
    			<!-- <ul class='jmIfo'>
    				<li v-if='isChangeBill=="yes"'>{{member.name?member.name:'--'}}</li>
    				<li v-if='isChangeBill=="yes"'>{{vipFree}}</li>
    				<li v-if='isChangeBill=="no"'>{{member.name}}</li>
    				<li v-if='isChangeBill=="no"'>{{vipFree}}</li>
    			</ul> -->
    		</li>
    		<li @click="jmCount" v-if='(ordertype!=7)'>减免<span class='jmIfo' v-if='jmMoney2'>{{jmMoney2}}</span></li>
    	</ul>
    </div>
    <ul class="payType">
    	<li class="cash pic" @click="payCash" :class="{cashCho:payType==0,posActive:payType==0}"><span></span>现金</li>
    	<li class="wechat pic" @click="payWechat" :class="{wechatCho:payType==1,posActive:payType==1}"><span></span>微信/支付宝</li>
    	<li class="member pic" @click="payMember" :class="{memberCho:payType==2,posActive:payType==2}" v-if='ordertype!=7'><span></span>会员储值</li>
    	<!-- <li class="member pic" v-if='ordertype==7'><span></span>会员储值</li> -->
    	<li class="pos pic" @click="payPOS" :class="{posCho:payType==3,posActive:payType==3}"><span></span>POS刷卡</li>
    	<li class="self" @click="paySelf" :class="{posActive:payType==4}">自定义</li>
    	<!-- <li class="guazhang pic" @click="payCredit" :class="{posCredit:payType==5,posActive:payType==5}" v-if='ordertype!=7'><span></span>挂账</li>
    	<li class="guazhang pic" v-if='ordertype==7'><span></span>挂账</li> -->
    	<li class="other"><span class="left"></span><span class="right"></span></li>
    </ul>
    <!-- 现金支付 -->
    <div v-show="payType==0 && (isChangeBill=='no' || balance>0)" class="payCash" >
    	<div class="left">
	    	<h5 >收现金</h5>
	    	<p class="cash"><input type="number" v-model="value1"  class="money" @focus="input($event)" @blur="compeletedEvt($event)" ref='input1' data-value=1 data-type=1 />元</p><i>{{cashError}}</i>
	    	<h5 class="charge">找零</h5>
	    	<p class="chargeNum"><span>{{Number(charge).toFixed(2)}}</span>元</p>
	    	<!-- <h5 class="preChoose">预选项</h5>
	    	<ul class="preNum"> 
	    	</ul> -->
	    </div>
	    <div class="_keyboard">
	    	<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
	    </div>
    </div>
    <div v-show="payType==1 && (isChangeBill=='no' || balance>0)" class="payWechat">
    	<p>请用扫描枪对客户微信或支付宝支付码进行扫码收款</p>
    	<input type="text" name="" id='paycode' autofocus="autofocus" v-model="paycode" style="border:1px solid #f4f4f4;" ref='input'>
    	<!-- <p>或生成收款二维码让客户扫描支付</p>
    	<button class="qrCode" v-show="qrCode" @click="creatQRCode">生成二维码</button>
    	<div v-show="erweima">
    		<img src="../../static/images/pay.png"><br/>
    		<p v-show="timer!='00:00'">请在<span>{{timer}}</span>内完成支付</p>
    		<button @click="creatQRCode" v-show="timer=='00:00'" class="reFresh">已过期,点击重新生成</button>
    	</div> -->
    </div>
    <!-- 会员储值 -->
    <div v-show="payType==2 && (isChangeBill=='no' || balance>0)" class="payMember">
    	<div class="left">
	    	<h5>卡号</h5>
	    	<input type="text" name="" placeholder="请输入卡号" ref='input2' v-model="value2" @focus="input($event)"  data-value=2 data-type=0 :readonly="isChangeBill=='yes'&&member.name?true:false" />
	    	<button class="search" @click="memSearch($event)" data-num="0">查询</button><br/><i>{{error}}</i>
	    	<ul>
	    		<li>姓名<br/><span>{{member.name?member.name:'--'}}</span></li>
	    		<li>等级<br/><span>{{member.levelname?member.levelname:'--'}}</span></li>
	    		<li>卡号<br/><span>{{String(member.cardno).substr(-10)!='undefined'?String(member.cardno).substr(-10):'--'}}</span></li>
	    		<li>手机<br/><span>{{member.mobile?member.mobile:'--'}}</span></li>
	    		<li>可用余额<br/><span>{{member.balance?member.balance+'元':'--'}}</span></li>
	    	</ul>
    	</div>
    	<div class="_keyboard">
    		<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
    	</div>
    	</div>
	    <div v-show="payType==3 && (isChangeBill=='no' || balance>0)" class="payPos">
	    	<p>使用POS刷卡结账</p>
	    </div>
	    <!-- 自定义方式 -->
	    <div v-show="payType==4 && (isChangeBill=='no' || balance>0)" class="payPos selfpay">
	    	<ul>
	    		<li v-for="(selfPay,index) in selfPays" :class="{selfPayAct:selfPayIdx==index}" :data-paytype='selfPay.dictid' @click="selfPayClick(index,$event)" :key='index'>{{selfPay.itemdesc}}</li>
	    	</ul>
	    	<p v-if='!selfPays.length'>门店暂无自定义支付方式，请选择其他支付方式！</p>	    	
	    	<i style="display: block;margin: 0.2rem;">{{error}}</i>
	    </div>
	    <!-- 挂账 -->
	    <div v-show="payType==5 && (isChangeBill=='no' || balance>0)" class="payMember">
	    	<div class="left">
	    	<h5>会员</h5>
	    	<input type="text" name="" placeholder="请输入卡号" ref='input3' v-model="value3" @focus="input($event)" data-value=3 data-type=0 /><button class="search" @click="memSearch($event)" data-num="1">查询</button><br/><i>{{error}}</i>
	    	<ul>
	    		<li>姓名<br/><span>{{member.name?member.name:'--'}}</span></li>
	    		<li>等级<br/><span>{{member.levelname?member.levelname:'--'}}</span></li>
	    		<li>卡号<br/><span>{{String(member.cardno).substr(-10)!='undefined'?String(member.cardno).substr(-10):'--'}}</span></li>
	    		<li>手机<br/><span>{{member.mobile?member.mobile:'--'}}</span></li>
	    		<!-- <li>已挂账<br/><span>{{member.gzamount}}元</span></li> -->
	    	</ul>
	    	</div>
	    	<div class="_keyboard">
	    		<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
	    	</div>
	    </div>
	    <div v-if="isChangeBill=='yes' && balance < 0 " class="payPos">
	  		<p>应收金额低于修改账单前金额，确认结账后系统将自动原路退回！退回金额：￥{{Number(Math.abs(balance)).toFixed(2)}}({{backMoneyType}})</p> 			
	  	</div>
    	<button class="btn" @click="orderPay" v-show="payType!=1">确认结账</button>
    	<button class="btn btnEmpty" v-show="payType==1">确认结账</button>
  	</div>
  	<!-- 反结账实收金额高于应收金额 -->
  	
  	<!-- 会员、减免弹窗 -->
  	<div class="window" v-show="window">
  		<div class="box" v-show='index==1'>
	    	<div class="header">
				<h5>会员</h5>
				<span @click="cancel"></span>
			</div>
			<div class='main'>
				<div>
					<input type="text" name="" placeholder="请输入卡号"  v-model="value5"   data-value=5 data-type=0 @focus="input($event)" :readonly="isChangeBill=='yes'&&member.name?true:false"/>
					<button class="search" @click="memSearch($event)" data-num="2">查询</button><br/><i>{{error1}}</i>
			    	<ul class="mem">
			    		<li>姓名<br/><span>{{member.name?member.name:'--'}}</span></li>
			    		<li>等级<br/><span>{{member.levelname?member.levelname:'--'}}</span></li>
			    		<li>卡号<br/><span>{{String(member.cardno).substr(-10)!='undefined'?String(member.cardno).substr(-10):'--'}}</span></li>
			    		<li>手机<br/><span>{{member.mobile?member.mobile:'--'}}</span></li>
			    		<li>可用余额<br/><span>{{member.balance?member.balance+'元':'--'}}</span></li>
			    	</ul>
				</div>
				<div class="_keyboard">
		    		<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
		    	</div>
			</div>	    	
	    	<div class='btnBox'>
				<button @click="confirm">确定</button>
				<button @click="clearMem">清除会员</button>
			</div>
    	</div>
		<div class="box" v-show='index==2'>
			<div class="header">
				<h5>减免</h5>
				<span @click="cancel"></span>
			</div>
			<div class='main'>
				<div>
					<label>减免金额</label><input type="number" v-model="value4" data-value=4 data-type=1  @focus="input($event,'jm')"/><br/>
					<div>
						<ul class="money">
							<li v-for="(jmNum,index) in jmNums" @click="jmNumCho($event,index)" :class="{jmPayAct:jmPayIdx==index}" :key='index'>{{jmNum}}</li>
						</ul>
					</div>					
				</div>
				<div class="_keyboard">
		    		<Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"></Keyboard>
		    	</div>
			</div>				    												
			<div class='btnBox'>
				<button @click="confirm1">确定</button>
				<button @click="cancel">取消</button>
			</div>	    			
    	</div>    	
    </div>
    <!-- 权限弹窗 -->
    <!-- <Authority @aut='_aut' :url='url' v-show='getAut'/> -->
    <!-- 支付中提示 -->
    <div id='paying' v-show='paying' ><div>支付中...<span class='el-icon-loading'></span></div></div>
  </div>
</template>

<script>
import axios from 'axios'
import Bus from '../bus.js';
import Keyboard from '../components/public/Keyboard';
import Authority from '../components/public/Authority'
export default {
  name: 'Pay',
  components:{Keyboard,Authority},
  data(){
  	return {
  		payType:0,
  		qrCode:true,
  		erweima:false,
  		timer:"10:00",
  		member:{},
  		memberinfo: {},
  		payTypeCho:0,
  		value:'',
		inputType:'',
		backMoney:'',
		value1:'',
		value2:'',
		value3:'',
		value4:'',
		value5:'',
		dueamount:'',//账单金额
		dueamountOld:'',
		window:false,
		jmNums:[],
		index:'',
		jmMoney1:'',//会员减免金额
		jmMoney2:'',//减免金额
		jmMoney2Old:'',
		vipFree:'',
		vipFreeOld:'',
		error:'',
		error1:'',
		cashError: '',
		ordertype:'a',
		selfPays:[],
		selfPayIdx:'a',
		jmPayIdx:'a',
		cardno:'',
		oldprice:'',
		balance:'',
		balanceOld:'',
		backMoneyType:'',
		isChangeBill:'',
		paywayCount:'',
		lastpayway:'',
		rechargeMoney:'',
		freeMoney:'',
		memFreeMoney:'',
		getAut:false,
        url:'',
        haveAut:false,
        charge:0,//现金找零
        userid:'',
        paycode:'',
        orderid:'',
        paying:false,
        memBalance:'',
        storeIfo:{},
        text:'',
        flag:0,
        tableID: '',
        codeUrl:'',//微信支付宝支付成功url
        queryTimer:'',
        queryTimer2:''
  	}
  },
  methods:{
  	inputFocus(){
  		if(this.payType==1){
	    	setTimeout(()=>{			
	    		this.$refs['input'].focus()	    	
	    	},100) 
    	} 
  	},
  	compeletedEvt(evt) {
 		// var val = evt.target.value;
 		// if(val < (Number(this.dueamount)-Number(this.vipFree)-Number(this.jmMoney2))) {
 		// 	this.value1 = (Number(this.dueamount)-Number(this.vipFree)-Number(this.jmMoney2)).toFixed(2);
 		// }
  	},
  	creatQRCode(){//点击向后台请求支付二维码
  		// axios({
			 //    method:"POST",
			 //    url:'',
			 //    data:,
	   //   		xhrFields:{
	   //          	withCredentials:true
	   //          }
	   //      }).then((res)=>{
	   //          console.log(res)
	   				
	   //      })
  		this.qrCode=false;
  		this.erweima = true; 
  		let n = 600,
  			sec='',
  			min='',
  		    _timer = setInterval(()=>{ 			
	  			n--;
	  			sec =("0"+(n % 60)).slice(-2);
	  			min =("0"+(Math.floor(n/60))).slice(-2)
	  			// console.log(min,sec)
	  			this.timer=min+":"+sec
	  			if(n==0){
	  				clearInterval(_timer)
	  			}
  			},1000)
  	},
  	payCash(){
  		if(this.isChangeBill=="yes"&&this.balance<=0){
  			this.payType='a';
  		}else{
  			this.payType=0; 
  		}  				
  	},
  	payWechat(){
  		if(this.isChangeBill=="yes"&&this.balance<=0){
  			this.payType='a';
  		}else{
  			this.payType=1; 
  		}
  	},
  	payMember(){
  		if(this.isChangeBill=="yes"&&this.balance<=0){
  			this.payType='a';
  		}else{
  			this.payType=2; 
  		}
  	},
  	payPOS(){
  		if(this.isChangeBill=="yes"&&this.balance<=0){
  			this.payType='a';
  		}else{
  			this.payType=3; 
  		}
  	},
  	paySelf(){
  		if(this.isChangeBill=="yes"&&this.balance<=0){
  			this.payType='a';
  		}else{
  			this.payType=4; 
	  			axios.post(localStorage.getItem('apiurl')+'/account/getAllCustomPayWay',{}).then(res=>{
	  			if(res.data!=''){
	  				this.selfPays=res.data
	  			}
	  		})
  		} 		
  	},
  	selfPayClick(index,e){
  		if(this.selfPayIdx==index){
  			this.selfPayIdx='a'
  		}else{
  			this.selfPayIdx=index
  		}
  		this.paytype=e.target.dataset.paytype	
  		this.error=''
  	},
  	payCredit(){
		localStorage.setItem("authorityAllOnce","")
  		this.payType=5;
  	},
  	payClose(){
  		if(this.isChangeBill=="yes"){
  			this.$router.go(-1) 		
  		}else if(this.ordertype==7){
  			this.$emit('editPayClose',1)
  		}
  		else{
	  		this.$router.push({
	  			path:"/orderTable"
	  		})
  		}  		 		
  	},
  	input(e,text){
      	this.value = e.target.dataset.value;
      	this.inputType = e.target.dataset.type;
      	this.backMoney = e.target.value;     	
      	if(this.value==5){
      		this.error1=''
      	}else if(this.value == 1){
      		this.cashError = '';
      	}else{
      		this.error='';
      	}
      	if(text=='jm'){
      		this.jmPayIdx='a'
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
 			this.value1=res; 			
 		}else if(this.value==2){
 			this.value2=String(res).replace(/\./g,''); 			 			
 		}else if(this.value==3){
 			this.value3=String(res).replace(/\./g,'');			
 		}else if(this.value==4){
 			this.value4=res;			
 		}else if(this.value==5){
 			this.value5=String(res).replace(/\./g,'');		
 		}
	},
	jmNumCho(e,index){
		if(this.jmPayIdx==index){
			this.jmPayIdx='a'
			this.value4 = ''
		}else{
			this.value4 = e.target.innerText
			this.jmPayIdx=index
		}		
	},	
	confirm(){
		this.memberinfo = this.member;
		if(this.memFreeMoney){
			this.vipFree=Number(this.memFreeMoney).toFixed(2);
		}else{
			this.vipFree=0.00
		}						
		if(this.isChangeBill=="yes"){
			let num = Number(this.vipFreeOld)-Number(this.vipFree)+Number(this.jmMoney2Old)-Number(this.jmMoney2)
			this.dueamount=Number(this.dueamountOld)+num
			this.balance=Number(this.balanceOld)+num
			if(this.balance<=0){
				this.payType='a'
			}else if(this.balance>0){
				this.payType=0
			}			
			this.value1=Number(this.balance).toFixed(2)
		}else{
			this.value1 = (Number(this.dueamount) - Number(this.jmMoney2) - Number(this.vipFree)).toFixed(2);
		}		
		if(!this.member.name){
			this.error1='请输入会员卡号查询减免优惠金额！'
			return
		}else{
			this.window=false
		}		
	},
	confirm1(){		
		if(this.value4)
			this.jmMoney2 = Number(this.value4).toFixed(2)
		else if(this.value4==0||this.value4=='')
			this.jmMoney2='' 
		if(this.isChangeBill=="yes"){
			let num = Number(this.jmMoney2Old)-Number(this.jmMoney2)+Number(this.vipFreeOld)-Number(this.vipFree)
			this.dueamount=Number(this.dueamountOld)+num
			this.balance=Number(this.balanceOld)+num
			if(this.balance<=0){
				this.payType='a'
			}else{
				this.payType=0
			}		
			console.log(this.balance,this.dueamount)
			this.value1=Number(this.balance).toFixed(2)
		}else{
			this.value1 = (Number(this.dueamount) - this.jmMoney2 - this.vipFree).toFixed(2);
		}
		this.window=false				
	},
	clearMem(){
		this.vipFree=0
		// this.member={}
		this.memberinfo = {}
		this.memFreeMoney=''
		// this.memBalance = ''
		// this.cardno=''
		this.error1 = ''
		this.window=false
		if(this.isChangeBill=="no"){
			this.value1 = (Number(this.dueamount) - this.jmMoney2 - this.vipFree).toFixed(2)
		}else{
			let num = Number(this.vipFreeOld)-Number(this.vipFree)+Number(this.jmMoney2Old)-Number(this.jmMoney2)
			this.dueamount=Number(this.dueamountOld)+num
			this.balance=Number(this.balanceOld)+num
			if(this.balance<=0){
				this.payType='a'
			}else if(this.balance>0){
				this.payType=0
			}			
			this.value1=Number(this.balance).toFixed(2)
		}				
	},
	cancel(){
		this.window=false
		this.error1=''
	},
	jmMem(){//账单会员减免金额查询
		this.window=true;
		this.index=1;		
	},
	jmCount(){//账单减免金额查询
		axios.post(localStorage.getItem('apiurl')+'/account/free',
		{
			'count':Number(this.dueamount)-Number(this.vipFree)
		}).then(res => {
	        if(res.data.freeList.length!=''){	        		        	
	   			this.jmNums = res.data.freeList
	        }
	        this.index=2
	        this.window=true	        
	    })
	},
	memSearch(e){
		let num = e.target.dataset.num;
		if(num==0)
			this.cardNum = this.value2
		else if(num==1)
			this.cardNum = this.value3
		else if(num==2)
			this.cardNum = this.value5
		if(!this.cardNum){
			if(num==2)
				this.error1='请输入卡号'
			if(num==0)
				this.error='请输入卡号'	
			return
		}
		axios.post(localStorage.getItem('apiurl')+'/account/getVip',
			    {
			    	'orderid':localStorage.getItem('orderid'),
			    	'isOrder':'1',
			    	'branchId':localStorage.getItem('branchId'),
			    	'queryCondition':this.cardNum,
			    	// 'isgz':'0',
			    	'ydurl':'/chain-newspicyway/api/member/queryMemberInfo'
			    }
		).then((res)=>{ 					
            if(res.data.code==1){ 	                                  	
            	this.window=true;
				this.index=1;
            	this.member=res.data.memberInfo; 
            	this.cardno=res.data.memberInfo.cardno; 
            	this.memFreeMoney=res.data.totalDiscountAmount;
            	this.memBalance=res.data.memberInfo.balance; 
            	this.value2=this.value5            	       	
            }else if(res.data.code=='0'){
            	this.value2=''
				this.value3=''
				this.value5=''
				this.memberinfo = ''
				this.memFreeMoney = ''
				this.memBalance = ''
				this.member=''
				if(num==2)
					this.error1='没有找到会员信息'								    
				if(num==0)				
					this.error='没有找到会员信息'
            }else if(res.data.code==2){ 
            	if(res.data.memberInfo.status==2){
	        		this.message("该会员已挂失，请先解挂！",'warning')
	        		return
	        	}
            	this.window=true;
				this.index=1;          	
            	// this.message("无可用减免优惠",'message')
            	this.memFreeMoney=0.00
            	// this.memberinfo = res.data.memberInfo;
            	this.member=res.data.memberInfo;
            	this.cardno=res.data.memberInfo.cardno;
            	this.memBalance=res.data.memberInfo.balance;
            	this.value2=this.value5
            }                     
  		}).catch(err=>{
  			this.message('网络错误，不能进行会员相关操作！',"error")
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
	orderPay(){//账单支付
		let payway,
			that=this,
			userid=localStorage.getItem('username'),
			orderid=this.orderid,
			branchid=localStorage.getItem('branchId'),
			cardNo=this.member.mobile;
		this.tableID=localStorage.getItem('tableID');
		if(this.dueamount<0){
			this.message('实收金额不能为负！','warning')
			return
		}
		if(this.isChangeBill=="yes" && this.balance<0){//反结账退款
			if(this.paywayCount>1 || this.lastpayway==4){//上次结账方式大于1现金退回
				payway=4
				pay()
			}else if(this.paywayCount<=1){//支付宝退回
				if(this.lastpayway==1){
					axios.post(localStorage.getItem('apiurl')+'/account/getVip',
						{
							'branchid':branchid,
							'orderid':orderid,
							'rebatesMoney':Math.abs(that.balance),
							'ydurl':'/chain-newspicyway/api/pay/rebatesRecord'
						}
					).then(res=>{
						console.log(res)
						if(res.data.result.resultMsg=='退款成功'){							
							payway=1
							pay()
						}else if(res.data.result.resultMsg=='订单已经退款'){
							this.message('订单已经退款！','message')
						}
						else{
							this.message('退款失败，请重试！','error')
							return
						}
					}).catch(err=>{
						this.message('网络错误，不能进行此操作！')
					})
				}else{
					payway=this.lastpayway
					pay()
				}				
			}
		}else if(this.ordertype!=7){
			if(this.payType==0){								
		    	if(this.charge<0){
		    		this.message('收银现金小于应收金额，不能结算！','warning');
		    		return
		    	}		
				payway=4				
				pay()
			}else if(this.payType==1){
				let orderAmount = this.balance>0 ? that.balance : that.dueamount
				payway=1
				if(!this.codeUrl){//未支付成功过
					axios.post(localStorage.getItem('apiurl')+'/account/getVip',//微信支付宝支付
						{
							"code":this.paycode,//付款码
							"orderid":orderid,
							"branchid":branchid,
							"orderAmount":orderAmount,//账单应付金额
							"ydurl":'/chain-newspicyway/api/pay/smartScan'
						}
					).then(res=>{
						if(res.data.code==1){
							let that = this
							this.codeUrl=res.data.code_url
							this.paycode=''
							payResult()							
							that.queryTimer = setInterval(()=>{
								payResult()
							},1000)							
							that.queryTimer2 = setTimeout(()=>{
								clearInterval(that.queryTimer)
								that.queryTimer=''
								that.paying=false 
								that.paycode=''
								that.message('支付超时，请重新扫码支付！','error')
			            		return						
							},60000)												
						}else{
							this.paycode=''
							this.paying=false	
							if(res.data.msg=='该门店暂未配置莱米商户信息'){
								that.message('本门店暂未配置莱米商户信息！')								
							}else{
								that.message('支付失败！','error')
							}			        
			        		return
						}
					}).catch(err=>{
						this.paying=false
						this.paycode=''
						this.message('网络错误，请检查网络！','error')
	            		return
					})
				}else{//有支付成功但未进行账单结账，再次支付直接查询支付结果结账
					payResult()
				}				

				function  payResult(){
					// let that = this;
					axios.post(localStorage.getItem('apiurl')+'/account/getVip',
						{
							"code_url":that.codeUrl,
							"branchid":branchid,
							"orderAmount":orderAmount,
							"ydurl":'/chain-newspicyway/api/pay/queryPayResult'
						}	
					).then(res=>{
						console.log(res)						
						if(res.data.code=='1'){
							let payType = res.data.payType ? res.data.payType : '';	
							clearInterval(that.queryTimer)
							clearTimeout(that.queryTimer2)
							that.queryTimer=''
							that.queryTimer2=''														
							pay(payType)							
						}else if(res.data.code=='0'){	
							if(res.data.msg!=='等待支付'){
								that.message(res.data.msg,'error')
								clearInterval(that.queryTimer)
								clearTimeout(that.queryTimer2)
								that.paying=false; 
								that.paycode=''
								return
							}																					
						}
					})					
				}
			}else if(this.payType==2){//会员结算
				if(this.member.status!=1){
            		this.message("该会员已挂失，请先解挂！",'warning')
            		return
            	}
            	if(this.isChangeBill=="no"){
            		if(Number(this.memBalance)<Number(this.dueamount)-Number(this.vipFree)-Number(this.jmMoney2) && this.memBalance != ''){
						this.message('会员余额不足，不能用会员储值支付！','warning');
            			return				
					}
            	}else{
            		if(Number(this.memBalance)<Number(this.balance)&&this.memBalance != ''){
						this.message('会员余额不足，不能用会员储值支付！','warning');
            			return				
					}
            	}								
				payway=2
				pay()
			}else if(this.payType==3){//POS刷卡
				payway=3
				pay()
			}else if(this.payType==4){//自定义结算
				if(this.selfPayIdx=='a'){
					console.log(this.selfPayIdx)
					this.error="请选择自定义支付方式"
					return
				}else{
					payway = this.paytype
					pay()
				}				
			}else if(this.payType==5){//会员挂账
				payway=5
				pay()
			}else{
				payway=this.lastpayway?this.lastpayway:4
				pay()
			}
		}else if(this.ordertype==7){
			if(this.payType==0){
				payway=4
				if(this.value1 < Number(this.dueamount)){
					this.cashError = '收银现金小于应收金额，不能结算！';
					return;
				}
			}else if(this.payType==1){
				payway=1				
			}else if(this.payType==3){
				payway=3
			}else if(this.payType==4){
				if(this.selfPayIdx=='a'){
					this.error="请选择自定义支付方式"
					return
				}
				payway = this.paytype
			}			 	
			axios.post(localStorage.getItem('apiurl')+'/account/getVip',
			{
				'type':1,
				'cardNo':this.storeIfo.memberno,
				'rechargeMoney':this.storeIfo.ssamount,
				'ssamount':this.storeIfo.ssamount,
				'freeMoney':this.storeIfo.freeamount,
				'payType':payway,
				'ydurl':"/chain-newspicyway/api/member/changeMemberBalance"
			}).then(res=>{
				if(res.data.code==1){												
					pay()
				}
			}).catch(err=>{
				this.message('网络错误，请检查网络是否连接！','warning');
			})
		}

		function pay(payType){
			let data={},
				url='',
				num=that.member.mobile?that.member.mobile:'',
				code_url=that.codeUrl?that.codeUrl:''
			if(that.isChangeBill=="no"){//普通支付接口
				data={
					"payway":payway,//支付方式 1:微信支付宝
					"orderid":orderid,//订单id
					"ymamount":that.vipFree,//会员减免
					"wipeamount":that.jmMoney2,//减免金额
					"dueamount":that.dueamount,//账单应付金额
					"cardNo":num,//如果结算没有与会员相关的传空
					"userid":userid,
					"branchid":branchid,
					'payType':payType,
					'code_url':code_url 
				}
				if(that.payType == 0) {
					data.zlmoney = that.charge;
				}
				url=localStorage.getItem('apiurl')+'/account/closeAccounts'
			}else if(that.isChangeBill=="yes"){//反结算支付
				data={
					"payway":payway,//支付方式 1:微信支付宝
					"orderid":orderid,//订单id
					"dueamount":that.dueamount,
					"ymamount":that.vipFree,//会员减免
					"wipeamount":that.jmMoney2,//减免金额
					"cardNo":num,//如果结算没有与会员相关的传空
					"userid":userid,
					"branchid":branchid,
					'paywayCount':that.paywayCount,
					'payType':payType					
				}
				url=localStorage.getItem('apiurl')+'/account/returnPay'			
			}
			axios.post(url,data).then(res=>{
				if(res.data.code==0){					
					that.paying=false					
					if(that.isChangeBill=="no"&&that.ordertype!=7){	
						that.message('付款成功','success')				
						axios.get(localStorage.getItem('apiurl')+'/padinterface/checkout?tid='+that.tableID			
						).then(res=>{				
							if(res.data.code==0){
								axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=0&tableid='+that.tableID+'&ucode=' + localStorage.getItem('username')).then(res=>{//记录离开页面
									if(res.data.code==0){
										that.printer();	
										that.$router.push({
											path:'/dinner'
										})
									}
								});								
							}
						})
					}else if(that.ordertype==7){
						that.printer();	
						that.message('会员储值成功！','success')
						that.$emit('editPayClose',1)
					}else{
						that.printer();
						if(that.isChangeBill=="yes" && that.balance<0){
							that.message('退款成功！','success')
						}else{
							that.message('结账成功!','success')
						}
						
						that.$router.push({
							path:'/dinner'
						})		
					}														
				}//else if(res.data.code==3)
			}).catch(err=>{
				this.message('结账失败，请重试！','error')
			})
		}								
	},
    _aut(res){		
    	if(res=='close'){
    		this.getAut=false
    	}else if(res=='aut'){
    		this.haveAut = true
    		this.getAut=false
    	}
    },
    printer (){
    	let that = this;
		let data = {
			orderid: this.orderid,
			type: 'y',
			isBefore: 0
		}		
		axios.post(localStorage.getItem('apiurl') + '/api/employee/doPrinter', data)
    },
    cash(){
    	// if(this.payType==0)
    	// this.value1=Number(Number(this.dueamount)-Number(this.vipFree)-Number(this.jmMoney2)).toFixed(2)
    }
  },
  watch:{
    payType(){
    	this.value='5' 
    	if(this.payType==1){
	    	setTimeout(()=>{			
	    		this.$refs['input'].focus() 	
	    	},100) 
    	}    	 	
    },
    value1(){
    	// this.$refs['input1'].focus()
    	if(this.isChangeBill=='yes'){
    		this.charge=Number(Number(this.value1)-Number(this.balance)).toFixed(2)
    		if(this.charge==-0.00){
    			this.charge=0.00
    		}  
    	}else{
    		this.charge=Number(Number(this.value1)-Number(this.dueamount)+Number(this.vipFree)+Number(this.jmMoney2)).toFixed(2)   
    		if(this.charge==-0.00){
    			this.charge=0.00
    		} 	
    	}   	
    },   
    paycode(){
    	if(this.paycode.length==18){
    		console.log('获取到付款码')
    	 	this.orderPay()
    	 	this.paying=true
    	}
    },
    value4(){
    	if(this.value4<0) this.value4=0    		
    	if(this.isChangeBill=="yes"&&this.balance>=0){
    		if(Number(this.value4)>Number(this.dueamount)){
    			this.message('减免金额不能大于实收金额，请重新输入！','warning');
	        	this.value4=''	        	
    		}
    	}else if(this.value4>(this.dueamount-this.jmMoney2)||(this.balance>0&&this.value4>this.balance)){
    		this.message('减免金额不能大于实收金额，请重新输入！','warning');
	        this.value4=''	        
    	}
    	this.backMoney=this.value4	
    }
  },
  created(){
  	document.onkeydown = e=>{//监听键盘按下，快捷键操作
    	if(e.keyCode==13){
    		if(this.payType!=1)	
    			this.orderPay()
    	}   		   		
    }
  },
  mounted(){
  	let url = window.location.href,
  		idx = url.indexOf("orderTable"), 		
  		orderid=localStorage.getItem('orderid'),
  		isChangeBill=this.isChangeBill=localStorage.getItem('isChangeBill');  		
  	this.value="9";		
  	this.orderid=orderid;
  	//发送请求获取相应订单信息
  	if(isChangeBill=='no'){
  		axios.post(localStorage.getItem('apiurl')+'/account/toAccount',
			{
				"orderid":orderid
			}
		).then(res=>{			
			if(res.data.code==0){								
				if(res.data.order.ordertype==7){
					this.ordertype=res.data.order.ordertype
					this.value1=this.dueamount=Number(res.data.order.ssamount).toFixed(2)
					this.storeIfo=res.data.order					
				}else{
					this.dueamount=res.data.order.dueamount
					this.value1 = Number(res.data.order.dueamount).toFixed(2)
				}
			}			
		})
  	}else if(isChangeBill=='yes'){
  		// this.payType='a'
  		let that = this
  		axios.post(localStorage.getItem('apiurl')+'/account/oppositeCloseAccounts',
			{
				"orderid":orderid,				
				'currentprice':localStorage.getItem('dueamount')
			}
		).then(res=>{
			if(res.data.code==0){
				this.userid=res.data.order.userid;
				this.jmMoney2=this.jmMoney2Old=Number(res.data.order.wipeamount?res.data.order.wipeamount:'');
				this.vipFree=this.vipFreeOld=Number(res.data.order.freeamount?res.data.order.freeamount:'');
				this.dueamount=this.dueamountOld=Number(res.data.order.dueamount)-Number(this.jmMoney2)-Number(this.vipFreeOld);					
				this.oldprice=Number(res.data.order.ssamount);														 
				this.paywayCount=Number(res.data.paywayCount);
				this.lastpayway=res.data.order.payway;				
				this.backMoneyType=res.data.paywayName;	
				this.value1=this.balanceOld=this.balance=Number(this.dueamount-this.oldprice).toFixed(2)
				this.codeUrl=res.data.order.codeurl?res.data.order.codeurl:''
				if(this.balance<=0){
					this.payType='a'
				}							
				if(res.data.order.cardno){
					this.value2=this.value5=res.data.order.cardno	
					axios.post(localStorage.getItem('apiurl')+'/account/getVip',
					    {
					    	'orderid':localStorage.getItem('orderid'),
					    	'isOrder':'1',
					    	'branchId':localStorage.getItem('branchId'),
					    	'queryCondition':res.data.order.cardno,
					    	// 'isgz':'0',
					    	'ydurl':'/chain-newspicyway/api/member/queryMemberInfo'
					    }
					).then((res)=>{ 
			            if(res.data.code==1||res.data.code==2){
			            	this.member=res.data.memberInfo; 
			            	this.memberinfo=res.data.memberInfo;			            	
			            	this.cardNo=this.member.cardno; 
			            	this.memberinfo.vipFree=res.data.totalDiscountAmount?res.data.totalDiscountAmount:'';
			            	this.memFreeMoney=res.data.totalDiscountAmount;
			            }
			        }).catch(err=>{
			        	this.message('网络错误，不能进行反结账会员操作！')
			        })
				}this.memberinfo
			}			
		})
  	}

  	document.onselect = ()=>{//input文字选中
	    if(window.getSelection) {
	      console.log(window.getSelection().toString())
	      this.text = window.getSelection().toString()
	    }else if(document.selection && document.selection.createRange) {
	        this.text = document.selection.createRange().text;
	    }
	}  	
  }
}
</script>

<style>
	.container{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(52,52,52,0.5);
		z-index: 99;
	}
	#pay{
		width: 65%;
		height: 100%;
		position: fixed;
		right: 0;
		top: 0;
		background: white; 
	}
	#pay .header{
		width: 95%;
		height: 0.6rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f4f4f4;
		margin: 0 auto;
	}
	#pay .header .title{
		font-size: 0.24rem;
		line-height: 0.6rem;
	}
	#pay .header .close{
		width: 0.2rem;
		height: 0.6rem;
		background: url('../../static/images/ic_close.png') no-repeat center center;
	}
	#pay .acount{
		width: 95%;
		/*height:25%;*/
		margin: 0 auto;
		border-bottom: 1px solid #f4f4f4;
		box-sizing: border-box;
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
	}
	#pay .acount p{
		text-align: center;
		font-size: 0.22rem;
		color: #ff7e4b;		
	}
	#pay .acount p .original{
		font-weight: normal;
		color: #999999;
		text-decoration: line-through;
	}
	#pay .acount p:not(.accountp) em{
		display: inline-block;
		width: 50%;
		font-style: normal;
		color: #ff7e4b;
		text-align: right;
	}
	#pay .acount p.accountp span {
		color: #ff7e4b;
	}
	#pay .acount p:not(.accountp) span{
		display: inline-block;
		width: 50%;
		color: #ff7e4b;
		text-align: left;
	}
	#pay .acount>ul{
		width: 2.1rem;
		height: 0.4rem;
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		margin-top: 0.2rem;
	}
	#pay .acount>ul>li{
		width: 1rem;
		height: 0.4rem;
		line-height: 0.4rem;
		box-sizing: border-box;
		text-align: center;		
		border: 1px solid #ededed;
		border-radius: 5px;
		font-size: 0.14rem; 
		float: left;		
	}	
	#pay .acount>ul>li:nth-child(1) span{
		display: inline-block;
		overflow: hidden;
		/*height: 0.4rem;		*/
	}
	#pay .acount>ul>li:nth-child(2) span{
		color: #ff7e4b;
		margin-left: 0.05rem;
	}
	#pay .acount>ul>li ul.jmIfo{
		display: inline-block;
		/*height: 0.4rem;*/
		overflow: hidden;
	}
	#pay .acount>ul>li ul.jmIfo li{
		height: 0.2rem;
		line-height: 0.2rem; 
		color: #ff7e4b;
	}
	#pay .acount>ul>li span.jmIfo {
		display: block;
		margin-top: -.12rem;
		color: #ff7e4b;
		font-size: .12rem;
	}
	#pay .payType{
		width: 95%;
		height: 1.2rem;
		margin: 0 auto;
		border-bottom: 1px solid #f4f4f4;
		box-sizing: border-box;
		display: flex;
	}
	#pay .payType li{
		flex: 1;
		height: 1rem;
		text-align: center;
		border: 1px solid #ededed;
		border-radius: 5px;
		font-size: 0.14rem; 
		margin: 7px 5px;
		box-sizing: border-box;
		font-size: 0.12rem;
	}
	#pay .payType .pic span{
		display: block;
		width: 100%;
		height: 0.4rem;
		margin-top: 0.2rem;
		margin-bottom: 0.05rem;
	}
	#pay .payType .posActive{
		color: #ff7e4b;
		border: 2px solid #ff7e4b;
	}
	#pay .payType .cash span{
		background: url('../../static/images/ic_cash.png') no-repeat center center;
	}
	#pay .payType .cashCho span{
		background: url('../../static/images/ic_cash_sel.png') no-repeat center center;
	}
	#pay .payType .wechat span{
		background: url('../../static/images/ic_wechat.png') no-repeat center center;
	}
	#pay .payType .wechatCho span{
		background: url('../../static/images/ic_wechat_sel.png') no-repeat center center;
	}
	#pay .payType .member span{
		background: url('../../static/images/ic_member_VIP.png') no-repeat center center;
	}
	#pay .payType .memberCho span{
		background: url('../../static/images/ic_member_VIP_sel.png') no-repeat center center;
	}
	#pay .payType .pos span{
		background: url('../../static/images/ic_POS.png') no-repeat center center;
	}
	#pay .payType .posCho span{
		background: url('../../static/images/ic_POS_sel.png') no-repeat center center;
	}
	#pay .payType .guazhang span{
		background: url('../../static/images/ic_guazhang.png') no-repeat center center;
	}
	#pay .payType .posCredit span{
		background: url('../../static/images/ic_guazhang_sel.png') no-repeat center center;
	}	
	#pay .payType .self{
		line-height: 1rem;
	}
	#pay .payType .other{
		display: none;
		line-height: 1rem;
	}
	#pay .payType .other span{
		display: inline-block;
		width: 49%;
		height: 0.18rem;
		background: red;
	}
	#pay .payType .other .left{
		background: url('../../static/images/ic_left.png') no-repeat center center;
		border-right: 1px solid #f4f4f4;
	}
	#pay .payType .other .right{
		background: url('../../static/images/ic_right.png') no-repeat center center;
	}
	#pay .payCash{
		width: 85%;
		height: calc(100% - 4.4rem);
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 2%;
		display: flex;
	}
	#pay .payCash .left{
		width: 50%;
		height: 100%;
	}
	#pay ._keyboard{
		width: 50%;
		height: 80%;
	}
	#pay .payCash h5{
		font-size: 0.14rem;
		color: #999999;
		margin-top: 3%;
	}
	#pay .payCash .cash{
		display: block;
		width: 70%;
		height: 0.4rem;
		display: flex;
		padding: 0 0.1rem;
		justify-content: space-between;
		color: #999999;
		font-size: 0.14rem;
		border:1px solid #ededed;
		line-height: 0.4rem;
	}
	#pay .payCash .cash .money{
		color: black;
		width: 98%;		
	}
	#pay .payCash .chargeNum{
		color: black;
		font-size: 0.14rem;	
	}
	#pay .payCash .chargeNum span{
		color: black;
		font-size: 0.14rem;	
	}
	#pay .preNum{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 78%;
		height: 1rem; 
	}
	#pay .preNum li{
		width: 30%;
		height: 0.4rem; 
		border: 1px solid #ededed;
		border-radius: 4px;
		text-align: center;
		line-height: 0.4rem;
		font-size: 0.14rem;
	}
	#pay .payWechat{
		width: 85%;
		height: calc(100% - 4.4rem);
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 2%;
		text-align: center;
		font-size: 0.14rem;		
	}
	#pay .payWechat p{
		line-height: 0.3rem;
		color: red;
	}
	#pay .payWechat .reFresh{
		color: #ffa04b;
		font-size: 0.14rem;
		background: white;
		margin-top: 0.1rem; 
	}
	#pay .payWechat img{
		margin-top: 0.4rem;
	}
	#pay .payWechat .qrCode{
		display: block;
		width: 1rem;
		height: 0.4rem;
		background: white;
		margin: 0 auto;
		border-radius: 5px;
		color: #999999;
		font-size: 0.14rem;
		border: 1px solid #ededed;
		margin-top: 0.2rem;
	}
	#pay .payMember{
		width: 85%;
		height: calc(100% - 4.4rem);
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 2%;
		display: flex;	
	}
	#pay .payMember .left{
		width: 50%;
		height: 100%;
	}
	#pay .payMember h5{
		font-size: 0.14rem;
		color: #999999;
		margin-top: 3%;
	}
	#pay .payMember input{
		width: 50%;
		height: 0.3rem; 
		border: 1px solid #ededed;
		padding: 0 0.1rem;
		box-sizing: border-box;
	}
	#pay .payMember button{
		width: 0.6rem;
		height: 0.3rem;
		background: #ff7e4b;
		margin-left: 0.2rem;
		border-radius: 3px;
		color: white;
		font-size: 0.14rem;
	}
	#pay .payMember ul{
		width: 100%;
		height: 70%;
		max-height: 2rem;
		display: flex;
		flex-wrap: wrap; 
		margin-top: 0.2rem;
	}
	#pay .payMember ul li{
		width: 49%;
		height: 20%;
		font-size: 0.14rem;
		color: #999999;
	}

	#pay .payMember ul li>span{
		font-size: .14rem;
		font-weight: 600;
		color: #666;
	}
	#pay .payPos{
		width: 85%;
		height: calc(100% - 4.4rem);
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 2%;
	}
	#pay .payPos p{
		display: block;
		width: 100%;
		height: 0.2rem;
		text-align: center;
		line-height: 0.2rem; 
		margin: 0 auto;
		font-size: 0.16rem;
	}
	#pay .selfpay ul{		
		width: 100%;
		display: flex;
		flex-wrap: wrap;		
		margin: 0 auto;
	}
	#pay .selfpay ul li{
		width: 20%;
		height: 0.6rem;
		border: 1px solid #ededed;
		text-align: center;
		line-height: 0.6rem;
		border-radius: 5px;
		font-size: 0.14rem;
		margin: 5px;
	}
	#pay .selfpay ul li:not(.selfPayAct):hover{
		color: #ff7e4b;
    	border: 1px solid #ff7e4b;
	}
	#pay .selfPayAct,.jmPayAct{
		color: white;
    	background: #ff7e4b !important;
	}
	#pay .btn{
		position: absolute;
		left: 10%;
		bottom: 0.3rem;
		display: block;
		width: 80%;
		height: 0.4rem;
		background: #ff7e4b;
		margin: 0 auto;
		border-radius: 5px;
		color: white;
		font-size: 0.14rem;
	}
	#pay .btnEmpty{
		background: #ffbea5;
	}
	.window{
	    width: 100%;
	    height: 100%;
	    position: fixed;
	    left: 0;
	    top: 0;
	    background: rgba(52,52,52,0.5);
  	}
  	.window .box{
	    width: 5rem;
	    height: 4rem;
	    background: white;    
	    margin: auto; 
	    position: absolute;
	    left: 35%;
	    top: 0;
	    bottom: 0;
	    right: 0; 
	    border-radius: 10px;
    }
	.window .box .header{
		width: 100%;
		height: 0.72rem;
		line-height: 0.72rem;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 0.3rem; 
		border-bottom: 1px solid #f4f4f4;
	}
	.window .box .header h5{
		font-size: 0.16rem;
		color: #333333; 
	}
	.window .box .header span{
		display: block;
		width: 0.14rem;
		height: 0.72rem;
		background: url('../../static/images/ic_close.png') no-repeat center center;
	}
	.window .box .main{
		width: 100%;
		height: 65%;
		display: flex;
		box-sizing: border-box;
		padding-top: 0.1rem;
	}
	.window .box .main>div{
		width: 50%;
		height: 100%;
		box-sizing: border-box;
		padding-left: 0.3rem;
		position: relative;
	}
	.window .box ._keyboard{
		width: 45% !important;
		height: 80% !important; 
	}
	.window .box .main input{
		width: 1.5rem;
		height: 0.3rem;
		border: 1px solid #f4f4f4;
		padding: 0 0.1rem;
		box-sizing: border-box;
	}
	.window .box .main input+button{
		width: 0.4rem;
		height:0.3rem;
		border-radius: 4px;
		background: #ff7e4b;
		margin-left: 5px;
		color: #fff;
	}
	.window .box .main ul{
		width: 100%;
		height: 70%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.window .box .main ul li{
		width: 45%;
		height: 0.3rem;
		line-height: 0.3rem;		
	}
	.window .box .main ul.money li{
		border: 1px solid #f4f4f4;
		border-radius: 5px;	
		margin: 0.05rem 0;
		text-align: center;
		font-size: 0.14rem;
	}
	.window .box .main ul.money li:not(.jmPayAct):hover{
		color: #ff7e4b;
    	border: 1px solid #ff7e4b;
	}
	.window .box .main ul.mem li{
		height: 0.4rem;
		margin: 0.05rem 0;
		text-align: left;
		line-height: 0.2rem;
		font-size: 0.14rem;
	}
	.window .box .main ul.mem li span{
		color: #666;
	    font-size: 0.12rem;
	    font-weight: 600;
	}
	.window .box .btnBox{
		width: 100%;
		height: 0.4rem;
		display: flex;
		justify-content: space-around;
	}
	.window .box .btnBox button{
		width: 35%;
		height: 0.4rem;
		display: block;
		background: #ff7e4b;
		color: #fff;
		border-radius: 5px; 
	}
	i{
		color: red;
		font-style: normal;
	}
	#paying{
		width: 65%;
	    height: 100%;
	    position: fixed;
	    right: 0;
	    top: 0;
	    background: rgba(52,52,52,0.3);
	    z-index: 9999;	    
	}
	#paying div{
		width: 100px;
		height: 5px; 
		text-align: center;	
		font-size: 18px;    
	    color:white;
	    position: absolute;
	    left: 0;
	    right: 0;
	    top: 0;
	    bottom: 0; 
	    margin: 50px auto;
	}
	#paying div span{
		color: inherit;
	}	
</style>
