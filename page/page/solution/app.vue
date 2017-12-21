<template>
	  <div id="couponsReadMe">
		<header-component :title='title'></header-component>
        <div class="container">
            <div class="article blk2">
                <div v-if="FAQtitle" class="article-title2">问题：{{FAQtitle}}</div>
                <div class="article-text" ref="articleText">
                </div>
            </div>
        </div>
	  </div>	
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};

   
export default {
    data () {
        return {
            title:'解决方案',
            FAQtitle:''
        };
    },
    methods:{
        _getInfo(){
            
            let that = this,
                hrefParma=util.getHrefParma(),
                id = hrefParma.id;
            
            // 请求数据
            util.api({
                //surl: './resources/json/solution.json',
                surl: root.ME_API_PATH + 'help/detail?id='+id,
                type: 'get',
                success: function (response) {
                    var rpco = response.rpco,
                        body = response.body || {};
                    // 处理
                    switch (rpco) {
                        // 正常
                        case 200:
                                that.wxuserinfo = body;  
                                that.articleInfo = body.data.articleInfo;
                                that.FAQtitle =  that.articleInfo.title;
                                that.content =  that.articleInfo.content; 

                                $(that.$refs.articleText).append(that.content);
                            break;
                        case 404:
                             that.content = '抱歉，没有找到相关文章。';
                            $(that.$refs.articleText).append(that.content);
                    }
                }
            });
        }
    },
    created(){
        this._getInfo();
        if(util.isApp()){
           util.deleteHeadBtn();
        }
    },
    components: {
        headerComponent
    }
}

</script>

<style lang="less">
@import '../../util/fs.less';

/* 公共内容区 */
.container {
    width: 10rem;
	min-width: 320px;
    background-color: #f5f5f5;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 1.173333rem;
    bottom: 0;
    -webkit-overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
    z-index:999;
}

/* 优惠券使用说明页 */
.article {
    word-break: break-all;
    padding-bottom: .373333rem /* 28/75 */;
}
.blk2 {
    background-color: #fff;
    padding-left: .32rem /* 24/75 */;
    padding-right: .32rem /* 24/75 */;
    overflow: hidden;
}
.article-title2 {
    color: #333;
	.mixinfont(16px);
    font-weight: 700;
    line-height: .64rem /* 48/75 */;
    margin: .24rem /* 18/75 */ 0;
}
.article-text {
    color: #666;
    .mixinfont(16px);
    line-height:.64rem /* 48/75 */;
}
</style>