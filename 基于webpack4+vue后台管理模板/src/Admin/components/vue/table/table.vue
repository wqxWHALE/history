<template>
    <div>
        <t-filter-vue v-if="tableDefaultSetting.hasFilter"
                      v-bind:filterArr="filterDefaultSetting.filterArr"
                      v-bind:commitFun="filterCommit"></t-filter-vue>
        <button class="btn btn-default add-btn" v-if="tableDefaultSetting.allowAdd" v-on:click="toAdd">新增</button>
        <div class="tr-edit" v-if="showAddForm">
            <form-vue v-bind:formSetting="formDefaultSetting"
                      v-bind:editColIndex="formDefaultSetting.editColIndex"
                      v-bind:commitFun="addItem"
                      v-bind:cancelFun="hideAddForm"
                      v-bind:commitBtnStr="'新增'"></form-vue>
        </div>
        <div class="table my-table table-bordered">
            <div class="thead">
                <div class="tr">
                    <div class="th" v-for="(thItem,index) in tableDefaultSetting.thArr" v-if="(tableDefaultSetting.showID && index===0 )|| (index!==0)" :style="{width: itemWidth}">{{thItem}}</div>
                    <div class="th" v-if="tableDefaultSetting.hasAction || tableDefaultSetting.hasDetail" :style="{width: itemWidth}">操作</div>
                </div>
            </div>
            <div class="tbody" v-for="(dataItem,index) in tableDefaultSetting.dataList" :key="dataItem.tdData[0]">
                <div class="tr">
                    <div class="td" v-for="(item,index) in dataItem.tdData"
                         v-if="((tableDefaultSetting.showID && index===0 )|| (index!==0)) && (tableDefaultSetting.showColIndex.indexOf(index)!==-1)"
                         :style="{width: itemWidth}">{{item}}</div>
                    <div class="td" :style="{width: itemWidth}" v-if="tableDefaultSetting.hasDetail || tableDefaultSetting.hasAction">
                        <button v-if="tableDefaultSetting.hasDetail" class="btn btn-common" @click="toShowDetail(dataItem.tdData[0])">详情</button>
                        <span v-if="tableDefaultSetting.hasAction">
                            <button class="btn btn-info" @click="toEdit(dataItem.tdData[0])">编辑</button>
                            <button class="btn btn-danger" @click="toDelete(dataItem.tdData[0])">删除</button>
                            <span v-for="(btnItem,index) in actionBtnDefaultSetting">
                            <button class="btn" :style="btnItem.style" @click="toAction(btnItem.actionName,dataItem.tdData[0])">{{btnItem.name}}</button>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="tr-edit" v-if="dataItem.isEdit">
                    <form-vue v-bind:formSetting="formDefaultSetting"
                              v-bind:initData="dataList2[index].tdData"
                              v-bind:editColIndex="formDefaultSetting.editColIndex"
                              v-bind:commitFun="formCommit"
                              v-bind:commitBtnStr="'修改'"></form-vue>
                </div>
                <div class="tr-edit" v-if="dataItem.showDetail">
                    <data-info-vue v-bind:infoSetting="detailDefaultSetting"
                                   v-bind:initData="dataList2[index].tdData"
                                   v-bind:showColIndex="detailDefaultSetting.detailShowColIndex"></data-info-vue>
                </div>
            </div>
        </div>

        <div class="pagination" v-if="tableDefaultSetting.hasPagination">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="paginationSetting.totalPage"
                    :page-size="paginationSetting.pageSize"
                    @current-change="pageChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Form from '../form/form'
    import DataInfo from '../data-info/data-info'
    import Tfilter from '../table/t-filter'
    export default {
        props: {
            tableSetting:{
                type:Object
            },
            actionBtnSetting:{
              type:Array
            },
            detailSetting:{
                type:Object,
                default:function(){
                    return {
                        detailShowColIndex:[],
                        detailArr:[]
                    }
                }
            },
            filterSetting:{
                type:Object
            },
            formSetting: {
                type:Object,
                default:function(){
                    return {
                        editColIndex:[],
                        formStruArr:[]
                    }
                }
            },
            paginationSetting:{
                type:Object,
                default:function(){
                    return {
                        totalPage: 1000,
                        pageSize:10
                    }
                }
            },
            addItem: {
                type:Function
            },
            delItem: {
                type:Function
            },
            formCommit: {
                type:Function
            },
            filterCommit:{
                type:Function
            },
            jumpPagFunc:{
                type:Function
            }
        },
        components: {
            'form-vue':Form,
            't-filter-vue':Tfilter,
            'data-info-vue':DataInfo
        },
        data(){
            return {
                itemWidth:'200px',
                dataList2:[],
                showAddForm:false,
                filterDefaultSetting:{
                    filterArr:[{
                            name:'col1',
                            nameCode:'colValue1',
                            type:'input',
                            initValue:''
                         }]
                },
                formDefaultSetting: {
                    editColIndex: [1, 2, 3],
                    formStruArr: [{
                        name: 'col1',
                        nameCode: 'colValue1',
                        type: 'input',
                        textType: 'text'
                    }, {
                        name: 'col2',
                        nameCode: 'colValue2',
                        type: 'input',
                        textType: 'text'
                    }, {
                        name: 'col3',
                        nameCode: 'colValue3',
                        type: 'input',
                        textType: 'text'
                    }]
                },
                detailDefaultSetting:{
                    detailShowColIndex:[1,2,3],
                    detailArr:["col1","col2","col3"],
                },
                actionBtnDefaultSetting:[],
                tableDefaultSetting:{
                    allowAdd:true,
                    hasAction:false,
                    hasDetail:false,
                    hasFilter:false,
                    hasPagination:false,
                    showID:true,
                    dataList: [
                        {
                            isEdit:false,
                            showDetail:false,
                            tdData:['1','value1','value2','value3']
                        },{
                            isEdit:false,
                            showDetail:false,
                            tdData:['2','value1','value2','value3']
                        }
                    ],
                    thArr:['#','col1','col2','col3'],
                    showColIndex:[0,1,2,3]
                }
            }
        },
        watch:{
            'tableSetting.dataList':function(){
                this.tableDefaultSetting.dataList=this.tableSetting.dataList;
                this.dataList2=JSON.parse(JSON.stringify(this.tableDefaultSetting.dataList));
            }
        },
        mounted(){
            this.setData();
            this.setDefaultData();
        },
        methods:{
            setData:function(){
                Object.assign(this.tableDefaultSetting,this.tableSetting);
                Object.assign(this.detailDefaultSetting,this.detailSetting);
                Object.assign(this.formDefaultSetting,this.formSetting);
                Object.assign(this.filterDefaultSetting,this.filterSetting);
                Object.assign(this.actionBtnDefaultSetting,this.actionBtnSetting);

                if(typeof this.tableSetting=='undefined' || typeof this.tableSetting.showColIndex == 'undefined'){
                    this.tableDefaultSetting.showColIndex=[];
                    for(let i=0;i<this.tableDefaultSetting.thArr.length;i++) {
                        this.tableDefaultSetting.showColIndex.push(i)
                    }
                }
                if(this.detailDefaultSetting.detailArr.length===0){
                    this.detailDefaultSetting.detailArr=this.tableDefaultSetting.thArr;
                    for(let i=0;i<this.detailDefaultSetting.detailArr.length;i++){
                        this.detailDefaultSetting.detailShowColIndex.push(i);
                    }
                }
                if(this.formDefaultSetting.formStruArr.length===0){
                    for(let i=1;i<this.tableDefaultSetting.thArr.length;i++){
                        this.formDefaultSetting.editColIndex.push(i);
                        this.formDefaultSetting.formStruArr.push({
                            name: this.tableDefaultSetting.thArr[i],
                            nameCode: 'colValue'+i,
                            type: 'input',
                            textType: 'text'
                        });
                    }
                }
            },
            setDefaultData:function(){
                //设置默认值
                //设置表td宽度
                let tableSetting=this.tableDefaultSetting;
                if((tableSetting.hasAction && tableSetting.showID) || (tableSetting.hasDetail && tableSetting.showID)){
                    this.itemWidth=Number(1/(tableSetting.showColIndex.length+1))*100+'%';
                }else if(!tableSetting.hasAction && !tableSetting.hasDetail && !tableSetting.showID){
                    this.itemWidth=Number(1/(tableSetting.showColIndex.length-2))*100+'%';
                }else{
                    this.itemWidth=Number(1/tableSetting.showColIndex.length)*100+'%';
                }
            },
            toAction:function(actionName,id){
                this.$emit(actionName,id)
            },
            toEdit:function(id){
                this.tableDefaultSetting.dataList.forEach((item,index) => {
                    if(item.tdData[0]===id){
                        this.tableDefaultSetting.dataList[index].isEdit=!this.tableDefaultSetting.dataList[index].isEdit;
                    }
                })
            },
            toDelete:function(id){
                let data = new URLSearchParams();
                data.append('deleteID', id);
                //console.log('deleteID:'+ id);
                this.delItem(data);
            },
            toShowDetail:function(id){
                this.tableDefaultSetting.dataList.forEach((item,index) => {
                    if(item.tdData[0]===id){
                        this.tableDefaultSetting.dataList[index].showDetail=!this.tableDefaultSetting.dataList[index].showDetail;
                    }
                })
            },
            toAdd:function(){
                this.showAddForm=!this.showAddForm;
            },
            pageChange:function(currentPage){
                this.jumpPagFunc(currentPage);
            },
            hideAddForm:function(){
                this.showAddForm=!this.showAddForm;
            }
        }
    }
</script>

<style scoped>
    .add-btn{
        height:32px;
        line-height: 32px;
        font-size:14px;
        width:60px;
        margin-bottom: 10px;
    }
    .pagination{
        margin-top:20px;
    }
</style>





