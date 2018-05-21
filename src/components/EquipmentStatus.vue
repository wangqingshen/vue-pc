<template>
  <div id="equipmentStatus">
    <!-- <h5 class="title">打印机</h5>
    <ul class="print">
    	<li><i></i><span>吧台<br/><em class="online">在线</em></span></li>
    	<li><i></i><span>库房<br/><em class="offline">离线</em></span></li>
    	<li><i></i><span>饮品<br/><em class="paper">缺纸</em></span></li>
    </ul> -->
    <h5 class="title">在线设备</h5>
    <ul class="mobile" v-if="facilityList.length">
        <li v-for="(item, index) in facilityList">
            <i></i>
            <span>{{item.num}}({{item.name}})<br/><em>{{item.time}}</em></span>
        </li>
    </ul>
    <ul class="nodata" v-if="!facilityList.length">
        {{noData}}
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'EquipmentStatus',
    data () {
        return {
            noData: '当前暂无在线的设备',
            printerList: [], //打印机设备数据
            facilityList: [], //移动设备数据
        }
    },
    methods: {
        // 获取移动设备
        getFacilityStatus() {
            let self = this;
            axios({
                method:"POST",
                url:localStorage.getItem('apiurl')+'/systemset/allFacilityStatus',
                xhrFields:{
                    withCredentials:true
                    }
                }
            ).then(res=>{
                var data = res.data.userlist;
                if(data.length) {
                    var t = res.data.currenttime;
                    for(var i in data) {
                        var obj = {};
                        obj.num = data[i].account;
                        obj.name = data[i].name;
                        var t1 = data[i].lastlogintime,
                            bt = (t - t1)/1000;
                        // var day = Math.floor(bt/1000/60/60/24); 
                        var hour = Math.floor(bt%86400/3600);
                        var minute = Math.floor(bt%86400%3600/60);
                        var str = '在线';
                        if(hour > 0) {
                            str += hour + '小时';
                        }else{
                            str += '0小时';
                        }
                        str += minute + '分';
                        obj.time = str;
                        self.facilityList.push(obj);
                    }
                }
            })
        }
    },

    created() {
        this.getFacilityStatus()
    }
}
</script>

<style>
    #equipmentStatus h5.title{
        font-size: 0.14rem;
        font-weight: bolder;
        color: #666;
        line-height: 0.2rem;
    }
    #equipmentStatus ul {
        clear: both;
        overflow: hidden;
        list-style: none;
    }
    #equipmentStatus ul.nodata {
        font-size: .13rem;
        padding: 0.2rem 0;
        color: #999;
    }
    #equipmentStatus ul.print {
        margin-bottom: 0.3rem;
    }
    #equipmentStatus ul li {
       /* width: 25%;*/
       width: 2.1rem;
        float: left;
    }
    #equipmentStatus ul li i {
        display: table-cell;
        width:0.6rem;
        height:0.6rem;  
    }
    #equipmentStatus ul li span{
        display: table-cell;
        vertical-align: middle;
        font-size: 0.14rem;
        font-weight: bolder;
        color: #666;
        line-height: 0.2rem;
    }
    #equipmentStatus ul li span em {
        font-style: normal;
        font-weight: 400;
        color: #999;
    }
    #equipmentStatus ul li span em.online {
        color: #69e6c4;
    }
    #equipmentStatus ul li span em.offline {
        color: #cccccc;
    }
    #equipmentStatus ul li span em.paper {
        color: #ff7e4b;
    }
    #equipmentStatus ul.print li i {
        background:url('../../static/images/ic-print.png') no-repeat center center;
    }
    #equipmentStatus ul.mobile li i {
        background:url('../../static/images/ic-mob.png') no-repeat center center;
    }
   /* #equipmentStatus ul li:nth-child(4n+1) {
        clear: left;
    }*/
</style>
