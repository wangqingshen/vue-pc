<template>
	<div class="container">
	  <div id="changeTable">
	    <div class="header"><h5 class="title"><span>{{tableArear}}{{tableNum}}</span>更换桌台</h5><span class="close" @click="goBack"></span></div>
		<div class="tableType">
			<div class="typeList">
				<ul id="changetableList">
					<li v-for="(tableType,index) in tableTypes" :data-id=tableType.areaid  :class="{typeActive:typeIdx==index}"  @click="tableTypeChange(index,$event)">{{tableType.name}}</li>
				</ul>
			</div>
			<div class="search"><div class="searchWrap"><input type="text" v-model='searchText' @input="searchTable" name="" placeholder="请输入桌台号"><span ></span></div></div>
		</div>
		<div class="_table">
			<ul>
				<li v-for="(table,index) in tables" :data-id=table.tableid :class="{tableActive:tableIdx==index}" @click=tableClick(index,$event) class="leisure">					
					<div class="num">
						<p class="tableArea" ref=arear>{{table.areaname}}</p>
						<p class="tableNum" ref=num>{{table.tableName}}</p>
					</div>															
				</li>
			</ul>
			<button @click="checkFlag" v-show='tableid'>确认换台</button>
			<button class="empty" v-show='!tableid'>确认换台</button>
		</div>
	  </div>
    </div>
</template>

<script>
import Bus from '../bus.js';
import axios from 'axios'
export default {
  name: 'ChangeTable',data(){
  	return {
  		tableTypes:[{name:"全部",areaid:'-1'}],
  		tablesStores:[],
  		 tables:[],
  		typeIdx:0,
  		tableid:'',
  		tableIdx:'a',
  		tableArear:'',
  		num:'',
  		searchText:'',
  		tableTypeSel:'-1',
  		competedState: false,
  	}
  },
  methods:{
  	searchTable(){
  		this.tableIdx = 'a'
    	this.tableid=''
  		let num = this.searchText.toLocaleUpperCase(),
  			tables = this.tablesStores,
  			array=[];	
  		for(var i = 0;i < tables.length;i++){ 
  			let str = tables[i].tableNo.toLocaleUpperCase(),
  				idx = str.indexOf(num),
  				bool1 = tables[i].areaid==this.tableTypeSel;  
  			if(num==''){//查询值空 				
  				if(this.tableTypeSel=='-1'){
  					array = tables
  				}else{
  					if(bool1&&idx!=-1){
  						array.push(tables[i])
  					}
  				}
  			}else if(this.tableTypeSel=='-1'){
	  			if(idx!=-1){
	  				array.push(tables[i])
	  			}	  			
	  		}else{      			
	  			if(bool1 && idx!=-1)      				
	  				array.push(tables[i])     			
	  		}
	  	}
 		this.tables=array;
  	},
  	goBack:function(){
  		this.$router.push({
		  	path:'/dinner'
		})
  		// axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=0&tableid='+localStorage.getItem('tableID')).then(res=>{
    // 		if(res.data.code==0){
    // 			console.log('退出操作成功')
    // 			this.$router.push({
		  // 			path:'/dinner'
		  // 		})
    // 		}  			
    // 	}) 		
  	},
  	tableTypeChange(index,e){
  		if(this.typeIdx != index) {
  			this.typeIdx=index
  			this.tableIdx = 'a'
    		this.tableid=''
  		}
      	
      	let id = this.tableTypeSel = e.currentTarget.dataset.id;      	
      	var table = this.tablesStores;
      	this.tables=[];
      	for(var i = 0;i < table.length;i++){      		
      		if( id=='-1'){
      			this.tables = table;   			
      		}else{      			
      			if(table[i].areaid==id)      				
      				this.tables.push(table[i])     			
      		}
      	}
    },
    tableClick(index,e){//点击选择切换桌台
    	if(this.tableIdx != index) {
    		this.tableIdx = index
    		this.tableid=e.currentTarget.dataset.id;
    		this.num=this.$refs.num[index].innerText
    	}else{
    		this.tableIdx = 'a'
    		this.tableid=''
    	}
    	
    },
    // 验证是否桌台是否被占用
	checkFlag(){
		let that = this;
		axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=2').then(function(res){
			if(res.data.code == 0) {
				var d = res.data.data;
				var num = 0;
				var name = '';
				var state = false;
				for(var i in d) {
					if(i == localStorage.getItem('tableID')) {
						name = d[i];
						state = true;
					}
					num++;
				}
				if(!num || !state) {
					that.changeTableConfirm()
				}else{
					that.message('对不起，当前'+name+'正在操作该桌台', 'error');
				}
			}
		});
	},

    changeTableConfirm(){//确认更换桌台
    	let self = this,
    		tid=localStorage.getItem('tableNum'),
    		ntid=this.num,
    		oid=localStorage.getItem('orderid');
    	let data = {
    		tid: tid,
    		ntid: ntid, 
    		oid: oid
    	}
    	axios({
		    method:"POST",
		    data: data,
		    url:localStorage.getItem('apiurl')+'/padinterface/updateTable',//订单id
	 		xhrFields:{
	        	withCredentials:true
	        	}
	        }
        ).then(res=>{
        	if(!res.data.code && res.data.msg == '请求成功'){
        		self.message('换台成功!','success');		        	
                Bus.$emit('ChangeTable',1)  
                self.$router.push({
				 	path:'/dinner'
			    })   
        	}else{
        		self.message('换台失败，请重试','error');	       		
        	}
        }).catch(err=>{
        	self.message('换台失败，请重试','error');
        })
    },
    setWidth (l) {
		let that = this;
		let timer = setInterval(function(){
	    	if(that.competedState) {
	    		clearInterval(timer);
		    	var list = document.getElementById('changetableList').children;
		    	var len = l.length;
		    	var width = 1 + 12*len;
		    	for(var i=0; i<len; i++) {
		    		width += list[i].offsetWidth;
		    	}
		    	document.getElementById('changetableList').style.width = width + 'px';
		    }
	    }, 200)
    }
  },
  created(){
  	this.tableArear = localStorage.getItem('tableArear')
  	this.tableNum = localStorage.getItem('tableNum')
  	let branchId = localStorage.getItem("branchId");
  	let self = this;
	axios({
          method:"POST",
          url:localStorage.getItem('apiurl')+'/api/employee/getTableAndType',
          data:{
			    	'branchId':branchId,
			    	'areaid':''
				},
          xhrFields:{
                withCredentials:true
              }
        }).then((res)=>{
    	if(!res.code){
    		this.competedState = true;
    		let tables=res.data.data;//存放桌台分类对象            			          		
    		for(let i=0;i<tables.length;i++){
    			let obj={};
    			obj.name=tables[i].areaname;
    			obj.areaid= tables[i].areaid;
    			this.tableTypes.push(obj)
    			// this.tableTypes = this.tableTypes.concat(tables[i].areaname)
    			if(tables[i].tables==undefined)
    				return
    			for(let j=0;j<tables[i].tables.length;j++){ 
    				if(tables[i].tables[j].status=='0'){
    					this.tables=this.tables.concat(tables[i].tables[j])
    				}           				      			    				
    				//将返回数据保存在tablesStores里，切换类型状态的时候不用向后台请求            		
    			} 
    		}
    		this.tablesStores=this.tables;
    		if(this.tables==''){
    			this.$alert('暂无空闲可换桌台', '',{
	                confirmButtonText: '确定',
	                showClose:false,
	                confirmButtonClass:'confirmInput'
	            }).then(res=>{
	            	this.goBack()
	            });	                
    		}           		
    		this.setWidth(this.tableTypes);
    	}	
	})
  }
}
</script>

<style>
	.container{
		width: 100%;
		height:100%;
		position:fixed;
		left:0;
		top:0;
	}
	#changeTable{
		width: 65%;
		height:100%;
		position:fixed;
		right:0;
		top:0;
		background: white;
	}
	#changeTable .header{
		width:95%;
		height:0.6rem;
		display:flex;
		justify-content: space-between;
		border-bottom: 1px solid #f4f4f4;
		margin:0 auto;
	}
	#changeTable .header .title{
		font-size:0.2rem;
		line-height:0.6rem;
	}
	#changeTable .header .title span{
		color:#ff7e4b;
	}
	#changeTable .header .close{
		cursor: pointer;
		width:0.2rem;
		height:0.6rem;
		background: url('../../static/images/ic_close.png') no-repeat center center;
	}
	#changeTable .tableType{
		width:98%;
		margin: 0 auto;
		background:white;
		display:flex;
		position:relative;
	}
	#changeTable .tableType .typeList {
		box-sizing: border-box;
		width: calc(100% - 2.2rem);
		/*padding: 0 0.1rem;*/
		overflow-x: auto;
		overflow-y: hidden;
	}
	#changeTable .tableType .typeList>ul{
		/*display:flex;*/
		display: block;
		height:0.62rem;
		background:white;
	}
	#changeTable .tableType ul li{
		display: inline-block;
		min-width:0.42rem;
		width: auto;
		height:0.42rem;
		text-align:center;
		line-height:0.42rem;
		border:1px solid #f4f4f4;
		border-radius:5px;
		margin-left:0.12rem;
		margin-top:0.1rem;
		padding: 0 0.2rem;
		font-size:0.14rem;
	}
	#changeTable .tableType .typeActive{
		background:#ff7e4b;
		color:white;
	}
	#changeTable .tableType ul li:not(.typeActive):hover {
		cursor: pointer;
		color: #ff7e4b;
		border-color: #ff7e4b;
	}	
	#changeTable .tableType .search{
		position: absolute;
	    right: 0;
	    width: 2rem;
	    height: 0.62rem;
	    display: flex;
	}

	#changeTable .tableType .search .searchWrap {
	  /*border: 1px solid rgba(121, 121, 121, 0.5);*/
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  width: 100%;
	  height: 0.4rem;
	  margin-right: .2rem;
	  margin-top: 0.11rem;
	}
	#changeTable .tableType .search input{
		 width: calc(100% - .4rem);
		  height: 100%;
		  padding-left: 0.1rem;
		  box-sizing: border-box;
		  float: left;
		  border-radius: 5px;
	}
	#changeTable .tableType .search span{
		 display: inline-block;
		  width: 0.4rem;
		  height: 100%;
		  background: url('../../static/images/ic_search.png') no-repeat center center;
		  background-size: .2rem;
	}
	#changeTable ._table{
		height:calc(100% - 1.22rem);
		width:98%;
		margin-left: 0.1rem;
		overflow:hidden;
	}
	#changeTable ._table ul{
		display:flex;
		flex-wrap: wrap;
		align-content: flex-start;
		width: 98%;
		height:calc(100% - 0.62rem);
		box-sizing: border-box;
		padding: 0.2rem 0;
		margin: 0 auto;
		overflow: auto;
	}
	#changeTable ._table>button{
		display: block;
		width:98%;
		height:0.42rem;
		margin: 0 auto;
		line-height: 0.42rem;
		font-size:0.14rem;
		color: white;
		background: #ff7e4b;
		border-radius: 5px;
		margin-bottom: 0.2rem;
	}
	#changeTable ._table>button.empty{
		background: #ffbea5;
	}
	#changeTable ._table li{
		width: calc((100% - 5*(4px + 4px))/5);
	    height: calc((100% - 6*(4px + 4px))/6);
	    margin: 4px;
	    min-height: 1.3rem;
	    min-width: 1.5rem;
	    text-align: center;
	    border-radius: 5px;
	}
	#changeTable ._table .num{
		height:70% !important;
		width:80% !important;
		margin:0 auto;
	}
	#changeTable ._table .num .tableArea{
		font-size:0.16rem;
		color:white;
		padding-top:0.2rem;
	}
	#changeTable ._table .num .tableNum{
		font-size:0.22rem;
		color:white;
	}
	#changeTable ._table div{
	    width:2.3rem; 
		width:100%;
		height:100%;	    
	    text-align: center;	    
	    white-space: normal;
	    align-items: center;
	    justify-content: center;
	    border-radius: 4px!important;
	}
	#changeTable ._table .leisure{
		background-color: #33CC33;
		/*background: rgba(102, 204, 51, 1);*/
		/*-webkit-gradient(linear, left top, right bottom, color-stop(0%,#86f4a1), color-stop(100%,#56dcdd));*/
	}
	#changeTable ._table .tableActive{
		background: #FF5511;
	}
</style>
