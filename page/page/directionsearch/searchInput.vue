<template>
    <div class="search_wrap">
        <div class="search">
            <input ref="Input" type="text" v-model="msg" @keyup="keyup" :class="{'blur':blur}" />
            <i v-show="clear">
                <img src="//gfs11.gomein.net.cn/T17jLjB5hT1RCvBVdK.png" @click="deleteMsg" />
            </i>
            <div class="search_icon" @click="search">搜索</div>
        </div>
        <div class="searchModel" v-if="modelShow">
            <model-list @add-event="addEvent"  @no-data="nodatalist" :listmsg="listmsg" :hboptions="HBoptions"></model-list>
        </div>
        <nodata v-show="nolist"></nodata>
    </div>
</template>

<script>
import modelList from "../../components/modelList";
import nodata from './nodata';

export default {
    data() {
        return {
            blur:false,
            clear:false,
            msg:'',
            modelShow:false,
            nolist:true,
            modellist:{},
            HBoptions:{
                url:root.INSTRUCTION_API_PATH+'marque'
            },
            listmsg:{
                name:''
            }
        }
    },
    mounted() {
        this.blur=true;
    },
    methods:{
        deleteMsg() {
            this.msg = '';
            this.clear = false;
            this.blur = true;
        },
        keyup() {
            if(event.keyCode == 13){
                this.search();
            }
            if(this.msg == ''){
                this.blur = true;
                this.clear = false;
            }else{
                this.blur = false;
                this.clear = true;
            }
        },
        addEvent(obj) {
            $(this.$refs.Input).blur();
            obj.blur&&obj['blur']();
        },
        nodatalist(str) {
            this.nolist = str;
            this.modelShow = !str;
        },
        search() {
            var _this = this;
            this.$refs.Input.blur();
            setTimeout(()=>{
                _this.listmsg.name = _this.msg;
                _this.clear = true;
                _this.modelShow = true;
            },300)
        }
    },
    components:{
        modelList,
        nodata
    }
}
</script>

<style lang="less" scoped>
@import '../../util/fs.less';
.search_wrap{
    overflow: hidden;
    height: 100%;
}
.search_icon{
    position: absolute;
    top: 0;
    height: 1.1rem;
    right: 0.37333rem;
    line-height: 1.1rem;
    font-size: 0.37333rem;
    color: #333;
}
.search{
    width: 100%;
    height: 0.96rem;
    background: #f3f5f7;
    padding-top: 0.24rem;
    position: relative;
    z-index: 999;
    input{
        width: 8.21333rem;
        height: 0.72rem;
        margin-left:0.37333rem; 
        display: block;
        background:#fff;
        margin-left:0.4rem;
        border-radius: 0.4rem;
        font-size: 0.37333rem;
        text-indent: 0.29333rem;
    }
    input.blur{
        background: #fff url(http://gfs13.gomein.net.cn/T1rzE_B4AT1RCvBVdK.png) no-repeat center center !important;
        background-size: 1.093rem 0.32rem !important;
    }
    i{
        position: absolute;
        top: 0.4rem;
        right: 1.5rem;
        width: 0.6rem;
        height: 0.6rem;
        img{
            width: 0.4rem;
            height: 0.4rem;
        }
    }
}
.searchModel{
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>


