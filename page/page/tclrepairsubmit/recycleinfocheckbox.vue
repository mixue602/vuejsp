<template>
	<div  class="faults-box">
		<ul class="assement">
			<li class="assementList">
				<h2 class="assementTitle">
					<span>故障描述</span>
					<a href="javascript:;" @click="closeFault"></a>
				</h2>
	            <!-- <transition enter-active-class="slideInDown" > -->
	                <ul class="assementContent grid clearfix">
	                    <li class="column6 waves" v-for='(item, index) in fault' :class="{'on': item.on}" @click='selectCheckbox(index,$event)'>{{item.mlfnm}}</li>
	                </ul>
	            <!-- </transition> -->
			</li>
		</ul>
		<div  :class="{'on': subfault.length}" class="fault-sure" @click="submitFault($event)">确定</div>
	</div>
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
			assementdata: {},
			subFaultObj:[],
			faultBtn: true
    	}
    },
    methods: {
    	// 多选逻辑
    	selectCheckbox(index,event) {
    		ripple(event);
    		let currentObj = this.fault[index];
    		currentObj.on = !currentObj.on;
    		//提交数据对象
			if(this.subfault.indexOf(currentObj.mlfid)<=-1){
				this.subfault.push(currentObj.mlfid);
			}else{
				this.subfault.splice(this.subfault.indexOf(currentObj.mlfid),1);
			}
    	},
    	closeFault() {
    		this.$emit("closefault");
    	},
    	submitFault(event) {

    		if(!this.subfault.length){return};
    		ripple(event);
    		this.$emit("submitfault",this.subfault);
    		this.$emit("closefault");
    	}
    },
    created() {
    	this.hrefParma = util.getHrefParma();
    },
    mounted () {
    	Array.prototype.forEach.call(document.querySelectorAll('[data-ripple]'), function(element){
              new RippleEffect(element);
        });
    }
}
</script>

<style lang="less">
	@import '../../util/fs.less';
	.faults-box{
		width: 100%;
		position: fixed;
		top:0;
		left:0;
		bottom:0;
		right:0;
		z-index: 999999;
		background-color: rgba(0,0,0,0.3);
		.assement{
			position: absolute;
		    bottom: 0;
		    left: 0;
			width: 100%;
			height: 9.3rem;
			overflow-y: auto;
		    /* padding-left: .266667rem; */
		    padding-bottom: 1.066667rem;
		    background-color: #fff;
		    box-sizing:border-box;
			&:nth-of-type(1){
				margin: 0.266667rem 0 0;
			};
			&:nth-of-type(2){
				margin: 0 0 1.306667rem;
			};
			.assementList{
				/* border-bottom: 1px solid #E9E9E9; */
				/* padding-right: 0.266667rem; */
				box-sizing: border-box;
				width: 100%;
			    overflow-y: auto;
				.assementTitle{
					position: fixed;
					z-index: 999999;
					padding-right: 0.266667rem;
					text-indent: 0.399999rem;
					width: 100%;
					height: 1.173333rem;
					line-height: 1.173333rem;
					background-color: #fff;
					box-sizing: border-box;
					.mixinfont(14px);
					a{
						position: absolute;
						right: 0;
						width: 0.346667rem;
						height:0.346667rem;
						padding: .4rem;
						background: url(img/close.png) no-repeat;
						background-size: 0.346667rem 0.346667rem;
						background-origin: content-box;
					}
				};
				.assementContent{
					width: 100%;
					padding: 1.333333rem  0 0 ;
					li {
						width: 46%;
						height: 1.2rem;
						line-height: 1.2rem;
						border-radius: 0.106667rem;
						margin: 0 0 0.266667rem 2.5%;
						text-align: center;
						background-color: #F6F6F6;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
						.mixinfont(12px);
						box-sizing: border-box;
						/* &:nth-child(2n){
							float: right;
						}; */
						&.on {
							background-color: #FFF1F1;
							border: 1px solid #FF9897;
						};
					}
				};
			};
		}
	}
	.fault-sure{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9999;
		width: 100%;
		height: 1.306667rem;
		line-height: 1.306667rem;
		text-align: center;
		background-color: #E0E0E0;
		color: #fff;
		.mixinfont(16px);
		&.on{
			background-color: #ff4b46;
		}
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