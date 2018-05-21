<template>
  <div id="orderTable" @click="pageClick">
    <ul id="title">
      <li class="title" v-show='isChangeBill=="no"'>点单</li>
      <li class="title" v-show='isChangeBill=="yes"'>修改账单</li>
      <li class="close" @click="goDinner"></li>
    </ul>
    <div class="orderTable">
      <div class="left">
        <div class="top">
          <ul class="tableNum">
            <li class="arear">{{orderTableArear}}</li>
            <li class="num">{{orderTableNum}}</li>
          </ul>
          <ul class="tableIfo">
            <li>服务员：<span>{{userid}}</span></li>
            <li>人数：<span>{{custnum}}</span>人</li>
            <li>用时：<span>{{timeDuration}}</span></li>
          </ul>
        </div>
        <!-- 账单类型 -->
        <div class="bottom">
          <ul class="billType">
            <li :class="{billTypeActive:billTypeIdx == index}" v-for="(billType,index) in billTypes" @click="billTypeCho(index)" :key='index'>{{billType}}</li>
          </ul>
          <ul class="cuisineIfo">
            <li class='long'>品名</li>
            <li>数量</li>
            <li>单位</li>
            <li>单价</li>
          </ul>
          <!-- 账单商品详情 -->
          <ul class="cuisine">
            <li v-for="(bill,index) in bills" :data-id=bill.orderid :data-orderdetailid=bill.orderdetailid :data-num=bill.dishnum :data-price=bill.orderprice :data-orignalprice=bill.orignalprice :data-pricetype=bill.ordertype :data-dishid=bill.dishid :data-unit=bill.dishunit :data-discountrate=bill.discountrate :data-title=bill.title :class="{billCuisineAct:billCuise==index}" @click="billCuisineClick(index,$event)" :key='index'>
              <ul class="cuisineDetail">
                <li v-if='bill.ordertype==0' class='long'>{{bill.title}}</li>
                <li v-else-if='bill.ordertype==1' class='long'>{{bill.title}}<span class="mark">(赠)</span></li>
                <li v-else-if='bill.ordertype==2' class='long'>{{bill.title}}<span class="mark">(改价)</span></li>
                <li v-else-if='bill.ordertype==3' class='long'>{{bill.title}}<span class="mark">({{bill.discountrate}}折)</span></li>
                <li v-else-if='bill.ordertype==5' class='long'>{{bill.title}}<span class="mark">(退)</span></li>
                <li>{{bill.dishnum}}</li>
                <li>{{bill.dishunit2}}</li>
                <li v-model='price'>￥{{Number(bill.orderprice).toFixed(2)}}</li>
              </ul>
            </li>
          </ul>
          <div class="count" v-show="billTypeIdx == 0"><span>未落单</span>合计：<span>￥{{amount}}</span></div>
          <div class="count" v-show="billTypeIdx == 1"><span>已落单</span>合计：<span>￥{{amount}}</span></div>
          <div class="count" v-show="billTypeIdx == 2"><span>已结账</span>合计：<span>￥{{amount}}</span></div>
        </div>
      </div>
      <div class="medium">
        <ul class="orderHandle" v-show="billTypeIdx==0 && billDishNum !=0">
          <li @click="give" class="billHandle" v-show="ordertype!=1">赠送</li>
          <li v-show="ordertype==1">赠送</li>
          <li @click="cancelGive" class="billHandle" v-show="ordertype==1">取消赠送</li>
          <li v-show="ordertype!=1">取消赠送</li>
          <li>退菜</li>
          <li class="add billHandle" data-num=0 @click="billCuiseAR($event)">＋</li>
          <li class="reduce billHandle" data-num=1 @click="billCuiseAR($event)">－</li>
          <li class="billHandle" data-num=2 @click="billCuiseAR($event)">删除</li>
          <li @click="changeNum" class="billHandle">改量</li>
          <li @click="changePrice" class="billHandle">改价</li>
          <!--  <li v-show="ordertype!=0">改价</li> -->
          <li @click="discount" class="billHandle">打折</li>
          <!--  <li v-show="ordertype!=0">打折</li> -->
          <li v-show="!(!ld.length && js.length) && isChangeBill=='no'" class="billHandle" @click="cancelBill">取消账单</li>
          <li v-show="!ld.length && js.length && isChangeBill=='no'">取消账单</li>
        </ul>
        <ul class="orderHandle" v-show="billTypeIdx==1 && billDishNum !=0">
          <li @click="give" class="billHandle" v-show="ordertype!=1&&ordertype!=5">赠送</li>
          <li v-show="ordertype==1||ordertype==5">赠送</li>
          <li @click="cancelGive" class="billHandle" v-show="ordertype==1&&ordertype!=5">取消赠送</li>
          <li v-show="ordertype!=1||ordertype==5">取消赠送</li>
          <li @click="quitProd" class="billHandle" v-show='ordertype!=5'>退菜</li>
          <li v-show='ordertype==5'>退菜</li>
          <li class="add" @click=billCuiseAR($event)>＋</li>
          <li class="reduce" @click=billCuiseAR($event)>－</li>
          <li @click=billCuiseAR($event)>删除</li>
          <li>改量</li>
          <li @click="changePrice" class="billHandle" v-show="ordertype!=5">改价</li>
          <li v-show="ordertype==5">改价</li>
          <li @click="discount" class="billHandle" v-show="ordertype!=5">打折</li>
          <li v-show="ordertype==5">打折</li>
          <li v-show="!(!ld.length && js.length) && isChangeBill=='no'" class="billHandle" @click="cancelBill">取消账单</li>
          <li v-show="!ld.length && js.length && isChangeBill=='no'">取消账单</li>
        </ul>
        <ul class="orderHandle" v-show="billTypeIdx==2 || billDishNum==0">
          <li>赠送</li>
          <li>取消赠送</li>
          <li>退菜</li>
          <li class="add">＋</li>
          <li class="reduce">－</li>
          <li>删除</li>
          <li>改量</li>
          <li>改价</li>
          <li>打折</li>
          <li v-show="!(!ld.length && js.length) && isChangeBill=='no'" class="billHandle" @click="cancelBill">取消账单</li>
          <li v-show="!ld.length && js.length && isChangeBill=='no'">取消账单</li>
        </ul>
      </div>
      <div class="right">
        <!-- 商品分类 -->
        <div class="typeList">
          <ul class="cuisineTypes" id="tableList">
            <li v-for="(cuisineType,index) in cuisineTypes" :class="{typeActive:cuisineTypeCho==index}" @click="cuisineTypeChoose(index,$event)" :data-id=cuisineType.itemid :key='index'>{{cuisineType.itemdesc}}</li>
          </ul>
        </div>
        <!-- 商品 -->
        <ul class="cuisines">
          <li v-for="(cuisine,index) in cuisines" :data-id=cuisine.dishid :data-unit=cuisine.unit :data-price=cuisine.price @click="cuisineClick($event)" v-if='cuisine.label=="0"' :key='index'>
            <el-button>
              <ul class="cuisine">
                <li class="name">{{cuisine.title}}</li>
                <li class="price">￥{{cuisine.price}}/{{cuisine.unit}}</li>
              </ul>
            </el-button>
          </li>
          <li v-for="(cuisine,index) in cuisines" :data-id=cuisine.dishid :data-unit=cuisine.unit :data-price=cuisine.price v-if='cuisine.label=="1" || cuisine.label == null' :key='index'>
            <el-button class="empty">
              <ul class="cuisine">
                <li class="name">{{cuisine.title}}</li>
                <li class="price">￥{{Number(cuisine.price).toFixed(2)}}/{{cuisine.unit}}</li>
              </ul>
            </el-button>
          </li>
        </ul>
        <div class="search">
          <div>
            <input type="search" placeholder="菜品名称/名称首字母" v-on:input='dishSearch($event)' /><span></span></div>
          <!-- <ul class="page">
					<li>上一页</li>
					<li>下一页</li>
				</ul> -->
        </div>
        <ul class="handle">
          <li>
            <el-button @click="ldClick" v-if='isChangeBill=="no"'>落单(F4)</el-button>
          </li>
          <li>
            <el-button @click='printBill'>打印预结单(F3)</el-button>
          </li>
          <li>
            <el-button @click="acounts($event)">结账(F6)</el-button>
          </li>
          <li>
            <el-button @click='openCashBox'>开钱箱(F8)</el-button>
          </li>
        </ul>
      </div>
      <!-- 赠送、取消赠送、退菜、改量、改价、打折、取消账单的弹窗 -->
      <div class="prodHandleWin" v-show="window">
        <div class="box" @click="refreshData($event)">
          <div class="left" v-show="prodHandle==0">
            <h5>赠送</h5>
            <p class="billTitle">{{billTitle}}</p>
            <p>可赠数量：<span>{{billDishNum}}</span></p>
            <label>赠送数量</label>
            <div>
              <input type="number" name="" v-model="value1" ref='input1' @focus="input($event)" data-value=1 data-type=2/><span class="add" data-type='add' @click="countChange($event, 1)"></span><span class="reduce" data-type='reduce' @click="countChange($event, 1)"></span></div>
            <label>原因</label>
            <textarea placeholder="必填" v-model="reason" @focus="textareaInput"></textarea>
            <br/>
            <i>{{error}}</i>
            <button data-content="store1">保存</button>
          </div>
          <div class="left" v-show="prodHandle==1">
            <h5>取消赠送</h5>
            <p class="billTitle">{{billTitle}}</p>
            <p>已赠送数量：<span>{{billDishNum}}</span></p>
            <label>取消赠送</label>
            <div>
              <input type="number" name="" v-model="value1" ref='input2' @focus="input($event)" data-value=2 data-type=2/><span class="add" data-type='add' @click="countChange($event, 2)"></span><span class="reduce" data-type='reduce' @click="countChange($event, 2)"></span></div>
            <i>{{error}}</i>
            <button data-content="store2">保存</button>
          </div>
          <div class="left" v-show="prodHandle==2">
            <h5>退菜</h5>
            <p class="billTitle">{{billTitle}}</p>
            <p>已点数量：<span>{{billDishNum}}</span></p>
            <label>退菜数量</label>
            <div>
              <input type="number" name="" v-model="value1" ref='input3' @focus="input($event)" data-value=3 data-type=2/><span class="add" data-type='add' @click="countChange($event,3)"></span><span class="reduce" data-type='reduce' @click="countChange($event,3)"></span></div>
            <label>原因</label>
            <textarea placeholder="必填" v-model="reason" @focus="textareaInput"></textarea>
            <br/>
            <i>{{error}}</i>
            <button data-content="store3">保存</button>
          </div>
          <div class="left" v-show="prodHandle==6">
            <h5>修改数量</h5>
            <p class="billTitle">{{billTitle}}</p>
            <label>数量</label>
            <div>
              <input type="number" name="" v-model="value1" ref='input4' @focus="input($event)" data-value=4 data-type=0/><span class="add" data-type='add' @click="countChange($event,4)"></span><span class="reduce" data-type='reduce' @click="countChange($event,4)"></span></div>
            <i>{{error}}</i>
            <button data-content="store4">保存</button>
          </div>
          <div class="left" v-show="prodHandle==7">
            <h5>修改价格</h5>
            <p class="billTitle">{{billTitle}}</p>
            <label>原价</label><span>{{orignalprice}}</span>
            <label>修改后价格(元)</label>
            <input type="number" name="" v-model="value1" ref='input5' @focus="input($event)" data-value=5 data-type=1/>
            <br/>
            <i>{{error}}</i>
            <button data-content="store5">保存</button>
          </div>
          <div class="left" v-show="prodHandle==8">
            <h5>商品折扣</h5>
            <p class="billTitle">{{billTitle}}</p>
            <label>原价</label><span>{{orignalprice}}</span>
            <label>折扣(%)</label>
            <div>
              <input type="number" name="" v-model="value1" ref='input6' @focus="input($event)" data-value=6 data-type=1/><span>0~100</span></div>
            <label>折后价</label><span>{{discountPrice}}</span>
            <i>{{error}}</i>
            <button data-content="store6">保存</button>
          </div>
          <div class="right">
            <span @click="cancel"></span>
            <div class='keyboard' @click.stop='_handleKeyPress'>
              <div class='key-row'>
                <div class='key-cell' data-num='7'>7</div>
                <div class='key-cell' data-num='8'>8</div>
                <div class='key-cell' data-num='9'>9</div>
                <div class='key-cell' data-num='-1'>删除</div>
              </div>
              <div class='key-row'>
                <div class='key-cell' data-num='4'>4</div>
                <div class='key-cell' data-num='5'>5</div>
                <div class='key-cell' data-num='6'>6</div>
                <div class='key-cell' data-num='-1'>清空</div>
              </div>
              <div class='key-row'>
                <div class='key-cell' data-num='1'>1</div>
                <div class='key-cell' data-num='2'>2</div>
                <div class='key-cell' data-num='3'>3</div>
                <div class='key-cell' data-num='-1'></div>
              </div>
              <div class='key-row'>
                <div class='key-cell disabled' data-num='0'>0</div>
                <div class='key-cell' data-num='00'>00</div>
                <div class='key-cell' data-num='.'>.</div>
                <div class='key-cell' data-num='-1'></div>
              </div>
              <!-- <div class='key-confirm' data-num='S'>确认</div> -->
              <div class='key-clear' data-num='C'>清空</div>
              <div class='key-delete' data-num='D'>删除</div>
            </div>
            <button @click="cancel">取消</button>
          </div>
        </div>
      </div>
      <div class="cancelBill" v-show="prodHandle==9">
        <div class="box">
          <span></span>
          <p>取消账单后，已落单但未结账商品将全部退菜操作(若有)，并清空桌台，是否继续？</p>
          <div>
            <button @click="clearOrderConfirm">确认</button>
            <button @click="cancel">放弃</button>
          </div>
        </div>
      </div>
      <div class="cancelBill accountBill" v-show="prodHandle==10">
        <div class="box">
          <span></span>
          <p>该桌台有未落单商品</p>
          <div>
            <button @click="accountBillEvt(1)">落单并结账</button>
            <button @click="accountBillEvt(2)">清除并结账</button>
            <button @click="cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
    <!--  <Pay v-if="bill"/> -->
    <router-view/>
    <!-- 获取临时权限弹窗 -->
    <!-- <Authority @aut='_aut' :url='url' v-show='getAut' /> -->
  </div>
</template>
<script>
import Pay from '../components/Pay';
import Bus from '../bus.js';
import Keboard from '../components/public/Keyboard';
import Authority from '../components/public/Authority';
import axios from 'axios';
export default {
  name: 'OrderTable',
  components: { Keboard, Pay, Authority },
  data() {
    return {
      bills: [],
      cuisineTypes: [{ 'itemdesc': "全部", "itemid": "" }],
      cuisinesStore: [],
      cuisines: [],
      cuisineTypeCho: 0,
      billTypes: ["未落单", "已落单", "已结账"],
      billTypeIdx: 0,
      orderTableArear: '',
      orderTableNum: '',
      prodHandle: 0,
      window: false,
      billCuise: 'a',
      value1: '',
      // value2:'',
      // value3:'',
      // value4:'',
      // value5:'',
      // value6:'',
      value: '',
      inputType: '',
      backMoney: '',
      money: '',
      js: [],
      ld: [],
      wld: [],
      orderid: '',
      orderdetailid: '', //账单中菜品id,
      dishid: '',
      cuisineTypeId: '',
      reason: '',
      error: "",
      billDishNum: 0,
      orderprice: '', //账单中菜品价格,
      orignalprice: '', //账单中菜品原始价格,
      unit: '', //账单中菜品单位
      discountPrice: '', //折扣后价格
      ordertype: 'a', //账单中商品详情类型，0正常，1赠送，2改价，3打折,5退菜
      time: '',
      timeDuration: '',
      userid: '',
      custnum: 1,
      amount: 0, //账单金额
      price: '', //账单中菜品价格取两位小数
      discountrate: '',
      isChangeBill: '', //是否是反结账
      type: 0, //订单类型，0表示正常，反结账1
      num:1,//订单类型，1表示正常，反结账0
      isAcount: '',
      lastClick: '',
      printArr: [],
      billTitle: '',
      callbackState: false, //设置回调状态,
      callPrintState: false,
      callBtnState: false,
      getAut: false,
      url: '',
      haveAut: false,
      pageClickTimer: 0,
      durationTimer: '',
      competedState: false,
      authority: 'no',
      text: '',
      flag: 0,
      changBillHandle:''
    }
  },
  methods: {
    acounts(e) {
      if (this.authority == 'no') {
        this.message('无结账权限，不能结账！', 'warning');
        return
      } else {
        var that = this;
        let timer = setInterval(() => {
          if (that.competedState) {
            clearInterval(timer);
            let id = localStorage.getItem('orderid');
            if (!that.wld.length && !that.ld.length) {
              that.message('暂无落单商品，不能结账','warning');
              return
            }
            if(that.wld.length) {
              that.prodHandle = 10;
            }else{
               let flag = false;            
               for(var i in that.ld){
                   if(that.ld[i].ordertype != 5)
                		flag = true;
                }                                 
	            // if (!flag||(that.isChangeBill == "yes"&& !this.changBillHandle)) {
	            if (!flag) {
	              that.message('无有效菜品操作，不能进行修改账单操作！', 'warning')
	              return
	            }
	            that.$router.push({
	                path: '/orderTable/pay'
	            })
            }
          }
        }, 200)
      }
    },
    clearData () {
      this.value1 = '';
      this.reason = '';
      this.dishid = '';
      this.billCuise = '';
      this.billTitle = '';
      this.orderdetailid = '';
      this.billDishNum = '';
      this.orderprice = '';
      this.orignalprice = '';
      this.ordertype = '';
      this.unit = '';
      this.discountrate = '';
    },
    openCashBox() {
      if (this.authority == 'no') {
        this.message('开钱箱权限，不能开钱箱！', 'warning');
        return
      } else {
        alert('开钱箱')
      }
    },
    accountBillEvt(t) {
      this.cancel();
      if (t == 1) {
        this.isAcount = 'yes';
        this.ldClick();
      } else if (t == 2) {
        this.clearEvt();
      }
    },
    clearEvt() {
    	let d = this.wld;
    	let arr = [],
      	that = this;
    	for (var i in d) {
      	var url = axios.get(localStorage.getItem('apiurl') + '/padinterface/deleteOrderDetail?id=' + d[i].orderdetailid + '&orderid=' + localStorage.getItem('orderid'));
      	arr.push(url);
   	  }
    	axios.all(arr).then(function(res) {
      	if (res.length) {
      		that.wld = [];           
      		if (!that.ld.length) {
            if(!that.js.length){
              that.billTypeIdx = 0; 
              that.bills = [];               
            }else{
              that.billTypeIdx = 2;
              that.billDishNum = 0;
              that.bills = that.js;
            }       			
            that.message('清空成功，但无落单商品，不能结账', 'warning');
        	} else {
        		that.billTypeIdx = 1;
        		that.bills = that.ld;
          	that.$router.push({
           		path: '/orderTable/pay'
          	})
        	}
      	}
    	})
    },
    cuisineTypeChoose(index, e) {
      this.cuisines = [];
      this.cuisineTypeCho = index;
      let id = this.cuisineTypeId = e.currentTarget.dataset.id;
      localStorage.setItem('cuisineTypeId', id)
      localStorage.setItem('cuisineTypeCho', index)
      if (id == '') {
        this.cuisines = this.cuisinesStore
      } else {
        for (var i = 0; i < this.cuisinesStore.length; i++) {
          if (this.cuisinesStore[i].fcolumnid == id) {
            this.cuisines.push(this.cuisinesStore[i])
          }
        }
      }
    },
    billCuisineClick(index, e) {
      this.value1 = '';
      this.reason = '';
      this.dishid = e.currentTarget.dataset.dishid;
      this.billCuise = index;
      this.billTitle = e.currentTarget.dataset.title;
      this.orderdetailid = e.currentTarget.dataset.orderdetailid;
      this.billDishNum = e.currentTarget.dataset.num;
      this.orderprice = e.currentTarget.dataset.price;
      this.orignalprice = e.currentTarget.dataset.orignalprice;
      this.ordertype = e.currentTarget.dataset.pricetype; //获取账单菜品价格类型，点击获取菜品的可操作选项
      this.unit = e.currentTarget.dataset.unit;
      this.discountrate = e.currentTarget.dataset.discountrate;
      localStorage.setItem('clickDishIndex', index);
    },
    goDinner() {
      if (this.isChangeBill == 'no') { //离开页面清除标记函数
        axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=0&tableid=' + localStorage.getItem('tableID')+'&ucode=' + localStorage.getItem('username')
        ).then(res => {
          if (res.data.code == 0) {
            this.$router.push({
              path: '/dinner'
            })
          }
        })
      } else {
        axios.get(localStorage.getItem('apiurl') + '/padinterface/callback?id=' + localStorage.getItem('orderid')//桌台id                                        
        ).then((res) => {
          if (res.data.code == 0) {
            this.$router.push({
              path: '/dinner'
            })
          }
        })
      }
    },
    billTypeCho(index) {
      if(this.isChangeBill=="no"){
        this.billTypeIdx = index
        this.billCuise = 'a'
        this.billDishNum = 0
        localStorage.setItem('billTypeIdx', index)
        if (index == 0)
          this.bills = this.wld
        else if (index == 1)
          this.bills = this.ld
        else if (index == 2)
          this.bills = this.js
      }else{
        this.billTypeIdx = 1
      }      
    },
    give() {
      if (this.authority == 'no') {
        this.message('无赠送权限，不能赠送菜品！', 'warning');
        return
      } else {
        this.window = true;
        this.prodHandle = 0;
        this.reason = '';
        this.value = '';
        this.value1 = '';
      }
    },
    cancelGive() {
      if (this.authority == 'no') {
        this.message('无取消赠送权限，不能取消赠送菜品！', 'warning');
        return
      } else {
        this.window = true;
        this.prodHandle = 1;
        this.reason = '';
        this.value = '';
        this.value1 = '';
      }
    },
    quitProd() {
      if (this.authority == 'no') {
        this.message('无退菜权限，不能退菜品！', 'warning');
        return
      } else {
        this.window = true;
        this.prodHandle = 2;
        this.reason = '';
        this.value = '';
        this.value1 = '';
      }
    },
    changeNum() {
      this.window = true;
      this.prodHandle = 6;
      this.reason = '';
    },
    changePrice() {
      if (this.authority == 'no') {
        this.message('无改价权限，不能更改菜品价格！', 'warning');
        return
      } else {
        this.window = true;
        this.prodHandle = 7;
        this.reason = '';
        this.value = '';
        this.value1 = '';
      }
    },
    discount() {
      if (this.authority == 'no') {
        this.message('无打折权限，不能更改菜品折扣！', 'warning');
        return
      } else {
        this.window = true;
        this.prodHandle = 8;
        this.reason = '';
        this.value = '';
        this.value1 = '';
      }
    },
    cancelBill() {
      if (this.authority == 'no') {
        this.message('无取消账单权限，不能取消账单！', 'warning');
        return
      } else {
        this.prodHandle = 9;
      }
    },
    clearOrderConfirm() { //确认取消账单，未结状态桌台才可以进行该操作，传账单id
      	let self = this;
      	axios.get(localStorage.getItem('apiurl') + '/padinterface/canOrder?id=' + localStorage.getItem('orderid') + '&openPeople=' + localStorage.getItem('username') + '&tableNo='+this.orderTableNum+'&type=0').then(function(r) { //取消账单
        	if (!r.data.code) {
          // var d = {orderid: localStorage.getItem('orderid')};
          // axios.post(localStorage.getItem('apiurl') + '/api/employee/reviseInventory', d).then(function(re){ //库存回滚
          // 	if(re.data.code == 1) {
          		self.cancel()
          		self.message('账单取消成功', 'success')
              	axios.get(localStorage.getItem('apiurl') + '/app/getTables?type=0&tableid=' + localStorage.getItem('tableID')+'&ucode=' + localStorage.getItem('username')).then(res => {
                	if (res.data.code == 0) {
                		self.$router.push({
                			path: '/dinner'
                		})
                	}
              	})
          // }
          // });
        	}
      	})
    },
    cancel() {
      this.isAcount = '';
      this.window = false;
      this.prodHandle = ''
      this.money = ''
      this.error = ''
      this.money = ''
    },
    cuisineClick(e) {
      if (this.isChangeBill == 'no') { //正常下单
        if (!this.callbackState) {
          this.callbackState = true;
          let that = this,
            dishid = e.currentTarget.dataset.id,
            unit = e.currentTarget.dataset.unit,
            orderid = localStorage.getItem('orderid'),
            orderprice = Number(e.currentTarget.dataset.price).toFixed(2),
          	branchid=localStorage.getItem('branchId'),
          	type=this.js.length?1:0;

          //防止点击速度过快，上一次下单来不及刷新		
          if (!this.wld.length) { //判断该菜品是否为第一次下单
            axios.post(localStorage.getItem('apiurl') + '/padinterface/bookorderList', //第一次下单请求
              {
                "currenttableid": this.orderTableNum,
                "globalsperequire": "",
                "orderid": orderid, //,'H20180113601742000001'
                "operationType": 1,
                "sequence": 94,
                "type":type,
                "rows": [{
                  "printtype": "0",
                  "pricetype": 0,
                  "orderprice": orderprice,
                  "orignalprice": orderprice,
                  "dishid": dishid,
                  "userName": null,
                  "dishunit": unit,
                  "orderid": orderid,
                  "dishtype": 0,
                  // "orderseq": that.seqNumber,
                  "dishnum": "1",
                  "sperequire": "",
                  "primarykey": "9A82543061E67C32BABB6153CA9110D4",
                  "dishstatus": "0",
                  "ispot": 0,
                  "taste": "",
                  "freeuser": null,
                  "freeauthorize": null,
                  "freereason": null,
                  "dishes": null,
                  'status': 0,
                  'ordertype': 0,
                  'branchid':branchid
                }]
              }).then((res) => {
              if (res.data.code == '0') {
                fresh()
              } else {
                that.callbackState = false;
              }
            })
          } else {
            if (isExist(this.wld) == -1) {
              axios.post(localStorage.getItem('apiurl') + '/padinterface/bookorderList', //第一次下单请求
                {
                  "currenttableid": this.orderTableNum,
                  "globalsperequire": "",
                  "orderid": orderid, //,'H20180113601742000001'
                  "operationType": 1,
                  "sequence": 94,
                  "type":type,
                  "rows": [{
                    "printtype": "0",
                    "pricetype": 0,
                    "orderprice": orderprice,
                    "orignalprice": orderprice,
                    "dishid": dishid,
                    "userName": null,
                    "dishunit": unit,
                    "orderid": orderid,
                    "dishtype": 0,
                    // "orderseq": that.seqNumber,
                    "dishnum": "1",
                    "sperequire": "",
                    "primarykey": "9A82543061E67C32BABB6153CA9110D4",
                    "dishstatus": "0",
                    "ispot": 0,
                    "taste": "",
                    "freeuser": null,
                    "freeauthorize": null,
                    "freereason": null,
                    "dishes": null,
                    'status': 0,
                    'ordertype': 0,
                    'branchid':branchid
                  }]
                }).then((res) => {
                if (res.data.code == '0') {
                  fresh()
                } else {
                  that.callbackState = false;
                }
              })
            } else {
              axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
                {
                  'orderid': orderid,
                  'orderdetailid': isExist(this.wld).orderdetailid,
                  'dishnum': Number(isExist(this.wld).dishnum) + 1,
                  'ordertype': 0,
                  'orderprice': orderprice,
                  'orignalprice': orderprice,
                  'dishid': dishid,
                   'branchid':branchid
                }).then((res) => {
                if (res.data.code == 0) {
                  fresh()
                } else {
                  that.callbackState = false;
                }
              })
            }
          }

          function fresh() { //点击后更新数据			
            axios.get(localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + orderid + "&type=0" +'&num=' + that.num //订单id
            ).then((res) => {
              if (res.data.code == 0) {
                that.callbackState = false;
                let data = res.data.data;
                // that.cuisines=data.food;
                that.js = data.js;
                that.ld = data.ld;
                that.wld = data.wld;
                that.bills = data.wld
                that.billCuise = 'a' //localStorage.getItem('clickDishIndex')
                that.billDishNum = 0
                // that.cuisineTypeCho = localStorage.getItem('cuisineTypeCho')
                that.bills = that.wld
                that.billTypeIdx = 0
              }
            })
          }

          function isExist(array) { //判断未落单里是否有点击的菜品
            for (let i = 0; i < array.length; i++) {
              if (array[i].dishid == dishid && Number(array[i].orderprice).toFixed(2) == orderprice && array[i].ordertype == 0) { //未落单里已有相关菜品
                return array[i]
              }
            }
            return -1
          }
        }
      } else if (this.isChangeBill == 'yes') {
      	this.message('反结账不能新增商品', 'warning');
      }


      // this.lastClick = new Date()
      // console.log(+new Date(), Date.parse(this.lastClick), +new Date() - Date.parse(this.lastClick));
      // if((+new Date() - Date.parse(this.lastClick))<300){//两次下单商品时间太短，数据尚未刷新完成
      // 	return	
      // }	
    },
    refreshData(e) {
      if (!this.callBtnState) {
        let store = e.target.dataset.content,
          orderid = localStorage.getItem('orderid'),
          orderprice = this.oderprice,
          ordertype = this.ordertype,
          dishid = this.dishid,
          num = this.billDishNum,
          unit = this.unit,
          that = this,
          type=this.js.length?1:0,
          _array,
          status,
          branchid=localStorage.getItem('branchId');
        if (this.billCuise == "a" || this.billDishNum == 0) //没有选中的商品
          return
        if (that.billTypeIdx == 0) {
          _array = that.wld
          status = 0
        } else if (that.billTypeIdx == 1) {
          _array = that.ld
          status = 1
        }
        if (store != undefined) {
          this.callBtnState = true;
        }
        if (store == "store1") {
          if (this.value1 == '' || this.reason == '' || this.value1 <= 0) {
            this.error = '请输入赠送数量和赠送原因'
            this.callBtnState = false;
            return
          }
          if (isExist(_array, 1) == -1) {
            let postData = {
              "currenttableid":this.orderTableNum,
              "globalsperequire": "",
              "orderid": orderid, //,'H20180113601742000001'
              "operationType": 1,
              "sequence": 94,
              "type":type,
              "rows": [{
                "printtype": "0",
                "pricetype": 0,
                "orderprice": 0,
                "orignalprice": that.orignalprice,
                "dishid": dishid,
                "userName": null,
                "dishunit": unit,
                "orderid": orderid,
                "dishtype": 0,
                // "orderseq": that.seqNumber,
                "dishnum": this.value1,
                "sperequire": "",
                "primarykey": "9A82543061E67C32BABB6153CA9110D4",
                "dishstatus": "0",
                "ispot": 0,
                "taste": "",
                "freeuser": null,
                "freeauthorize": null,
                "freereason": null,
                "dishes": null,
                "status": status,
                "ordertype": 1,
                "branchid":branchid
              }]
            };
            // if (this.isChangeBill == 'no') {
            //   postData.currenttableid = this.orderTableNum;
            // }
            //发送请求添加一条赠送商品记录,第一次下单请求
            axios.post(localStorage.getItem('apiurl') + '/padinterface/bookorderList', postData).then((res) => {
              if (res.data.code == 0) { //原有商品做减量 
                update(ordertype)
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          } else {
            axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
              {
                'orderid': orderid,
                'orderdetailid': isExist(_array, 1).orderdetailid,
                'dishnum': Number(isExist(_array, 1).dishnum) + Number(that.value1),
                'ordertype': 1,
                'orderprice': orderprice,
                'orignalprice': that.orignalprice,
                'dishid': dishid,
                "status": status,
                "branchid":branchid
              }
            ).then((res) => {
              if (!res.data.code) {
                update(ordertype)
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          }
        } else if (store == 'store2') {
          if (this.value1 == '') {
            this.error = '请输入取消赠送数量'
            this.callBtnState = false
            return
          }
          if (isExist(_array, 2) == -1) {
            let postData = {
              "currenttableid":this.orderTableNum,
              "globalsperequire": "",
              "orderid": orderid, //,'H20180113601742000001'
              "operationType": 1,
              "sequence": 94,
              "type":type,
              "rows": [{
                "printtype": "0",
                "pricetype": 0,
                "orderprice": that.orignalprice,
                "orignalprice": that.orignalprice,
                "dishid": dishid,
                "userName": null,
                "dishunit": unit,
                "orderid": orderid,
                "dishtype": 0,
                // "orderseq": that.seqNumber,
                "dishnum": that.value1,
                "sperequire": "",
                "primarykey": "9A82543061E67C32BABB6153CA9110D4",
                "dishstatus": "0",
                "ispot": 0,
                "taste": "",
                "freeuser": null,
                "freeauthorize": null,
                "freereason": null,
                "dishes": null,
                "status": status,
                "ordertype": 0,
                "branchid":branchid
              }]
            };
            // if (this.isChangeBill == 'no') {
            //   postData.currenttableid = this.orderTableNum;
            // }
            //发送请求添加一条赠送商品记录,第一次下单请求
            axios.post(localStorage.getItem('apiurl') + '/padinterface/bookorderList', postData).then((res) => {
              if (res.data.code == 0) {
                update(1)
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          } else {
            axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
              {
                'orderid': orderid,
                'orderdetailid': isExist(_array, 2).orderdetailid,
                'dishnum': Number(isExist(_array, 2).dishnum) + Number(that.value1),
                'ordertype': 0,
                'orderprice': that.orignalprice,
                'orignalprice': that.orignalprice,
                'dishid': dishid,
                "status": status,
                "branchid":branchid
              }
            ).then((res) => {
              if (!res.data.code) {
                update(1)
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          }
        }else if(store == 'store3') {
            if(this.value1 == '' || this.reason == '') {
	            this.error = '请输入退菜数量及原因'
	            this.callBtnState = false
	            return
            }
            let price;
            if(this.isChangeBill=="yes"){
	          	price = that.orderprice;
	        }else{
	        	price = that.orignalprice;
	        }
          	let postData = {
              "currenttableid":this.orderTableNum,
	            "globalsperequire": "",
	            "orderid": orderid, //,'H20180113601742000001'
	            "operationType": 1,
	            "sequence": 94,
	            "type":type,
	            "rows": [{
	              "printtype": "0",
	              "pricetype": 0,
	              "orderprice": that.orignalprice,
	              "orignalprice": that.orignalprice,
	              "dishid": dishid,
	              "userName": null,
	              "dishunit": unit,
	              "orderid": orderid,
	              "dishtype": 0,
	              // "orderseq": that.seqNumber,
	              "dishnum": that.value1,
	              "sperequire": "",
	              "primarykey": "9A82543061E67C32BABB6153CA9110D4",
	              "dishstatus": "0",
	              "ispot": 0,
	              "taste": "",
	              "freeuser": null,
	              "freeauthorize": null,
	              "freereason": null,
	              "dishes": null,
	              "status": 1,
	              "ordertype": 5,
	              "branchid":branchid
	            }]
	          };
          	// if (this.isChangeBill == 'no') {
           // 	 	postData.currenttableid = this.orderTableNum;
          	// }
          //发送请求添加一条赠送商品记录,第一次下单请求		
          	axios.post(localStorage.getItem('apiurl') + '/padinterface/bookorderList', postData).then((res) => {
            	if (res.data.code == 0) {
              //      	let data = {
              // 	dishid: dishid,
              // 	dishCount: num,
              // 	branchid: localStorage.getItem('branchId'),
              // 	orderid: orderid,
              // 	type: 0
              // };
              // axios.post(localStorage.getItem('apiurl') + '/api/employee/calcInventory', data
              // ).then(res=>{
              // 	if(res.data.code == 1){
                console.log(res)
              update(ordertype)
              // 	}
              // })			        	
              } else {
                that.callBtnState = false
              }
          }).catch(function(error) {
            that.callBtnState = false
          })
        } else if (store == 'store4') {
          let type,
            discountrate;

          if (this.value1 == '' || this.value1 == num || this.value1 < 0) {
            this.error = '请输入修改数量'
            this.callBtnState = false
            return
          }
          if (this.discountrate == undefined || this.discountrate == '') {
            discountrate = ''
          } else {
            discountrate = this.discountrate
          }
          if (Number(this.value1) > Number(num))
            type = 1
          else if (Number(this.value1) < Number(num))
            type = 2
          if (this.value1 == 0) {
            axios.get(localStorage.getItem('apiurl') + '/padinterface/deleteOrderDetail?id=' + this.orderdetailid + '&orderid=' + orderid //订					 	
            ).then((res) => {
              if (res.data.code == 0) {
                // this.billDishNum =0
                // this.billCuise='a'
                // that.cancel()
                fresh()
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          } else {
            axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
              {
                'orderid': orderid,
                'orderdetailid': this.orderdetailid,
                'dishnum': this.value1,
                'ordertype': ordertype,
                'discountrate': discountrate,
                'orderprice': orderprice,
                'orignalprice': that.orignalprice,
                'dishid': dishid,
                "branchid":branchid
              }
            ).then((res) => {
              if (!res.data.code) {
                // that.cancel()
                // this.billDishNum = this.value1
                fresh()
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          }
        } else if (store == 'store5') {
          if (this.value1 == '' || this.value1 < 0) {
            this.error = '请输入修改后价格'
            this.callBtnState = false
            return
          }
          let type
          axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
            {
              'orderid': orderid,
              'orderdetailid': this.orderdetailid,
              'orderprice': this.value1,
              'orignalprice': that.orignalprice,
              'ordertype': 2,
              'status': that.billTypeIdx,
              'dishid': dishid,
              "branchid":branchid
            }
          ).then((res) => {
            if (res.data.code == 0) {
              // this.cancel()
              fresh()
            } else {
              that.callBtnState = false
            }
          }).catch(function(error) {
            that.callBtnState = false
          })
        } else if (store == 'store6') {
          if (this.value1 == '') {
            this.error = '请输入折扣'
            this.callBtnState = false
            return
          }
          axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
            {
              'orderid': orderid,
              'orderdetailid': this.orderdetailid,
              'ordertype': 3,
              'discountrate': Number(this.value1) * 0.1,
              'orderprice': Number(this.value1) * Number(that.orignalprice) * 0.01,
              "orignalprice": that.orignalprice,
              'status': that.billTypeIdx,
              'dishid': dishid,
              "branchid":branchid
            }
          ).then((res) => {
            if (res.data.code == 0) {
              // that.cancel()
              fresh()
            } else {
              that.callBtnState = false
            }
          }).catch(function(error) {
            that.callBtnState = false
          })
        }

        function isExist(array, t) { //判断未落单里是否有点击的菜品
          if (t == 1) {
            for (let i = 0; i < array.length; i++) {
              if (array[i].dishid == dishid && array[i].orderprice == 0) { //未落单里已有相关菜品
                return array[i]
              }
            }
            return -1
          } else if (t == 2) {
            for (let i = 0; i < array.length; i++) {
              if (array[i].dishid == dishid && !array[i].ordertype && array[i].ordertype != 5) { //未落单里已有相关菜品
                return array[i]
              }
            }
            return -1
          }

        }

        function update(type) { //账单菜品操作更新公共函数
  	    	if(that.isChangeBill=='yes'){
  	    		that.changBillHandle=true
  	    	}
          if(that.billDishNum == that.value1) {
            axios.get(localStorage.getItem('apiurl') + '/padinterface/deleteOrderDetail?id=' + that.orderdetailid + '&orderid=' + orderid //订			 		
            ).then((res) => {
              if (res.data.code == 0) {
                // that.billDishNum =0
                // that.cancel()
                fresh()
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          } else {
            axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
              {
                'orderid': orderid,
                'orderdetailid': that.orderdetailid,
                'dishnum': Math.abs(Number(num) - Number(that.value1)),
                'ordertype': type,
                'discardReason': that.reason,
                'orderprice': orderprice,
                'orignalprice': that.orignalprice,
                'discountrate':that.discountrate,
                'dishid': dishid,
                'status': status,
                'branchid':branchid
              }
            ).then((res) => {
              if (res.data.code==0) {
                that.billDishNum=0
                that.cancel()
                that.reason=''
                fresh()
              } else {
                that.callBtnState = false
              }
            }).catch(function(error) {
              that.callBtnState = false
            })
          }
        }

        //保存成功获取数据刷新		
        function fresh() {
          let tableID = localStorage.getItem("tableID"),
            id = localStorage.getItem('orderid'),
            orderUrl = localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + id + "&type=0" +'&num=' + that.num;
          axios.get(orderUrl).then((res) => {
            that.callBtnState = false;
            if (res.data.code == 0) {
              that.cancel();
              that.reason = '';
              if (that.isChangeBill == 'yes') {
                let d = res.data.data.ld;
                that.bills = d
                that.ld = d
                that.js = []
                that.wld = []
                that.billTypeIdx = 1
              } else {
                let data = res.data.data;
                that.js = data.js;
                that.ld = data.ld;
                that.wld = data.wld;
                that.bills = data.wld
                // that.billCuise = localStorage.getItem('clickDishIndex')
                // that.billTypeIdx = 0		        			        	
                that.bills = that.billTypeIdx == 0 ? data.wld : that.ld
                if (store == 'store3' || (store == 'store1' && that.billTypeIdx == 1)) {
                  that.billTypeIdx = 1
                  that.bills = data.ld
                }
              }

              that.billCuise = 'a'
              that.billDishNum = 0
              that.value1 = ''
            }
          }).catch(function(error) {
            that.callBtnState = false;
          })
        }
      }
    },
    billCuiseAR(e) { //账单菜品数量直接加减删除
      let num = e.target.dataset.num,
        dishid = this.dishid,
        that = this,
        ordertype = this.ordertype,
        discountrate,
        orderprice = this.orderprice,
        branchid=localStorage.getItem('branchId');
      if(this.discountrate == undefined || this.discountrate == '') {
        discountrate = ''
      } else {
        discountrate = this.discountrate
      }
      if (this.billCuise == "a" || this.billDishNum == 0) //没有选中的商品
        return
      if (num == 0) {
        this.billDishNum = Number(this.billDishNum) + 1
        axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
          {
            'orderid': that.orderid,
            'orderdetailid': this.orderdetailid,
            'dishnum': this.billDishNum,
            'ordertype': ordertype,
            'discountrate': discountrate,
            'dishid': dishid,
            'orderprice': orderprice,
            "branchid":branchid
          }
        ).then((res) => {
          if (res.data.code == 0) {
            fresh()
          }
        })
      } else if (num == 1) {
        if (this.billDishNum == 1) {
          axios.get(localStorage.getItem('apiurl') + '/padinterface/deleteOrderDetail?id=' + this.orderdetailid + '&orderid=' + that.orderid //订单id
          ).then((res) => {
            if (!res.data.code) {
              this.billDishNum = 0
              this.billCuise = 'a'
              fresh()
            }
          })
        } else {
          this.billDishNum -= 1
          axios.post(localStorage.getItem('apiurl') + '/padinterface/updateOrderDetail', //订单id
            {
              'orderid': that.orderid,
              'orderdetailid': this.orderdetailid,
              'dishnum': this.billDishNum,
              'ordertype': ordertype,
              'discountrate': discountrate,
              'dishid': dishid,
              'orderprice': orderprice,
              "branchid":branchid
            }
          ).then((res) => {
            if (res.data.code == 0) {
              fresh()
            }
          })
        }
      } else if (num == 2) {
        axios.get(localStorage.getItem('apiurl') + '/padinterface/deleteOrderDetail?id=' + this.orderdetailid + '&orderid=' + that.orderid //订				 		
        ).then((res) => {
          if (res.data.code == 0) {
            this.billDishNum = 0
            this.billCuise = 'a'
            fresh()
          }
        })
      }

      function fresh() {
        let tableID = localStorage.getItem("tableID"),
          id = localStorage.getItem('orderid'); // 'H20180113601742000001'
        axios.get(localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + id + '&type=0' +'&num=' + that.num //订单id		 		
        ).then((res) => {
          if (res.data.code == 0) {
            let data = res.data.data;
            that.js = data.js;
            that.ld = data.ld;
            that.wld = data.wld;
            that.bills = data.wld
            if (num == 2 || (num == 1 && that.billDishNum == 0)) {
              that.billCuise = 'a'
              that.billDishNum = 0
            } else {
              that.billCuise = localStorage.getItem('clickDishIndex')
            }
          }
        })
      }
    },
    countChange(e, v) { //弹窗商品数量加减操作
      let text = e.target.dataset.type;
      this.value = v;
      if (text == 'add') {
        this.value1++
      } else if (text == 'reduce') {
        if (this.value1 >= 1)
          this.value1--
          else if (this.value1 <= 0) {
            return
          }
      }
      // this.$refs['input'+v].focus()
    },
    textareaInput() {
      this.error = ''
      this.value = ''
    },
    input(e) {
      this.money = this.value1;
      this.error = '';
      // this.inputType = e.target.dataset.type;
      this.value = e.target.dataset.value;
    },
    dishSearch(e) {
      let val = e.target.value.toLocaleUpperCase(),
        id = localStorage.getItem('cuisineTypeId'),
        dishs = this.cuisinesStore,
        array = [];
      console.log(val);
      for (var i = 0; i < dishs.length; i++) {
        if (val == '') {
          if (id == "") {
            array = dishs
          } else {
            if (dishs[i].fcolumnid == id)
              array.push(dishs[i])
          }
        } else if (id == "") {
          if (dishs[i].title == val || dishs[i].py.indexOf(val) != -1)
            array.push(dishs[i])
        } else {
          if (id == dishs[i].fcolumnid && (dishs[i].title == val || dishs[i].py.indexOf(val) != -1))
            array.push(dishs[i])
        }
      }
      this.cuisines = array
    },
    ldClick() { //落单    	      	
      	let that = this,
        	  wld = this.wld;
      	if (!wld.length) {
      		this.message('暂无未落单商品，请先点单', 'warning');
        	return
      	}
      	this.printArr = [];
      	for (let i = 0; i < wld.length; i++) {
        	this.printArr.push(wld[i].orderdetailid);
      	}
      	axios.post(localStorage.getItem('apiurl') + '/padinterface/ldOrderDetail?orderid=' + this.orderid + '&status=0').then(function(r){
      	  	if(r.data.code == 0) {
      	  		that.message('落单操作成功！','success');
          		that.billTypeIdx = 1;
          		that.billCuise = 'a';
          		that.billDishNum = 0;
          		that.printer(2);
          		axios.get(localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + localStorage.getItem('orderid') + "&type=0" +'&num=' + that.num)
          		.then((res) => {
            		if (res.data.code == 0) {
              			let data = res.data.data;
              			that.js = data.js;
              			that.ld = data.ld;
              			that.wld = data.wld;
              			if (that.billTypeIdx == 0) {
                			that.bills = data.wld
              			} else if (that.billTypeIdx == 1) {
                			that.bills = data.ld
              			} else if (that.billTypeIdx == 2) {
                			that.bills = data.js
              			}
              			if (that.isAcount == 'yes') {
                			that.isAcount = ''
                			that.$router.push({
                  				path: '/orderTable/pay'
                			})
              			}
            		}
         		})
      	  	}  
      })
    },
    printBill() {
        if(!this.ld.length) {
        	this.message('暂无落单商品，不能打印预结单','warning');
        	return
      	}
      	this.printer(1)
    },
    printer(type) {
        if(!this.callPrintState) {
	        this.callPrintState = true;
	        let that = this;
	        let data = {
	          orderid: localStorage.getItem('orderid'),
	          type: 'n',
	          isBefore: 1,
	        }
	        if (type == 2) {
	          data.orderdetailid = this.printArr;
	          data.isBefore = 0;
	        }
	        axios.post(localStorage.getItem('apiurl') + '/api/employee/doPrinter', data).then(function(res) {
	            that.callPrintState = false;
	            if(type == 1) {
		          	if(res.data.code == 4) {
		               that.message('打印预结单成功','success');
		            }else{
		               that.message(res.data.msg,'error');
		            }
	            }
	        })
    	}
    },
    _aut(res) {
      if (res == 'close') {
        this.getAut = false
      } else if (res == 'aut') {
        this.haveAut = true
        this.getAut = false
      }
    },
    //处理键盘输入
    _handleKeyPress(e) {
      let num = e.target.dataset.num;
      //不同按键处理逻辑
      // -1 代表无效按键，直接返回
      //undefined按到没有键的空隙了
      if (num == -1) return false;
      if (num == undefined) return false;
      switch (String(num)) {
        //小数点
        case '.':
          this._handleDecimalPoint();
          break;
          //删除键
        case 'D':
          this._handleDeleteKey();
          break;
          //清空键
        case 'C':
          this._handleClearKey();
          break;
          //确认键
        case 'S':
          this._handleConfirmKey();
          break;
        case '':
          break;
        default:
          this._handleNumberKey(num);
          break;
      }
      if (this.text && this.flag == 0) {
        this.money = this.money.slice(-1)
        this.value1 = this.money
        this.flag = 1
        this.text = ''
      } else {
        this.flag = 0
        if (this.value != '') {
          this.value1 = this.money
        }
      }
    },
    //处理小数点函数
    _handleDecimalPoint() {
      //如果包含小数点，直接返回
      if (this.inputType == 0) { //0表示文本输入梳理
        this.money += '.'
      } else if (this.inputType == 1) { //1表示输入金额，保留两个位小数
        if (this.money.indexOf('.') > -1) return false;
        //如果小数点是第一位，补0
        if (!this.money.length)
          this.money = '0.';
        //如果不是，添加一个小数点
        else
          this.money = this.money + '.';
      } else if (this.inputType == 2) { //2表示输入数字
        this.money += ''
      }

    },
    //处理删除键
    _handleDeleteKey() {
      let S = this.money;
      //如果没有输入，直接返回
      if (!S.length) return false;
      //否则删除最后一个
      this.money = S.substring(0, S.length - 1);
    },
    //处理清空键
    _handleClearKey() {
      this.money = '';

    },
    //处理数字
    _handleNumberKey(num) {
      let S = this.money;
      if (this.inputType == 0) { //0表示文本输入
        this.money = S + num
      } else if (this.inputType == 1) { //1表示输入金额，保留两个位小数
        //如果有小数点且小数点位数不小于2
        if (S.indexOf('.') > -1 && S.substring(S.indexOf('.') + 1).length < 2)
          this.money = S + num;
        //没有小数点
        if (!(S.indexOf('.') > -1)) {
          //如果第一位是0，只能输入小数点
          if (num == 0 && S.length == 0)
            this.money = '0.';
          else {
            if (S.length && Number(S.charAt(0)) === 0) return;
            this.money = S + num;
          }
        }
      } else if (this.inputType == 2) { //2表示输入数字 
        if (S.length == 0 || S == 0) {
          if (num == 0) {
            this.money = ''
          } else {
            this.money = S + num
          }
        } else {
          this.money = S + num
        }
      }
    },
    setWidth(l) {
      let that = this;
      let timer = setInterval(function() {
        if (that.competedState) {
          clearInterval(timer);
          var list = document.getElementById('tableList').children;
          var len = l.length;
          var width = 1 + 20 * len;
          for (var i = 0; i < len; i++) {
            width += list[i].offsetWidth;
          }
          document.getElementById('tableList').style.width = width + 'px';
        }
      }, 200)
    },
    pageClick() {
      //this.pageClickTimer=+new Date()  				   		   		
    }
  },
  watch: {
    value1() {
        this.backMoney = this.value1;
        if (this.value1 < 0) {
	        this.error = '数值不能为负数'
	        this.value1 = ''
	        return
        }else if(this.value1.toString().indexOf('00')==0){
        	this.value1 = 0
	        return
        }
        if(this.value == 1 || this.value == 2 || this.value == 3) {
	      	if(this.value1){
	      		if(this.value1 >= 0) {
		          this.value1 = Math.floor(Number(this.value1))
		        }
	      	}       
	        if(Number(this.value1) > Number(this.billDishNum)) {
		        if (this.value == 1) {
		          this.error = '赠送数量不能大于可赠数量'
		        } else if (this.value == 2) {
		          this.error = '取消赠送数量不能大于已赠数量'
		        } else if (this.value == 3) {
		            this.error = '退菜数量不能大于可退数量'
		        }
		        this.value1 = this.billDishNum
	        }
        }else if(this.value == 6) {
	        if(this.value1 > 100) {
	            this.error = '折扣不能大于100'
	            this.value1 = 100
	        }else {
	            this.discountPrice = String(Number(Number(this.value1) * Number(this.orignalprice) * 0.01).toFixed(2))
	        }
        }else if(this.value == 4) {
	      	if(this.value1){
	      		if (this.value1 >= 0) {
		          this.value1 = Math.floor(Number(this.value1));
		        }
	      	}      	       
	        if(this.value1.toString().length > 6) {
	            this.error = '最多输入6位数'
	            this.value1 = ''
	        }
        }else if(this.value == 5) {

	        var reg = /^\d+(\.\d{1,2})?$/;
	        if(!reg.test(this.value1) && this.value1) {
	            this.error = '价格只能保留两位小数'
	            this.value1 = Number(this.value1).toFixed(2);
	        }
	        if(Math.floor(this.value1).toString().length > 8) {
	            this.value1 = Number(this.value1.slice(0, 8)).toFixed(2)
	        }
        }
      // this.$refs['input'+this.value].focus()
    },
    bills() {
      let n = 0;
      for (var i = 0; i < this.bills.length; i++) {
        if (this.bills[i].ordertype == 5) {
          n += 0
        } else {
          n += Number(this.bills[i].orderprice) * Number(this.bills[i].dishnum)
        }
      }
      this.amount = Number(n).toFixed(2)
      localStorage.setItem('dueamount', Number(n).toFixed(2))
    },

  },
  beforeCreate() {
    Bus.$off();
    Bus.$on('pay', res => {
      this.isAcount = 'yes'
      this.acounts()
    })
  },
  mounted() {
    // this.pageClick()//进入页面计时，30秒没操作返回dinner页面
    // 	let timer = setInterval(()=>{
    // 		console.log(+new Date() - this.pageClickTimer)
    //   		if(+new Date() - this.pageClickTimer>=30000){ 
    //   			clearInterval(timer)    			
    //      		this.$router.push({
    //      			path:'dinner'
    //      		})
    // }
    //      },1000) 
    this.orderid = localStorage.getItem('orderid');
    this.authority = localStorage.getItem('authority') //权限判断 
    this.isChangeBill = localStorage.getItem('isChangeBill')
    this.orderTableArear = localStorage.getItem("tableArear")
    this.orderTableNum = localStorage.getItem("tableNum")

    let tableID = localStorage.getItem("tableID"),
    	that = this,
	    _type = localStorage.getItem('ordertype'),
	    orderUrl = localStorage.getItem('apiurl') + '/padinterface/oneOrder?id=' + this.orderid,
	    key,
	    hour = '',
	    min = '',
	    n = 0;
    localStorage.setItem('cuisineTypeId', '')
    localStorage.setItem('billTypeIdx', 'a')
    this.value = "9"
    if (_type == 0) {
      _type == '0'
    } else {
      _type == '1'
    }

    if(this.isChangeBill == 'no') {
    	this.type = 0;
      this.num = 1;
    }else if(this.isChangeBill == 'yes') {
    	this.type = 1;
      this.num = 0;
    }
    orderUrl = orderUrl + '&type=' + this.type +'&num=' + this.num;
    axios.get(orderUrl).then((res) => {
	  	if (res.data.code == 0) {
	    	that.competedState = true;
	    	let data = res.data.data;
	    	let _id = data.basicData[0].fcolumnid;
	    	this.cuisinesStore = data.food;
	    	this.cuisines = data.food;
	    	this.cuisineTypes = this.cuisineTypes.concat(data.basicData);
	    	if (this.isChangeBill == 'no') {
	      		this.js = data.js;
	      		this.ld = data.ld;
	      		this.wld = data.wld;
	      		this.bills = data.wld;
	      		//根据账单类型是否为空选择选中账单类型并显示相应账单
	      		if (!data.wld.length && data.ld.length) {
	        		this.billTypeIdx = 1;
	        		this.bills = data.ld;
	      		} else if (!data.wld.length && !data.ld.length && data.js.length) {
	        		this.billTypeIdx = 2;
	        		this.bills = data.js;
	      		} else {
	        		this.billTypeIdx = 0;
	        		this.bills = data.wld;
	      		}
	    	}else{
	    		let d =data.ld;
		        this.bills = d
		        this.ld = d
		        this.js = []
		        this.wld = []
		        this.billTypeIdx = 1;
	    	}
	    	this.time = data.order.begintime;
	    	if (data.order.userid.indexOf(localStorage.getItem('branchId')) != -1) {
	      		this.userid = localStorage.getItem('branchId');
	    	} else {
	      		this.userid = data.order.userid;
	    	}

	    	this.custnum = data.order.custnum;
	    	//初次载入不选中账单中商品
	    	this.billCuise = 'a';
	    	localStorage.setItem('cuisineTypeCho', 0);
	    	let n = 0;
	    	for (var i = 0; i < this.bills.length; i++) {
	      		if (this.bills[i].ordertype == 5) {
	        		n += 0;
	      		} else {
	        		n += Number(this.bills[i].orderprice) * Number(this.bills[i].dishnum);
	      		}
	    	}
	    	this.amount = Number(n).toFixed(2)
	    	that.setWidth(this.cuisineTypes);
	    	setDuration()
	    	setTimeout(() => {
	      		setDuration();
	    	}, 200)
	    	this.durationTimer = setInterval(() => {
	      		setDuration();
	    	}, 60000)

	    	function setDuration() { //当前桌台账单用时计时
	      		if (that.time != undefined && that.time != '' && that.time != 0) {
	        		let timer = (+new Date() - that.time) / 1000,
	          			hour = ('0' + Math.floor(timer / 3600)).slice(-2),
	         	 		min = ('0' + Math.floor(timer % 3600 / 60)).slice(-2);
	        		hour = hour == '-1' ? '00' : hour;
	        		min = timer % 3600 / 60 < 0 ? '00' : min;
	        		that.timeDuration = hour + '小时' + min + '分钟';
	      		} else {
	        		that.timeDuration = '--';
	      		}
	    	}   
	  	} else {
	    	this.billCuise = 'a';
	  	}
	})

    document.onkeydown = e => { //监听键盘按下，快捷键操作
      key = e.keyCode
      if (key == 115) {
        this.ldClick()
      } else if (key == 114) {
        this.printBill()
      } else if (key == 117) {
        this.acounts()
      } else if (key == 119) {
        this.openCashBox()
      }
    }

    document.onselect = () => { //input文字选中
      if (window.getSelection) {
        console.log(window.getSelection().toString())
        this.text = window.getSelection().toString()
      } else if (document.selection && document.selection.createRange) {
        this.text = document.selection.createRange().text;
      }
    }
  }
}

</script>
<style>
#orderTable {
  width: 100%;
  height: 100%;
}

#title {
  width: 100%;
  height: 0.6rem;
  display: flex;
  justify-content: space-between;
  background: url('../../static/images/bg_header.png') no-repeat center center;
  background-size: 100% 100%;
}

#title .title {
  color: white;
  font-size: 0.24rem;
  line-height: 0.6rem;
  margin-left: 0.3rem;
}

#title .close {
  width: 0.7rem;
  height: 0.6rem;
  background: url('../../static/images/ic_close.png') no-repeat center center;
}

.orderTable {
  height: calc(100% - .6rem);
  width: 100%;
  background: #f4f4f4;
  display: flex;
  padding: 0.2rem 0.3rem;
  box-sizing: border-box;
}

.orderTable>.left {
  height: 100%;
  width: 30%;
  max-width: 3rem;
  box-sizing: border-box;
}

.orderTable>.left .top {
  width: 100%;
  height: 1.5rem;
  background: white;
  display: flex;
}

.orderTable>.left .top .tableNum {
  width: 1.1rem;
  height: 1.5rem;
  text-align: center;
  position: relative;
}

.orderTable>.left .top .tableNum:after {
  position: absolute;
  right: 0;
  top: 40%;
  content: '';
  width: 1px;
  height: 30%;
  background-color: #f4f4f4;
}

.orderTable>.left .top .tableNum .arear {
  font-size: 0.18rem;
  color: #ff7e4b;
  margin-top: 0.5rem;
}

.orderTable>.left .top .tableNum .num {
  font-size: 0.23rem;
  color: #ff7e4b;
}

.orderTable>.left .top .tableIfo {
  width: 1.8rem;
  height: 1.5rem;
  box-sizing: border-box;
  padding-left: 0.2rem;
  font-size: 0.15rem;
  box-sizing: border-box;
  padding-top: 0.52rem;
}

.orderTable>.left .top .tableIfo li,
.orderTable .left .top .tableIfo li span {
  color: #666;
  font-size: .14rem;
}

.orderTable>.left .bottom {
  width: 100%;
  height: calc(100% - 1.6rem);
  background: #f4f4f4;
  margin-top: 0.1rem;
  box-sizing: border-box;
}

.orderTable>.left .bottom .billType {
  width: 100%;
  height: 0.4rem;
  display: flex;
  justify-content: space-around;
  font-size: 0.14rem;
  line-height: 0.4rem;
  background: white;
  /*margin-bottom: 2px;*/
  border-bottom: 1px solid #eee;
}

.orderTable>.left .bottom .billType li:hover {
  color: #ff7e4b;
  border-bottom: 2px solid #ff7e4b;
}

.orderTable>.left .bottom .billType .billTypeActive {
  color: #ff7e4b;
  border-bottom: 2px solid #ff7e4b
}

.orderTable>.left .bottom .cuisineIfo {
  width: 100%;
  height: 0.35rem;
  display: flex;
  justify-content: space-around;
  font-size: 0.12rem;
  line-height: 0.35rem;
  background: white;
  box-sizing: border-box;
  padding: 0 0.15rem;
}

.orderTable>.left .bottom .cuisineIfo li {
  color: #999;
  flex: 1;
  text-align: left;
}

.orderTable>.left .bottom .cuisineIfo li:last-child{
	text-align: right;
}

.orderTable>.left .bottom .cuisineIfo li.long {
  flex: 2;
  display: inline-block;
  box-sizing: border-box;
}

.orderTable>.left .bottom .cuisine {
  width: 100%;
  height: calc(100% - 1.14rem);
  background: white;
  overflow: auto;
}

.orderTable>.left .bottom .cuisine .billCuisineAct {
  background: #ffe5db;
}

.orderTable>.left .bottom .cuisine .cuisineDetail {
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 0.12rem;
  text-align: center;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  /*padding: 0 0.1rem;*/
}

.orderTable>.left .bottom .cuisine>li {
	padding: 0 0.15rem;
	box-sizing: border-box;
}

.orderTable>.left .bottom .cuisine .cuisineDetail li {
  /*height:0.42rem; */
  /*line-height: 0.42rem;*/
  text-align: left;
  flex: 1;
  padding: 0.13rem 0;
}

.orderTable>.left .bottom .cuisine .cuisineDetail li:last-child{
	text-align: right;
}

.orderTable>.left .bottom .cuisine .cuisineDetail li.long {
  flex: 2;
}

.orderTable>.left .bottom .cuisine span.mark {
  color: red;
}

.orderTable>.left .bottom .cuisine>li:hover {
  background: #ffe5db;
}

.orderTable>.left .bottom .count {
  width: 100%;
  height: 0.4rem;
  text-align: center;
  line-height: 0.4rem;
  background: #ff7e4b;
  font-size: 0.12rem;
  color: white;
}

.orderTable>.left .bottom .count span {
  font-size: 0.12rem;
  color: white;
}

.orderTable>.medium {
  height: 100%;
  width: 15%;
  min-width: 1.06rem;
  max-width: 1.4rem;
  padding: 0 0.2rem;
  /*box-sizing:border-box;*/
  border-radius: 5px;
}

.orderTable>.medium ul {
  height: 100%;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 0 0.12rem;
}

.orderTable>.medium li {
  width: 100%;
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  border-bottom: 1px solid #f4f4f4;
  line-height: 100%;
  font-size: 0.14rem;
  color: #999999;
  box-sizing: border-box;
}

.orderTable>.medium li.billHandle {
  color: black;
  font-weight: 600;
}

.orderTable>.medium .add {
  font-size: 0.3rem;
}

.orderTable>.medium .reduce {
  font-size: 0.4rem;
}

.orderTable>.right {
  position: relative;
  min-width: calc(100% - 4.4rem);
  width: 65%;
  height: 100%;
  box-sizing: border-box;
  /*	margin-left:0.2rem;*/
}

.orderTable>.right .typeList {
  background: white;
  width: 100%;
  padding: 0 0.1rem;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
}

.orderTable>.right .cuisineTypes {
  width: auto;
  height: 0.62rem;
  line-height: 0.62rem;

  /*display:flex;*/
  display: block;
  /*align-items: center;*/
 /* padding-right: 0.15rem;*/
}

.orderTable>.right .cuisineTypes li {
  display: inline-block;
  width: auto;
  height: 0.4rem;
  text-align: center;
  line-height: 0.4rem;
  margin-left: 0.2rem;
  padding: 0 0.2rem;
  font-size: 0.14rem;
  border: 1px solid #ededed;
  border-radius: 5px;
}

.orderTable>.right .cuisineTypes li:hover {
  border: 1px solid #ff7e4b;
  color: #ff7e4b;
}

.orderTable>.right .typeActive {
  background: #ff7e4b;
  color: white !important;
}

.orderTable>.right .cuisines {
  width: 100%;
  height: calc(100% - 2rem);
  box-sizing: border-box;
  margin-top: .2rem;
 /* padding-bottom: 0.1rem;*/
  display: flex;
  flex-wrap: wrap;
  /*overflow:hidden;*/
  overflow: auto;
  align-content: flex-start;
}

.orderTable>.right .cuisines .empty {
  background: #a0a0a0;
  /*display: block !important;*/
}

.orderTable>.right .cuisines>li {
  width: calc((100% - 5*(5px + 5px))/5);
  height: calc((100% - 5*(5px + 5px))/5);
  background: white;
  margin: 5px;
  margin-left: 0;
  margin-right: 10px;
  border-radius: 5px;
  min-height: 1.3rem;
  min-width: 1.5rem;
}

.orderTable>.right .cuisines>li .el-button {
  width: 100%;
  height: 100%;
  padding: 12px 0;
  border: none;
}

.orderTable>.right .cuisines>li ul {
  width: 100%;
  height: 100%;
  text-align: center;
}

.orderTable>.right .cuisines>li ul .name {
  margin-top: 0.35rem;
  margin-bottom: 0.05rem;
  font-size: 0.16rem;
  white-space: normal;
}

.orderTable>.right .cuisines>li ul .price {
  width: 100%;
  font-size: 0.2rem;
  color: #ff7e4b;
}

.orderTable>.right .search {
  width: 100%;
  height: 0.4rem;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}

.orderTable>.right .search div {
  width: 40%;
  height: 0.4rem;
  background: white;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  padding: 0 0.15rem 0 .1rem;
}

.orderTable>.right .search div input {
  border: none;
  width: 2.8rem;
  height: 0.4rem;
  margin-left: 0.1rem;
}

.orderTable>.right .search div span {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  background: red;
  background: url('../../static/images/ic_keyboard.png') no-repeat center center;
}

.orderTable>.right .page {
  display: flex;
  background: white;
  height: 0.42rem;
  border-radius: 5px;
}

.orderTable>.right .page li {
  width: 1rem;
  line-height: 0.42rem;
  text-align: center;
  font-size: 0.14rem;
}

.orderTable>.right .handle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.6rem;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
}

.orderTable>.right .handle li {
  width: 25%;
  text-align: center;
  height: 100%;
  line-height: 0.4rem;
}

.orderTable>.right .handle li .el-button {
  height: 0.6rem;
  width: 100%;
  white-space: inherit;
  border-radius: 0;
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
}

.orderTable>.right .handle li .el-button span{
	height: 100%;
  width: 100%;
  border-left: 1px solid #eee;
  display: block;
  /*line-height: .36rem;*/
  box-sizing: border-box;
  padding: 0.1rem 0;
	font-weight: 600;
}

.orderTable>.right .handle li:first-child .el-button span {
	border-left: 0;
}









/*订单菜品操作弹窗*/

.prodHandleWin {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.1);
}

.prodHandleWin .box {
  width: 5rem;
  height: 4.2rem;
  background: white;
  margin: auto;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 10px;
  padding: 0.3rem;
  display: flex;
}

.prodHandleWin i {
  color: red;
  font-style: normal;
}

.prodHandleWin .box div.left {
  height: 100%;
  width: 40%;
  box-sizing: border-box;
  position: relative;
  margin-right: 10%;
}

.prodHandleWin .box div.right {
  height: 100%;
  width: 50%;
  text-align: right;
  position: relative;
  /*	padding-right: 0.2rem;*/
}

.prodHandleWin .box div.right ._keboard {
  height: 60%;
  width: 100%;
}

.prodHandleWin .box div.left h5 {
  line-height: 0.2rem;
  font-size: 0.16rem;
  margin-bottom: 0.2rem;
}

.prodHandleWin .box div.left label {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.16rem;
  color: #999999;
  /*margin-bottom: 0.05rem;*/
}

.prodHandleWin .box div.left p {
  margin-top: 0.1rem;
}

.prodHandleWin .box div.left div {
  display: flex;
}

.prodHandleWin .box div.left input {
  width: 1.1rem;
  height: 0.3rem;
  border: 1px solid #ededed;
}

.prodHandleWin .box div.left textarea {
  width: 1.9rem;
  height: 0.8rem;
  border: 1px solid #ededed;
  padding: 0.1rem;
}

.prodHandleWin .box div.left div>span {
  display: inline-block;
  width: 0.4rem;
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  border: 1px solid #ededed;
}

.prodHandleWin .box div.left div>span.add {
  background: url(../../static/images/ic_add.png) no-repeat center center;
}

.prodHandleWin .box div.left div>span.reduce {
  background: url(../../static/images/ic_reduce.png) no-repeat center center;
}

.prodHandleWin .box div.left p,
.prodHandleWin .box div.left p span {
  font-size: 0.14rem;
  color: #ff7e4b;
}

.prodHandleWin .box div.left p.billTitle {
  font-size: .16rem;
  font-weight: 600;
  padding-bottom: .1rem;
}

.prodHandleWin .box div.right span {
  height: 0.2rem;
  width: 0.14rem;
  margin-bottom: 0.2rem;
  display: inline-block;
  background: url("../../static/images/ic_close.png") no-repeat center center;
}

.prodHandleWin .box div.right>div {
  width: 2.15rem;
  height: 2.55rem;
}

.prodHandleWin .box div.right button {
  width: 2.15rem;
  height: 0.4rem;
  border: 1px solid #ff7e4b;
  border-radius: 5px;
  background: white;
  font-size: 0.14rem;
  color: #ff7e4b;
  position: absolute;
  bottom: 0;
  right: 0;
}

.prodHandleWin .box div.left button {
  width: 2.15rem;
  height: 0.4rem;
  border: 1px solid #ff7e4b;
  border-radius: 5px;
  background: #ff7e4b;
  font-size: 0.14rem;
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
}










/*取消账单*/

.cancelBill {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(52, 52, 52, 0.5);
}

.cancelBill .box {
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

.cancelBill .box span {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin: 0.2rem 0;
  background: url('../../static/images/notice_2.png') no-repeat center center;
}

.cancelBill .box p {
  font-size: 0.16rem;
  margin-bottom: 0.2rem;
  padding: 0 0.3rem;
}

.cancelBill .box button {
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

.accountBill .box {
  width: 5.5rem;
}

.accountBill .box button:not(:first-child) {
  background: #fff;
  border: 1px solid #ddd;
  color: #333;
}











/*键盘样式*/

.keyboard {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.keyboard .key-row {
  display: flex;
  flex: 1;
  width: 100%;
  display: -webkit-flex;
  position: relative;
}

.keyboard .key-row::before {
  /* content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);*/
}

.keyboard .key-cell {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  -webkit-box-flex: 1;
  position: relative;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
  font-size: 0.18rem;
  color: #333333;
  margin: 2px;
}

.keyboard .key-cell::after {
  /* content: '';
        position: absolute;
        overflow: hidden;
        top: 0;
        right: 0;
        bottom: 0;
        height: 200%;
        border-right: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);*/
}

.keyboard .key-cell:nth-last-child(1)::after {
  /*  border-right: 0;*/
}

.keyboard .key-delete,
.keyboard .key-clear {
  position: absolute;
  height: 49%;
  width: 24%;
  background: #fff;
  z-index: 5;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0 0.1rem;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 0.18rem;
  color: #333333;
}

.keyboard .key-delete {
  top: 0;
  right: 0;
}

.keyboard .key-cell:hover,
.keyboard .key-delete:hover,
.keyboard .key-clear:hover {
  cursor: pointer;
  background-color: #eee;
}

</style>
