<template>
  <div id="aut">
      <div class="box">
        <h4>获取临时权限<span @click='close'></span></h4>
        <label>工号</label><input type="text" v-model="num" name="" placeholder="请输入工号" @focus='inputNum($event)' ref='input1' data-value=1 data-type=0><br/><i class="aut-msg">{{errorNum}}</i><br/>
        <label>密码</label><input type="password" v-model="pwd" name="" placeholder="请输入密码" @focus='inputPwd($event)' ref='input2' data-value=2 data-type=0><br/><i class="aut-msg">{{errorPwd}}</i><br/>
        <p class="explain">*临时权限仅针对本次有效</p>       
        <div class="btn-box">
          <button @click="confirm">确认</button>
          <button @click='close'>取消</button>
        </div>
        <div class='_keyboard'>
           <Keyboard :message="value" :input-type="inputType" :back-money='backMoney' @confirmEvent="_confirmEvent"/>
        </div>                
      </div>
           
  </div>
</template>

<script>
import axios from 'axios'
import Keyboard from '../public/Keyboard'
export default {
  name: 'Authority',
  props:['url'],
  components:{Keyboard},
  data(){
    return {
       num:'',
       pwd:'',
       errorNum:'',
       errorPwd:'',
       value:'',
       inputType:'',
       backMoney:'',
       _url:''
    }
  }, 
  methods:{
    close(){
      this.$emit('aut','close');
      this.num='';
      this.pwd='';
    },
    confirm(){
      let that = this;
      if(this.num=='') this.errorNum='请输入工号'
      if(this.pwd=='') this.errorPwd='请输入密码'
      if(this.num=='' || this.pwd==''){
        return
      }else{
        axios.post(this.GLOBAL.baseUrl+'/function/tempFunction',
          {
            "username":this.num,
            "password":this.pwd,
            "touser":localStorage.getItem('username'),
            "url":this.url
          }
        ).then((res)=>{
          this._url=this.url
          console.log(that._url)
          if(res.data.code==0){
            let arr;
            if(that._url=="/padinterface/canOrder"){
              arr=["/padinterface/canOrder","/padinterface/bookorderList?return"]
            }else if(that._url=="/account/toAccount?pay"){
              arr=["/padinterface/ldOrderDetail",'/chain-newspicyway/api/member/queryMemberInfo','/account/toAccount?pay']
            }else if(that._url=='/account/toAccount?returnPay'){
              arr=['/padinterface/ldOrderDetail','/padinterface/bookorderList?return','/padinterface/bookorderList?give','/padinterface/bookorderList?discount','/chain-newspicyway/api/member/queryMemberInfo','/account/free','/account/closeAccounts?credit']
            }else if(that._url=='/chain-newspicyway/memberManager/save'){
              arr=['/chain-newspicyway/api/member/queryMemberInfo','/chain-newspicyway/memberManager/save']
            }else if(that._url=='/api/employee/createMemberOrder'){
              arr=['/chain-newspicyway/api/member/queryMemberInfo','/api/employee/createMemberOrder']
            }else if(that._url=='/chain-newpicyway/deal'){
              arr=['/chain-newspicyway/api/member/queryMemberInfo','/chain-newpicyway/deal']
            }
            // else if(that._url=='/account/closeAccounts?credit'){
            //   arr=['/chain-newspicyway/api/member/queryMemberInfo','/account/closeAccounts?credit','/account/toAccount?pay']
            // }
            else{
              arr=[that._url]
            }
            console.log(arr)
            localStorage.setItem('authorityAllOnce',JSON.stringify(arr))//全部权限 
            this.$emit('aut','aut')           
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error',
              duration:2500
            }); 
            // this.$alert(res.data.msg, '',{
            //   confirmButtonText: '确定',
            //   showClose:true,
            //   confirmButtonClass:'confirmInput'
            // });
          }
        })
      }
    },
    inputNum(e){
      this.errorNum='';
      this.value=e.target.dataset.value;
      this.inputType=e.target.dataset.type;
      this.backMoney=e.target.value;
    },
    inputPwd(e){
      this.errorPwd='';
      this.value=e.target.dataset.value;
      this.inputType=e.target.dataset.type;
      this.backMoney=e.target.value;
    },
    _confirmEvent(res){
      if(this.value==1){      
        this.num=res;
        this.$refs['input1'].focus();  
      }else if(this.value==2){
        this.pwd=res;
        this.$refs['input2'].focus();            
      }
    }
  }
}
</script>

<style>
  #aut{
    width: 100%;
    height:100%;
    position: fixed;
    top:0;
    left: 0;
    z-index: 100;
    background: rgba(52,52,52,0.3);
    z-index: 999;
  }
  #aut .box{
    width: 5rem !important;
    height:3.5rem !important;  
    border-radius: 10px;  
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: white;
    box-sizing: border-box;
    padding: 0 0.2rem;
  }
  #aut .box h4{
    width:4.6rem;
    height:0.6rem;
    line-height: 0.6rem;
    margin-bottom: 0.3rem; 
    color: #333333;
    font-size:0.18rem;    
    display: flex;
    justify-content: space-between; 
    border-bottom: 1px solid rgba(215, 215, 215, 1);      
  }
  #aut .box h4 span{
    display: inline-block;
    width: 0.3rem;
    line-height: 0.2rem;
    background: url('../../../static/images/ic_close.png') no-repeat center center;
  }
  #aut .box label,#aut .box input{
   display: inline-block;
  }
  #aut .box label{   
    width: 0.5rem;
    height:0.4rem; 
    line-height: 0.4rem;
    font-size:0.14rem; 
  } 
  #aut .box input{   
    width: 1.8rem;
    height:0.4rem; 
    padding:0  0.1rem;
    margin-top: 0.1rem;
    line-height: 0.4rem;
    font-size:0.14rem; 
    border: 1px solid rgba(215, 215, 215, 1);
  }
  #aut .box p.explain{
    width: 2rem;
    margin-left: .48rem;
  }
  #aut .box .btn-box{
    width: 3.5rem;
    margin: 0.3rem auto;
    display: flex;
    justify-content: space-around;
  }
  #aut .box .btn-box button{
    width: 1.5rem;
    height: 0.4rem;
    border-radius: 5px;
    font-size: 0.14rem;
    background: white;
    border:1px solid rgba(215, 215, 215, 1); 
  }
  #aut .box .btn-box button:nth-child(1){
    background: #ff7e4b;
    color: white;
    font-size: 0.14rem;
    border: none;
  }
  i.aut-msg{
    display: inline-block;
    width: 2.2rem;
    text-align: left;
    color: red;
    font-style: normal;
  }
  #aut .box ._keyboard{
    width: 2rem;
    height:2rem;
    position: absolute;
    top: 0.7rem;
    right: 0.2rem;
  }
</style>
