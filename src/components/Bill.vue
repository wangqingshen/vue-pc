<template>
  <div id="bill">
    <div class="box">
      <div id="billType">
        <ul class="billType">
          <li v-for="(item, index) of billType" :class="{active:selected==index}" @click="changeTab(index)" :key='index'>{{item.title}}</li>
        </ul>
        <div id="billSearch">
          <input type="text" placeholder="订单号/桌台号/会员" v-model="searchText">
          <button @click="filterList">查询</button>
        </div>
      </div>
      <div id="billIfo">
        <ul class="billIfo">
          <li>订单号</li>
          <li>桌台类型</li>
          <li>桌台号</li>
          <li>人数</li>
          <li>消费金额</li>
          <li>优惠</li>
          <!-- <li>应收金额</li> -->
          <li>实收金额</li>
          <li>状态</li>
          <li>收银员</li>
          <li class="time">开始时间</li>
          <li class="time">结账时间</li>
          <li class="time">会员</li>
        </ul>
        <ul class="billAll" v-show="!showLoading">
          <li v-if="billHasData && billAll.orderid != null" v-for="(billAll,index) in billAlls" :class="{double:index % 2 == 1}" @click="billClick(billAll.areaname,billAll.currenttableid,billAll.orderid)">
            <ul class="bill">
              <li>{{billAll.orderid}}</li>
              <li>{{billAll.areaname}}</li>
              <li>{{billAll.currenttableid}}</li>
              <li>{{billAll.custnum}}</li>
              <li>{{billAll.dueamount == null ? '0.00' : Number(billAll.dueamount).toFixed(2)}}元</li>
              <li>{{billAll.freeamount == null ? '0.00' : Number(billAll.freeamount).toFixed(2)}}元</li>
              <!-- <li>{{(billAll.dueamount-billAll.freeamount) | keepTwoNum}}元</li> -->
              <li>{{billAll.ssamount == null ? '0.00' : Number(billAll.ssamount).toFixed(2)}}元</li>
              <li>{{billAll.orderstatus=='1'|| billAll.orderstatus=='0'?'未结账':billAll.orderstatus=='3'?'已结账':'已作废'}}</li>
              <li>{{billAll.settleJobNumber?billAll.settleJobNumber:'--'}}</li>
              <li class="time">{{billAll.begintime}}</li>
              <li class="time">{{billAll.endtime?billAll.endtime:'--'}}</li>
              <li class="time">{{billAll.isMember == '否' || !billAll.isMember?'否':billAll.isMember}}</li>
            </ul>
          </li>
          <li v-if="!billHasData" class="noData">
            暂无账单信息
          </li>
        </ul>
        <LoadInline v-show="showLoading"></LoadInline>
      </div>
    </div>
    <!-- 单账单弹窗 -->
    <div class="container" v-show="billDetail">
      <div class="billDetail">
        <div class="header">
          <h5>账单详情</h5><span @click="closeBillDetail"></span></div>
        <div class="main">
          <div class="left">
            <p class="num" style=".22rem"><span>{{tableArea}}</span><span>{{tableNo}}</span></p>
            <ul>
              <li v-for="(menu, index) in leftMenu" :class="{active:menuSelected==index}" @click="changeMenuTab(index,menu.orderId,menu.orderStatus)">
                <span>{{menu.name}}</span>
                <br/>
                <span>{{menu.typename}}</span>
              </li>
            </ul>
          </div>
          <div class="right">
            <div class="top">
              <div class="cuisine">
                <ul>
                  <li>品名</li>
                  <li>数量</li>
                  <li>单位</li>
                  <li>单价</li>
                  <li>原价</li>
                </ul>
                <ul v-if="cuisines.length">
                  <li v-for="(cuisine,index) in cuisines" :class="{odd:index%2==1}">
                    <ul class="detail">
                      <li>{{cuisine.title}}</li>
                      <li>{{cuisine.dishnum}}</li>
                      <li>{{cuisine.unit}}</li>
                      <li>{{Number(cuisine.nowPrice).toFixed(2)}}</li>
                      <li>{{Number(cuisine.orignalprice).toFixed(2)}}</li>
                    </ul>
                  </li>
                </ul>
                <ul v-if="!cuisines.length">
                  <li style="text-align:center;padding:.2rem;font-size:.13rem;">暂无商品展示</li>
                </ul>
                <p>账单合计：￥<span>{{Number(totalAmount).toFixed(2)}}</span></p>
              </div>
              <div class="billIfo">
                <ul>
                  <li v-if="billIfoSingle.orderid !== undefined">
                    <label>账单号</label><span>{{billIfoSingle.orderid.substr(0,13)}}</span></li>
                  <li v-if="billIfoSingle.openPeople !== undefined">
                    <label>开台人</label><span>{{billIfoSingle.openPeople?billIfoSingle.openPeople:'--'}}</span></li>
                  <li v-if="billIfoSingle.fuwuyuan !== undefined">
                    <label>服务员</label><span>{{billIfoSingle.fuwuyuan?billIfoSingle.fuwuyuan:'--'}}</span></li>
                  <li v-if="billIfoSingle.shouyinyuan !== undefined && billInfoData.orderstatus != ''">
                    <label>收银员</label><span>{{billIfoSingle.shouyinyuan?billIfoSingle.shouyinyuan:'--'}}</span></li>
                  <li v-if="billIfoSingle.begintime !== undefined">
                    <label>开台时间</label><span>{{billIfoSingle.begintime}}</span></li>
                   <li v-if="billIfoSingle.endtime !== undefined && billInfoData.orderstatus != ''">
                    <label>结账时间</label><span>{{(billIfoSingle.endtime &&billIfoSingle.endtime != '--')?billIfoSingle.endtime:'--' }}</span></li>
                   <li v-if="billIfoSingle.cleantime !== undefined && billInfoData.orderstatus  == ''">
                    <label>清台时间</label><span>{{billIfoSingle.cleantime}}</span></li>
                  <li v-if="billIfoSingle.afteramount !== undefined">
                    <label>账单总额</label><span>￥{{billIfoSingle.afteramount?Number(billIfoSingle.afteramount).toFixed(2):'0.00'}}</span></li>
                  <li v-if="billIfoSingle.yhamount !== undefined">
                    <label>优惠金额</label><span>￥{{billIfoSingle.yhamount?Number(billIfoSingle.yhamount).toFixed(2):'0.00'}}</span></li>
                  <li v-if="billIfoSingle.settleamount !== undefined">
                    <label>实收金额</label><span>￥{{(billIfoSingle.settleamount != '--' && billIfoSingle.settleamount)?Number(billIfoSingle.settleamount).toFixed(2):'0.00'}}</span></li>
                   <li v-if="billIfoSingle.payway !== undefined && billInfoData.orderstatus != ''">
                    <label>收银方式</label><span>{{(billIfoSingle.payway && billIfoSingle.payway != '--')?billIfoSingle.payway:'--'}}</span></li>
                  <li v-if="billIfoSingle.notpaymoney !== undefined && billInfoData.orderstatus == ''">
                    <label>未收金额</label><span>￥{{billIfoSingle.notpaymoney?Number(billIfoSingle.notpaymoney).toFixed(2):'--'}}</span></li>
                </ul>
                <div class="updateRecord" v-if="updateRecord.length">
                  <h1>修改记录</h1>
                  <ul v-for="(item, index) in updateRecord" :key='index'>
                    <li>
                      <label>修改时间</label><span>{{item.changetime}}</span></li>
                    <li>
                      <label>退款或收款</label><span>{{item.isretrunpay == -1?'退款':'收款'}}</span></li>
                    <li>
                      <label>修改前金额</label><span>￥{{Number(item.beforeamount).toFixed(2)}}</span></li>
                    <li>
                      <label>支付方式</label><span>{{paystyle[Number(item.payway)-1]}}</span></li>
                    <li>
                      <label>修改后金额</label><span>￥{{Number(item.afteramount).toFixed(2)}}</span></li>
                    <li>
                      <label>退款或收款金额</label><span>￥{{Number(item.settleamount).toFixed(2)}}</span></li>
                  </ul>
                </div>
                <div class="cancelDish" v-if="billInfoData.orderstatus == 4">
                  <ul>
                    <li>
                      <label>作废操作</label><span>{{billIfoSingle.cancelpeople?billIfoSingle.cancelpeople: '--'}}</span></li>
                    <li>
                      <label>作废时间</label><span>{{billIfoSingle.canceltime?billIfoSingle.canceltime: '--'}}</span></li>
                   <!--  <li>
                      <label>是否退菜</label><span>{{billIfoSingle.isreturndish == 1? '是':'否'}}</span></li> -->
                    <li>
                      <label>是否退款</label><span>{{billIfoSingle.isreturnpay == 1? '是':'否'}}</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="btn">
              <button v-if="btnState == -1" @click="payBillEvt">去点单</button>
              <button v-if="btnState == 0 || btnState == 1" @click="printEvt(2)">重打小票</button>
              <button v-if="btnState == 1 && !disabledState" @click='changeBillClick'>修改账单(反结账)</button>
              <button v-if="btnState == 1 && disabledState" class="disabledState">修改账单(反结账)</button>
              <button v-if="btnState == 1" @click="voidBillClick">作废账单</button>
              <button v-if="btnState == 2" @click="closeBillDetail">关闭</button>
              <button v-if="btnState == 3" @click="payBillEvt">结账</button>
              <button v-if="btnState == 3" @click="printEvt(1)">打印预结单</button>
              <button v-if="btnState == 3 || btnState == -1" @click="cancelBillClick">取消账单</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="changeBill" v-show="changebill">
      <div class="box">
        <span class="tip-img">图片</span>
        <p>修改账单后将影响已产生的交易数据，是否继续？</p>
        <div>
          <button @click="changeBillConfirm">确认</button>
          <button @click="closeChangeBill">放弃</button>
        </div>
      </div>
    </div>
    <div class="changeBill" v-show="voidbill">
      <div class="box">
        <span class="tip-img">图片</span>
        <p>账单作废后不可恢复，已收金额将从统计中减去，是否继续？</p>
        <div>
          <button @click="checkFlag(1)">确认</button>
          <button @click="closeVoidBill">放弃</button>
        </div>
      </div>
    </div>
    <div class="changeBill" v-show="cancelbill">
      <div class="box">
        <span class="tip-img">图片</span>
        <p>账单取消后不可恢复，已落单商品将做退菜处理，是否继续？</p>
        <div>
          <button @click="checkFlag(0)">确认</button>
          <button @click="closeCancelBill">放弃</button>
        </div>
      </div>
    </div>
    <!-- 获取临时权限弹窗 -->
   <!--  <Authority @aut='_aut' :url='url' v-show='getAut' /> -->
  </div>
</template>
<script>
import axios from 'axios'
import Global from '../components/public/Global'
import Authority from '../components/public/Authority'
import LoadInline from '../components/public/LoadInline'
export default {
  name: 'Bill',
  components: { Authority, LoadInline},
  data() {
    return {
      selected: 0,
      menuSelected: 0,
      billHasData: false, //有无账单数据
      billDetail: false,
      btnState: 1, //-1去点单，0重打小票，1重打小票、修改账单、作废账单，2关闭， 3结账、打印预结单、取消账单
      tableArea: '',
      tableNo: '',
      endDate: '',
      totalAmount: '',
      searchText: '',
      changebill: false,
      voidbill: false,
      cancelbill: false,
      billAlls: [],
      noCheckData: [], //未结账数据
      hasCheckData: [], //已结账数据
      abandonedData: [], //已作废数据
      billData: {
        orderstatus: '', //1未结账，3已结账，4已作废
        condition: '' //搜索条件
      },
      billType: [{ title: '未结账' }, { title: '已结账' }, { title: '已作废' }],
      billInfoData: { //账单详情参数
        orderid: '',
        orderstatus: ''
      },
      leftMenu: [],
      cuisines: [],
      searchList: [],
      billIfoSingle: [],
      updateRecord: [],
      cancelDish: [],
      disabledState: false,
      clickIndex: 0,
      paystyle: [
        '莱米支付', '会员储值', 'POS刷卡', '现金', '挂账'
      ],
      currenttableid: '', //当前tableid
      orderstatus: '',
      getAut: false,
      url: '',
      haveAut: false,
      callPrintState: false,
      emptyState: false,
      showLoading: true,
      callPayState: false,
      callCancelState: false,
    }
  },
  mounted() {
    	this.billData.orderstatus = 1;
    	this.getBillData()
  },

  methods: {
    billClick: function(area, tno, orderid) {
      	this.billInfoData.orderid = orderid;
      	this.billInfoData.orderstatus = this.billData.orderstatus;
      	this.clickIndex = 0;
      	this.menuSelected = 0;
      	this.cuisines = [];
      	this.tableArea = area;
      	this.tableNo = tno;
      	this.leftMenu = [];
      	this.billIfoSingle = [];
      	this.getBillInfo();
    },
    filterList() {
      	let val = this.searchText.toUpperCase();
     	let len = this.searchList.length;
      	var arr = [];
      	var reg = new RegExp(val);
      	for (var i = 0; i < len; i++) {
        	//如果字符串中不包含目标字符会返回-1
        	if (this.searchList[i]['orderid'].match(reg) || this.searchList[i]['currenttableid'].match(reg) || this.searchList[i]['isMember'].match(reg)) {
          		arr.push(this.searchList[i]);
        	}
      	}
      	this.billAlls = arr;
      	if (!arr.length) {
        	this.billHasData = false;
      	} else {
        	this.billHasData = true;
      	}
    },

    closeBillDetail: function() {
      	this.billDetail = false;
    },

    getBillData() {
    	this.showLoading = true;
    	let that = this;
      	axios({
        	method: "POST",
        	data: this.billData,
        	url: localStorage.getItem('apiurl') + '/api/employee/queryBillList',
        	xhrFields: {
          		withCredentials: true
        	}
      	}).then((res) => {
      		this.showLoading = false;
        	if (res.data.code == 0) {
          		let d = res.data.data;
          		if (d.length) {
            		this.billHasData = true;
            		let dd = [];
            		if (this.billData.orderstatus == 1 && this.selected == 0) {
              			this.noCheckData = d;
              			dd = d;
            		} else if (this.billData.orderstatus == 3 && this.selected == 1) {
              			this.hasCheckData = d;
              			dd = d;
            		} else if (this.billData.orderstatus == 4 && this.selected == 2) {
              			this.abandonedData = d;
              			dd = d;
            		}
            		this.billAlls = dd;
          			this.searchList = dd;
          		} else {
            		this.billHasData = false;
            		this.billAlls = d;
          			this.searchList = d;
          		}
        	}
      	}).catch(function(error){
      		that.showLoading = false;
      	})
    },
    changeTab(index) {
      this.selected = index;
      this.billAlls = [];
      let status = 0;
      switch (index) {
        case 0:
          status = 1
          break;
        case 1:
          status = 3
          break;
        default:
          status = 4
      }
      this.billData.orderstatus = status;
      this.getBillData();
    },
    checkDate() {
      	var nowTime = new Date().getTime();
      	var endTime = new Date(this.endDate).getTime();
      	this.disabledState = false;
      	if ((nowTime - endTime) / 1000 / 3600 > 24 && this.btnState == 1) {
        	// 清台时间超过24小时，不能进行反结账操作
        	this.disabledState = true;
      	}
    },
    getBillInfo() {
      axios({
        method: "POST",
        data: this.billInfoData,
        url: localStorage.getItem('apiurl') + '/api/employee/queryBillDetail',
        xhrFields: {
          	withCredentials: true
        }
      	}).then((res) => {
	        let d = res.data;
	        if(d.code == 1) {
	        	if(!this.leftMenu.length) {
	        		if (d.leftList.length == 1) {
	        			d.leftList[0].name = '账单1';
	              		let n = '';
	              		if (d.leftList[0].orderStatus == 1 || d.leftList[0].orderStatus == 0) {
	              			d.leftList[0].orderStatus = 1;
	              			n = '未结';
	               	 		this.btnState = 3;
	              		} else if (d.leftList[0].orderStatus == 3) {
	                		this.btnState = 1;
	                		n = '已结';
	              		} else if (d.leftList[0].orderStatus == 4) {
	                		this.btnState = 2;
	                		n = '作废';
	              		}
	              		d.leftList[0].typename = n;
	              		this.leftMenu = d.leftList;
	              		this.clickIndex = 0;
	      				this.menuSelected = 0;
	        		}else if(d.leftList.length > 1) {
	        			var obj = {
	                		'name': '合计账单',
	                		'orderId': d.leftList[0].orderId,
	                		'orderStatus': '',
	                		'typename': ''
	              		}
	              		this.leftMenu.push(obj);
	              		for (var i in d.leftList) {
	               			let n = '';
	               	 		d.leftList[i].name = '账单' + (Number(i) + 1);
	                		if (d.leftList[i].orderStatus == 1 || d.leftList[i].orderStatus == 0) {
	                			d.leftList[i].orderStatus = 1;
	                 			n = '未结';
	                		} else if (d.leftList[i].orderStatus == 3) {
	                  			n = '已结';
	                		} else if (d.leftList[i].orderStatus == 4) {
	                  			n = '作废';
	                		}
	                		if(d.leftList[i].orderId == this.billInfoData.orderid) {
	                			this.clickIndex = Number(i)+1;
	      						this.menuSelected = Number(i)+1;
	      						if(this.billInfoData.orderstatus == 1) {
	      							this.btnState = 3;
	      						}else if(this.billInfoData.orderstatus == 3) {
	      							this.btnState = 1;
	      						}else if(this.billInfoData.orderstatus == 4) {
	      							this.btnState = 2;
	      						}
	                		}
	                		d.leftList[i].typename = n;
	                		this.leftMenu.push(d.leftList[i]);
	              		}
	        		}
	        	}
	        	if (this.leftMenu[this.clickIndex].orderStatus == 3) {
		        	this.updateRecord = d.updaterecord;
		        } else {
		        	this.updateRecord = [];
		        }
		        if (d.settleAll.settledId != undefined) {
		        	localStorage.setItem('settledid', d.settleAll.settledId)
		        }
	        	this.endDate = d.settleAll.endtime;
	          	this.cuisines = d.billDetail;
	          	this.totalAmount = d.totalAmount;
	          	this.checkDate();
	          	this.emptyState = false;
	        }else if(d.code == 0) {
	        	if (!this.leftMenu.length) {
	            	d.leftList[0].name = '账单1';
		            // d.leftList[0].orderstatus = this.billData.orderstatus;
		            this.leftMenu = d.leftList;
		            if (this.billData.orderstatus == 1) {
		            	this.btnState = -1;
		            	d.leftList[0].typename = '未结';
		         	} else if (this.billData.orderstatus == 4) {
		            	this.btnState = 2;
		            	d.leftList[0].typename = '作废';
		          	}
	          	}
	          	this.cuisines = [];
	          	this.totalAmount = '0.00';
	          	this.updateRecord = [];
	          	this.emptyState = true;
	        }
	        this.billIfoSingle = d.settleAll;
	        this.currenttableid = d.settleAll.currenttableid;
	        this.billDetail = true;
      	})
    },

    changeMenuTab(index, id, orderstatus) {
      	this.menuSelected = index;
      	this.clickIndex = index;
      	this.billInfoData.orderid = id;
      	this.billInfoData.orderstatus = orderstatus;
      	if(orderstatus == '') {
      		this.btnState = 0;
      	} else if (orderstatus == 1) {
        	this.emptyState ? this.btnState = -1 : this.btnState = 3;
      	} else if (orderstatus == 3) {
        	this.btnState = 1;
      	} else if (orderstatus == 4) {
        	this.btnState = 2;
      	}
      	// this.cuisines = [];
      	this.billIfoSingle = [];
      	this.getBillInfo();
    },
    changeBillClick() { //反结账eturn
      	this.changebill = true
    },
    voidBillClick() { //作废账单
      	this.voidbill = true
    },
    cancelBillClick() { //取消账单
      	this.cancelbill = true
    },
   	cvBillConfirm(t) {
   		let self = this;
      	let orderid = this.billInfoData.orderid;
      	axios.get(localStorage.getItem('apiurl') + '/padinterface/canOrder?id=' + orderid + '&openPeople=' + localStorage.getItem('username')+'&tableNo='+this.tableNo+'&type='+t)
      	.then(function(res) {
        	if (!res.data.code) {
        		if(t == 0) {
        			self.message('账单已取消', 'success');
              		self.cancelbill = false;
        		}else if(t == 1) {
        			self.message('账单已作废', 'success');
          			self.voidbill = false;
        		}
              	self.billDetail = false;
              	self.getBillData();
        	}
      	})
   	},
    changeBillConfirm() {
      	let orderid = this.billInfoData.orderid;
      	localStorage.setItem('orderid', orderid)
      	localStorage.setItem('tableArear', this.tableArea)
      	localStorage.setItem('tableNum', this.tableNo)
      	localStorage.setItem('isChangeBill', 'yes')
      	this.$router.push({
        	path: '/orderTable'
      	})					
    },
    payBillEvt() { //去结账
    	if(!this.callPayState) {
    		let that = this;
    		this.callPayState = true;
    		let orderid = this.billInfoData.orderid;
      		localStorage.setItem('orderid', orderid)
      		localStorage.setItem('tableArear', this.tableArea)
      		localStorage.setItem('tableNum', this.tableNo)
      		localStorage.setItem('tableID', this.currenttableid)
      		localStorage.setItem('isChangeBill', 'no')
      		axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=1&ucode=' + localStorage.getItem('username') + '&uname=' + localStorage.getItem('name') + '&tableid=' + this.currenttableid).then(res => {
      			that.callPayState = false;
        		if (res.data.code == 0) {
          			localStorage.setItem('ordertype', 0)
          			this.$router.push({
            			path: '/orderTable'
          			})
        		} else {
        			this.message('对不起，当前' + res.data.data.replace('_', '|') + '正在操作该桌台', 'error')
		        }
      		}).catch(function(error){
      			that.callPayState = false;
      		})
    	}		
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
            		if(i == that.currenttableid) {
              			name = d[i];
              			state = true;
            		}
            		num++;
          		}
          		if (!num || !state) {
          			that.cvBillConfirm(s)
          		} else {
            		that.message('对不起，当前' + name + '正在操作该桌台','error');
          		}
        	}
      	});
    },
    printEvt(type) {
      	if (!this.callPrintState) {
        	this.callPrintState = true;
        	let self = this;
        	let data = {
          		orderid: this.billInfoData.orderid,
          		type: 'n',
          		isBefore: 1
        	}
        	if (type == 2) {
          		data.type = 'y';
          		data.isBefore = 2;
        	}
        	axios.post(localStorage.getItem('apiurl') + '/api/employee/doPrinter', data).then(function(res) {
          		self.callPrintState = false;
          		if (res.data.code == 4) {
            		var text = '';
            		if (type == 1) {
              			text = '预打印成功';
            		} else {
              			text = '重打小票成功';
            		}
            		self.message(text,'success');
          		} else {
          			self.message(res.data.msg, 'error');
          		}

        	})
      	}
    },

    closeChangeBill() {
      	this.changebill = false
    },

    closeVoidBill() {
      	this.voidbill = false
    },

    closeCancelBill() {
      	this.cancelbill = false
    }

  }
}

</script>
<style>
#bill {
  height: 100%;
  width: 100%;
  background: #f4f4f4;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0.2rem 0.2rem;
}

#bill .box {
  width: 100%;
  height: 100%;
  background: white;
}

#billType {
  width: 100%;
  height: 0.6rem;
  display: flex;
  box-sizing: border-box;
  padding: 0.1rem 0.2rem;
  border-bottom: 1px solid #f4f4f4;
}

#billType .billType {
  display: flex;
  /*width:25%;*/
  height: 0.4rem;
}

#billType .billType li {
  flex: 1;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin: 0 0.1rem;
  font-size: 0.15rem;
  color: #666666;
  padding: 0 0.15rem;
}

#billType .billType li:not(.active):hover {
  cursor: pointer;
  border-color: #ff7e4b;
  color: #ff7e4b;
}

#billType .billType li.active {
  background-color: #ff7e4b;
  color: #fff !important;
}

#billType .billType li.active:hover {
  cursor: default;
}

#billSearch {
  /*	width:30%;*/
  height: 0.4rem;
  margin-left: 0.2rem;
}

#billSearch input {
  /*width:1.25rem;*/
  height: 0.4rem;
  box-sizing: border-box;
  padding: 0 .1rem;
  border: 1px solid #ededed;
  border-radius: 5px;
}

#billSearch button {
  /*width:25%;*/
  height: 0.4rem;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin-left: 0.1rem;
  background: white;
  font-size: 0.15rem;
  padding: 0 0.15rem;
  color: white;
  background: #ff7e4b;
}

#billSearch button:hover {
  cursor: pointer;
}

#billIfo {
  /*width:97%;*/
  /*height:90%;*/
  height: calc(100% - 1rem);
  box-sizing: border-box;
  margin: 0.2rem;
  border: 1px solid #f4f4f4;
  overflow: auto;
}

#billIfo .billIfo {
  display: table;
  width: 100%;
  /*height:0.3rem;
	 	display:flex;*/
  justify-content: space-between;
  background: #f4f4f4;
}

#billIfo .billIfo li {
  display: table-cell;
  vertical-align: middle;
  width: 6%;
  /*height:0.3rem;
	 	line-height:0.3rem;*/
  font-size: 0.14rem;
  text-align: center;
  padding: 0.1rem 0;
  color: #999999;
}

#billIfo .billIfo li:first-child {
  width: 15%;
}

#billIfo .billIfo .time {
  width: 13%;
}
#billIfo .billAll .double {
  background: #fafafa;
}

#billIfo .billAll>li ul {
  /*display: flex;*/
  display: table;
  width: 100%;
  cursor: pointer;
}

#billIfo .billAll>li ul:hover {
  background-color: #eee;
}

#billIfo .billAll li ul li {
  display: table-cell;
  vertical-align: middle;
  padding: 0.1rem 0;
  width: 6%;
  /*height:0.52rem;
	 	line-height:0.52rem;*/
  text-align: center;
  font-size: 0.14rem;
  color: #666666;
  text-align: center;
  word-wrap: break-word;
  word-break: normal;
}

#billIfo .billAll li ul li:first-child {
  width: 15%;
}

#billIfo .billAll li.noData {
  padding: .2rem;
  font-size: .14rem;
  text-align: center;
}

#billIfo .billAll li ul .time {
  width: 13%;
}

#bill .container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.5);
}

#bill .container .billDetail {
  width: 90%;
  height: 75%;
  background: white;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 5px;
  box-sizing: border-box;
  /*padding: 0.2rem;*/
}

#bill .container .billDetail .header {
  width: 100%;
  height: 0.5rem;
  display: flex;
  justify-content: space-between;
}

#bill .container .billDetail .header h5 {
  /*height: 0.7rem;
	    line-height:0.7rem;*/
  font-size: 0.14rem;
  color: #333333;
  padding: 0.2rem;
}

#bill .container .billDetail .header span {
  cursor: pointer;
  padding: 0.2rem;
  margin-right: .1rem;
  /*width: 0.14rem;
		height:0.7rem;*/
  display: block;
  background: url('../../static/images/ic_close.png') no-repeat center center;
}

#bill .container .billDetail .main {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - .5rem);
  padding: .1rem .2rem;
}

#bill .container .billDetail .main .left {
  width: 16%;
  height: 100%;
  overflow: auto;
}

#bill .container .left .num span {
  font-size: 0.17rem;
  color: #ff7e4b;
  margin-right: 0.1rem;
}

#bill .container .left>ul {
  width: 100%;
  height: calc(100% - .51rem);
  overflow: auto;
  margin-top: 0.1rem;
}

#bill .container .left ul li {
  width: 90%;
  height: 0.6rem;
  box-sizing: border-box;
  padding: 0.15rem 0;
  text-align: center;
  border-radius: 5px;
  font-size: 0.16rem;
  margin-top: 0.2rem;
  border: 1px solid #333;
}

#bill .container .left ul li.active {
  color: white;
  background: #ff7e4b;
  border: none;
}

#bill .container .left ul li:hover {
  cursor: pointer;
}

#bill .container .left ul li.active:hover {
  cursor: default;
}

#bill .container .left ul li span:last-child {
  display: block;
  font-size: .13rem;
  color: #888;
}

#bill .container .left ul li.active span {
  color: #fff;
}

#bill .container .right {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#bill .container .right .top {
  width: 100%;
  height: calc(100% - .8rem);
  display: flex;
  overflow: hidden;
}

#bill .container .right .top .cuisine {
  width: 65%;
  height: 99%;
  border: 1px solid #f4f4f4;
}

#bill .container .top .cuisine>ul:nth-child(1) {
  width: 100%;
  height: 0.3rem;
  display: flex;
  background: #f4f4f4;
}

#bill .top .cuisine>ul:nth-child(1) li {
  flex: 1;
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  font-size: 0.14rem;
  color: #999999;
}

#bill .top .cuisine>ul:nth-child(2) {
  width: 100%;
  height: calc(100% - .7rem);
  overflow: auto;
  padding-bottom: .1rem;
  box-sizing: border-box;
}

#bill .top .cuisine .detail {
  width: 100%;
  height: 0.4rem;
  display: flex;
}

#bill .top .cuisine .detail li {
  flex: 1;
  height: 0.4rem;
  box-sizing: border-box;
  padding: 0.1rem 0;
  text-align: center;
  font-size: 0.14rem;
  color: #999999;
}

#bill .top .cuisine p {
  box-sizing: border-box;
  width: 100%;
  height: 0.4rem;
  padding: 0 0.15rem;
  line-height: 0.4rem;
  font-size: 0.14rem;
  color: white;
  background: #666666;
}

#bill .top .cuisine p span {
  color: white;
}

#bill .top .billIfo {
  width: 35%;
  height: 99%;
  overflow: auto;
  box-sizing: border-box;
  /*background-color: #f4f4f4;*/
  padding: 0.15rem;
  border: 1px solid #ededed;
  margin-left: 0.1rem;
}

#bill .top .billIfo .updateRecord,
#bill .top .billIfo .cancelDish {
  padding: .1rem 0;
  margin-top: .1rem;
  border-top: 1px solid #ddd;
}

#bill .top .billIfo .updateRecord h1 {
  font-style: .14rem;
  text-align: center;
  padding-bottom: .15rem;
}

#bill .top .billIfo .updateRecord ul:not(:last-child) {
  margin-bottom: 0.15rem;
  border-bottom: 1px dashed #ddd;
}

#bill .top .billIfo ul {
  /*overflow: hidden;
		clear: both;*/
}

#bill .top .billIfo li {
  color: #333;
  /*float: left;
		width: 50%;*/
  font-size: .13rem;
  margin-bottom: .12rem;
}




/*#bill  .top .billIfo li:nth-child(2n+1) {
		clear: left;
	}*/

#bill .top .billIfo li label {
  line-height: .18rem;
  color: #999;
  margin-right: 0.05rem;
}

#bill .top .billIfo li span {
  color: #000;
}

#bill .btn {
  width: 100%;
  height: 0.4rem;
  /*display: flex;*/
  justify-content: space-between;
  margin-top: 0.2rem;
  text-align: center;
}

#bill .btn button {
  display: inline-block;
  width: 28%;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  color: #ff7e4b;
  font-size: 0.16rem;
  border-radius: 5px;
  border: 1px solid #ff7e4b;
  background: white;
  margin: 0 1.5%;
}

#bill .btn button.disabledState {
  background-color: #ccc;
  color: #fff;
  border-color: #ccc;
}

#bill>.changeBill {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.5);
  text-align: center;
  z-index: 999;
}

#bill .changeBill .box {
  width: 5.1rem;
  height: 3rem;
  background: white;
  margin: 0 auto;
  margin-top: 20%;
  border-radius: 10px;
  padding-top: 0.4rem;
}

#bill .changeBill .box span {
  display: inline-block;
  height: 1rem;
  margin: 0.2rem 0;
}

#bill .changeBill .box p {
  font-size: 0.16rem;
  margin-bottom: 0.2rem;
}

#bill .changeBill .box button {
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

.el-message-box__message p {
  color: red;
}

.confirmInput span {
  color: white;
}

.tip-img {
  font-size: 0;
  display: inline-block;
  height: 1rem;
  width: 1rem;
  margin: 0.2rem 0;
  background: url('../../static/images/notice_2.png') no-repeat center center;
}

</style>
