<template>
    <el-container>
      <el-header height="70px">
      <div id="header">
        <div id="logo"><span></span><h5>酒吧收银</h5></div>
        <div id="handle">
          <ul>
            <li class="barName">{{userName}}<em>(</em>{{userNum}}<em>)</em></li>
            <li><el-button class="jiaoban" @click="goShift">交班</el-button></li>
            <li><el-button class="logout" @click="loginOut">注销</el-button></li>
          </ul>
        </div>
      </div>
    </el-header>
        <el-container>
          <el-aside width="100%">
          <div id="postNav">
            <ul>
             <!--  <li class="order" @click='clickOrder' :class="{ activeOrder: isO, active:isO}"><span></span><br/>点单</li>
              <li class="bill" @click='clickBill' :class="{ activeBill: isB, active:isB}"><span></span><br/>账单</li>
              <li class="member" @click='clickMember' :class="{ activeMmember: isM, active:isM}"><span></span><br/>会员</li> -->
              <li class="order" @click='clickOrder' :class="{ activeOrder: nav==0}">
                <router-link to="/dinner" ><span></span><br/>点单</router-link>
              </li>
              <li class="bill" @click='clickBill' :class="{ activeBill: nav==1}" v-if='authority=="yes"'>
                <router-link to="/dinner/bill" ><span></span><br/>账单</router-link>
              </li>
              <li class="bill" @click='clickBill' v-if='authority=="no"'>
                <a href='javascript:void(0)'><span></span><br/>账单</a>
              </li>
              <li class="member" @click='clickMember' :class="{ activeMmember: nav==2}" v-if='authority=="yes"'>
                <router-link to="/dinner/member"><span></span><br/>会员</router-link>
              </li>
              <li class="member" @click='clickMember' v-if='authority=="no"'>
                <a href='javascript:void(0)'><span></span><br/>会员</a>
              </li>
            </ul>

            <ul class=_more>
              <li class="more" @click='clickMore'><span></span><br/>更多</li>
            </ul>
          </div>
          <div id="table">
            <router-view></router-view>
          </div>
          </el-aside>         
        </el-container>
        <!-- 换台组件 -->
        <!-- <ChangeTable v-if="changeTable"/> --> 
        
        <!-- 注销弹窗 -->
        <div class="quitLogin" v-show="quitLogin">
          <div class="box">
            <span></span>
            <p>是否退出登录？</p>
            <div><button @click='confirmLoginOut'>确认</button><button @click="quiteLoginOut">放弃</button></div>
          </div>
      </div>
    </el-container>   
</template>

<script>
import axios from 'axios';
import ChangeTable from "../components/ChangeTable";
import Bus from '../bus.js';
export default {
  name: 'Dinner',
  data(){
    return{
      userName:"",
      userNum:"",
      isO:true,
      isB:false,
      isM:false,
      isMo:false,
      changeTable:false,
      quitLogin:false,
      nav:0,
      text:'',
      authority:'no'
    }
  },
  components:{ChangeTable},
  methods:{
    clickOrder(){
      this.nav = 0;
    },
    clickBill(){
      if(this.authority=='no'){
        this.message('无查看账单权限！');       
        return
      }else{
        this.nav=1;
      }      
    },
    clickMember(){
      if(this.authority=='no'){
        this.message('无会员操作权限！');       
        return
      }else{
        this.nav=2;
      } 
    },
    goShift(){
      this.nav='a'
      this.$router.push({
        path:"/dinner/shift"
      })
    },
    clickMore(){
      this.$router.push({
        path:"/more"
      })
    },
    loginOut(){
      this.quitLogin=true
    },
    confirmLoginOut(){      
      axios.get(localStorage.getItem('apiurl')+'/padinterface/logout').then((res)=>{//订单id 
        if(res.data.code==0){
          localStorage.removeItem("username");
          localStorage.removeItem("userid");
          localStorage.removeItem("user");
          this.message('注销成功！','success');        
          this.$router.push({
            path:'/'    
          })
        }else{
          this.message('注销失败，请重试！','warning');
          return
        }          
      })                    
    },
    quiteLoginOut(){
      this.quitLogin=false
    }
  },
  created(){   
    let that = this;
    this.userName=localStorage.getItem('name')
    this.userNum=localStorage.getItem('username')
    this.authority=localStorage.getItem('authority')
    Bus.$on('tableChange', (id)=> {
      that.changeTable=true
    })
    Bus.$on('closeChange', (id)=> {
      this.changeTable=false     
    })     
  }
}
</script>

<style>
  .el-container{
    height:100%;   
  }
  .el-header{
    background: url('../../static/images/bg_header.png') no-repeat center center;
    background-size: 100% 100%;
  }  
  .el-aside {
    display:flex;
    height:100%;
  }
  #header{
    display:flex;
    justify-content: space-between;
    width: 100%;
    height:.7rem;
  }
  #logo{
    height: .7rem;
    width: 2rem;    
    text-align: center;
    line-height: .7rem;
    display: flex;
  }
  #logo span{
    display: inline-block;
    height: .4rem;
    width: .4rem;
    border-radius: .2rem;
    background: url('../assets/logo_2.jpg');
    background-size: 100% 100%; 
    margin: .15rem .1rem .1rem 0;
  }
  #logo h5{
    font-size: .2rem;
    color: white; 
  }
  #handle{
    /*min-height:7.08rem;*/ 
  }
  #handle ul{
    width: 3.1rem;
    height: .7rem;  
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
  #handle ul li{
    height:0.7rem;
    color: white;
    line-height: 0.7rem;
    font-size: 0.15rem; 
  }
  #handle ul li>em {
    color: #fff;
    font-style: normal;
    margin: 0 5px;
  }
  #handle ul li .el-button {
    background: #2d2846;
    /*background-color: transparent;
    border: 0;*/
    font-size: .15rem;
  }
  #handle ul li .el-button span{
    color:white;
    cursor: pointer;
  }
  /*#handle ul li:hover {
    color: #ff7e4b;
  }*/
  #handle ul li a{
    color: white;
    font-size: .15rem; 
  }
  
  #postNav{
    height:100%;
    width:1.04rem;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    background: url('../../static/images/bg_nav.png') no-repeat center center;
    background-size: 100% 100%;
  }
  #postNav .router-link-exact-active{
    color:#ff7e4b;
  }
  #postNav ._more{
    width:1.04rem;
    height:1.04rem;
    border-top: 1px solid #39213f;
  }
  #postNav li{
    cursor: pointer;
    display:block;
    width:1.04rem;
    height:1.04rem;
    color:white;
    text-align:center;
    font-size: 0.16rem;
    border-bottom: 1px solid #39213f;
  }
  #postNav li a{
    display: block;
    width: 100%;
    height: 100%;
    color:white;
  }
  #postNav .more{
    position:absolute;
  }
  #postNav li span{
    display:inline-block;
    width:.41rem;
    height:.41rem;
    margin-top:.18rem;
    cursor: pointer;
  }
  #postNav  .order span{
    background: url("../../static/images/ic_order.png") no-repeat center center;
  }
  #postNav  .bill span{
    background: url("../../static/images/ic_bill.png") no-repeat center center;
  }
  #postNav  .member span{
    background: url("../../static/images/ic_vip.png") no-repeat center center;
  }
  #postNav  .more span{
    background: url("../../static/images/ic_more.png") no-repeat center center;
  }
  .active {
    color:#ff7e4b !important;
  }
  li.order .router-link-exact-active span{  
    background: url("../../static/images/ic_order_sel.png") no-repeat center center !important; 
  }
  li.bill .router-link-exact-active span{  
    background: url("../../static/images/ic_bill_sel.png") no-repeat center center !important; 
  }
  li.member .router-link-exact-active span{  
    background: url("../../static/images/ic_vip_sel.png") no-repeat center center !important; 
  }
  li._more .router-link-exact-active span{  
    background: url("../../static/images/ic_more_sel.png") no-repeat center center !important; 
  }
  #table{
    width:100%;
    height:100%;
    position: relative;
    overflow: hidden;
  }
  /*注销弹窗*/
  .quitLogin{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top:0;
    background:  rgba(52,52,52,0.5);
    z-index: 999;
  }
  .quitLogin .box{
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
  .quitLogin .box span{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin: 0.2rem 0;
    background: url('../../static/images/notice_2.png') no-repeat  center center;
  }
  .quitLogin .box p{
    font-size: 0.18rem; 
    margin-bottom: 0.2rem;
  }
  .quitLogin .box button{
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
</style>