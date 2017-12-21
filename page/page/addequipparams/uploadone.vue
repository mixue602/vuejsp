<template>
    <div class="picuploadone">
        <input type="file" id="fileUpload" accept="image/*" multiple>
        <ul class="img-list">
            <li v-for="(item,index) in uploadArr"><img :src="item" />
                 <!-- <span :data-index="index" @click="delpic"></span> -->
            </li>
            <li id="upload" :class="{'nopic':nopic,'pic':hasPic}" @click="load">
                <span class="edit" v-show="hasPic">编辑</span>
            </li>
        </ul>
    </div>
</template>
<script type="ecma6.0">
    let root = window || {}, 
        util = root.util || {};
        export default{
            props: ['type','imgaro'],  
            data() {
                return {
                    uploadArr: [],
                    hasPic: false,
                    nopic: true
                }
            },
            watch:{

                imgaro:function(){
                   console.log(this.imgaro);
                   if(this.imgaro){
                      this.uploadArr.push(this.imgaro); 
                      this.hasPic = true;
                      this.nopic = false;
                   }
                }
            },
            methods: {
                //删除图片
                delpic: function(event) {
                    var i = event.target.getAttribute("data-index");
                    this.uploadArr.splice(i, 1);
                    this.$emit('watchupload', this.uploadArr)
                    // console.log(this.uploadArr);
                },
                //加载事件
                load: function() {
                    var that = this;
                    var maxsize = 100 * 1024;
                    var fileupload = document.getElementById("fileUpload");
                    fileupload.click();
                    fileupload.onchange = function() {
                        if (!this.files.length) return;
                        var files = Array.prototype.slice.call(this.files);
                        if (files.length > 1) {
                            alert("最多同时只可上传1张图片");
                            return;
                        }
                        files.forEach(function(file, i) {
                            if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                            var reader = new FileReader();
                            reader.onload = function() {
                                var result = this.result;
                                var img = new Image();
                                img.src = result;
                                //如果图片大小小于100kb，则直接上传
                                if (result.length <= maxsize) {
                                    img = null;
                                    that.uploadpic(result, file.type);
                                    return;
                                }
                                //图片加载完毕之后进行压缩，然后上传
                                if (img.complete) {
                                    callback();
                                } else {
                                    img.onload = callback;
                                }

                                function callback() {
                                    var data = that.compress(img);
                                    that.uploadpic(data, file.type);
                                    img = null;
                                }
                            };
                            reader.readAsDataURL(file);
                        })
                    };
                },
                //使用canvas对大图片进行压缩
                compress: function(img) {
                    //用于压缩图片的canvas
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext('2d');
                    //瓦片canvas
                    var tCanvas = document.createElement("canvas");
                    var tctx = tCanvas.getContext("2d");
                    
                    var initSize = img.src.length;
                    var width = img.width;
                    var height = img.height;
                    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                    var ratio;
                    if ((ratio = width * height / 4000000) > 1) {
                        ratio = Math.sqrt(ratio);
                        width /= ratio;
                        height /= ratio;
                    } else {
                        ratio = 1;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    //铺底色
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    //如果图片像素大于100万则使用瓦片绘制
                    var count;
                    if ((count = width * height / 1000000) > 1) {
                        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                        //计算每块瓦片的宽和高
                        var nw = ~~(width / count);
                        var nh = ~~(height / count);
                        tCanvas.width = nw;
                        tCanvas.height = nh;
                        for (var i = 0; i < count; i++) {
                            for (var j = 0; j < count; j++) {
                                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                            }
                        }
                    } else {
                        ctx.drawImage(img, 0, 0, width, height);
                    }
                    //进行最小压缩
                    var ndata = canvas.toDataURL('image/jpeg', 0.1);
                    console.log('压缩前：' + initSize);
                    console.log('压缩后：' + ndata.length);
                    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                    return ndata;
                },
                //图片上传，将base64的图片转成二进制对象，塞进formdata上传
                uploadpic: function(basestr, type) {
                    var that =this;
                    var text = window.atob(basestr.split(",")[1]);
                    var buffer = new Uint8Array(text.length);
                    var pecent = 0,
                        loop = null;
                    for (var i = 0; i < text.length; i++) {
                        buffer[i] = text.charCodeAt(i);
                    }
                    var blob = that.getBlob([buffer], type);
                    var xhr = new XMLHttpRequest();
                    var formdata = that.getFormData();
                    formdata.append('file', blob);
                    xhr.open('post', '/pic/yf/upload');
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var res = JSON.parse(xhr.responseText);
                            var rpco = res.rpco,
                                body = res.body || [];
                                if (rpco == 200) {
                                    $(".picupload .upload-note").hide();

                                    //清空原有图片地址，只保留一个（实现更新图片的效果）
                                    that.uploadArr.splice(0,that.uploadArr.length);
                                   
                                    that.uploadArr.push(body.url);
                                    that.hasPic = true;      
                                    that.nopic = false;   
                                    console.log(111111111)                         
                                    that.$emit('watchupload', that.uploadArr)
                                }
                        }
                    };
                    xhr.send(formdata);
                },
                /**
                 * 获取blob对象
                 */
                getBlob: function(buffer, format) {
                    try {
                        return new Blob(buffer, { type: format });
                    } catch (e) {
                        var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
                        buffer.forEach(function(buf) {
                            bb.append(buf);
                        });
                        return bb.getBlob(format);
                    }
                },
                /**
                 * 获取formdata
                 */
                getFormData: function() {
                    var isNeedShim = ~navigator.userAgent.indexOf('Android') &&
                        ~navigator.vendor.indexOf('Google') &&
                        !~navigator.userAgent.indexOf('Chrome') &&
                        navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
                    return isNeedShim ? new FormDataShim() : new FormData()
                },
                /**
                 * formdata 补丁, 给不支持formdata上传blob的打补丁
                 */
                FormDataShim: function() {
                    console.warn('using formdata shim');
                    var o = this,
                        parts = [],
                        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
                        oldSend = XMLHttpRequest.prototype.send;
                    this.append = function(name, value, filename) {
                        parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
                        if (value instanceof Blob) {
                            parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                            parts.push(value);
                        } else {
                            parts.push('\r\n\r\n' + value);
                        }
                        parts.push('\r\n');
                    };
                    // Override XHR send()
                    XMLHttpRequest.prototype.send = function(val) {
                        var fr,
                            data,
                            oXHR = this;
                        if (val === o) {
                            // Append the final boundary string
                            parts.push('--' + boundary + '--\r\n');
                            // Create the blob
                            data = this.getBlob(parts);
                            // Set up and read the blob into an array to be sent
                            fr = new FileReader();
                            fr.onload = function() {
                                oldSend.call(oXHR, fr.result);
                            };
                            fr.onerror = function(err) {
                                throw err;
                            };
                            fr.readAsArrayBuffer(data);
                            // Set the multipart content type and boudary
                            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                            XMLHttpRequest.prototype.send = oldSend;
                        } else {
                            oldSend.call(this, val);
                        }
                    };
                }
            }
        }
</script>
<style lang='less'>
@import '../../util/fs.less';
    .picuploadone {
        /*background: #fff;*/
        position: absolute;
        width: 2rem;
        height: 2rem;
        left: .4rem;
        top: .4rem; 
        .upload-note{
            position: absolute; 
            color: #999; 
            bottom: 0.48rem; 
            left: 2.133333rem;
            right: 0.266667rem;
            .mixinfont(14px);
        }
        #fileUpload {
            display: none;
        }
        canvas {
            width: 100%;
            border: 1px solid #000000;
        }
        .img-list {
            /*margin:0 0 0 0.4rem;*/
            /*padding: 0.4rem 0 0.133333rem 0;*/
            width: 100%;
            height: 100%;
            position: relative;
            /*border: 1px solid #e1e1e1;*/
        }
        .img-list li {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 6;
            /*margin: 0 0.4rem 0.266667rem 0;*/
            display: inline-block;
            width: 2rem;
            height: 2rem;
            border-radius: 0.066667rem;
        }
        .img-list li#upload {
            position: absolute;
            left: 0;
            top: 0;
            /*border: 1px solid #999;*/
        }
        .img-list li.nopic{
            z-index: 7;
            background: url(//gfs10.gomein.net.cn/T1S0LbBXZT1RCvBVdK.png) no-repeat 60% 57%;
            background-size: 57%;
            background-color: #F1F2F6;
        }
        .img-list li.pic{
            z-index: 7;
            .edit{
                display: block;
                width: 100%;
                background-color: rgba(0,0,0,.25);
                height: .5rem;
                line-height: .5rem;
                text-align: center;
                color: #fff;
                font-size: 0.35rem;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
        .img-list li img{
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            border-radius: 0.066667rem;
        }
        /*.img-list li span{
            position: absolute;
            top: -0.186667rem;
            right: -0.186667rem;
            width: 0.373333rem;
            height: 0.373333rem;
            background: url(//gfs11.gomein.net.cn/T17dW_B7AT1RCvBVdK.png) no-repeat center;
            background-size: 0.373333rem 0.373333rem;
            z-index: 6;
        }*/
    }
</style>