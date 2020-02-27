<template>
    <div class="page-wrapper" >
        <div class="page-box">
            <a class="pager-prev" :class="{'page-disabled':prevDisable}" href="javascript:void(0)" @click="jumpPrev()">上一页</a>

            <ul>
                <li v-for="num in pageSize">
                    <a href="javascript:void(0)" @click="jump(num)" :class="{'theme-active':pageNo===num}" class="page-wrapper-item">
                        <span>{{num}}</span>
                    </a>
                </li>
            </ul>

            <a class="page-next" :class="{'page-disabled':nextDisable}" href="javascript:void(0)" @click="jumpNext()">下一页</a>
        </div>
        <div class="page-input-box">
            跳转到：
            <input type="text" v-model="jumpPage" class="page-input" />
            <a class="pager-btn-go" href="javascript:void(0)" @click="Go()">GO</a>
        </div>
    </div>
</template>

<script>
    export default {
        model: { // 通过v-model传过来的参数
            prop: 'pageNo',
            event: 'jumpPage'
        },
        props: {
            pageSize: {
                type: Number,
                default: 10
            },
            pageNo: { // 通过v-model传过来的参数
                type: Number,
                default: 1
            }
        },
        data () {
            return {
                jumpPage: '' // 避免操作props参数
            }
        },
        computed: {
            prevDisable: function () { // “上一页”按钮是否可点
                if (this.pageNo > 1) {
                    return false
                } else {
                    return true
                }
            },
            nextDisable: function () { // “下一页”按钮是否可点
                if (this.pageNo < this.pageSize && this.pageSize > 1) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            jumpPrev: function () { // 点击上一页
                if (this.pageNo === 1) {
                    return false
                } else {
                    this.$emit('jumpPage', this.pageNo - 1)
                }
            },
            jumpNext: function () { // 点击下一页
                if (this.pageNo === this.pageSize) {
                    return false
                } else {
                    this.$emit('jumpPage', this.pageNo + 1) ;// 修改当前页码
                }
            },
            jump: function (id) { // 直接跳转
                if (id > this.pageSize) {
                    id = this.pageSize
                }
                this.jumpPage = '';
                this.$emit('jumpPage', id) // 修改当前页码
            },
            /**
             * @return {boolean}
             */
            Go: function () {
                if (this.jumpPage === '') { // 判空处理
                    return false;
                } else if (/^\d*$/.test(parseInt(this.jumpPage))) { // 填写数字才能跳转
                    this.jump(parseInt(this.jumpPage));
                    this.jumpPage = '';
                } else {
                    this.jumpPage = '';
                    return false
                }
            }
        }
    }
</script>

<style>
    .page-wrapper{
        margin-top:20px;
    }
    .page-wrapper .page-box{
        float:left;
        overflow: hidden;
        margin-right:20px;
    }
    .page-wrapper ul, .page-wrapper li{
        float:left;
    }
    .page-wrapper-item,
    .page-wrapper .pager-btn-go{
        display: inline-block;
        width:30px;
        height:28px;
        line-height:28px;
        text-align: center;
        border:1px solid #ccc;
        color:#ccc;
        margin:0px 3px;
        font-size:12px;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .page-wrapper .pager-prev,.page-wrapper .page-next{
        float:left;
        box-sizing: border-box;
        height:28px;
        line-height:28px;
        width:60px;
        text-align: center;
        font-size:12px;
        color:#ccc;
        border:1px solid #ccc;
        border-radius: 2px;
    }
    .page-wrapper li.page-active a{
        color:#ff4946;
        border:1px solid #ff4946;
    }
    .page-wrapper .page-disabled{
        background:#f5f5f5;
        color:#ccc;
        border:1px solid #ccc;
    }
    .page-wrapper .page-input-box{
        color:#999;
        font-size:12px;
        line-height:28px;
    }
    .page-wrapper .page-input{
        width:60px;
        border:1px solid #ccc;
        height:28px;
        border-radius: 2px;
    }

</style>
