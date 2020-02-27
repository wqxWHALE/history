<template>
    <div class="data-info-container">
        <div class="info-row" v-for="(item,index) in infoSetting.detailArr">
            <div class="row-name">{{item}}</div>
            <div class="row-split">：</div>
            <div class="row-value">{{initData[showColIndex[index]]}}</div>
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            infoSetting:{
                detailShowColIndex:[],
                detailArr:[],
            },
            initData:{
                type:Array
            },
            showColIndex:{
                type:Array
            }
        },
        data(){
            return {
                dtata:''
            }
        }
    }
</script>

<style scoped>
    .data-info-container {
        width:100%;
        overflow: hidden;
        padding:20px 10px;
        box-sizing: border-box;
    }
    .info-row{
        overflow:hidden;
    }
    .row-name,
    .row-value,
    .row-split{
        font-size:14px;
        float:left;
        line-height:32px;
        height:32px;
        color:#606266;
    }
    .row-split{
        margin:0px 10px;
    }
    .row-name{
        width:100px;
        text-align: right;
    }
    .row-value{
        width:500px;
        text-align: left;
    }
</style>
