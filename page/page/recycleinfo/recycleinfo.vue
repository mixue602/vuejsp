<template>
	<ul class="assement">
		<li class="assementList bdr-bottom" v-for='(item, parentIndex) in assement' v-if="item.chtp == 1 ||item.chtp == 2" v-show='item.parentShow' >
			<h2 class="assementTitle">
				<span class="assementTit">{{ parentIndex+1 }}.{{item.propnm}}</span>
				<span class="assementText" v-show="item.titShow">：{{item.tit}}</span>
				<a v-show="item.titShow" class="float_r assementModify" href="javascript:;" @click='modify(parentIndex)'>修改</a>
			</h2>
            <!-- <transition enter-active-class="slideInDown" > -->
                <ul class="assementContent grid clearfix" v-show='item.ulShow'>
                    <li   class="column6 waves" v-for="(val,index) in item.vals" :class="{'border': val.on}" @click='select($event,parentIndex,index)'>{{val.valnm}}</li>
                </ul>
            <!-- </transition> -->

		</li>
		<li  class="assementList" v-for='(item, parentIndex) in assement' v-if="item.chtp == 3 ||item.chtp == 4" v-show='item.parentShow'>
			<h2 class="assementTitle">{{ parentIndex+1 }}.{{item.propnm}}
				<span>(多选)<i>若无问题请点击马上估价</i></span>
				<a v-show="item.titShow" class="float_r assementModify" href="javascript:;" @click='modify(parentIndex)'>修改</a>
			</h2>
            <!-- <transition enter-active-class="slideInDown" > -->
    			<ul class="assementContent grid clearfix" v-show='item.ulShow'>
    				<li  class="column6 waves" v-for="(val,index) in item.vals" :class="{'border': val.on}" @click='selectCheckbox($event,parentIndex,index)'>{{val.valnm}}</li>
    			</ul>
            <!-- </transition> -->
		</li>
	</ul>

</template>

<script>
var assementdata = {};
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
    	select(ev,parentIndex,index) {
    		var that = this;
            ripple(ev);
            setTimeout(function(){
            	let parObj = that.assement[parentIndex],
    			nextParObj = that.assement[parentIndex+1],
    			currentObj = that.assement[parentIndex].vals[index];
	    		// 标题及修改按钮展示
	    		parObj.titShow = true;
	    		// 标题内容更改
	    		parObj.tit =  currentObj.valnm;
	    		// 单选选中状态
	    		if(parObj.select){
	    			for(var i=0;i<parObj.vals.length;i++){
	    				parObj.vals[i].on = false;
	    			}
	    		}
	    		currentObj.on = true;
	    		parObj.select = true;

	    		// 当前选项模块关闭，下一个展开
	    		if(!parObj.modify && nextParObj ){
		            parObj.ulShow = false;
		            nextParObj.parentShow = true;
		            nextParObj.ulShow = true;
	            }else{
	            	parObj.ulShow = true;
	            	for(var i=0;i<that.assement.length;i++){
		    			if(!that.assement[i].select){
		    				parObj.ulShow = false;
		    				that.assement[i].parentShow = true;
		    				that.assement[i].ulShow = true;
		    				break;
		    			}
	    			}

	            }
	            var len=0;
	            $.each(that.assement,(i,item)=>{
	            	if((item.chtp==1 || item.chtp==2 )&& item.select){
	            		len++;
	            	}
	            })
	    		// 控制进度条及提交按钮
				// assementdata[parentIndex] = currentObj.valid;
				// let len = 0;

				// for(var k in assementdata){
				// 	if(assementdata.hasOwnProperty(k)) {
				// 			len++;
	   //              }
				// }
				//提交数据对象
				if(!that.subobj[parentIndex]){
					that.subobj[parentIndex] = {};
				}
				that.subobj[parentIndex].propid = parObj.propid;
				that.subobj[parentIndex].valids = [currentObj.valid];

				that.$emit("select",len,that.subobj,that.assement)

            }, 200)

    	},
    	selectCheckbox(ev,parentIndex,index) {
            ripple(ev);
    		let parObj = this.assement[parentIndex],
    			nextParObj = this.assement[parentIndex+1],
    			currentObj=this.assement[parentIndex].vals[index];
    		parObj.titShow = true;
    		currentObj.on = !currentObj.on;
    		parObj.select = true;
    		// 当前选项模块关闭，下一个展开
    		 //收起所有的下拉框
    		for(var i=0;i<this.assement.length;i++){
    			this.assement[i].ulShow = false;
    		}
    		if(!parObj.modify && nextParObj ){
	            parObj.ulShow = false;
	            nextParObj.parentShow = true;
	            nextParObj.ulShow = true;
            }else{
            	parObj.ulShow = true;
            	for(var i=0;i<this.assement.length;i++){
	    			if(!this.assement[i].select){
	    				parObj.ulShow = false;
	    				this.assement[i].parentShow = true;
	    				this.assement[i].ulShow = true;
	    				break;
	    			}
    			}

            }
    		//提交数据对象
    		if(!this.subobj[parentIndex]){
				this.subobj[parentIndex] = {};
			}
			this.subobj[parentIndex].propid = parObj.propid;
			if(!!this.subobj[parentIndex].valids){
				let valIndex = this.subobj[parentIndex].valids.indexOf(currentObj.valid);
				if(valIndex<=-1){
					this.subobj[parentIndex].valids.push(currentObj.valid);
				}else{
					this.subobj[parentIndex].valids.splice(valIndex, 1);
				}
			}else{
				this.subobj[parentIndex].valids = [currentObj.valid];
			}
			this.$emit("selectcheckbox",this.subobj,this.assement)
    	},
        //点击修改
    	modify(parentIndex) {

    		let parObj = this.assement[parentIndex],
    			nextParObj = this.assement[parentIndex+1];
            //收起所有的下拉框
    		for(var i=0;i<this.assement.length;i++){
    			this.assement[i].ulShow = false;
    		}
            parObj.modify = true;
    		parObj.ulShow = true;
    	}
    },
    computed: {

    },
    mounted () {

    }
}
</script>

<style lang="less">
	@import '../../util/fs.less';
	.assement{
		margin: 0.266667rem 0 0.4rem;
		padding-left: 0.266667rem;
		background-color: #fff;
	}
	.assementList{
		/* border-bottom: 1px solid #E9E9E9; */
		padding-right: 0.266667rem;
		box-sizing: border-box;
	/* 	&:last-child{
			border-bottom: none;
		}; */

	};
	.assementTitle{
		position: relative;
		width: 100%;
		height: 1.173333rem;
		line-height: 1.173333rem;
		background-color: #fff;
		box-sizing: border-box;
		.mixinfont(14px);
		.assementTit{
			float: left;
		};
		.assementText{
			/* position: absolute; */
			float: left;
			width: 55%;
			overflow:hidden;
			white-space:nowrap;
			text-overflow:ellipsis;
		};
		i{
			color: #777777;
			.mixinfont(12px);
		};
		.assementModify{
			position: absolute;
			right:0.266667rem;
			height: 1.173333rem;
			line-height: 1.173333rem;
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
    .border{
  		position: relative;
	}
	.border:before{
	  content: "";
	  position: absolute;
	  width: 200%;
	  height: 200%;
	  border: 1px solid #ff9897;
	  border-radius: 8px;
	  top: 0;
	  left: 0;
	  -webkit-transform-origin:0 0;
	  -ms-transform-origin:0 0;
	  -moz-transform-origin:0 0;
	  -o-transform-origin:0 0;
	  transform-origin:0 0;
	  -webkit-transform:scale(0.5,0.5);
	  -ms-transform:scale(0.5,0.5);
	  -o-transform:scale(0.5,0.5);
	  transform:scale(0.5,0.5);
	  -webkit-box-sizing:border-box;
	  -moz-box-sizing:border-box;
	  box-sizing: border-box;
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