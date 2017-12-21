<template>
    <div class='tvtab'>
        <h2 class="tvtab-header bdr-bottom" @click='tabShow=!tabShow'>电视安装<i :class='{"icon-arrow-t":tabShow,"icon-arrow-r":!tabShow}' class='icon '></i><span :class='{"on":installText!="请选择"}'>{{installText}}</span> </h2>
        <div v-show='tabShow'>
            <ul class="tvtab-content">
                <li class="tvtab-first" v-for='(item,index) in installMethods'>
                    <h2 :class='{"on":firstOnIndex==index,"bdr-bottom":index!=installMethods.length-1}' @click='setInstallMethods(item,item.id)'>{{item.method}} <i v-if='item.children.length'></i></h2> 
                    <ul class="tvtab-second clearfix">
                        <li class="ellipsis" v-if='item.children.length' v-for='(val,index2) in item.children' :class='{"on":seecondOnIndex==index2}' @click='setInstallMethodsSend(val,item.id,val.id)' >{{val.method}}</li>
                    </ul>
                </li>
            </ul>     
        </div>
    </div>
</template>

<script type="ecma6.0">
    let root = window || {},
    util = root.util || {};
    export default{
        data () {
            return{
                installMethods:[
                    {method:'座架安装',id:1,children:[]},
                    {method:'挂架安装',id:2,children:[{method:'自备',id:'1'},{method:'门店购买',id:'3'},{method:'送装工人处购买',id:'2'}]}
                ],
                installText:'请选择',
                firstOnIndex:null,
                seecondOnIndex:null,
                tabShow:false
            }
        },
        created() {

        },
        methods:{
            _getInstallMethods(){
                
            },
            setInstallMethods(item,installType){
                if(item.children.length>0){
                    return;
                }else{
                    this.tabShow = false;
                    this.installText = item.method;
                    this.$emit('setinstallmethods',installType,0);
                }
            },
            setInstallMethodsSend(item,installType,installItem){
                this.tabShow = false;
                this.installText = item.method;
                this.$emit('setinstallmethods',installType,installItem);
            }

        }
    }




</script>

<style lang="less">
@import '../../util/fs.less';
.tvtab{
    margin-top: 0.266667rem;
    background-color: #fff;
    .mixinfont(14px);
   .tvtab-header{
        height: 1.173333rem;
        line-height: 1.173333rem;
        .mixinfont(14px);
        padding:0 0.32rem;
        span{
            float:right;
            margin-right: 0.266667rem;
            .mixinfont(14px);
            color:#ccc;
            &.on{
                color:#333; 
            }
        }
   }
   .icon{
        float: right;
        width: 0.2rem;
        height: 0.346667rem;
        background: url(img/day.png) no-repeat;
        background-size:cover; 
   }
   .icon-arrow-r{
        margin-top: 0.40rem;
   }
   .icon-arrow-t{
        margin-top: .37rem;
        -webkit-transform: rotate(-90deg);
           -moz-transform: rotate(-90deg);
            -ms-transform: rotate(-90deg);
             -o-transform: rotate(-90deg);
                transform: rotate(-90deg);
   }
   .tvtab-content{
        padding-left: 0.32rem;
        .tvtab-first{
            h2{
                height: 1.173333rem;
                line-height: 1.173333rem;
                padding:0 0.32rem 0 0.48rem; 

            }
            .tvtab-second{
                background-color: #fff;
                /* padding-left: 0.32rem; */
                padding-bottom: 0.133333rem; 
                li{
                    float: left;
                    width: 4.533333rem;
                    height: 1.173333rem;
                    line-height: 1.173333rem;
                    background-color: #F6F6F6;
                    border-radius: 0.106667rem;
                    text-align: center;
                    margin-bottom:0.266667rem;
                    &:nth-child(2n){
                        margin-left:0.266667rem;
                    };
                    &.on{
                        background-color: #FFF1F1;
                        border: 1px solid #FF9897;
                    };
                }
            }
        }
   }
   
}

</style>