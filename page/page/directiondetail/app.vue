<template>
    <div class="directiondetail wapper" :class="{bg:text}">
        <header-components :title="headeroptions.title" @watchdirection="goback"></header-components>
        <div class="collce" @click="Collce" :class="{'nocollce':collce.on}" v-show="isAsset&&!use"></div>
        <ul v-if="!text">
            <li v-for="(k,v) in modeldetail.clst" @click="gotextdetail(k,v)" v-html="k.cn" class="bdr-bottom">
            </li>
        </ul>
        <div class="textdetail" v-html="textdetail" v-if="text">
        </div>
        <div class="footer" v-if="text">
            <img src="//gfs12.gomein.net.cn/T1KWJvB4VT1RCvBVdK.png" class="listicon" @click="footoption('list')" />
            <img src="//gfs12.gomein.net.cn/T1XZZbB4AT1RCvBVdK.png" class="kefu" @click="footoption('kefu')" />
            <img src="//gfs12.gomein.net.cn/T1CEJQB4LT1RCvBVdK.png" class="prev" @click="footoption('prev')" />
            <img src="//gfs12.gomein.net.cn/T1J5WTBCJT1RCvBVdK.png" class="next" @click="footoption('next')" />
        </div>
        <div class="mask" v-if="shareImg" @click="hideMask">
            <img src="http://img.dev.gomegj.com/guanjia/v2/fx_log.png" />
        </div>
    </div>
</template>
<script>
import headerComponents from '../../components/HeaderComponent'
var root = window || {},
    util = root.util;
export default {
    data() {
        return {
            modeldetail: {}, //说明书详情页列表数据
            textdetail: null,
            text: false,
            shareImg: false,
            collce: { //收藏参数
                on: false,
                data: {},
                msg: '',
                url: ''
            },
            use: false,
            isAsset: true,
            newcollce: {},
            layer: false,
            hrefParama: {},
            headeroptions: { //头部参数
                title: ''
            },
            detailoptions: { //型号列表页请求参数
                pid: 0,
                gid: null,
                did: 1,
                tmid: 1,
                cade: ''
            },
            index: null
        };
    },
    components: {
        headerComponents
    },
    watch: {
        index: {
            handler(newval) {
                var data = this.detailoptions;
                data.pid = this.modeldetail.clst[newval].pid;
                this.load(data);
            }
        }
    },
    created() {
        var ls = window.localStorage;
        this.hrefParama = util.getHrefParma();

        this.use = this.hrefParama.use || false;

        $('title').html(decodeURI(this.hrefParama.cname) || '国美管家')

        this.detailoptions.gid = this.hrefParama.docid;
        this.headeroptions.title = decodeURI(this.hrefParama.cname);
        //初次进入
        if (ls.getItem('direction') != 'yes') {
            this.shareImg = true;
            ls.setItem('direction', 'yes');
        }
        //在app里调用app分享
        this._isApp();
        //是否收藏
        this._isCollce();

        if (this.hrefParama.isAsset == 2) {//是資產説明書隱藏收藏按鈕
            this.isAsset = false;
        }

        this.use ? this.url = '/edoc/GomeWordWeb/asset/v1/wx/usmuqr' : this.url = '/edoc/GomeWordWeb/asset/v1/wx/pmdq'; //是否是使用说明

        this.load(this.detailoptions); //加载数据
    },
    methods: {
        _isCollce() {
            if (this.hrefParama.isFav == 2) {
                this.collce = {
                    on: false
                }
                this.newcollce = {
                    url: root.INSTRUCTION_API_PATH + 'removefavorite',
                    on: false,
                    data: {
                        gdid: this.hrefParama.gdid
                    },
                    msg: '已取消收藏'
                }
            } else {
                this.collce = {
                    on: true
                }
                this.newcollce = {
                    url: root.INSTRUCTION_API_PATH + 'addfavorite',
                    on: true,
                    data: {
                        docId: this.hrefParama.docid,
                        gdid: this.hrefParama.gdid,
                        memberId: 111,
                        cname: decodeURI(this.hrefParama.cname)
                    },
                    msg: '收藏成功'
                }
            }
        },
        _isApp() {
            var _this = this;
            if (util.isApp()) {
                var param = {
                    title: decodeURI(_this.hrefParama.cname),
                    menus: {
                        isShowCloseMenu: 'Y',
                        rightMenus: [{
                            type: 'share',
                            title: '分享',
                            // icon:'',
                            icon: 'file://share',
                            action: 'http://u.m.atguat.com.cn/my_evaluate-0.html',
                            shareInfo: {
                                title: '产品说明书',
                                shareDesc: decodeURI(_this.hrefParama.cname),
                                shareImageUrl: CheckImgExists(_this.hrefParama.imgsrc) ? _this.hrefParama.imgsrc : 'http://gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
                                shareUrl: window.location.href,
                                platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'copylink']
                            }
                        }]
                    }
                }
                util.setHeadBar(param);
            }
            function CheckImgExists(imgurl) {
                var ImgObj = new Image();
                ImgObj.src = imgurl;
                //没有图片，则返回-1
                if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        hideMask() {
            this.shareImg = false;
        },
        Collce() {
            var _this = this;
            util.api({
                surl: _this.newcollce.url,
                type: 'get',
                data: _this.newcollce.data,
                success: function(res) {
                    if (res.rpco == 200) {
                        util.tip(_this.newcollce.msg);
                        _this.collce.on = !_this.collce.on;
                        _this.hrefParama.isFav = _this.collce.on ? 0 : 2
                        setTimeout(() => {
                            util.href('./directiondetail.html', _this.hrefParama)
                        }, 500)
                    } else {
                        util.tip('收藏失败');
                    }
                }
            })
        },
        okfn() {
            window.location.href = "tel://4008-708-708";
        },
        goback() {
            this.detailoptions.pid = 0;
            this.detailoptions.gid = this.hrefParama.docid;
            this.load(this.detailoptions);

        },
        footoption(str) {
            switch (str) {
                case 'list':
                    this.detailoptions.pid = 0;
                    this.detailoptions.gid = this.hrefParama.docid;
                    this.load(this.detailoptions);
                    break;
                case 'kefu':
                    util.alert('拨打售后服务电话4008-708-708可预约设备清洗保养、（保外）维修和回收服务', {
                        title: '提示',
                        txtal: 'center',
                        content: '',
                        justOk: false,
                        okBtnText: '确定',
                        cancelBtnText: '取消',
                        okFn: this.okfn,
                        cancelFn: function() {}
                    })
                    break;
                case 'prev':
                    if (this.index == 0) {
                        util.tip('当前已是第一个参数说明页')
                        return false;
                    }
                    this.index--;
                    break;
                case 'next':

                    if (this.index == this.modeldetail.clst.length - 1) {
                        util.tip('当前已是最后一个参数说明页')
                        return false;
                    }
                    this.index++
            }
        },
        load(data) {
            var _this = this;
            util.api({
                surl: _this.url,
                type: 'get',
                data: data,
                success: function(res) {
                    //console.log(res)
                    if (res.rpco == 200) {
                        var body = res.body;
                        if (body.cade == 2) {
                            _this.modeldetail = body;
                            _this.text = false
                        } else {
                            _this.textdetail = body.pc;
                            _this.text = true
                        }
                        if (body.cn.split('.')[1] != 'docx') {
                            _this.headeroptions.title = decodeURI(body.cn);
                            $('title').html(decodeURI(body.cn))
                        } else {
                            if (body.cn.split('.')[0] == '常见问题' || body.cn.split('.')[0] == '操作说明') {
                                _this.headeroptions.title = decodeURI(body.cn.split('.')[0]);
                                _this.isAsset = false;
                                $('title').html(decodeURI(body.cn.split('.')[0]))
                                if (util.isApp()) {
                                    var param = {
                                        title: decodeURI(body.cn.split('.')[0])
                                    }
                                    util.setHeadBar(param);
                                    util.deleteHeadBtn();
                                }
                            }
                        }
                    }
                }
            })

        },
        gotextdetail(item, index) {
            this.detailoptions.pid = item.pid;
            this.index = index;
            this.load(this.detailoptions)
        }
    }
};
</script>
<style>
/* @import '../../util/fs.less'; */

.mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999999;
}

.mask img {
    width: 100%;
    height: 100%;
}

.directiondetail {
    width: 100%;
}

.bg {
    background: #fff;
}

.directiondetail>ul {
    width: 100%;
}

.directiondetail>ul>li {
    width: 100%;
    line-height: 1.46667rem;
    font-size: 0.3733rem;
    color: #333;
    height: 1.46667rem;
    background: #fff;
    text-indent: 0.4rem;
}

.textdetail {
    padding: 1.1733rem 0.46667rem 1.2rem 0.46667rem;
}

.collce {
    position: fixed;
    width: 1.14667rem;
    height: 1.14667rem;
    right: 0.4rem;
    bottom: 1.65333rem;
    border-radius: 50%;
    background: url(./img/collce.png) no-repeat center center;
    background-size: cover;
    z-index: 999;
}

.nocollce {
    background: url(./img/nocollce.png) no-repeat center center;
    background-size: cover;
}

.footer {
    width: 100%;
    height: 1.2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fafafa;
}

.footer img {
    position: absolute;
    width: 0.58667rem;
    height: 0.58667rem;
    top: 0.29333rem;
}

.footer img.listicon {
    left: 0.34667rem;
}

.footer img.kefu {
    left: 3.28rem;
}

.footer img.prev {
    right: 3.52rem;
}

.footer img.next {
    right: 0.45333rem;
}
</style>