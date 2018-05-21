<template>
  <div id="shift">
  	<div class="shiftTitle"> 
  		<ul>
  			<li v-for="(title,index) in titles" @click="shiftContent(index)" :class="{titleChoose:idx==index}">{{title}}</li> 			
  		</ul>  		
  	</div>
  	<div class="shiftContainer">
	  	<!-- 营业统计时段查询 -->
	  	<div v-show="idx==1" class="search">
			<label>统计时间</label>
			<el-date-picker v-model="begin" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间" @focus='dateSel'></el-date-picker>
			<el-date-picker v-model="end" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间" @focus='dateSel'></el-date-picker>
			<el-button type="warning" @click='search'>查询</el-button>
			<i>{{error}}</i>
		</div>
		<!-- 当班情况 -->
	  	<div class="postChange" :class="{postC:idx==1}"> 	
		  	<div class="duration" v-show="idx==0 || idx==1">	  		
		  		<div v-show="idx==0">
			  		<p class="long">当班时间:<span>{{format(dutyIfo2.starttime)}}--{{format(currentDate)}}</span></p>
			  		<p class="short">时长:<span>{{dutyDuration}}</span></p>
			  		<p class="short">员工:<span>{{dutyIfo2.username}}</span></p>
			  		<p class="long">应收总额:<span>￥{{money(dutyIfo.alldueamount)}}</span><span>(消费￥{{money(dutyIfo.dupay)}}</span>&nbsp;&nbsp;<span>充值￥{{money(dutyIfo.vipdu)}})</span></p>
					<p class="long">实收总额:<span>￥{{money(dutyIfo.allssamount)}}</span><span>(消费￥{{money(dutyIfo.sspay)}}</span>&nbsp;&nbsp;<span>充值￥{{money(dutyIfo.vipdu)}})</span></p>
					<p class="short">折扣优惠:<span>￥{{money(dutyIfo.allcouponamount)}}</span></p> 		  		
					<p class="short" style="width:25%">减免金额:<span>￥{{money(dutyIfo.allfeeamount)}}</span></p>
					<p class="short">会员赠送:<span>￥{{money(dutyIfo.vipzs)}}</span></p>
					<p class="medium">领取备用现金:<span>￥{{money(dutyIfo2.cashamount)}}</span></p>		
					<p class="medium">本班现金余额:<span>￥{{money(cashAmount)}}</span></p>				
				</div>
				<div v-show="idx==1">
					<p class="medium">应收金额:<span>￥{{money(dutyIfo.alldueamount)}}</span></p> 
					<p class="medium">折扣优惠:<span>￥{{money(dutyIfo.allcouponamount)}}</span></p>
					<p class="medium">消费人次:<span>{{dutyIfo.allcustnum}}</span></p>
					<p class="medium">实收金额:<span>￥{{money(dutyIfo.allssamount)}}</span></p>
					<p class="medium">减免金额:<span>￥{{money(dutyIfo.allfeeamount)}}</span></p>				
					<p class="medium">人均消费:<span>￥{{money(dutyIfo.allaverage)}}</span></p>
				</div>
		  	</div>
		  	<!-- 收银明细 -->
		  	<div class="post" v-show="idx==0 || idx==1">
		  		<h4>收银明细</h4>
		  		<div>
		  			<ul class="postIfo">
		  				<li>收款方式</li>
		  				<li>消费单数</li>
		  				<li>消费收款</li>
		  				<li>会员充值单数</li>
		  				<li>会员充值金额</li>
		  				<li>退款单数</li>
		  				<li>退款金额</li>
		  				<li>作废单数</li>
		  				<li>作废金额</li>
		  			</ul>
		  			<ul class="postDetail" v-show="!showLoading">
		  				<li v-if='gatheringDetails.length' v-for="(gatheringDetail,index) in gatheringDetails" :class="{double:index % 2 == 1 }">
		  					<ul :class="{double:index % 2 == 1 }">
		  						<li>{{gatheringDetail.payname}}</li>
		  						<li>{{gatheringDetail.consumecount}}</li>
		  						<li>￥{{money(gatheringDetail.consumemoney)}}</li>
		  						<li>{{gatheringDetail.vippaycount}}</li>
		  						<li>{{gatheringDetail.vippaymoney}}</li>
		  						<li>{{gatheringDetail.returncount}}</li>
		  						<li>￥{{money(Math.abs(gatheringDetail.returnmoney))}}</li>
		  						<li>{{gatheringDetail.cancelcount}}</li>
		  						<li>￥{{money(gatheringDetail.cancelmoney)}}</li>
		  					</ul>
		  				</li>
		  				<li v-if='!gatheringDetails.length' style='font-size: 0.14rem;color:black;margin-top: 0.1rem;'>暂无收银记录</li>
		  			</ul>
		  			<LoadInline v-show="showLoading"></LoadInline>
		  		</div>
		  	</div>
		  	<div class="quit" v-show="idx==0">
		  		<button @click='openCashBox'>开钱箱</button><button @click="shiftAndQuit">交班并退出</button>
		  	</div>
		  	<!-- 交班记录 -->
		  	<div v-show="idx==2" class="changeRcord">
		  		<ul>
		  			<li class="time">开班时间</li>
		  			<li class="time">交班时间</li>
		  			<li>收银员</li>
		  			<li>领取备用金</li>
		  			<li>现金余额</li>
		  			<li>操作</li>
		  		</ul>
		  		<ul v-show="!showLoading">
		  			<li v-for="(changeRcord,index) in changeRcords" @click="detail(format(changeRcord.starttime),format(changeRcord.insertdate),changeRcord.username,changeRcord.id,1)">
		  				<ul :class="{double:index % 2 == 1}">
				  			<li class="time">{{format(changeRcord.starttime)}}</li>
				  			<li class="time">{{format(changeRcord.insertdate)}}</li>
				  			<li>{{changeRcord.username}}</li>
				  			<li>￥{{money(changeRcord.cashamount)}}</li>
				  			<li>￥{{money(changeRcord.personalcount)}}</li>
				  			<li class="detail">详情</li>			  			
				  		</ul>			  		
		  			</li>
		  			<li v-if='changeRcords==""' style='font-size: 0.14rem;color:black;text-align: center;margin-top: 0.2rem;'>暂无交班记录</li>

		  		</ul>
		  		<LoadInline v-show="showLoading"></LoadInline>
		  	</div>
		  	<!-- 确认交班弹窗-->
		  	<div class="shiftConfirm" v-show="shiftConfirm">
		  		<div class="box">
		  			<span></span>
			  		<p>是否交班？</p>
			  		<div><button @click='confirmShift'>确认</button><button @click="quitShift">放弃</button></div>
		  		</div>	  		
	  		</div>
	  		<!-- 交班记录详情弹窗 -->
	  		<div class="changeRcordDetail" v-show="changeRcordDetail">
	  			<div class="box">
	  				<div class="title"><h4>交班记录</h4><span @click="closeDetail"></span></div>
		  			<div class="duration">	  		
				  		<p class="long">当班时间:<span>{{format(dutyIfo.starttime)}}--{{format(dutyIfo.insertdate)}}</span></p><!--  -->
			  		<p class="short">&nbsp;&nbsp;时长:<span>{{dutyDuration}}</span></p>
			  		<p class="short">员工:<span>{{dutyIfo.username}}</span></p>
			  		<p class="long">应收总额:<span>￥{{money(dutyIfo.alldueamount)}}</span><span>(消费￥{{money(dutyIfo.dupay)}}</span>&nbsp;&nbsp;<span>充值￥{{money(dutyIfo.vipdu)}})</span></p>
					<p class="long">&nbsp;&nbsp;实收总额:<span>￥{{money(dutyIfo.allssamount)}}</span><span>(消费￥{{money(dutyIfo.sspay)}}</span>&nbsp;&nbsp;<span>充值￥{{money(dutyIfo.vipdu)}})</span></p>
					<p class="short">折扣优惠:<span>￥{{money(dutyIfo.allcouponamount)}}</span></p> 		  		
					<p class="short">减免金额:<span>￥{{money(dutyIfo.allfeeamount)}}</span></p>
					<p class="short">&nbsp;&nbsp;会员赠送:<span>￥{{money(dutyIfo.vipzs)}}</span></p>
					<p class="medium">领取备用现金:<span>￥{{money(dutyIfo.cashamount)}}</span></p>		
					<p class="medium">本班现金余额:<span>￥{{money(dutyIfo.personalcount)}}</span></p>
			  		</div>
			  		<div class="post">
				  		<h4>收银明细</h4>
				  		<div>
				  			<ul class="postIfo">
				  				<li>收款方式</li>
				  				<li>消费单数</li>
				  				<li>消费收款</li>
				  				<li>会员充值单数</li>
				  				<li>会员充值金额</li>
				  				<li>退款单数</li>
				  				<li>退款金额</li>
				  				<li>作废单数</li>
				  				<li>作废金额</li>
				  			</ul>
				  			<ul class="postDetail" v-show="!showLoading">
				  				<li v-for="(gatheringDetail,index) in gatheringDetails" :class="{double:index % 2 == 1 }">
				  					<ul :class="{double:index % 2 == 1 }">
				  						<li>{{gatheringDetail.payname}}</li>
				  						<li>{{gatheringDetail.consumecount}}</li>
				  						<li>￥{{money(gatheringDetail.consumemoney)}}</li>
				  						<li>{{gatheringDetail.vippaycount}}</li>
				  						<li>{{gatheringDetail.vippaymoney}}</li>
				  						<li>{{gatheringDetail.returncount}}</li>
				  						<li>￥{{money(Math.abs(gatheringDetail.returnmoney))}}</li>
				  						<li>{{gatheringDetail.cancelcount}}</li>
				  						<li>￥{{money(gatheringDetail.cancelmoney)}}</li>
				  					</ul>
				  				</li>
				  			</ul>
				  			<LoadInline v-show="showLoading"></LoadInline>
				  		</div>
			  		</div>
		  		</div>
	  		</div>
	  	</div>  
	</div>	
  </div>
</template>

<script>
import axios from 'axios'
import LoadInline from '../components/public/LoadInline'
export default {
  name: 'Shift',
  components: {LoadInline},
  data(){
  	return {
  		titles:["收银交班","营业统计","交班记录"],
  		dutyIfo:{},
  		dutyIfo2:{},
  		gatheringDetails:[],
  		businessIfo:{},
  		changeRcords:[],
  		shiftConfirm:false,
  		idx:0,
  		begin:'',
  		end:'',
  		changeRcordDetail:false,		
  		error:'',
  		openStartTime:'',
  		dutyDuration:'',
  		cashAmount:0,
  		authority:'no',
  		personOrAllBusiness:'',
  		tellcash:'',
  		showLoading: true,
  		currentDate:''
  	}
  },
  methods:{
  	shiftAndQuit(){
  		this.shiftConfirm = true
  	},
  	quitShift(){
  		this.shiftConfirm = false
  	},
  	shiftContent(index){ 
  		if(this.authority=='no' && index==0){
  			this.message('无收银权限，没有收银交班数据！','warning');
  			return
  		}else{
  			this.idx=index; 		
	  		this.dutyIfo='';
	  		this.dutyIfo2='';
	  		this.gatheringDetails=[];
	  		this.dutyDuration=''
	  		if(index==0){
	  			this.personalBusiness()
	  		}else if(index==1){
	  			this.duration()
	  			this.search()
	  		}else if(index==2){
	  			let that = this;
	  			this.showLoading = true;
	  			axios.post(localStorage.getItem('apiurl')+'/duty/shiftDutyList',
			  		{
			  			"branchid":localStorage.getItem('branchId')					
			  		}
			  	).then(res=>{
			  		this.showLoading = false;
			  		if(res.data.tellerCastList.length!=0){
			  			this.changeRcords=res.data.tellerCastList
			  		}
			  	}).catch(function(error){
			  		that.showLoading = false;
			  	})
	  		}
  		} 		
  		
  	},
  	search(){
  		let that = this;
  		if(this.begin==''||this.end==''){
  			this.error='请选择查询时段'
  			return 		 			
  		}
  		if(Date.parse(new Date(this.begin)) > Date.parse(new Date(this.end))){
  			this.error='结束时段不能小于开始时段' 
  			return 
  		}		
  		this.showLoading = true;					
		axios.post(localStorage.getItem('apiurl')+'/duty/allBusiness',
	  		{
	  			"userid":localStorage.getItem('username'),
				"starttime":this.begin,
				"endtime":this.end,
				"branchid":localStorage.getItem('branchId')	
	  		}
	  	).then(res=>{
	  		this.showLoading = false;
	  		if(res.data!=''){
	  			this.dutyIfo=res.data.personOrAllBusiness[0];
	  			this.gatheringDetails=res.data.business;
	  		}
	  	}).catch(function(error){
	  		that.showLoading = false;
	  	})
  	},
  	detail(start,end,userid,id){
  		this.changeRcordDetail=true
  		this.personalBusiness(start,end,userid,id,1) 		
  	},
  	closeDetail(){
  		this.changeRcordDetail=false
  	},
  	personalBusiness(start='',end='',userid=localStorage.getItem('username'),id,num){   		
  		let that = this,
  			url,data;
  		if(num==1){
  			url='/duty/shiftDutyDetail'
  			data={'id':id}
  		}else{
  			url='/duty/personalBusiness'  			
  			data={
	  			'userid':userid,
	  			"starttime":start,
				"endtime":end
	  		}
  		}
  		this.showLoading = true;					
  		axios.post(localStorage.getItem('apiurl')+url,
	  		data
	  	).then(res=>{
	  		this.showLoading = false;
	  		if(res.data!=''){	
	  		// console.log(res) 
	  			this.showLoading = false;				  				  			
	  			if(num==1){
	  				// console.log('hhh')
	  				this.gatheringDetails=res.data.personBusiness;
	  				this.dutyIfo=res.data.cash;	  			   	  			   
	  			    this.cashAmount=res.data.personalcount;
	  			    let timer = (+new Date(res.data.cash.insertdate) - +new Date(res.data.cash.starttime))/1000,
	        			hour = ("0"+ Math.floor(timer/3600)).slice(-2),
        				min = ("0"+ Math.floor(timer%3600/60)).slice(-2);        		
        			this.dutyDuration = hour + "小时" + min + "分钟"   			    
	  			}else{
	  				this.gatheringDetails=res.data.business;
	  				this.dutyIfo=res.data.personOrAllBusiness[0];
	  				// console.log(res.data.personOrAllBusiness[0])
	  				this.personOrAllBusiness=res.data.personOrAllBusiness[0];
	  				this.openStartTime=res.data.tellcash.starttime;
	  				this.currentDate=res.data.currentDate
	  				this.dutyIfo2=res.data.tellcash;
	  				this.cashAmount=res.data.count;
	  				this.personOrAllBusiness.userid=res.data.tellcash.username	
	  				let timer = (+new Date(res.data.currentDate) - +new Date(this.openStartTime))/1000,
	        			hour = ("0"+ Math.floor(timer/3600)).slice(-2),
        				min = ("0"+ Math.floor(timer%3600/60)).slice(-2);        		
	        		this.dutyDuration = hour + "小时" + min + "分钟" 
	        		this.personOrAllBusiness.worktime=hour + "小时" + min + "分钟" 
	        		this.personOrAllBusiness.worktime=hour + "小时" + min + "分钟"					  				
	  			}	  				  			        		
	  		} 			
	  	}).catch(function(error){
	  		that.showLoading = false;
	  	})
  	},
  	dateSel(){
  		this.error=''
  	},
  	total(data){
  		let n=0,n1=0,n2=0,n3=0,n4=0,n5=0,n6=0,n7=0,n8=0;
  		for(var i in data){
  			n += data[i].consumecount
  			n1 += data[i].consumemoney
  			n2 += data[i].vippaycount
  			n3 += data[i].vippaymoney
  			n4 += data[i].returncount
  			n5 += data[i].refundAcount
  			n6 += data[i].cancelcount
  			n7 += data[i].cancelmoney
  		}
  	},
  	duration(){// 获取当前时间，根据当前时间默认营业统计查询时段
  		let hour = new Date().getHours(),
  			year=new Date().getFullYear(),
			month=('0'+ (+new Date().getMonth()+1)).slice(-2),
			date=new Date().getDate(),
			_hour=new Date().getHours(),
			minute=new Date().getMinutes(),
			second=new Date().getSeconds()   		
	  	if(hour<6){	
	  		this.begin = year + "-" + month + "-" + ('0'+(date-1).slice(-2)) + " " + "06:00:00"
	  		this.end = year + "-" + month + "-" + ('0'+(date)).slice(-2) + " " + "06:00:00"	  		
	  	}else if(hour>=6){
	  		this.begin = year + "-" + month + "-" + ('0'+date).slice(-2) + " " + "06:00:00"
	  		this.end = year + "-" + month + "-" + ('0'+(date+1)).slice(-2) + " " + "06:00:00"
	  	}
  	},
  	confirmShift(){
  		axios.post(localStorage.getItem('apiurl')+'/duty/shiftDuty',this.personOrAllBusiness				
  		).then(res=>{
  			if(res.data.code==0){
  				this.logout()
  			}
  		})
  	},
  	logout() {
  		axios.get(localStorage.getItem('apiurl')+'/padinterface/logout').then((res)=>{
	        if(res.data.code==0){
	          localStorage.removeItem("username");
	          localStorage.removeItem("userid");
	          localStorage.removeItem("user");
	          this.message('交班并注销成功','success'); 	         
	          this.$router.push({
	            path:'/'    
	          })
	        }
      	}).catch(function(error){
      		this.message('网络错误，请稍后重试','error'); 
      	})                   
  	},
  	openCashBox(){

  	},
  	money(num){
  		if(num == '' || num == undefined || num == 'undefined'){
  			num = 0
  		}	
  		num = Number(num).toFixed(2)
  		return num
  	},
	format(timeStamp = +new Date()){
		let time = new Date(timeStamp),
			 y = time.getFullYear(),
			 m = time.getMonth()+1,
			 d = time.getDate(),
			 h = time.getHours(),
			 mm = time.getMinutes(),
			 s = time.getSeconds();
		function add0(m){return m<10?'0'+m:m }
		return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
	}
  },
  created(){  	
  	this.authority=localStorage.getItem('authority')
  	this.duration()
  	if(this.authority=='yes'){
  		this.personalBusiness('','',localStorage.getItem('username'),'')
  		this.idx=0
  	}else{ 
  		// this.duration()
	  	this.search()  		
  		this.idx=1
  	}	 			 	
  }
}
</script>

<style>
	#shift{
		width: 100%;
		height:100%;
		background: #f4f4f4;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 0.2rem;
	}
	#shift .search{
		margin-bottom: 0.2rem;
		background: white;
		padding: 0.2rem 0;
	}
	#shift .search label{
		font-size: 0.14rem;
		margin-left: 0.2rem;
	}
	#shift .search .el-date-picker{
		width: 10%;
	}
	#shift .search .el-button{
		font-size: 0.14rem;
		width: 0.8rem;
		background: #ff7e4b;
	}
	#shift .search .el-button span{
		color: white;
	}
	#shift .search .el-date-editor.el-input {
		width: 1.8rem;
		margin: 0 .1rem;
	}
	#shift .search .el-input__inner{
		/*width: 92% !important;*/
	}
	#shift .shiftTitle .titleChoose{
		color:#ff7e4b;
		border-bottom: 2px solid #ff7e4b;
	}
	#shift .shiftTitle ul{
		max-width: 10rem;
		width: 100%;
		height:0.6rem;
		display: flex;
		line-height: 0.6rem;
		font-size: 0.2rem;
		color:black;
	}
	#shift .shiftTitle li{
		width: 20%;
		height:0.6rem;
		line-height: 0.6rem;
		text-align: center;
		font-size: 0.2rem;
		color:black;
		margin-right: 0.2rem;
		
	}
	#shift .shiftTitle li:not(.titleChoose):hover {
		color: #ff7e4b;
		cursor: pointer;
	}
	#shift .shiftContainer {
		width: 100%;
		height: calc(100% - 0.8rem);
	}
	#shift .postChange{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 0.2rem;
		background: white;
		overflow: auto;
	}
	#shift .postChange.postC {
		height: calc(100% - 1rem);
		padding-bottom: .2rem;
	}
	#shift .duration{
		max-width: 8rem;
		width: 100%;
		margin-bottom: .4rem;
		/*height: 25%;
		min-height: 2.2rem;
		overflow: auto;		*/
	}
	#shift .postChange.postC .duration{
		max-width: inherit;
		height: auto;
		min-height: inherit;
		margin-bottom: .3rem;
	}
	#shift .duration div{
		width: 100%;
		height: 100%; 
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		overflow: auto;
	}
	#shift .duration div p{
		height: 0.4rem;
		box-sizing: border-box;
		padding: 0.1rem 0; 
		font-size: 0.14rem;
		color: #999999;
	}
	#shift .duration .long{
		width: 49%;
		margin-top: 0.1rem; 
		background: none !important;
	}
	#shift .duration div:nth-child(1) .medium{
		width:49%;
		margin-top: 0.1rem;
		font-size: 0.18rem;
		color: #ff916a;
		font-weight: 600; 
	}
	#shift .duration .long span{
		color:black;
	}
	#shift .duration .short{
		width: 24%;
		margin-top: 0.1rem;
	}
	#shift .duration .short span{
		color:#ff916a;
	}
	#shift .duration div:nth-child(2) .medium{
		height: 0.5rem;
		width: 26%;
		line-height: 0.25rem;
		margin-top: 0.1rem;
		padding-top: 0.2rem;
	}
	#shift .duration .medium span{
		color:#ff916a;
		font-weight: 600;
		padding-left: 0.05rem;
	}
	#shift .post{
		width: 100%;
		/*height: 47%;*/
		margin: 0 auto;
		background: white;
		box-sizing: border-box;
		/*padding: 0 0.2rem;	*/
	}
	#shift .postChange.postC .post {
		height: auto;
	}
	#shift .box .post {
		max-width: 8rem;
		width: 95% !important;
		/*max-height: calc(100% - 2.6rem);
		height: calc(62% - .4rem);*/
		margin: auto;
	}
	#shift .post h4{
		width: 100%;
		height: 0.3rem;
		line-height: 0.3rem;
		font-size: 0.16rem;
		color: #333333;
		font-weight: 600;
	}
	#shift .post > div{
		width: 100%;
		height: 88%; 
		border:1px solid #f4f4f4;
	}
	#shift .post div .postIfo{
		width: 100%;
		/*height:0.3rem;*/
		background: #f4f4f4;
		display: flex;
	}
	#shift .post div .postIfo li{
		flex:1;
		/*height: 0.4rem;*/
		box-sizing: border-box;
		padding: 0.05rem 0;
		text-align: center;
		font-size: 0.12rem;
		color: #999999;
	}
	#shift .post div .postDetail{
		width: 100%;
		height:85%;
		padding-bottom: .1rem;
    	box-sizing: border-box;
		/*overflow: auto;*/
	}
	#shift .postChange.postC .post div .postDetail {
		height: auto;
	}
	#shift .post div .postDetail ul{
		width: 100%;
		height:0.3rem;
		display: flex;
	}
	#shift .post div .postDetail .double{
		background: #fafafa;
	}
	#shift .post div .postDetail li{
		flex:1;
		height: 0.3rem;
		line-height: 0.3rem;
		text-align: center;
		font-size: 0.12rem;
		color: #999999;
	}
	#shift .postChange .quit{
		width: 100%;
		height:0.4rem;
		margin: .4rem 0;
		/*margin-left: 0.2rem;*/
	}
	#shift .postChange .quit button:nth-child(1){
		width: 0.8rem;
		height:0.4rem;
		line-height: 0.4rem;
		font-size: 0.14rem;
		text-align: center;
		border-radius: 5px;
		border: 1px solid #f4f4f4;
		background: white;
	}
	#shift .postChange .quit button:nth-child(2){
		width: 1.1rem;
		height:0.4rem;
		line-height: 0.4rem;
		color: white;
		font-size: 0.14rem;
		text-align: center;
		border-radius: 5px;
		background: #ff7e4b;
		margin-left: 0.2rem;
	}
	/*交班记录*/
	#shift .changeRcord{
		width: 100%;
		height: 90%;
		background: white;
		box-sizing: border-box;
		padding-top:0.2rem; 
	}
	#shift .changeRcord>ul:nth-child(1){
		background: #f4f4f4;	
	}
	#shift .changeRcord ul:nth-child(1){
		width: 100%;
		/*height: 0.4rem;
		display: flex;*/
		display: table;
	}
	#shift .changeRcord ul.double{
		background: #fafafa;
	}
	#shift .changeRcord ul:nth-child(1) li{
		display: table-cell;
		vertical-align: middle;
		width: 14%;
		/*height: 0.4rem; 
		line-height: 0.4rem; */
		padding: 0.1rem 0;
		text-align: center;
		font-size: 0.14rem;
		color:#999999;
	}
	#shift .changeRcord ul:nth-child(1) li.time{
		width: 22%;
		/*height: 0.4rem; */
	}
	#shift .changeRcord ul:nth-child(1) li.detail{
		color: blue;
	}
	/*交班弹窗*/
  .shiftConfirm,.changeRcordDetail{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top:0;
    background:  rgba(52,52,52,0.5);
    z-index: 999;
  }
  .shiftConfirm .box{
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
  .shiftConfirm .box span,.quitLogin .box span{
    display: inline-block;
    height: 1rem;
    width: 1rem;
    margin: 0.2rem 0;
    background: url('../../static/images/notice_2.png') no-repeat center center;

  }
  .shiftConfirm .box p{
    font-size: 0.18rem; 
    margin-bottom: 0.2rem;
  }
  .shiftConfirm .box button{
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
  /*交班记录详情弹窗*/
  .changeRcordDetail .box{
    width: 7rem;
    height:6rem;
    overflow: auto;
    background: white;    
    margin:auto; 
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    right:0; 
    border-radius: 10px;
  }
  .changeRcordDetail .box .title{
  	height: 0.4rem;
  	width: 100%;
  	box-sizing: border-box;
  	padding: 0 0.2rem; 
  	display: flex;
	justify-content: space-between;
  }
  .changeRcordDetail .box .title h4{
  	line-height: 0.4rem;
  	font-size: 0.18rem; 
  }
  .changeRcordDetail .box .title span{
  	height: 0.4rem;
  	width: 0.14rem; 
  	display: block;
  	background: url("../../static/images/ic_close.png") no-repeat center center;
  }
  .changeRcordDetail .box .duration{
	width: 95% !important;
	/*height: 38% !important;*/
	display: flex;
	flex-wrap: wrap;
	margin-left: 0.2rem;
  }
  .changeRcordDetail .box p{
  	height: 0.4rem; 		
  	font-size: 0.13rem;
  }
  .changeRcordDetail .box p span{
  	display: inline-block;
  	padding: 3px 0;
  }
  .changeRcordDetail .box p.long{
	width: 49% !important;
  }
  .changeRcordDetail .box p.medium{
	width: 32% !important;
	font-size: 0.18rem;
	color: #ff916a;
	font-weight: 600;
  }
  .changeRcordDetail .box p.short{
	width: 24% !important;
  }
  .changeRcordDetail .post{
	padding-top: 0.1rem !important;
  }
  i{
  	color:red;
  	font-style: normal;
  }
</style>
