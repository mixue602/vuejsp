<template>
    <ul class="repairList clearfix">
        <li  class="float_l waves bdr-bottom bdr-r" v-for="(val,index) in body.eacatgs" @click="skip($event,val.eacid,val.eacnm,index)">
            <div class="float_l">
                <p>{{ val.eacnm }}</p>
                <p>{{ eacnmDescribe[val.eacid] }}</p>
            </div>
            <img :src="val.logo" alt="" class="float_r" :onerror="defaultImg" >
        </li>
    </ul>
</template>

<script>
export default {
  props: ["body"],
  data() {
    return {
      defaultImg: 'this.src="//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png"',
      eacnmDescribe: {
        12: "免费上门 现场维修",
        36: "安全可靠 方便快捷",
        13: "原装品质 价格透明",
        19: "专业保障 高效快速",
        20: "技术精湛 贴心服务",
        25: "合理收费 诚实守信",
        21: "原厂配件 免费保修",
        26: "估价报价 先修后付",
        27: "故障解析 售后保障",
        28: "保证质量 快速上门"
      }
    };
  },

  updated() {
    var liWaves = $('li.waves');
    if(liWaves.length%2>0){
      liWaves.last().css({'width':'100%'});
    }
    var ss=window.sessionStorage;
    console.log(ss);
    var channel = ss.getItem("channel");
    var c = this.body;
    if (channel == 86) {
      $.each(c.eacatgs, i => {
        if (c.eacatgs[i].eacnm == "手机") {
          c.eacatgs.splice(i, 1);
        }
        if (c.eacatgs[i].eacnm == "平板") {
          c.eacatgs.splice(i, 1);
        }
        if (c.eacatgs[i].eacnm == "电脑") {
          c.eacatgs.splice(i, 1);
        }
      });
    }
    this.body = c;
  },
  methods: {
    skip(event, eacid, eacnm, index) {
      var that = this,
        ls = window.localStorage,
        arcode;
      ripple(event);
      // var els = document.querySelectorAll('[data-ripple]');
      // new RippleEffect(els[index],event);
      // console.log(els[index])

      if (ls.getItem("dstrict") == null) {
        arcode = 110108;
      } else {
        arcode = eval("(" + ls.getItem("dstrict") + ")").d;
      }
      if (
        eacnm.indexOf("手机") != -1 ||
        eacnm.indexOf("平板") != -1 ||
        eacnm.indexOf("电脑") != -1
      ) {
        util.href("repairbrand.html", {
          eacid: eacid,
          eacnm: eacnm,
          arcode: arcode
        });
      } else {
        util.href("repairelse.html", {
          eacid: eacid,
          eacnm: eacnm,
          arcode: arcode
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../util/fs.less";
.repairList {
  background: #fff;
  li {
    box-sizing: border-box;
    width: 50%;
    height: 2.133333rem;
    /*       border-bottom: 0.013333rem solid #e9e9e9;
            border-right: 0.013333rem solid #e9e9e9; */
    div {
      p:nth-child(1) {
        color: #333;
        .mixinfont(14px);
        margin: 0.533333rem 0 0 0.4rem;
      }
      p:nth-child(2) {
        color: #999;
        .mixinfont(10px);
        margin: 0.186667rem 0 0 0.4rem;
      }
    }
    img {
      width: 1.653333rem;
      height: 1.653333rem;
      margin: 0.266667rem 0.15rem 0 0;
    }
  }
  li:nth-child(event) {
    border-right: 0;
  }
}
</style>