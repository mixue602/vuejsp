<template>
	<ul class="assement">
		<li class="assementList bdr-bottom">
			<h2 class="assementTitle">2.添加故障</h2>
            <!-- <transition enter-active-class="slideInDown" > -->
                <ul class="assementContent defaultul grid clearfix">
                    <li class="column6 waves" v-for='(item, index) in fault' :class="{'on': item.on}" @click='selectCheckbox(index,$event)'>{{item.mlfnm}}</li>
                </ul>
            <!-- </transition> -->
		</li>
	</ul>

</template>

<script>
export default {
	props:{
		fault:{
			type: Array
		},
		subfault:{
			type: Array
		}
	},
    data (){
    	return{
			onIndex: null,
			onShow: false,
			display: false,
			activeNum: 0,
			assementdata: {}
    	}
    },
    methods: {

    	// 多选逻辑
    	selectCheckbox(index,event) {
    		ripple(event);

    		let currentObj=this.fault[index];
            currentObj.on = !currentObj.on;
            if($('.defaultul li.on').length>=10&&currentObj.on){
                currentObj.on = !currentObj.on;
                util.tip('当前已选故障过多,您确定您的设备还能维修吗？');
                return;
            }
    		//提交数据对象
			if(this.subfault.indexOf(currentObj.mlfid)<=-1){
				this.subfault.push(currentObj.mlfid);
			}else{
				this.subfault.splice(this.subfault.indexOf(currentObj.mlfid),1);
			}
			this.$emit("selectcheckbox",this.subfault,this.fault)
    	}
    },
    created() {
    	this.hrefParma = util.getHrefParma();

    },
    mounted () {

    }
}
</script>

<style lang="less">
	@import '../../util/fs.less';
	.assement{
		padding-left: 0.266667rem;
		background-color: #fff;
		&:nth-of-type(1){
			margin: 0.266667rem 0 0;
		};
	/*	&:nth-of-type(2){
			margin: 0 0 1.306667rem;
		}*/
		.assementList{
			/* border-bottom: 1px solid #E9E9E9; */
			padding-right: 0.266667rem;
			box-sizing: border-box;
			.assementTitle{
				position: relative;
				width: 100%;
				height: 1.173333rem;
				line-height: 1.173333rem;
				background-color: #fff;
				box-sizing: border-box;
				.mixinfont(14px);
				.assementText{
					position: absolute;
					width: 60%;
					overflow:hidden;
					white-space:nowrap;
					text-overflow:ellipsis;
				};
				i{
					color: #777777;
					.mixinfont(12px);
				};
				.assementModify{
					color: #0060FF;
				}
			}
			.assementContent{
				width: 100%;
				padding: 0 0.133333rem;
				li {
					width: 4.466667rem;
					height: 1.2rem;
					line-height: 1.2rem;
					border-radius: 0.106667rem;
					margin: 0 0 0.266667rem;
					text-align: center;
					background-color: #F6F6F6;
					overflow:hidden;
					white-space:nowrap;
					text-overflow:ellipsis;
					.mixinfont(12px);
					&:nth-child(2n){
						float: right;
					};
					&.on {
						background-color: #FFF1F1;
						border: 1px solid #FF9897;
					};
				}
			}
		};
	}
    @-webkit-keyframes slideInDown {
      from {
        -webkit-transform: translate3d(0, -10%, 0);
        transform: translate3d(0, -10%, 0);
        visibility: visible;
        opacity:0;

      }

      to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity:1;
      }
    }

    @keyframes slideInDown {
        from {
            -webkit-transform: translate3d(0, -10%, 0);
            transform: translate3d(0, -10%, 0);
            visibility: visible;
            opacity:0;

        }

        to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
             opacity:1;
        }
    }

    .slideInDown {
          -webkit-animation: slideInDown 1s;
          animation: slideInDown 1s;
    }

</style>