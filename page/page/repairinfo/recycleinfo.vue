<template>
	<ul class="assement bdr-bottom" >
		<li class="assementList" v-for='(item, parentIndex) in assement' >
			<h2 class="assementTitle">{{ parentIndex+1 }}.{{item.attrgrpnm}}
			</h2>
            <!-- <transition enter-active-class="slideInDown" > -->
                <ul class="assementContent grid clearfix">
                    <li class="column6 btn waves" v-for="(val,index) in item.attrs" :class="{'on': val.on}" @click='select(parentIndex,index,$event)'>{{val.attrnm}}</li>
                </ul>
            <!-- </transition> -->
		</li>
	</ul>

</template>

<script>
let assementdata = {};
export default {
	props:{
		assement:{
			type: Array
		},
		subobj:{
			type: Object
		}
	},
    data (){
    	return{
			onIndex: null,
			fault:'',
			onShow: false,
			display: false,
			activeNum: 0,
			assementdata: {}
    	}
    },
    methods: {
    	// 单选逻辑
    	select(parentIndex,index,event) {
    		let parObj = this.assement[parentIndex],
    			nextParObj = this.assement[parentIndex+1],
    			currentObj=this.assement[parentIndex].attrs[index];
    			ripple(event);
    		// 单选选中状态
			for(var i=0;i<parObj.attrs.length;i++){
				parObj.attrs[i].on = false;
			}
    		currentObj.on = true;
    		parObj.select = true;

    		// 控制进度条及提交按钮
    		var len=0;
            $.each(this.assement,(i,item)=>{
            	if(item.select){
            		len++;
            	}
            })

			assementdata[parentIndex] = currentObj.attrid;
			// let len = 0;
			// for(var k in assementdata){
			// 	if(assementdata.hasOwnProperty(k)) {
			// 			len++;
   //              }
			// }
			//提交数据对象
			if(!this.subobj[parentIndex]){
				this.subobj[parentIndex] = {};
			}
			this.subobj[parentIndex].attrgrpid = parObj.attrgrpid;
			this.subobj[parentIndex].attrid = currentObj.attrid;
			this.$emit("select",len,this.subobj,this.assement)
    	}
    },
    mounted () {
    	// console.log(1111)
    	// Array.prototype.forEach.call(document.querySelectorAll('.btn'), function(element){
    	//   	console.log(2222)
     //        new RippleEffect(element);
     //    });

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
		/*&:nth-of-type(2){
			margin: 0 0 1.306667rem;
		}*/
        &:nth-of-type(2){
            margin: 0 ;
        }
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
					margin: 0 0 0.213333rem;
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
                li:last-child{
                    margin-bottom: 0.4rem;
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