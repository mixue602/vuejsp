<template>
    <div class="">
        <ul class="tvquestion">
            <li class="bdr-bottom tvquestion-qs" v-for='(item,index) in tvquestion'>
                <h2 class="tvquestion-title">{{index+1}}.{{item.question}}</h2>
                <ul class="tvquestion-answer clearfix">
                    <li :class='{"on":index2===item.onIndex}' v-for='(val,index2) in item.answers' @click='setAnswer(val,index,index2)'>{{val.ansTex}}</li>
                </ul>
            </li>
        </ul>
       
    </div>
</template>
<script type="ecma6.0">
    let root = window || {},
    util = root.util || {};
    export default{
        data () {
            return{
                tvquestion:[
                    {question:'送货安装是一次性完成的吗？',queFlag:'isOnce',answers:[{ansTex:'是',ansId:1},{ansTex:'否',ansId:0}],onIndex:null},
                    {question:'是否讲解安装收费标准？',queFlag:'isExplain',answers:[{ansTex:'是',ansId:1},{ansTex:'否',ansId:0}],onIndex:null},
                    {question:'是否为您调试彩电功能？',queFlag:'isDebug',answers:[{ansTex:'是',ansId:1},{ansTex:'否',ansId:0}],onIndex:null},
                ],
                childMethods:null,
                firstOnIndex:null,
                seecondOnIndex:null
            }
        },
        created() {

        },
        methods:{
            _getInstallMethods(){
                
            },
            setAnswer(val,index,index2){
                this.tvquestion[index].onIndex = index2;
                let flag = this.tvquestion[index].queFlag;
                this.$emit('tvques',flag,val.ansId);
            }

        }
    }

</script>

<style lang="less">
@import '../../util/fs.less';
.tvquestion{
    .mixinfont(14px);
    margin-top:0.266667rem;
    background-color: #fff;
    padding-left: 0.32rem;
    .tvquestion-qs{
        .tvquestion-title{
            height: 1.173333rem;
            line-height: 1.173333rem;
            .mixinfont(14px);
        };
        .tvquestion-answer{
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
                box-sizing:border-box;
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


</style>