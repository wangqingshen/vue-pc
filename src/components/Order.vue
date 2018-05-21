<template>
  <div id="order">
    <div class="tableHandle">
      <ul v-show="tableStatusHandles==0" class="noHandle">
        <li>点单</li>
        <li>结账</li>
        <li>换台</li>
        <li>清台</li>
        <li>编辑</li>
        <li>打印预结单</li>
        <li>取消账单</li>
      </ul>
      <ul v-show="tableStatusHandles==1 || tableStatusHandles==2" class="noPay">
        <li class="orderMill noPayHandle" @click="goOrderTable">点单</li>
        <li class="accounts noPayHandle" @click="goPay" v-show='canPay'>结账</li>
        <li class="accounts" v-show='!canPay'>结账</li>
        <li class="changeTable noPayHandle" @click="changeTable">换台</li>
        <li class="clearTable noPayHandle" @click="_clearTable" v-show='canClear'>清台</li>
        <li class="clearTable" v-show='!canClear'>清台</li>
        <li class="edit noPayHandle" @click="editTable">编辑</li>
        <li class="printPreMenu noPayHandle" @click='printBill' v-show='canPrint'>打印预结单</li>
        <li class="printPreMenu" v-show='!canPrint'>打印预结单</li>
        <li class="cancelMenu noPayHandle" @click="billCancel" v-show='canCancel'>取消账单</li>
        <li class="cancelMenu" v-show='!canCancel'>取消账单</li>
      </ul>
      <!-- <ul v-show="tableStatusHandles==2" class="hasPay">
				<li class="orderMill payHandle" @click="goOrderTable">点单</li>
				<li class="accounts payHandle" @click="goPay" v-show='canPay'>结账</li>
				<li class="accounts" v-show='!canPay'>结账</li>
				<li class="changeTable payHandle" @click="changeTable">换台</li>
				<li class="clearTable payHandle" @click="clearTable" v-show='canClear'>清台</li>
				<li class="clearTable" v-show='!canClear'>清台</li>
				<li class="edit payHandle" @click="editTable">编辑</li>
				<li class="printPreMenu">打印预结单</li>
				<li class="cancelMenu">取消账单</li>
			</ul> -->
    </div>
    <div id="table" class="table">
      <div class="tableType">
        <div class="typeList">
          <ul id="tableList">
            <li v-for="(tableType,index) in tableTypes" :class="{typeActive:typeIndex==index}" @click="tableTypeChoose(index,$event)" :data-id=tableType.areaid :key='index'>{{tableType.name}}</li>
          </ul>
        </div>
        <div class="search">
        	<div class="searchWrap">
        		<input type="text" v-model='tableNum' @input="searchTable" name="" placeholder="请输入桌台号"><span></span>
        	</div>
          </div>
      </div>
      <LoadInline v-show="showLoading"></LoadInline>
      <div class="_table" v-show="!showLoading">
        <ul>
          <li v-for="(table,index) in tables" :key='index'>
            <div class="leisure" v-if="table.status==0" :data-tableId=table.tableid :data-tableStatus=table.status @click.stop='tableClick(index,$event)' :class="{tableCho:tableChoIdx==index}">
              <div class="num">
                <p class="tableArea" ref=arear>{{table.areaname}}</p>
                <p class="tableNum" ref=num>{{table.tableNo}}</p>
              </div>
            </div>
            <div class="weijie" v-else-if="table.status==1" :data-tableId=table.tableid :data-tableStatus=table.status :data-orderid=table.orderid :data-num=table.custnum :data-userid=table.userid :class="{tableCho:tableChoIdx==index}" @click.stop='tableClick(index,$event)' @dblclick="dblOrder(index,$event)">
              <div class="num">
                <p class="tableArea" ref=arear>{{table.areaname}}</p>
                <p class="tableNum" ref=num>{{table.tableNo}}</p>
              </div>
              <div>
                <span>￥{{Number(table.amount).toFixed(2)}}</span>
                <span><img src="../../static/images/ic_timer.png" /></span>
              </div>
            </div>
            <div class="occupy" v-else :data-tableId=table.tableid :data-tableStatus=table.status :data-orderid=table.orderid :class="{tableCho:tableChoIdx==index}" :data-num=table.custnum :data-userid=table.userid @click.stop='tableClick(index,$event)' @dblclick="dblOrder(index,$event)">
              <div class="num">
                <p class="tableArea" ref=arear>{{table.areaname}}</p>
                <p class="tableNum" ref=num>{{table.tableNo}}</p>
              </div>
              <span>￥{{Number(table.amount).toFixed(2)}}</span>
            </div>
          </li>
        </ul>
      </div>
      	<div id="tableState">
	      <ul class="tableState">
	        <li class="all" v-for="(tableStatusType,index) in tableStatusTypes" :class='{tableStatusTypeAct:tableStatusCho==index}' @click="tableStatusCli(index,$event)" :data-id=tableStatusType.id><span class="circle"></span>{{tableStatusType.title}}<span>{{tableStatusType.num}}</span></li>
	        <!-- <li class="leisure"><span class="circle"></span>空闲<span>{{leisure}}</span></li>
					<li class="weijie"><span class="circle"></span>未结<span>{{weijie}}</span></li>
					<li class="occupy"><span class="circle"></span>占用<span>{{occupy}}</span></li> -->
	      </ul>
	      <!-- <ul class="page">
					<li>上一页</li>
					<li>下一页</li>
				</ul> -->
    	</div>
    </div>
    <!-- 开台弹窗 -->
    <div class="openTable" v-show="openTable">
      <div class="box">
        <div class="header">
          <h5 v-show='!edit'>桌位开台</h5>
          <h5 v-show='edit'>桌台编辑</h5>
          <span @click="closeWindow"></span></div>
        <section>
          <div class="left">
            <p class="tableNum"><span>{{openTableArear}}</span><span>{{openTableNum}}</span></p>
            <label>人数</label>
            <input type="number" name="" v-model="openTableNumber" ref='input1' @focus="input($event)" data-value='1' data-type=2 />
            <br/>
            <span class="erro">{{error}}</span>
            <label>服务员</label>
            <input type="text" name="" v-model="waiter" ref='input2' @focus="input($event)" data-value='2' data-type=0 />
            <br/>
            <span class="erro">{{error1}}</span>
            <label>备注</label>
            <textarea v-model="remark"></textarea>
            <br/>
          </div>
          <div class="right">
            <Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent" />
          </div>
        </section>
        <div class="btn">          
          <button class="confirm" @click="confirm($event)" v-show='!edit'>开台</button>
          <button class="confirm" @click="confirm($event)" v-show='edit'>保存</button>
          <button @click="closeWindow" class="cancel">取消</button>
        </div>
      </div>
    </div>
    <!-- 取消账单弹窗 -->
    <div class="cancelBill" v-show="cancelBill">
      <div class="box">
        <span></span>
        <p>确认取消账单后，已落单但未结账商品将全部退菜操作(若有)，并清空桌台，是否继续？</p>
        <div>
          <button @click="checkFlag(1)">确认</button>
          <button @click="closeCancelBill">放弃</button>
        </div>
      </div>
    </div>
    <!-- 清除桌台提示弹窗 -->
    <div class="cancelBill" v-show="clearTable">
      <div class="box">
        <span></span>
        <p>确认清空桌台？</p>
        <div>
          <button @click="checkFlag(2)">确认</button>
          <button @click="closeClearTable">放弃</button>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <!-- 权限弹窗 -->
    <!-- <Authority @aut='_aut' :url='url' v-show='getAut' /> -->
  </div>
</template>
<script>
import axios from 'axios'
import Bus from '../bus.js';
import Keyboard from '../components/public/Keyboard'
import Authority from '../components/public/Authority'
import LoadInline from '../components/public/LoadInline'
export default {
  name: 'Order',
  components: { Keyboard, Authority, LoadInline },
  data() {
    return {
      tableTypes: [{ 'name': "全部", "areaid": '-1' }], //桌台分类
      tables: [],
      tableStatusTypes: [{ title: "全部", num: '', id: '-1' }, { title: "空闲", num: '', id: "0" }, { title: "未结", num: '', id: "1" }, { title: "占用", num: '', id: "2" }],
      tablesStores: [], //将返回数据保存在tablesStores里，切换类型状态的时候不用向后台请求  		
      openTable: false,
      typeIndex: 0,
      openTableNumber: 1,
      waiter: '',
      remark: '',
      openTableArear: '',
      openTableNum: '',
      tableStatusHandles: '0',
      tableChoIdx: 'a',
      curTableId: '',
      cancelBill: false,
      clearTable: false,
      tableStatusCho: '0', //已选中桌台状态第几个
      tableTypeSel: '-1', //已选择桌台分类id
      tableStatusSel: '-1', //已选择桌台状态id
      value: '',
      inputType: '',
      backMoney: '',
      tableNum: '',
      error: '',
      error1: '',
      edit: false,
      canClear: false,
      canPay: false,
      canPrint: false,
      canCancel: false,
      getAut: false,
      url: '',
      haveAut: false,
      interval: '',
      canHandleOrder: 0,
      callPrintState: false,
      callOpenState: false,
      competedState: false,
      // _text: this.GLOBAL.text,
      waiterExist: true,
      text: '',
      flag: 0,
      authority: 'no',
      showLoading: true,
      f: {}
    }
  },
  methods: {
    searchTable() {
      this.tableChoIdx = 'a';
      this.curTableId = '';
      this.openTableNumber = 1;
      this.tableStatusHandles = 0;
      let num = this.tableNum.toLocaleUpperCase(),
        tables = this.tablesStores,
        array = [];
      for (var i = 0; i < tables.length; i++) {
        let str = tables[i].tableNo.toLocaleUpperCase(),
          idx = str.indexOf(num),
          bool1 = tables[i].areaid == this.tableTypeSel,
          bool2 = tables[i].status == this.tableStatusSel;
        if (!num) { //查询值空
          if (this.tableStatusSel == '-1' && this.tableTypeSel == '-1') {
            array = tables
          } else if (this.tableStatusSel == '-1') {
            if (bool1) {
              array.push(tables[i])
            }
          } else if (this.tableTypeSel == '-1') {
            if (bool2) {
              array.push(tables[i])
            }
          }
        } else if (this.tableStatusSel == '-1' && this.tableTypeSel == '-1') {
          if (idx != -1) {
            array.push(tables[i])
          }
        } else if (this.tableStatusSel == '-1') {
          if (bool1 && idx != -1) {
            array.push(tables[i])
          }
        } else if (this.tableTypeSel == '-1') {
          if (bool2 && idx != -1)
            array.push(tables[i])
        } else {
          if (bool2 && bool1 && idx != -1)
            array.push(tables[i])
        }
      }
      this.tables = array;
    },
    tableClick(index, e) {
      let tableID = e.currentTarget.dataset.tableid,
        tableStatus = e.currentTarget.dataset.tablestatus,
        arear = this.$refs.arear[index].innerText,
        num = this.$refs.num[index].innerText,
        orderid = e.currentTarget.dataset.orderid,
        that = this;
      localStorage.setItem('tableID', tableID)
      localStorage.setItem('tableArear', arear)
      localStorage.setItem('tableNum', num)
      localStorage.setItem('orderid', orderid)
      this.tableStatusHandles = 0
      if (tableStatus == 0) {
        localStorage.setItem("authorityAllOnce", "")
        this.openTable = true;
        this.edit = false;
        this.waiter = localStorage.getItem('username');
        this.openTableNumber = 1;
        this.remark = '';
        if (index != this.tableChoIdx) {
          this.tableChoIdx = index;
          this.curTableId = tableID;
        }
      } else {
        if (index != this.tableChoIdx) {
          this.tableChoIdx = index;
          this.curTableId = tableID;
          this.openTableNumber = Number(e.currentTarget.dataset.num);
          this.waiter = e.currentTarget.dataset.userid;
          this.f = {};
          order(tableStatus);
          if (tableStatus == 1) {
            this.noTableCho = 1;    
          }else if(tableStatus == 2) {
          	this.f = {
          		'tableId': tableID,
	            'tableNo': num,
	            'peopleNum': e.currentTarget.dataset.num,
	            'userId': e.currentTarget.dataset.userid,
	            "branchId": localStorage.getItem("branchId"),
	            'createOrSave': '0',
	            "remark": '',
	            'openPeople': localStorage.getItem('username'),
	            'type':1//0:新开台  1:其他
          	} 
          }
        } else {
          this.tableChoIdx = 'a';
          this.curTableId = '';
          this.openTableNumber = 1;
          // this.tableStatusHandles = 0;
        }
      }

      function order(tableStatus) {
        let id = orderid, //  'H20180113601742000001'		  		
            ld = [];          
        axios.get(localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + id + "&type=0&num=1" //订单id	 		
        ).then((res) => {
          if(res.data.code == 0) {
            that.waiter = res.data.data.order.userid;
            that.openTableNumber=res.data.data.order.custnum;
            ld = res.data.data.ld;
            let js = res.data.data.js;
            let wld = res.data.data.wld;
            if (!ld.length && js.length) {
              that.canClear = true;
              that.canCancel = false
            } else {
              that.canCancel = true;
              that.canClear = false;
            }
            if (!ld.length) {
              that.canPrint = false
              if (!wld.length)
                that.canPay = false;
              else
                that.canPay = true;
            } else {
              that.canPay = true;
              that.canPrint = true;
            }
            that.tableStatusHandles = tableStatus;
          }else if(res.data.code == -1){
            that.message('订单不存在！','error')
          }
        })
      }
    },
    dblOrder(index, e) {
      	let tableID = e.currentTarget.dataset.tableid,
        	arear = this.$refs.arear[index].innerText,
        	num = this.$refs.num[index].innerText,
        	orderid=e.currentTarget.dataset.orderid;
      	localStorage.setItem('tableID', tableID)
      	localStorage.setItem('tableArear', arear)
      	localStorage.setItem('tableNum', num)
      	localStorage.setItem('orderid', orderid)
      	localStorage.setItem('ordertype', 0)
      	localStorage.setItem('isChangeBill', 'no')
      	this.canHandleOrder = 0
      	this.f = {}
      	if(e.currentTarget.dataset.tablestatus == 2) {
      		this.f = {
        	  	'tableId': tableID,
	    	    'tableNo': num,
	    	    'peopleNum': e.currentTarget.dataset.num,
	    	    'userId': e.currentTarget.dataset.userid,
	    	    "branchId": localStorage.getItem("branchId"),
	    	    'createOrSave': '0',
	    	    "remark": '',
	    	    'openPeople': localStorage.getItem('username'),
	    	    'type':1//0:新开台  1:其他
        	} 
      	}
      	this.orderFlag(1)
    },

    closeWindow() {
      	this.openTable = false;
      	this.erro = '';
      	this.openTableNumber = 1
      	if (!this.edit) {
        	this.tableChoIdx = 'a';
        	this.curTableId = '';
      	}
    },

    changeTable() {
      	localStorage.setItem("authorityAllOnce", "")
      	this.$router.push({
        	path: '/dinner/changeTable'
      	})
    },

    tableTypeChoose(index, e) {
      	if(this.typeIndex != index) {
        	this.tableChoIdx = 'a';
        	this.curTableId = '';
        	this.openTableNumber = 1;
        	this.tableStatusHandles = 0;
        	this.typeIndex = index;
      	}
      	this.tableTypeSel = e.currentTarget.dataset.id;
      	var table = this.tablesStores;
      	this.tables = [];
      	for (var i = 0; i < table.length; i++) {
        	if (this.tableStatusSel == '-1' && this.tableTypeSel == '-1') {
          		this.tables = table;
        	} else if (this.tableStatusSel == '-1') {
          		if (table[i].areaid == this.tableTypeSel) {
            		this.tables.push(table[i])
          		}
        	} else if (this.tableTypeSel == '-1') {
          		if (table[i].status == this.tableStatusSel)
            		this.tables.push(table[i])
        	} else {
          		if (table[i].status == this.tableStatusSel && table[i].areaid == this.tableTypeSel)
            	this.tables.push(table[i])
        	}
      	}
    },

    goOrderTable() {
     	this.canHandleOrder = 0
      	this.orderFlag(1)
    },

    goPay() {
      	if (this.authority == 'no') {
        	this.message('无结账权限，不能结账！', 'warning');
        	return
      	} else {
        	this.canHandleOrder = 1
        	this.orderFlag(1)
      	}
    },

    confirm(e) {
      	if (!this.callOpenState) {
        	this.callOpenState = true;       
        	let waiter = '';
        	this.waiter == '' ? waiter = localStorage.getItem("branchId") + '000' : waiter = this.waiter;
        	if (this.openTableNumber == "") {
        	  	this.error = '请输入人数';
        	  	this.callOpenState = false;
        	  	return
        	}
        	let tableid = localStorage.getItem("tableID"),
        		form,
          		url;
        	if(e.target.innerText == '开台') {
          		url = '/api/employee/setorder';
          		form = {
            		'tableId': tableid,
            		'tableNo': localStorage.getItem("tableNum"),
            		'peopleNum': this.openTableNumber,
            		'userId': waiter,
            		"branchId": localStorage.getItem("branchId"),
            		'createOrSave': '0',
            		"remark": this.remark,
            		'openPeople': localStorage.getItem('username'),
            		'type':0//0:新开台  1:其他

          		}
        	} else if (e.target.innerText == '保存') {
          		url = '/app/updateTable';
          		form = {
            		'tableId': tableid,
            		'orderid': localStorage.getItem('orderid'),
            		'peopleNum': this.openTableNumber,
            		'userid': waiter,
            		'remark': this.remark
          		}
        	}
        	axios.post(localStorage.getItem('apiurl') + url, form).then((res) => {
          		let orderid = ''
          		this.callOpenState = false;
          		if (res.data.code == 0) { //返回新开桌台生成账单id并保存	
            		this.waiterExist = true
            		if (e.target.innerText == '开台') {
              			orderid = res.data.data.orderid
              			localStorage.setItem('orderid', orderid)
              			this.canHandleOrder = 0
              			this.orderFlag(2)
            		} else if (e.target.innerText == '保存') {
              			orderid = localStorage.getItem('orderid')
              			this.message('桌台编辑成功！','success');
              			this.openTable = false;
              			this.erro = '';
              			this.tableChoIdx = 'a';
              			this.curTableId = '';
              			this.update();
            		}
            		this.openTableNumber = 1
          		} else {
            		if (e.target.innerText == '开台') {
              			this.message(res.data.message,'error');
            		}else{
              			this.message(res.data.msg,'error');
            		}
          		}
        	}).catch((error)=> {
          		this.callOpenState = false;
        	})
      	}
    },

    printBill() {
      	this.printer()
    },

    billCancel() {
      	if (this.authority == 'no') {
        	this.message('无取消账单权限，不能取消账单！', 'warning');
        	return
      	} else {
        	localStorage.setItem("authorityAllOnce", "")
        	this.cancelBill = true;
     	}
    },

    closeCancelBill() {
      	this.cancelBill = false;
    },

    closeClearTable() {
      	this.clearTable = false;
    },

    editTable() {
      	localStorage.setItem("authorityAllOnce", "")
      	this.openTable = true;
      	this.edit = true;
    },

    tableStatusCli(index, e) {
      	if (this.tableStatusCho != index) {
       		this.tableStatusCho = index;
       		this.tableChoIdx = 'a';
       		this.curTableId = '';
       		this.openTableNumber = 1;
       		this.tableStatusHandles = 0;
      	}
      	this.tableStatusSel = e.currentTarget.dataset.id
      	if (this.tableStatusSel == undefined || this.tableTypeSel == undefined)
        	return
      	//遍历tablesStores里桌台状态和桌台分类相应的桌台
      	var table = this.tablesStores;
      	this.tables = [];
      	for (var i = 0; i < table.length; i++) {
        	if (this.tableStatusSel == '-1' && this.tableTypeSel == '-1') {
          		this.tables = table;
        	} else if (this.tableStatusSel == '-1') {
          		if (table[i].areaid == this.tableTypeSel) {
            		this.tables.push(table[i])
          		}
        	} else if (this.tableTypeSel == '-1') {
          		if (table[i].status == this.tableStatusSel)
            		this.tables.push(table[i])
        	} else {
          		if (table[i].status == this.tableStatusSel && table[i].areaid == this.tableTypeSel)
           	 	this.tables.push(table[i])
        	}
      	}
    },

    _clearTable() {
      	this.clearTable = true;
    },

    clearTableConfirm() { //清台操作，占用桌台才可以进行该操作,传桌台id
      	let that = this;
      	let tid = localStorage.getItem('tableNum'),
            orderid = localStorage.getItem('orderid');
      	axios.get(localStorage.getItem('apiurl') + '/padinterface/cleanTable?tid=' + tid + "&orderid=" + orderid//桌台id ,订单号                                          
      	).then((res) => {
	        if (res.data.code == 0) {
	        	this.message('清台成功', 'success');
          	this.clearTable = false;
          	this.update();
          	this.tableChoIdx = 'a';
          	this.curTableId = '';
	        }
      	})
    },

    clearOrderConfirm() { //确认取消账单，未结状态桌台才可以进行该操作，传账单id
      	let self = this;
      	axios.get(localStorage.getItem('apiurl') + '/padinterface/canOrder?id=' + localStorage.getItem('orderid') + '&openPeople=' + localStorage.getItem('username') + '&tableNo=' + localStorage.getItem('tableNum')+'&type=0').then(function(r) { //取消账单
	        if (!r.data.code) {
	        	self.message('账单取消成功', 'success');
	            self.cancelBill = false;
	            self.update();
	            self.tableChoIdx = 'a';
	            self.curTableId = '';
	        }
      	})
    },
    input(e) {
      	this.value = e.target.dataset.value;
      	this.inputType = e.target.dataset.type;
      	this.backMoney = e.target.value;
      	this.waiterExist = true
      	if (this.value == 1)
        this.error = ''
      	if (this.value == 2)
        this.error1 = ''
    },

    _confirmEvent(res) {
      	if (this.text && this.flag == 0) {
        	res = res.slice(-1)
        	this.backMoney = res
        	this.flag = 1
      	} else {
        	this.flag = 0
      	}
      	if (this.value == 1) {
        	this.openTableNumber = res
      	} else if (this.value == 2) {
        	this.waiter = res
      	}
      	this.text = ''
    },

    update() {
      	let branchId = localStorage.getItem("branchId"),
        	arr = [{ 'name': "全部", "areaid": '-1' }],
        	that = this;
      	axios.post(localStorage.getItem('apiurl') + '/api/employee/getTableAndType', {
        	'branchId': branchId,
        	'areaid': ''
      	}).then((res) => {
      		that.showLoading = false;
        	if (res.data.code == 0) {
          		that.competedState = true;
          		let tables = res.data.data, //存放桌台分类对象
            		x = 0,
            		y = 0,
            		z = 0; //统计不同状态的桌台数量，x表示空闲,y未结，z占用
          		that.tables = []
          		for (let i = 0; i < tables.length; i++) {
            		let obj = {}
            		obj.name = tables[i].areaname;
            		obj.areaid = tables[i].areaid;
            		arr.push(obj)
            		// this.tableTypes = this.tableTypes.concat(tables[i].areaname)
            		if (tables[i].tables == undefined) {
              			x += 0
              			y += 0
              			z += 0
            		} else {
              			for (let j = 0; j < tables[i].tables.length; j++) {
                			if (tables[i].tables[j].status == 0) { //判断不同桌台状态，统计数量
                  				x++
                			} else if (tables[i].tables[j].status == 1) {
                  				y++
                			} else if (tables[i].tables[j].status == 2) {
                  				z++
                			}
                			that.tables = that.tables.concat(tables[i].tables[j])
                			that.tablesStores = that.tables; //将返回数据保存在tablesStores里，切换类型状态的时候不用向后台请求
                			that.tableStatusTypes[0].num = that.tablesStores.length //统计不同桌台状态数量
              			}
            		}

          		}
          		that.tableTypes = arr
          		that.setWidth(that.tableTypes);
         	 	that.tableStatusTypes[1].num = x;
          		that.tableStatusTypes[2].num = y;
          		that.tableStatusTypes[3].num = z;
          		that.tableStatusHandles = 0;
        	}
      	}).catch(function(error){
      		that.showLoading = false;
      	})
    },

    // 实时获取桌台信息
    getSocket() {
      	let branchId = localStorage.getItem("branchId"),
        	d = { 'branchId': branchId, 'areaid': '' },
        	that = this,
        	arr = [];
      	axios.post(localStorage.getItem('apiurl') + '/api/employee/getTableAndType', d).then((res) => {
        	if (res.data.code == 0) {
          	// this.tables=[]
	          	let tables = res.data.data, //存放桌台分类对象
	            	x = 0,
	            	y = 0,
	            	z = 0; //统计不同状态的桌台数量，x表示空闲,y未结，z占用
	          	that.tables = [];
	          	for (let i = 0; i < tables.length; i++) {
	            	if (tables[i].tables == undefined) {
	              		x += 0
	              		y += 0
	              		z += 0
	            	} else {
	              		for (let j = 0; j < tables[i].tables.length; j++) {
	                		if (tables[i].tables[j].tableNo.indexOf(that.tableNum.toLocaleUpperCase()) != -1) {
	                  			if (that.tableStatusSel == '-1' && that.tableTypeSel == '-1') {
	                    			that.tables.push(tables[i].tables[j]);
	                  			} else if (that.tableStatusSel == '-1') {
	                    			if (tables[i].tables[j].areaid == that.tableTypeSel) {
	                      				that.tables.push(tables[i].tables[j]);
	                    			}
	                  			} else if (that.tableTypeSel == '-1') {
	                    			if (tables[i].tables[j].status == that.tableStatusSel)
	                      				that.tables.push(tables[i].tables[j]);
	                  			} else {
	                    			if (tables[i].tables[j].status == that.tableStatusSel && tables[i].tables[j].areaid == that.tableTypeSel) 
	                    				that.tables.push(tables[i].tables[j]);
	                  			}
	                  			if (tables[i].tables[j].status == 0) { //判断不同桌台状态，统计数量
	                    			x++
	                  			} else if (tables[i].tables[j].status == 1) {
	                    			y++
	                  			} else if (tables[i].tables[j].status == 2) {
	                    			z++
	                  			}
	                  			arr.push(tables[i].tables[j]); //将返回数据保存在tablesStores里，切换类型状态的时候不用向后台请求
	                  			that.tableStatusTypes[0].num = that.tablesStores.length //统计不同桌台状态数量
	                		}
	                		that.tablesStores = arr
	              		}
	            	}

	          	}
	          	let state = false;
	          	for (var p in that.tables) {
	            	if (that.tables[p].tableid == that.curTableId && that.tables[p].orderid) {
	              		that.orderSocket(that.tables[p].status, that.tables[p].orderid);
	              		that.tableChoIdx = p;
	              		state = true;
	            	}
	          	}
	          	if (!state) {
	            	that.tableStatusHandles = 0;
	          	}
	          	that.tableStatusTypes[1].num = x;
	          	that.tableStatusTypes[2].num = y;
	          	that.tableStatusTypes[3].num = z;
        	}
      	})
    },

    orderSocket (status, orderid) {
        let id = orderid,	  		
          	ld = [],
          	that = this;
        axios.get(localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + id + "&type=0&num=1" //订单id	 		
        ).then((res) => {
          	if (res.data.code == 0) {
	            // that.waiter = res.data.data.order.userid;
	            ld = res.data.data.ld;
	            let js = res.data.data.js;
	            let wld = res.data.data.wld;
	            if (!ld.length && js.length) {
	              	that.canClear = true;
	              	that.canCancel = false
	            } else {
	              	that.canCancel = true;
	              	that.canClear = false;
	            }
	            if (!ld.length) {
	              	that.canPrint = false
	              	if (!wld.length)
	                	that.canPay = false;
	              	else
	                	that.canPay = true;
	            } else {
	              	that.canPay = true;
	              	that.canPrint = true;
	            }
	            that.tableStatusHandles = status;
          	}
        })
    },

    printer() {
      	if (!this.callPrintState) {
	        this.callPrintState = true;
	        let that = this;
	        let data = {
	          	orderid: localStorage.getItem('orderid'),
	          	type: 'n',
	          	isBefore: 1,
	        }
        	axios.post(localStorage.getItem('apiurl') + '/api/employee/doPrinter', data).then(function(res) {
          		that.callPrintState = false;
          		if (res.data.code == 4) {
            		that.message('打印预结单成功！','success');
          		} else {
            		that.message(res.data.msg,'error');
          		}
        	})
      	}
    },

    setWidth(l) {
      	let that = this;
      	let timer = setInterval(function() {
        	if (that.competedState) {
          		clearInterval(timer);
          		var list = document.getElementById('tableList').children;
          		var len = l.length;
          		var width = 21 + 12 * (len-1);
          		for (var i = 0; i < len; i++) {
            		width += list[i].offsetWidth;
          		}
          		document.getElementById('tableList').style.width = width + 'px';
        	}
      	}, 200)
    },

    orderFlag(t) { //进入orderTable页面标记函数
      let that = this;
      axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=1&ucode=' + localStorage.getItem('username') + '&uname=' + localStorage.getItem('name') + '&tableid=' + localStorage.getItem('tableID')).then(res => {
        if (res.data.code == 0) {
          	localStorage.setItem('ordertype', 0)
          	localStorage.setItem('isChangeBill', 'no')
          	if(t == 2) {
          		that.$router.push({
	            	path: '/orderTable'
	          	})
          	}else if(t == 1) {
	          	if(that.f.userId != undefined) {
	          		axios.post(localStorage.getItem('apiurl') + '/api/employee/setorder', that.f).then((res) => {
	          			if(res.data.code == 0) {
	                  		if(res.data.data){
	                    		localStorage.setItem('orderid',res.data.data.orderid)
	                  		}
	          				that.$router.push({
					            path: '/orderTable'
					        })
	          			}
	          		})
          		}else{
          			that.$router.push({
		           	 	path: '/orderTable'
		        	})
          		}
          		if (that.canHandleOrder == 1) {
		            setTimeout(() => {
		              	Bus.$emit('pay', 1)
		            }, 200)
		        }
          	}
        }else{
          	let user = localStorage.getItem('username')
          	if(res.data.data.indexOf(user)!=-1){
          		localStorage.setItem('ordertype', 0)
          		localStorage.setItem('isChangeBill', 'no')
            	if(t == 2) {
	          		that.$router.push({
		            	path: '/orderTable'
		          	})
	          	}else if(t == 1) {
	          		if(that.f.userId != undefined) {
		          		axios.post(localStorage.getItem('apiurl') + '/api/employee/setorder', that.f).then((res) => {
		          			if(res.data.code == 0) {
		          				if(res.data.data){
	                    			localStorage.setItem('orderid',res.data.data.orderid)
	                  			}
		          				that.$router.push({
						            path: '/orderTable'
						          })
		          			}
		          		})
		          	}else{
		          		that.$router.push({
				            path: '/orderTable'
				        })
		          	}
		          	if (that.canHandleOrder == 1) {
				        setTimeout(() => {
				          	Bus.$emit('pay', 1)
				        }, 200)
				   	}
	          	}
          }else{
            that.message('对不起，当前' + res.data.data.replace('_', '|') + '正在操作该桌台','error');
          }         
        }
      })
    },
    // 验证是否桌台是否被占用
    checkFlag(s) {
      let that = this;
      axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=2').then(function(res) {
        if (res.data.code == 0) {
          var d = res.data.data;
          var num = 0;
          var name = '';
          var state = false;
          for (var i in d) {
            if (i == localStorage.getItem('tableID')){
              name = d[i];
              state = true;
            }
            num++;
          }
          if(!num || !state) {
            if(s == 1) { //取消账单
              that.clearOrderConfirm();
            }else if(s == 2) { //清台
              that.clearTableConfirm();
            }
          }else{
            that.message('对不起，当前' + name + '正在操作该桌台','error');
          }
        }
      });
    },
  },
  created() {
    this.value = '4';
    this.waiter = localStorage.getItem('username');
    this.authority = localStorage.getItem('authority');
    let branchId = localStorage.getItem("branchId"),
      that = this;
    this.update()
    Bus.$on('ChangeTable', res => {
      that.tableChoIdx = 'a'
      that.curTableId = '';
      this.update();
    })
    this.interval = setInterval(() => {
      that.getSocket();
    }, 2000)

    document.onselect = () => { //input文字选中
      if (window.getSelection) {
        console.log(window.getSelection().toString())
        this.text = window.getSelection().toString()
      } else if (document.selection && document.selection.createRange) {
        this.text = document.selection.createRange().text;
      }
    }
  },
  beforeUpdate() {
    this.openTableArear = localStorage.getItem("tableArear")
    this.openTableNum = localStorage.getItem("tableNum")
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.interval);
    this.interval=''
    next(true);
  },
  watch: {
    openTableNumber() {
      // this.$refs['input1'].focus()
      if(this.openTableNumber){
        this.openTableNumber=Number(this.openTableNumber)
      }      
      if (this.openTableNumber.toString().length > 3) this.openTableNumber = Math.floor(this.openTableNumber / 10)
      if (Number(this.openTableNumber) < 0) this.openTableNumber = ''
      if (this.openTableNumber) this.backMoney = this.openTableNumber.toString()
      else this.backMoney = this.openTableNumber
    },
    waiter() {
      // this.$refs['input2'].focus()
      this.backMoney = this.waiter
    }
  }
}

</script>
<style>
#order {
  height: 100%;
  width: 100%;
  background: #f4f4f4;
  display: flex;
}

#order .tableHandle {
  height: 100%;
  width: 1.8rem;
  box-sizing: border-box;
  padding: 0.2rem;
  /*border-radius: 7px;*/
}

#order .tableHandle ul {
  height: 100%;
  width: 100%;
  background: white;
  margin: 0 auto;
  padding: 0 0.12rem;
  box-sizing: border-box;
  border-radius: 5px;
  -moz-box-shadow: 0px 2px 20px #eee;
  box-shadow: 0px 2px 20px #eee;
}

#order .tableHandle ul li {
  height: 13.3%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
  font-size: 0.14rem;
  color: #999999;
}

#order .tableHandle ul li:last-child {
	border-bottom: 0;
}

#order .tableHandle ul .cancelMenu {
  border-bottom: none;
}

#order .tableHandle .noPay .noPayHandle {
  cursor: pointer;
  color: #2f2f2f;
  font-weight: 600;
}

#order .tableHandle .hasPay .payHandle {
  cursor: pointer;
  color: #2f2f2f;
  font-weight: 600;
}

#order .table {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 0.2rem;
}

#order .table .tableType {
  width: 98%;
  height: 0.62rem;
  background: white;
  display: flex;
  position: relative;
  -moz-box-shadow: 0px 2px 20px #eee;
  box-shadow: 0px 2px 20px #eee;
}

#order .table .tableType .typeList {
  width: calc(100% - 2.2rem);
  overflow-x: auto;
  overflow-y: hidden;
}

#order .table .tableType .typeList>ul {
  /*display:flex;*/
  display: block;
  /*width: calc(100% - 2.5rem);*/
  height: 0.62rem;
  background: white;
  /*padding-right: 0.15rem;*/
}

#order .table .tableType li {
  display: inline-block;
  min-width: 0.42rem;
  width: auto;
  height: 0.42rem;
  text-align: center;
  line-height: 0.42rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-left: 0.12rem;
  margin-top: 0.1rem;
  padding: 0 0.2rem;
  font-size: 0.14rem;
}

#order .table .tableType li:first-child {
	margin-left: 0.2rem;
}

#order .table .tableType li:not(.typeActive):hover {
  cursor: pointer;
  color: #ff7e4b;
  border-color: #ff7e4b;
}

#order .table .search {
  position: absolute;
  right: 0;
  width: 2rem;
  height: 0.62rem;
  display: flex;
}

#order .table .search .searchWrap {
  /*border: 1px solid rgba(121, 121, 121, 0.5);*/
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  height: 0.4rem;
  margin-right: .2rem;
  margin-top: 0.11rem;
}

#order .table .search input {
  width: calc(100% - .4rem);
  height: 100%;
  padding-left: 0.1rem;
  box-sizing: border-box;
  float: left;
  border-radius: 5px;
}

#order .table .search span {
  display: inline-block;
  width: 0.4rem;
  height: 100%;
  background: url('../../static/images/ic_search.png') no-repeat center center;
  background-size: .2rem;
}

#order .table ._table {
  height: calc(100% - 1.24rem);
  width: 98%;
  box-sizing: border-box;
  padding: 0.15rem 0;
  overflow: hidden;
}

#order .table ._table ul {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  align-content: flex-start;
  overflow: auto;
}

#order .table ._table li {
  width: calc((100% - 6*(4px + 12px))/6);
  height: calc((100% - 6*(4px + 12px))/6);
  min-height: 1.3rem;
  min-width: 1.6rem;
  margin: 4px;
}

#order .table ._table li:hover {}

#table ._table .num {
  height: 70% !important;
  width: 80% !important;
  margin: 0 auto;
}

#table ._table .num .tableArea {
  font-size: 0.16rem;
  color: white;
  padding-top: 0.2rem;
}

#table ._table .num .tableNum {
  font-size: 0.22rem;
  color: white;
}

#order .table ._table div:nth-child(1) {
  width: 2.3rem;
  width: 100%;
  height: 100%;
  text-align: center;
  white-space: normal;
  align-items: center;
  justify-content: center;
  /* border-radius: 4px!important;*/
  margin-bottom: .1rem;
  /*border-bottom: 1px solid rgba(111, 111, 111, 0.1);*/
}

#order .table ._table div:nth-child(2) {
  width: 70%;
  height: 0.2rem;
  line-height: 0.2rem;
  font-size: 0.14rem;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}

#order .table ._table div span {
  font-size: 0.14rem;
  color: #fff;
}

#order .table ._table div span img {
  display: inline-block;
  width: 0.18rem;
}

#table .tableType .typeActive {
  background: #ff7e4b;
  color: white;
}

#order .table ._table .leisure {
  /*background: rgba(102, 204, 51, 1);*/
  background-color: #33CC33;
  /*-webkit-gradient(linear, left top, right bottom, color-stop(0%,#86f4a1), color-stop(100%,#56dcdd));*/
}

#order .table ._table .weijie {
  /*background: rgba(255, 0, 0, 1);*/
  background-color: #FF6666;
  /*-webkit-gradient(linear, left top, right bottom, color-stop(0%,#ffb14b), color-stop(100%,#ff864b));*/
}

#order .table ._table .occupy {
  /*background: rgba(240, 165, 43, 1);*/
  background-color: #FFCC66;
  /*-webkit-gradient(linear, left top, right bottom, color-stop(0%,#7adaff), color-stop(100%,#7ab3ff));*/
}

#table ._table .tableCho {
  border: 3px solid #6600CC !important;
}

#tableState {
  position: absolute;
  bottom: 0.2rem;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 98%;
  height: 0.42rem;

}

#tableState ul {
  display: flex;
  background: white;
  height: 0.42rem;
  border-radius: 5px;
  -moz-box-shadow: 0px 2px 20px #eee;
  box-shadow: 0px 2px 20px #eee;
}

#tableState ul li {
  width: 1rem;
  line-height: 0.42rem;
  text-align: center;
  font-size: 0.14rem;
}

#tableState ul li:first-child {
	border-bottom-left-radius: 5px;
	border-top-left-radius: 5px;
}

#tableState ul li:last-child {
	border-bottom-right-radius: 5px;
	border-top-right-radius: 5px;
}

#tableState .tableState li.tableStatusTypeAct {
  background: #ccc9c9;
  font-weight: 600;
}

#tableState ul li:not(.tableStatusTypeAct):hover {
  cursor: pointer;
}

#tableState ul span {
  margin: 0 5px 0 5px;
}

#tableState ul span.circle {
  display: inline-block;
  height: 0.1rem;
  width: 0.1rem;
  border-radius: 0.05rem;
}

#tableState .tableState li:nth-child(2) span.circle {
  /*background: rgba(102, 204, 51, 1);*/
  background-color: #33CC33;
}

#tableState .tableState li:nth-child(3) span.circle {
  /*background: rgba(255, 0, 0, 1);*/
  background-color: #FF6666;
}

#tableState .tableState li:nth-child(4) span.circle {
  /*background: rgba(240, 165, 43, 1);*/
  background-color: #FFCC66;
}

#order>.openTable {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.5);
}

#order .openTable .box {
  width: 5.1rem;
  height: 4rem;
  background: white;
  margin: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 10px;
}

#order .openTable .box .header {
  width: 90%;
  height: 0.7rem;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}

#order .openTable .box .header h5 {
  line-height: 0.7rem;
  font-size: 0.16rem;
}

#order .openTable .box .header span {
  display: block;
  width: 0.2rem;
  height: 0.7rem;
  background: url('../../static/images/ic_close.png') no-repeat center center;
}

#order .openTable .box section {
  display: flex;
}

#order .openTable .box .left {
  margin-left: 0.3rem;
  width: 2.14rem;
  height: 2.6rem;
}

#order .openTable .box .left .erro {
  color: red;
}

#order .openTable .box .left p span {
  color: #ff7e4b;
  font-size: 0.18rem;
  font-weight: 600;
}

#order .openTable .box .left label {
  display: block;
  color: #999999;
  font-size: 0.14rem;
  margin-top: 0.2rem;
  line-height: 0.18rem;
}

#order .openTable .box .left input {
  box-sizing: border-box;
  width: 2.15rem;
  height: 0.3rem;
  padding: 0 .1rem;
  border: 1px solid #ededed;
}

#order .openTable .box .left textarea {
  resize: none;
  box-sizing: border-box;
  width: 2.15rem;
  height: 0.6rem;
  border: 1px solid #ededed;
  padding: .1rem;
}

#order .openTable .box .right {
  width: 2.14rem;
  height: 2.6rem;
  margin-left: 0.2rem;
}

#order .openTable .box .btn {
  width: 90%;
  /*height:0.3rem;*/
  margin: 0 auto;
  margin-top: 0.15rem;
  display: flex;
  justify-content: space-around;
}

#order .openTable .box .btn button {
  width: 2.15rem;
  height: 0.4rem;
  border: 1px solid #ff7e4b;
  border-radius: 5px;
  font-size: 0.14rem;
}

#order .openTable .box .btn .cancel {
  background: white;
  margin-left: 0.1rem;
  color: #ff7e4b;
}

#order .openTable .box .btn .confirm {
  background: #ff7e4b;
  color: white;
  /*margin-left: 0.1rem;*/
}

#order .cancelBill {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.5);
}

#order .cancelBill .box {
  width: 4.1rem;
  height: 3rem;
  background: white;
  margin: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 10px;
  text-align: center;
}

#order .cancelBill .box span {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  margin: 0.2rem 0;
  background: url('../../static/images/notice_2.png') no-repeat center center;
}

#order .cancelBill .box p {
 	font-size: 0.16rem;
    margin-bottom: 0.2rem;
    padding: 0 0.3rem;
}

#order .cancelBill .box button {
  width: 1.5rem;
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  font-size: 0.14rem;
  color: white;
  background: #ff7e4b;
  border-radius: 5px;
  margin: 0.3rem 0.1rem;
}

.confirmInput {
  background: #ff7e4b !important;
  border: none;
}

.el-message-box {
  padding: 0.1rem 0 0.2rem;
}

.el-message-box__headerbtn {
  top: 0px;
  right: -189px;
}

.el-message-box__content,
.el-message-box__btns {
  text-align: center;
}

.el-message-box__message p {
  color: #666;
}

.confirmInput span {
  color: white;
  padding: 0.1rem 0.2rem;
  cursor: pointer;
}

</style>
