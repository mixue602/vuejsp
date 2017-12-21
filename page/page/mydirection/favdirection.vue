<template>
    <div class="favdirection">
        <ul>
            <li v-for="(item,index) in list" @click="gopage(item)">
                <div class="logo"><img :src="'http://'+item.goodsPic" onerror="javascript:this.src='http://gfs12.gomein.net.cn/T1.RKjBChT1RCvBVdK.png'" /></div>
                <span class="brand">{{item.cname}}</span>
                <span class="model" v-show="item.brand?true:false">iphone8</span>
                <i @click.stop="edit(item)" :class="{'devies':load!=1}"></i>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['load'],
    data() {
        return {
            list: {}
        }
    },
    created() {
        this.loadfavlist();
    },
    methods: {
        loadfavlist() {
            var _this = this;
            util.api({
                surl: root.INSTRUCTION_API_PATH + 'findfavorite',
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    console.log(res)
                    if (res.rpco == 200) {
                        _this.$emit('load-list', true)
                        _this.list = res.body.odlst;
                    } else if (res.rpco == 404) {
                        _this.$emit('load-list', false)
                    }
                }
            })
        },
        loadAssetList() {
            var _this = this;
            util.api({
                surl:root.INSTRUCTION_API_PATH + 'findasset',
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    console.log(res)
                    if (res.rpco == 200) {
                        _this.$emit('load-list', true)
                        _this.list = res.body.odlst;
                    } else if (res.rpco == 404) {
                        _this.$emit('load-list', false)
                    }
                }
            })
        },
        edit(item) {
            var _this = this;
            if (this.load == 1) {
                if(item.isAsset==2){//如果是资产说明书则无法删除，除非从资产里删除
                    util.tip('')
                    return false;
                }
                util.alert('确定要删除收藏？', {
                    title: '提示',
                    txtal: 'center',
                    content: '',
                    justOk: false,
                    okBtnText: '确定',
                    cancelBtnText: '取消',
                    okFn: deleteCollce,
                    cancelFn: function() {}
                })

                function deleteCollce() {
                    util.api({
                        surl:  root.INSTRUCTION_API_PATH + 'removefavorite?gdid=' + item.gdid,
                        type: 'get',
                        success: function(res) {
                            if (res.rpco == 200) {
                                util.tip('删除成功', 2000);
                                _this.loadfavlist();
                            } else {
                                util.tip('删除失败', 2000)
                            }
                        }
                    })
                }
            }else{
                util.href('./equipmentdetail.html',{id:item.asnum})
            }
        },
        gopage(item) {
            var parama = { isFav: item.isfav, gdid: item.gdid, docid: item.docid, did: 1, cname: encodeURI(item.cname), isAsset:item.isAsset}
            var ss = window.sessionStorage;
            ss.setItem('refesh',1);
            util.href('./directiondetail.html',parama)
        }
    },
    watch: {
        'load': {
            handler(newval) {
                if (newval == 1) {
                    this.loadfavlist()
                } else {
                    this.loadAssetList()
                }
            }
        }
    }
}
</script>
<style>
.favdirection ul li {
    width: 100%;
    height: 3.46667rem;
    margin-bottom: 0.26667rem;
    ` color: #333;
    font-size: 0.37333rem;
    background: #fff;
    position: relative;
}

.logo {
    width: 2.66667rem;
    height: 2.66667rem;
    margin: 0.4rem;
    overflow: hidden;
}

.logo img {
    width: 100%;
    height: 100%;
}

.brand,
.brand1 {
    position: absolute;
    top: 0.26667rem;
    left: 3.22667rem;
    display: block;
}

.model {
    position: absolute;
    top: 1.2rem;
    left: 3.22667rem;
    display: block;
}

.favdirection i {
    width: 0.45333rem;
    height: 0.45333rem;
    background: url(./img/delete.png) no-repeat center center;
    position: absolute;
    top: 1.30667rem;
    right: 0.56rem;
    background-size: cover;
}

.favdirection i.devies {
    background: url(//gfs11.gomein.net.cn/T1hhV_BC_T1RCvBVdK.png) no-repeat center center;
    background-size: cover;
}
</style>