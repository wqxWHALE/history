<template>
    <div class="my-row">
        <div class="column" v-for="(item,index) in tabs">
            <div class="c-box">
                <div class="c-icon"><i :class="[item.icon,'fa icon-c'+(index+1)]"></i></div>
                <div class="c-data userCount">
                    <h2>{{item.num}}</h2>
                    <h6>{{item.name}}</h6>
                </div>
            </div>
        </div>
    </div><!--end row-->
</template>

<script>
export default {
    props:{
        tabs:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    data(){
        return {
            data:''
        }
    }
}
</script>

<style scoped>
 .my-row{
        width: 100%;
        overflow:hidden;
        padding:0px 20px;
    }
.column{
        width:25%;
        padding:10px;
        float:left;
    }
    .c-box{
        position: relative;
        background:#FFF;
        overflow: hidden;
    }
    .c-box .c-icon,.c-box .c-data{
        float:left;
    }
    .c-box .c-data{
        width:50%;
        text-align: center;
        padding:18px 0px;
    }
    .c-box .c-icon{
        width:50%;
        height:120px;
        border-right: 1px solid #F1F2F7;
    }
    .c-box .c-icon i{
        position: relative;
        font-size:48px;
        line-height:120px;
        margin-left:50%;
        left:-24px;
    }
    .c-box .icon-c1{
        color:#6CCAC9;
    }
    .c-box .icon-c2{
        color:#FF6C60;
    }
    .c-box .icon-c3{
        color:#F8D347;
    }
    .c-box .icon-c4{
        color:#57C8F2;
    }

 .c-box .icon-c1{
     color:#40c9c6;
 }
 .c-box .icon-c2{
     color:#36a3f7;
 }
 .c-box .icon-c3{
     color:#f4516c;
 }
 .c-box .icon-c4{
     color:#34bfa3;
 }
</style>
