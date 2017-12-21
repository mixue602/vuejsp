<template>
    <div class="paramlist" >
        <div class="pic_txt">
            <!-- <img :src="IMGurl"> -->
            <uploadone @watchupload="loadAssetPic" :imgaro="oriUrl"></uploadone>
            <p v-show="parma.mdnm"> {{ parma.mdnm }} </p>
        </div>

        <div class="messageDetail bdr-bottom">
            品牌<span>{{ parma.bdnm }}</span>
        </div>
        <div class="messageDetail bdr-bottom">
            型号<span>{{ parma.mdnm }}</span> 
        </div>
        <div class="messageDetail bdr-bottom">
            购买日期 
           <!--  <span id="GMtime" class="timeInp" @click="getTime">{{ btime }}</span> 
            <span class="userInp" v-show='!btime'>选择日期</span> -->
            <div id="GMtime" class="timeInp" type="text" name="" placeholder="选择日期" readonly="readonly">选择日期</div>
        </div>
        <div class="messageDetail bdr-bottom">
            商品序列码
            <!-- <span class="num">{{ xunliema }}</span>  -->
            <input class="numInp" type="text" name="" placeholder="填写序列码" v-model="xunliema" @change="premt(xunliema)">
        </div>
        <div class="messageDetail bdr-bottom invice">
            发票
            <!-- <i v-show="!(brandObj.invoiceUrl)" class="editI"></i>
            <uploadtwo @watchupload="loadInvoicPic" v-show="!(brandObj.invoiceUrl)"></uploadtwo> -->
            <i class="editI"></i>
            <uploadtwo @watchupload="loadInvoicPic"></uploadtwo>
        </div>

        <div class="subBtn" @click="_submit_save()">确定</div>
    </div>
</template>

<script>
    import uploadone from './uploadone';//上传商品图片组件（内部对 图片数量进行控制）
    import uploadtwo from './uploadtwo';//上传电子发票组件（内部对 图片数量进行控制，上传按钮文案 进行控制）
    let root = window || {},
        util = root.util || {};
    export default {
        data () {
            return {
                title:'其他参数',
                parma: {},
                topTit:'',
                tempasimgu:'',// 临时存储商品图片地址
                invicemgu:'',// 存储发票图片地址

                btime:'',//下单时间
                buyTime:null,
                
                xunliema:null,

                IMGurl:'',//等待接口，用于显示
                oriUrl:'',//原图用于向相册数组中推送

            };
        },
        created() {
            this.parma = util.getHrefParma();
        },
        watch:{
            parma:function(){
               if(this.parma.goodsPic){
                    this.oriUrl = 'http://'+this.parma.goodsPic;
                    this.IMGurl = this.oriUrl;

                    // console.log(this.parma.goodsPic);
                }
            }
        },
        mounted() { 
            
        },
        methods: {
            //存储用户即将上传的商品图片地址
            loadAssetPic(mes){
                let that = this;
                that.assetPicUrl=mes;
                //将商品图片替换
                // that.IMGurl = that.assetPicUrl[0];
                // 临时存储，用于提交
                if(that.assetPicUrl.length>0){
                   that.IMGurl = that.assetPicUrl[0];
                }else{
                   that.IMGurl = '';
                }
            },
            //存储用户即将上传的电子发票图片地址
            loadInvoicPic(mes){
                let that = this;
                that.invoicPicUrl=mes;
                //发票地址
                that.invicemgu = that.invoicPicUrl[0];
            },
            // 唯一序列号
            premt(val){
                let that = this;
                // console.log(val);
            },
            // 校验设备信息
            _submit_save(){
                let that = this;
                //用户选择时间后，时间转化为时间戳
                if( $("#GMtime").html()!='选择日期' ){
                    that.buyTime = Date.parse(new Date( $("#GMtime").html() ));
                    that.buyTime = String(that.buyTime);
                }
                // 校验用户不可填项是否为空
                if( !that.parma.bdnm || !that.parma.bdid || !that.parma.gid ||!that.parma.mdnm || !that.parma.gid){
                    util.tip("设备添加失败");
                    return false;
                };
                //购买时间为空
                // if(!that.buyTime){
                //     util.tip("请选择购买时间");
                //     return false;
                // };
                //唯一序列码为空
                // if(!that.xunliema){
                //     util.tip("请填写唯一序列码");
                //     return false;
                // };
                //商品图片为空
                // if(!that.IMGurl){
                //     util.tip("请上传商品图片");
                //     return false;
                // };

                that.submit_save();
            },
            //提交设备信息
            submit_save(){
                let that = this;
                that.parma.gid = String(that.parma.gid);
                that.parma.did = String(that.parma.did);
                that.parma.bdid = String(that.parma.bdid);
                let dataAll = {
                           //品牌名称
                           'bdnm': that.parma.bdnm,
                           //品牌编号
                           'bdid': that.parma.bdid,
                           //型号编号
                           'mdid': that.parma.gdid,
                           //型号名称
                           'mdnm': that.parma.mdnm,
                           //购买时间
                           'phtm': that.buyTime,
                           //唯一序列码
                           'slnum': that.xunliema,
                           //发票图片（可不传）
                           'ivimg': that.invicemgu,
                           //家电分类ID
                           'eacid': that.parma.eacid,
                           //家电分类名称
                           'eacnm': that.parma.eacnm,
                           //商品图片路径
                           'gdiul': that.IMGurl,
                           //分组编号
                           'gid': that.parma.gid,
                           //文档编号
                           'did': that.parma.did
                    };
                    console.log(dataAll)

            util.api({
                surl: root.AS_API_PATH + 'asscrte',
                data: dataAll,
                type: 'post',
                success: function(response) {
                    console.log(response)
                    var rpco = response.rpco,
                        body = response.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            util.tip('设备添加成功');
                            setTimeout(function(){
                               util.href('./equipmentdetail.html',{id: body.id});
                            },200)
                            break;
                        default:
                            util.tip('设备添加失败');
                            break;
                    }
                }
            });
            }
        },
        components: {
            uploadone,
            uploadtwo
        }
    };
</script>

<style lang='less'>
    @import '../../util/fs.less';
     .paramlist{
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        width: 100%;
        box-sizing: border-box;
        background-color: #F3F5F7;
        
        .pic_txt{
            width: 100%;
            height: 2.8rem;
            line-height: 2.8rem;
            box-sizing: border-box;
            padding: 0.4rem;
            padding-left: 2.4rem;
            position: relative;
            margin-bottom: 0.266667rem;
            background: #fff;
            img{
               width: 2.0rem;
               height: 2.0rem;
               position: absolute;            
               left: .4rem;
               top: .4rem;
               z-index: 4;
           }
           p{
             font-size: 0.4rem;
             padding-left: 0.266667rem;
             color: #333;
             height: 2rem;
             line-height: 2rem;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
           }

        }

        .messageDetail{
            font-size: 0.4rem;
            padding: 0 0.4rem;
            height: 1.2rem;
            line-height: 1.2rem;
            color: #333;
            background: #fff;
            position: relative;
            span{
                position: absolute;
                right: 0.4rem;
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                 white-space: nowrap;
            }

            .timeInp{
                width: 30%;
                height: 100%;
                color: #666;
                z-index: 10;
                text-align: right;
                float: right;
            }
            .userInp{
                color: #666;
            }

            .numInp{
                color: #666;
                float: right;
                text-align: right;
            }
            .num{
                color: #666;
            }
        }
        .bdr-bottom:after {
            height: 1px;
            content: '';
            width: 100%;
            border-top: 1px solid #f0f0f0;
            position: absolute;
            bottom: -1px;
            right: 0;
            z-index: 10;
        }
        .invice{
            position: relative;
            span{
                color: #FB4A40;
                display: inline-block;
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

            }
             .editI{
                width: 0.22rem;
                height: 0.22rem;
                position: absolute;
                right: 0.4rem;
                top: 50%;
                transform: translateY(-30%);
                // transform: rotate(45deg) translateY(-50%);
                // -webkit-transform: rotate(45deg) translateY(-50%);
                // border: .01rem solid #FF4B41;
                //  border-left-color: transparent;
                // border-bottom-color: transparent;
            }
            .editI:before{
                content:"";
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid #ff0000;
                // border-radius: 5px;
                -webkit-transform-origin: 0 0; 
                -moz-transform-origin: 0 0; 
                -ms-transform-origin: 0 0; 
                transform-origin: 0 0; 
                -webkit-transform: scale(0.5 0.5); 
                -ms-transform: scale(0.5 0.5); 
                -o-transform: scale(0.5 0.5); 
                transform: scale(0.5 0.5); 
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                transform: rotate(45deg) translateY(-50%);
                -webkit-transform: rotate(45deg) translateY(-50%);
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
         
        }

        .subBtn{
            width: 100%;
            height: 1.306667rem;
            line-height: 1.306667rem;
            background-color: #FF4B41;
            color: #fff;
            font-size: 0.48rem;
            text-align: center;
            position: fixed;
            bottom: 0;
        }
     }
    
</style>