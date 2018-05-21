<template>
    <div id="printSet">
      <div class="nav">
      	<ul>
          <li v-for="(item, index) of list" :class="{active:selected==index}" @click="change(index)">{{item.title}}</li>
      	</ul>
      	<button @click="openDialog(1, '')">添加后厨打印机</button>
      </div>
    	<div class="printList"  v-show="selected==0">
    		<ul class="printListHead">
    			<li>名称</li>
    			<li>IP地址</li>
    			<li>打印范围</li>
    			<li>打印份数</li>
    			<li>操作</li>
    		</ul>
          <ul v-if="ahasData && !showLoading" v-for="(item, index) in alist" :class="{odd:index % 2 == 1}">
            <li>{{item.printername}}</li>
            <li>{{item.ipaddress}}</li>
            <li>
              <span v-if="item.areaname" v-for="(area, index) in item.areaname">
                {{area.itemdesc}}
              </span>
              <span v-else>无</span>
            </li>
            <li>{{item.printNum}}</li>
            <li><button @click="openDialog(2,item)">修改</button><button @click="printTestEvt(item.ipaddress)">打印测试</button><button @click="delDialog(item.printerid)">删除</button></li>
          </ul>
          <ul v-if="!ahasData && !showLoading" class="noData">
            暂无数据
          </ul>
        
        <LoadInline v-show="showLoading"></LoadInline>
    	</div>
      <!-- 前台打印机 -->
    	<div class="frontList" v-show="selected==1">
          <el-form ref="form" :model="form2">
          	<el-form-item label="打印机类型">
            <el-radio-group v-model="form2.printertype" @change="changeHandler">
              <el-radio v-for="(item, index) in printerTypeList" :label="item.id" :key=index>{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打印机IP" class="ip" v-if="handlerStatus">
              <div>
                <el-input v-model="fip.ip1" style="width: 1rem;"></el-input>.
                <el-input v-model="fip.ip2" style="width: 1rem;"></el-input>.
                <el-input v-model="fip.ip3" style="width: 1rem;"></el-input>.
                <el-input v-model="fip.ip4" style="width: 1rem;"></el-input>
              </div>
            </el-form-item>
          <el-form-item label="打印机品牌" v-if="handlerStatus">
            <el-select v-model="form2.port" style="width: 4.2rem;">
              <el-option v-for="(item, index) in brandList" :label="item" :value="item" :key=index></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打印机列表" v-if="!handlerStatus">
            <el-select v-model="form2.port" style="width: 4.2rem;">
              <el-option v-for="(item, index) in printDriver" :label="item" :value="item" :key=index></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打印纸尺寸(mm)">
            <el-radio-group v-model="form2.size">
              <el-radio v-for="(item, index) in sizeList" :label="item" :value="item" :key=index></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打印份数">
            <el-input v-model="form2.printNum" style="width: 4.2rem;" type="number"></el-input>
          </el-form-item>
          <el-form-item label="打印范围">
            <el-checkbox-group v-model="area2">
              <el-checkbox v-for="(item, index) in areaList" :label="item.itemid" name="areaname[]" :key=index>{{item.itemdesc}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkForm(2)">保存</el-button>
            <el-button @click="checkTest(2)">打印测试</el-button>
          </el-form-item>
        </el-form>
    	</div>
      <!-- 添加后厨打印机 -->
      <div class="addPrinterDialog" v-show="printDialog">       
          <el-form ref="form" :model="form1">
            <div><h5>{{dialogTitle}}</h5><span @click="close"></span></div>
            <el-form-item label="名称">
              <el-input v-model="form1.printername" placeholder="备注作用，非必填"></el-input>
            </el-form-item>
            <el-form-item label="打印机IP" class="ip">
              <div>
                <el-input v-model="aip.ip1"></el-input>.
                <el-input v-model="aip.ip2"></el-input>.
                <el-input v-model="aip.ip3"></el-input>.
                <el-input v-model="aip.ip4"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="打印机品牌">
              <el-select v-model="form1.port">
                <el-option v-for="(item, index) in brandList" :label="item" :value="item" :key=index></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="打印纸尺寸(mm)">
              <el-select v-model="form1.size">
                <el-option v-for="(item, index) in sizeList" :label="item" :value="item" :key=index></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="打印份数">
              <el-input v-model="form1.printNum" type="number"></el-input>
            </el-form-item>
            <el-form-item label="切线方式">
              <el-select v-model="form1.cut">
                <el-option v-for="(item, index) in paperList" :label="item" :value="item" :key=index></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="打印范围">
              <el-checkbox-group v-model="area1">
                <el-checkbox v-for="(item, index) in areaList" :label="item.itemid" name="areaname[]" :key=index>{{item.itemdesc}}</el-checkbox>
              </el-checkbox-group>      
            </el-form-item>
            <div class="btnBox">
              <el-button @click="checkForm(1)">确认</el-button>
              <el-button @click="checkTest(1)">打印测试</el-button>
              <el-button @click="close">取消</el-button>
            </div>            
        </el-form>
      </div>
      <!-- 确认删除弹窗-->
      <div class="delDialog" v-show="deleteDialog">
        <div class="box">
          <span class="tip-img"></span>
          <p>确认删除此条打印机信息？</p>
          <div><button @click="del">确认</button><button @click="closeDelDialog">放弃</button></div>
        </div>        
      </div>
      <!-- 获取临时权限弹窗 -->
      <Authority @aut='_aut' :url='url' v-show='getAut'/>
    </div>
</template>

<script>
import axios from 'axios'
import Global from '../components/public/Global'
import Authority from '../components/public/Authority'
import LoadInline from '../components/public/LoadInline'
export default {
  name: 'PrintSet',
  components:{Authority, LoadInline},
  data() {
      return {
        apiurl: localStorage.getItem('apiurl'),
        selected: 0,
        printDialog: false,
        deleteDialog: false,
        dialogTitle: '',
        fip: {ip1: '192', ip2: '168', ip3: '', ip4: ''},
        aip: {ip1: '', ip2: '', ip3: '', ip4: ''},
        fprintertype: 4, //前台打印机类型
        aprintertype: 1, //后台打印机类型
        form1: {
          printername:'',  //打印机名称
          ipaddress:'', //打印机IP
          port: '', //打印机品牌
          size: '',
          printertype: '', //打印机类型
          areaname: '', //打印范围
          printerid: '', //打印机id
          printNum: '', //打印份数
        },
        form2: {
          printername:'',  
          ipaddress:'', 
          port: '', 
          printertype: '',
          areaname: '', 
          printerid: '',
          size: '',
          cut: '', //切纸方式
          printNum: '',
        },
        area1: [],
        area2: [],
        printerid: '',
        list: [{title:'后厨打印机'},{title:'前台打印机(本机)'}],
        klist: [],
        alist: [],
        ahasData: false, //后厨列表默认无数据
        brandList: ['佳博', '爱普生', '新北洋', '芯烨', '其它'], //打印机品牌列表
        sizeList: ['80', '58'],  //打印机尺寸列表
        paperList: ['整单', '按商品分类', '按商品', '按商品单个数量'], //切纸方式
        printerTypeList: [{id:'41', name: '网口'}, {id: '42', name: '串口(驱动)'}], //打印方式
        printDriver: [],
        dirverType: '',
        areaList: [],
        getAut:false,
        url: '',
        haveAut:false,
        callPrintState: false,
        showLoading: true,
        handlerStatus: true
      }
    },

    mounted() { 
      this.getKPrinter();
      this.getFPrinter();
      this.getDishType();
      this.getAllPrintDriver();
    },

    methods: {
      concatIP (state) {
        if(state == 1) {
          this.form1.ipaddress = this.aip.ip1+'.'+this.aip.ip2+'.'+this.aip.ip3+'.'+this.aip.ip4;
        }else if(state == 2) {
          this.form2.ipaddress = this.fip.ip1+'.'+this.fip.ip2+'.'+this.fip.ip3+'.'+this.fip.ip4;
        }
        
      },

      splitIP (state) {
        let str = '',
          arr = [];
        if(state == 1) {
          str = this.form1.ipaddress;
          arr = str.split('.');
          this.aip.ip1 = arr[0];
          this.aip.ip2 = arr[1];
          this.aip.ip3 = arr[2];
          this.aip.ip4 = arr[3];
        }else if(state == 2) {
          str = this.form2.ipaddress;
          arr = str.split('.');
          this.fip.ip1 = arr[0];
          this.fip.ip2 = arr[1];
          this.fip.ip3 = arr[2];
          this.fip.ip4 = arr[3];
        }
      },

      changeHandler(value) {
        if(value == '41') {
          this.handlerStatus = true;
        }else if(value == '42') {
          this.handlerStatus = false;
        }
      },

      setAreaArr (state) {
        let str = '',
          arr = [];
        if(state == 1) {
          str = this.form1.areaname;
          arr = str.split(',');
          this.area1 = arr;
        }else if(state == 2) {
          str = this.form2.areaname;
          arr = str.split(',');
          this.area2 = arr;
        }
      },

      concatArea (state) {
        if(state == 1) {
          this.form1.areaname = this.area1.join(',');
        }else if(state == 2) {
          this.form2.areaname = this.area2.join(',');
        }
      },

      change(index) {
       this.selected = index; 
       if(index == 1) {
          if (this.klist && this.klist.ipaddress) {
            // let areaname = this.klist.areaname,
            //   arr = [];
            // for(var i in areaname) {
            //   arr.push(areaname[i].itemid);
            // }
            this.form2 = this.klist;
            // this.area2 = arr;
            this.splitIP(2);
            this.setAreaArr(2);
          } else {
            this.form2 = {
              printername:'', 
              ipaddress:'', 
              port: '',
              printertype: '',
              areaname: [], 
              printerid: '', 
              size: '',
              cut: '',
              printNum: '',
            };
            this.fip = {ip1: '192', ip2: '168', ip3: '', ip4: ''};
            this.area2 = [];
          }
       }
      },

      printTestEvt (printIp) {
        if(!this.callPrintState) {
          this.callPrintState = true;
          let self = this;
          let data = {
            orderid: 'aaaaaaaa',
            type: 'n',
            isBefore: 1,
            printIp: printIp
          }
          axios.post(localStorage.getItem('apiurl') + '/api/employee/doPrinter', data).then(function(res){
            self.callPrintState = false;
            if(res.data.code == 4) {
              self.message('打印测试成功', 'success');
            }else{
              self.message(res.data.msg, 'error');
            }
          }).catch(function(res){
            self.message('网络错误，请稍后重试', 'error');
          })
        }
        
      },
      checkForm (state) {
        this.concatIP(state);
        this.concatArea(state);
        var d = {};
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if(state == 1) {
          d = this.form1;
          if(!reg.test(d.ipaddress)){
            this.message('打印测试的IP格式错误', 'error');
            return false;
          }
          if(!d.port) {
            this.message('请选择打印机品牌', 'error');
            return false;
          }
        }else if(state == 2) {
          d = this.form2;
          if(!d.printertype) {
            this.message('请勾选打印类型', 'error');
            return false;
          }
          if(!this.handlerStatus) {
            d.ipaddress = this.dirverType;
            if(!d.ipaddress) {
              this.message('请选择打印列表中内容', 'error');
              return false;
            }
            d.port = this.dirverType;
          }else{
            if(!reg.test(d.ipaddress)){
              this.message('打印测试的IP格式错误', 'error');
              return false;
            }
            if(!d.port) {
              this.message('请选择打印机品牌', 'error');
              return false;
            }
          }
        }
        
        
        if(!d.size) {
          this.message('请选择打印纸尺寸', 'error');
          return false;
        }
        if(!d.printNum) {
          this.message('请填写打印份数', 'error');
          return false;
        }
        let reg1 = /^[1-9]\d*$/;
        if(!reg1.test(d.printNum)) {
          this.message('打印份数必须是正整数', 'error');
          return false;
        }
        if(!d.cut && state == 1) {
          this.message('请选择切纸方式', 'error');
          return false;
        }
        if(!d.areaname.length) {
          this.message('请勾选打印范围', 'error');
          return false;
        }
        this.saveoredit(d,state);
      },

      checkTest (state) {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        let ip = '';
        this.concatIP(state);
        if(state == 1) {
          ip = this.form1.ipaddress;
          if(!reg.test(ip)) {
            this.message('打印测试的IP格式错误', 'error');
            return false;
          }
        }else if(state == 2) {
          if(this.handlerStatus) {
            ip = this.form2.ipaddress;
            if(!reg.test(ip)) {
              this.message('打印测试的IP格式错误', 'error');
              return false;
            }
          }else{
            ip = this.dirverType;
            if(ip) {
              this.message('请选择打印列表中内容', 'error');
              return false;
            }
          }
        }
       
        this.printTestEvt(ip);
      },

      delDialog (id) {
        this.deleteDialog = true;
        this.printerid = id;
      },

      closeDelDialog () {
        this.deleteDialog = false;
      },

      saveoredit (d,state) {
        axios({
          method:"POST",
          url: this.apiurl + '/systemset/save',
          data: d,
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              if(res.data.code == 1) {
                if(state == 1) {
                  this.printDialog = false;
                  this.getKPrinter();
                }else{
                  this.getFPrinter();
                }
                this.message(res.data.maessge, 'success');
              } else{
                this.message(res.data.maessge, 'error');
              }
            })
      },

      getAllPrintDriver () {
        axios({
          method:"POST",
          url: this.apiurl + '/api/employee/getAllPrintDriver',
          xhrFields:{
                withCredentials:true
          }
          }).then((res)=>{
              if(res.data.code == 0) {
                this.printDriver = res.data.data;
              }
          })
      },
      
      //获取后厨打印机列表
      getKPrinter () { 
        this.showLoading = true;
        let that = this;
        axios({
          method:"POST",
          url: this.apiurl + '/systemset/find',
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              this.showLoading = false;
              if(res.data.code == 0) {
                if(res.data.data.length) {
                  var d = res.data.data;
                  this.ahasData = true;
                  this.alist = d;
                }else{
                  this.ahasData = false;
                }
              }else {
                this.ahasData = false;
              }
            }).catch(function(error){
              that.showLoading = false;
            })
      },

      getFPrinter () {
        axios({
          method:"POST",
          url:this.apiurl + '/systemset/findOne',
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              // console.log(res)
              var d = res.data.data;
              if(d) {
                this.klist = d;
                this.form2 = d;
                if(d.printertype == '41'){
                  this.handlerStatus = true
                }else if(d.printertype == '42') {
                  this.handlerStatus = false;
                  this.dirverType = d.ipaddress;
                }
              }
            })
      },

      del () {
          axios({
          method:"get",
          url: this.apiurl + '/systemset/del?id='+this.printerid,
          data: '',
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              // console.log(res)
              if(res.data.code == 0 && res.data.msg == '请求成功') {
                this.message('删除成功', 'success');
                this.deleteDialog = false;
                this.getKPrinter();
              }else{
                this.message(res.data.msg, 'error');
              }
              
            })
      },

      getDishType () {
        axios({
          method:"POST",
          url:this.apiurl + '/systemset/dishtype',
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              // console.log(res)
              var data = res.data.data;
              this.areaList = data;
            })
      },

      openDialog:function(state, item){
        this.printDialog=true;
        if(state == 1) {
          //添加
          this.dialogTitle = '添加后厨打印机';
          this.form1 = {
            printername:'', 
            ipaddress:'', 
            port: '',
            size: '',
            printertype: '',
            areaname: [], 
            printerid: '', 
            printNum: '',
          };
          this.aip = {ip1: '192', ip2: '168', ip3: '', ip4: ''};
          this.area1 = [];
        }else if(state == 2) {
          //修改
          this.dialogTitle = '修改后厨打印机';
          // this.setAreaArr(1);
          let areaname = item.areaname,
            arr = [];
          for(var i in areaname) {
            arr.push(areaname[i].itemid);
          }
          this.form1 = item;
          this.area1 = arr;
          this.splitIP(1);
        }
        this.form1.printertype = this.aprintertype;
      },

      close:function(){
        this.printDialog=false;
      },
      _aut(res){  
        if(res=='close'){
            this.getAut=false
        }else if(res=='aut'){
            this.haveAut = true
            this.getAut=false
        }
      }
    }
}
</script>

<style>
#printSet .nav {
  clear: both;
  overflow: hidden;
  box-sizing: border-box;
  margin: -0.1rem -0.2rem 0.2rem;
  padding-bottom: 0.1rem;
  border-bottom: 1px solid #f4f4f4;
}

#printSet .nav ul {
  float: left;
  clear: both;
  overflow: hidden;
  padding-left: 0.2rem;
}

#printSet .nav ul li {
  float: left;
  margin-right: 0.2rem;
}

#printSet .nav button {
  float: right;
  margin-right: 0.2rem;
}

#printSet .nav ul li, #printSet .nav button {
  font-size: 0.14rem;
  text-align: center;
  line-height: 0.2rem;
  padding: 0.1rem 0.15rem;
  background: none;
  border: 1px solid #f4f4f4;
  border-radius: 0.05rem;
  cursor: pointer; 
}

#printSet .nav ul li.active {
  background-color: #ff7e4b;
  color: white !important;
  border-color: none;
}

#printSet .nav ul li:not(.active):hover, #printSet .nav button:hover{
  color: #ff7e4b;
  border-color: #ff7e4b;
}

#printSet .printList {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    border: 1px solid #f4f4f4;
}
#printSet .printList ul {
  display: block;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 0.2rem;
}

#printSet .printList ul.noData {
  padding: .2rem;
  font-size: .14rem;
  text-align: center;
  color: #999;
}

#printSet .printList ul li {
  width: 15%;
  height: 100%;
  font-size: .14rem;
  float: left;
  color: #999;
  line-height: 0.3rem;
}
#printSet .printList ul li:nth-child(2) {
  width: 20%;
}
#printSet .printList ul li:nth-child(4) {
  text-align: center;
}
#printSet .printList ul li:last-child {
  text-align: center;
  width: 35%;
}

#printSet .printList ul li span {
  color: #999;
}

#printSet .printList ul li button {
  cursor: pointer;
  background: none;
  font-size: 0.12rem;
  color: #999;
  margin-right: 0.15rem;
}

#printSet .printList ul li button:hover {
  color: #000;
  text-decoration: underline;
}

#printSet .printList ul.printListHead {
  background-color: rgb(244,244,244);
}

#printSet .printList ul.odd {
  background-color: rgb(250,250,250);
}
.el-button--primary {
  background-color: #ff7e4b;
  border-color: #ff7e4b;
}

.el-button--primary>span {
  color: #fff;
}

.el-radio__input.is-checked .el-radio__inner , .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #ff7e4b;
  border-color: #ff7e4b;
}

.el-radio__input.is-checked+.el-radio__label, .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #ff7e4b;
}

.el-radio__input .el-radio__inner:hover , .el-checkbox__input .el-checkbox__inner:hover {
  border-color: #ff7e4b;
}

label.el-form-item__label {
  display: block;
  float: none;
  text-align: left;
}
.addPrinterDialog, .delDialog{
  width: 100%;
  height: 100%;
  position: fixed;
  left:0;
  top:0;
  background: rgba(52,52,52,0.5);
  z-index: 2;
}
.addPrinterDialog form{
  width: 6.5rem;
  height:6rem;
  background: white;    
  margin:auto; 
  position: absolute;
  left:0;
  top:0;
  bottom: 0;
  right:0; 
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
}
.addPrinterDialog .el-form .el-input{
  width: 3rem;
}
.addPrinterDialog form .ip div{
  width: 3rem;
  display: flex;
  text-align: bottom;
}
.addPrinterDialog form .ip div .el-input{
  flex: 1;
}
.addPrinterDialog form>div:nth-child(1){
  width:100%;
  height: 0.2rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}
.addPrinterDialog form>div:nth-child(1) h5{
  font-size: 0.14rem;
  line-height: 0.2rem; 
}
.addPrinterDialog form>div:nth-child(1) span{
  cursor: pointer;
  display: block;
  width: 0.14rem;
  height: 0.2rem;
  background: url('../../static/images/ic_close.png') no-repeat center center; 

}
.addPrinterDialog .el-form .el-form-item__label{
  display: block;
  height: 0.18rem;
  line-height: 0.18rem;
  font-size: 0.14rem;
  color: #999999; 
}
.addPrinterDialog .el-form .el-input{
  margin-top: 0.02rem;
}
.el-form-item{
  margin-bottom: 0.1rem !important;
}
.addPrinterDialog .el-form .el-form-item{
  margin-top: 0 !important; 
  
}
.addPrinterDialog .el-form .checkbox-group{
  display: flex;
  justify-content: space-between;
}
.addPrinterDialog .el-form .btnBox{
  width: 80%;
  display: flex;
  justify-content: space-around;
}
.addPrinterDialog .el-form .btnBox .el-button{
  flex: 1;
  border:1px solid #ff7e4b;  
}
.addPrinterDialog .el-form .btnBox .el-button:nth-child(1){
  border:none;
  background: #ff7e4b;
}
.addPrinterDialog .el-form .btnBox .el-button span{
  color:#ff7e4b;
}
.addPrinterDialog .el-form .btnBox .el-button:nth-child(1) span{
  color:white;
}
/*确认删除弹窗*/
  .delDialog .box{
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
  .delDialog .box span{
    display: inline-block;
    height: 1rem;
    margin: 0.2rem 0;
  }
  .delDialog .box p{
    font-size: 0.16rem; 
    margin-bottom: 0.2rem;
    /*padding: 0.8rem 0;*/
  }
  .delDialog .box button{
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
  .tip-img {
    display: inline-block;
    height: 1rem;
    width: 1rem;
    margin: 0.2rem 0;
    background: url('../../static/images/notice_2.png') no-repeat center center;
  }
</style>