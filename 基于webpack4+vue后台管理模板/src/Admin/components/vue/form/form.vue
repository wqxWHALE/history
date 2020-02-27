<template>
    <div class="form-container">
        <div class="form-content">
            <div class="form-item" v-for="(item,index) in formSetting.formStruArr">
                <div class="item-name"><span class="tip-icon" v-show="!item.allowNull">*</span> {{item.name}}：</div>
                <div class="item-limit">
                    <el-input v-if="item.type==='input'" v-model="initData[editColIndex[index]]" :type="item.textType" :placeholder="item.name"></el-input>
                    <el-input v-if="item.type==='textarea'"type="textarea" v-model="initData[editColIndex[index]]" :type="item.textType"></el-input>
                    <el-select v-if="item.type==='select' " v-model="initData[editColIndex[index]]" placeholder="请选择">
                        <el-option
                                v-for="opt in item.selectOpt"
                                :label="opt.label"
                                :value="opt.id">
                        </el-option>
                    </el-select>
                    <el-date-picker v-if="item.type==='datePicker'"
                            v-model="initData[editColIndex[index]]"
                            format="yyyy-MM-dd"
                             value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                    <el-autocomplete v-if="item.type==='inputAutoSearch'"
                                     v-model="initData[editColIndex[index]]"
                                     :fetch-suggestions="item.searchAction"
                                     placeholder="请选择">
                    </el-autocomplete>
                </div>
            </div>
        </div>
        <div class="form-item">
            <div class="item-name"></div>
            <div class="item-limit form-action">
                <button class="btn btn-info" @click="toEditCommit()">{{commitBtnStr}}</button>
                <button class="btn btn-danger" v-show="hasCancel" @click="toCancel()">取消</button></div>
            </div>
        </div>
</template>

<script>
    import FunTool from '@/utils/function.js'
    export default {
        props:{
            commitBtnStr:{
                type:String,
                default:function(){
                    return '确定'
                }
            },
            formSetting:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            initData:{
                type:Array,
                default:function(){
                    return []
                }
            },
            editColIndex:{
                type:Array,
                default:function(){
                    return []
                }
            },
            commitFun:{
                type:Function
            },
            cancelFun:{
                type:Function,
                default:function(){

                }
            }},
        data(){
            return {
                hasCancel:true
            }
        },
        created() {
            this.setData();
        },
        methods:{
            setData:function(){
                if(typeof this.formSetting.formStruArr !='undefined'){
                    if(this.initData.length===0){
                        for(let i=0;i<this.formSetting.formStruArr.length;i++){
                            this.initData.push('');
                        }
                    }
                }
                if(this.editColIndex.length===0){
                    for(let i=0;i<this.formSetting.formStruArr.length;i++){
                        this.editColIndex.push(i);
                    }
                }
            },
            toCancel:function(){
                this.cancelFun();
            },
            toEditCommit:function(){
                let _this=this;
                let formArr=_this.formSetting.formStruArr;
                let data = new URLSearchParams();
                data.append('ID', _this.initData[0]);
                for(let i=0;i<formArr.length;i++){
                    console.log(formArr[i].nameCode+":"+ _this.initData[this.editColIndex[i]]);
                    if(!formArr[i].allowNull){
                        let check=FunTool.isNotNull(_this.initData[this.editColIndex[i]]);
                        if(!check){
                            this.$message({
                                message: formArr[i].name+'不能为空哦',
                                type: 'warning'
                            });
                            return false;
                        }
                    }
                    if(formArr[i].textType==='tel'){
                        let check=FunTool.checkIsPhone(_this.initData[this.editColIndex[i]]);
                        if(!check){
                            this.$message({
                                message: formArr[i].name+'不合法哦',
                                type: 'warning'
                            });
                            return false;
                        }
                    }
                    data.append(formArr[i].nameCode, _this.initData[this.editColIndex[i]]);
                }
                console.log("准备提交");
                this.commitFun(data);
            },
        }
    }
</script>

<style scoped>
    .form-container{
        width:100%;
        overflow: hidden;
        padding:20px 10px;
        box-sizing: border-box;
    }
    .form-item{
        overflow: hidden;
        margin-bottom:20px;
    }
    .item-limit{
        width:350px;
        float:left;
    }
    .item-name{
        width:100px;
        font-size:14px;
        text-align: right;
        float:left;
        line-height:32px;
        height:32px;
        color:#606266;
    }
    .form-action{
        width: 350px;
        text-align: left;
    }
    .form-content{
        overflow: hidden;
    }
    .tip-icon{
        color:red;
        display: inline-block;
    }

</style>
