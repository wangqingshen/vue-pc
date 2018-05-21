<template>
  <div id="prodClear">
    <div class="nav">
    <div class="btnBox"><button class="clear" @click="deleteDialog('')">批量移除</button><button class="add" @click="addNewProdClear">新增估清商品</button></div>
    </div>
    <div class="box"> 
        <div class="chooseAll">
            <input type="checkbox" name="" @click="delAll" ref="delCheck">
            <ul class="prodIfo">
            	<li>名称</li>
            	<li>编号</li>
            	<li>单位</li>
            	<!-- <li>系统库存</li> -->
            	<li>估清时间</li>
            	<li>操作</li>
            </ul>
        </div>
        <ul class="prods" v-show="!showLoading">
            <li v-if="prodCleareds.length" v-for="(prodCleared,index) in prodCleareds" :class="{dobule:index % 2 == 1}">
                <input type="checkbox" name="mychk" :value="prodCleared.dishid" v-model="delArr">
                <ul class="prod">
                    <li>{{prodCleared.title}}</li>
                    <li>{{prodCleared.dishno}}</li>
                    <li>{{prodCleared.unit}}</li>
                   <!--  <li>{{prodCleared.repertory}}</li> -->
                    <li>{{prodCleared.gqtime1}}</li>
                    <li @click="deleteDialog(prodCleared.dishid)">删除</li>
                </ul>
        	</li>
            <li v-if="!prodCleareds.length" class="nodata">
                暂无估清商品
            </li>
        </ul>
        <LoadInline v-show="showLoading"></LoadInline>
    </div>
    <!-- 新增估清商品弹窗 -->
    <div class="addClearProd" v-show="addClearProd">
        <div class="box"> 
            <div class="title"><h5>商品估清</h5><span @click="closeProdClear" ></span></div>
            <div class="searchBox"><div class="search"><input type="text" name="" placeholder="商品编号/名称"><button>查询</button></div>
            <!-- <div class="page"><button>上一页</button><button>下一页</button></div> -->
        </div>
            <div class="addProBox">
                <div class="addAll">
                    <input type="checkbox" name="" @click="addAll" ref="addCheck">
                    <ul class="addProdIfo">
                        <li>编号</li>
                        <li>名称</li>
                        <li>单价</li>
                        <li>单位</li>
                       <!--  <li>系统库存</li> -->
                    </ul>
                </div>
                <ul class="addProds">
                    <li v-for="(addProd,index) in addProds" :class="{dobule:index % 2 == 1}">
                        <input type="checkbox" name="index" :value="addProd.dishid" v-model="addArr">
                        <ul class="addProd">
                            <li>{{addProd.dishNo}}</li>
                            <li>{{addProd.title}}</li>
                            <li>{{addProd.price}}</li>
                            <li>{{addProd.unit}}</li>
                           <!--  <li>{{addProd.repertory}}</li> -->
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="btnBox"><button @click="add(1)">估清</button><button @click="add(2)">估清并继续</button><button @click="closeProdClear">取消</button></div>
        </div>
    </div>
        <!-- 确认删除弹窗-->
        <div class="delDialog" v-show="delDialog">
            <div class="box">
                <span class="tip-img"></span>
                <p>确认删除？</p>
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
  name: 'ProdClear',
  components:{Authority,LoadInline},
  data(){
    return {
        apiurl: localStorage.getItem('apiurl'),
        addClearProd:false,
        delDialog: false,
        delType: '', //one all
        wmInfo: {
            dishid: '', //需要操作的商品id
            label: '' //商品类别 0充足  1缺少
        },
        prodCleareds: [], //估清列表
        addProds: [], //未估清列表
        type1: 0,
        type2: 1,
        delArr: [],
        addArr: [],
        url: '',
        getAut:false,
        haveAut:false,
        showLoading: true
    }
  },

  mounted() {
    this.getAllwmFood(this.type1)
    this.getAllwmFood(this.type2)
  },
  methods:{
    addNewProdClear:function(){
        this.addClearProd=true
    },
    closeProdClear:function(){
        this.addClearProd=false
    },
    // 获取所有估清商品列表
    getAllwmFood: function(type) {
        this.showLoading = true;
        let that = this;
        axios({
          method:"POST",
          url:this.apiurl + '/systemset/getByType?type='+type,
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              //console.log(res)
               this.showLoading = false;
              let d = res.data.data;
              if(d.length) {
                type == this.type2 ? this.prodCleareds = d : this.addProds = d;
              }
        }).catch(function(error){
             that.showLoading = false;
        })
    },

    add (type) {
        let arr = [];
        let dishArr = [];
        var _this = this;
        this.addProds.forEach(function(item, i){
            var state = true;
            _this.addArr.forEach(function(d, j) {
                if(item.dishid == d) {
                    dishArr.push(d);
                    state = false;
                }
            })
            if(state) {
                arr.push(item);
            }
        })
        if(dishArr.length) {
            this.wmInfo.dishid = dishArr.join(',');
            this.addProds = arr;
            this.addArr = [];
            this.wmInfo.label = 1;
            this.updatewmFood(type);
        }else{
            this.message('还未勾选估清商品', 'error');
        }
        
    },

    del () {
        let arr = [];
        var _this = this;
        if(this.delType == 'all') {
            let dishArr = [];
            this.prodCleareds.forEach(function(item, i){
                var state = true;
                _this.delArr.forEach(function(d, j) {
                    if(item.dishid == d) {
                        dishArr.push(d);
                        state = false;
                    }
                })
                if(state) {
                    arr.push(item);
                }
            })
            this.wmInfo.dishid = dishArr.join(',');
            this.delArr = [];
        }else if(this.delType == 'one') {
            this.prodCleareds.forEach(function(item, i){
                if(item.dishid == _this.wmInfo.dishid) {

                }else{
                    arr.push(item);
                }
            })
            // this.delArr.splice(this.wmInfo.dishid,1);
        }
        this.prodCleareds = arr;
        this.wmInfo.label = 0;
        this.updatewmFood(3);
    },

    delAll (event) {
        var _this = this;
        if (!event.currentTarget.checked) {
          this.delArr = [];
        } else { //实现全选
          _this.delArr = [];
          _this.prodCleareds.forEach(function(item, i) {
            _this.delArr.push(item.dishid);
          });
        }
    },

    addAll (event) {
        var _this = this;
        if (!event.currentTarget.checked) {
          this.addArr = [];
        } else { //实现全选
          _this.addArr = [];
          _this.addProds.forEach(function(item, i) {
            _this.addArr.push(item.dishid);
          });
        }
    },

    deleteDialog (id) {
        if(id) {
            this.delType = 'one';
            this.wmInfo.dishid = id;
            this.delDialog = true;
        }else{
            this.delType = 'all';
            if(this.delArr.length) {
                this.delDialog = true;
            }else{
                this.message('还未勾选估清商品', 'error');
            }
        }
    },

    closeDelDialog () {
      this.delDialog = false;
    },

    updatewmFood: function(type) {
        axios({
          method:"POST",
          url:this.apiurl + '/systemset/updateDish',
          data: this.wmInfo,
          xhrFields:{
                withCredentials:true
              }
           }).then((res)=>{
              //console.log(res)
              let d = res.data.data;
              let msg = '';
              this.$refs['addCheck'].checked = false;
              if(type == 1) {
                this.addClearProd = false;
                msg = '添加成功';
              }else if (type==2) {
                msg = '添加成功，请继续';
            }else if(type == 3) {
                this.$refs['delCheck'].checked = false;
                this.delDialog = false;
                msg = '移除成功';
            }
            this.message(msg, 'success')
            this.getAllwmFood(this.type1)
            this.getAllwmFood(this.type2)
        })
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
    #prodClear{
        width: 100%;
        height: 100%;
        /*overflow: hidden;*/
    }
    #prodClear .btnBox{
        width: 100%;
        height:0.6rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        /*margin-bottom: 0.2rem;*/
    }
    #prodClear .btnBox .clear{
        display: block;
        width: 1rem;
        height: 0.4rem;
        border-radius: 5px;
        line-height: 0.4rem;
        text-align: center;
        background: #f4f4f4;
        color:#666666;
        font-size: 0.14rem;
    }
    #prodClear .btnBox .add{
        display: block;
        width: 1.2rem;
        height: 0.4rem;
        border: 1px solid #ededed;
        border-radius: 5px;
        line-height: 0.4rem;
        text-align: center;
        background: white;
        color:#666666;
        font-size: 0.14rem;

    }
    #prodClear .box{
        width: 99.5%;
        border:1px solid #f4f4f4;
    }
    #prodClear .box .chooseAll{
        width: 100%;
        height:0.3rem;
        line-height: 0.3rem;
        background: #f4f4f4;
        display: flex;
    }
    #prodClear .box .chooseAll .prodIfo{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .chooseAll .prodIfo li{
        flex: 1;
        height:0.3rem;
        line-height: 0.3rem;
        margin-left: 0.1rem;
        font-size: 0.14rem;
        color:#999999;
    }
    #prodClear .box .prods{
        width: 100%;
    }
   
    #prodClear .box .prods>li{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .prods li.nodata {
        display: block;
        height: auto;
        box-sizing: border-box;
        padding: .2rem;
        font-size: .14rem;
        color: #999;
        text-align: center;
    }
    #prodClear .box .prods .prod{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .prods .dobule{
        background: #fafafa;
    }
    #prodClear .box .prods .prod li{
        flex: 1;
        height:0.3rem;
        margin-left: 0.1rem;
        line-height: 0.3rem;
        font-size: 0.14rem;
        color:#999999;
    }
    #prodClear input[type="checkbox"]{
        display: inline-block;
        margin-top: 0.08rem;
        margin-left: 0.2rem;
    }
    #prodClear .addClearProd, #prodClear .delDialog{
        width: 100%;
        height: 100%;
        position: fixed;
        left:0;
        top:0;
        background: rgba(52,52,52,0.5);
    }
    #prodClear .addClearProd>.box{
        width: 7rem;
        height:5rem;
        background: white;      
        margin:auto; 
        position: absolute;
        left:0;
        top:0;
        bottom: 0;
        right:0; 
        border-radius: 10px;
        text-align: center;
        box-sizing: border-box;
        padding: 0 0.2rem;
    }
    #prodClear .addClearProd .box .title{
        width: 100%;
        height:0.6rem;
        display: flex;
        justify-content: space-between;
    }
    #prodClear .addClearProd .box .title h5{
        line-height:0.6rem;
        font-size: 0.14rem;
        color: #333333;
     }
    #prodClear .addClearProd .box .title span{
        cursor: pointer;
        display: block;
        height: 0.6rem;
        width: 0.14rem; 
        background: url('../../static/images/ic_close.png') no-repeat center center;
     }
    #prodClear .addClearProd .searchBox{
        width: 100%;
        height: 0.4rem;
        display: flex;
        justify-content: space-between;
    }
    #prodClear .addClearProd .searchBox div.search{
        width:3.1rem;
        height:0.4rem;
        text-align: left;   
    }
    #prodClear .addClearProd .searchBox div.page{
        width:1.6rem;
        height:0.4rem;
        border: 1px solid #f4f4f4; 
        border-radius: 5px;  
    }
    #prodClear .addClearProd .searchBox div.search input{
        box-sizing: border-box;
        width:2.14rem;
        height:0.4rem;
        border: 1px solid #f4f4f4; 
        border-radius: 5px;
        margin: 0 !important;  
        padding: 0 .1rem;  
    }
    #prodClear .addClearProd .searchBox div.search button{
        width:0.8rem;
        height:0.4rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color:white;
        background: #ff7e4b; 
        border: 1px solid #f4f4f4; 
        border-radius: 5px;
        margin-left: 0.1rem;     
    }
    #prodClear .addClearProd .searchBox div.page button{
        width:0.7rem;
        height:0.4rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        background: white; 
        border-radius: 5px;
        margin-left: 0.1rem;     
    }
    #prodClear .addClearProd .addProBox{
        width: 100%;
        height:3rem;
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 0.2rem;
    }

    #prodClear .box .addAll{
        width: 100%;
        height:0.3rem;
        line-height: 0.3rem;
        background: #f4f4f4;
        display: flex;
    }
    #prodClear .box .addAll .addProdIfo{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .addAll .addProdIfo li{
        flex: 1;
        height:0.3rem;
        line-height: 0.3rem;
        margin-left: 0.1rem;
        font-size: 0.14rem;
        color:#999999;
    }
    #prodClear .box .addProds{
        width: 100%;
        border: 1px solid #f4f4f4;
    }
    #prodClear .box .addProds>li{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .addProds .addProd{
        width: 100%;
        height:0.3rem;
        display: flex;
    }
    #prodClear .box .addProds .dobule{
        background: #fafafa;
    }
    #prodClear .box .addProds .addProd li{
        flex: 1;
        height:0.3rem;
        margin-left: 0.1rem;
        line-height: 0.3rem;
        font-size: 0.14rem;
        color:#999999;
    }
    #prodClear .nav {
        box-sizing: border-box;
        background-color: #f4f4f4;
        margin: -.2rem -.2rem .2rem;
        padding-bottom: .2rem;
    }
    #prodClear .btnBox{
        width: 100%;
        height:auto;
        padding: .1rem .2rem;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
    }
    #prodClear .btnBox button{
        width: 30%;
        height:0.4rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color: #ff7e4b;
        background: white; 
        border-radius: 5px;
       /* margin-left: 0.1rem; */
        border: 1px solid #ff7e4b;
    }
    #prodClear .btnBox button:nth-child(1){
        /*background: #ff7e4b;
        border:none;
        color: white;*/
        border-color: #ddd;
    }
    #prodClear .addClearProd .btnBox button:nth-child(1) {
        background: #ff7e4b;
        border:none;
        color: white;
    }
/*确认删除弹窗*/
  .delDialog .box{
    width: 4.1rem !important;
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
        font-size: 0;
        display: inline-block;
        height: 1rem;
        width: 1rem;
        margin: 0.2rem 0;
        background: url('../../static/images/notice_2.png') no-repeat center center;
    }
</style>