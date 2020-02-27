<template>
    <div  class="table-container">
        <mask-vue v-show="showAddOrder || showAddService || isShowMask"></mask-vue>
        <div class="dialog" v-show="showAddOrder">
            <div class="dialog-title">添加订单</div>
            <form-vue v-bind:formSetting="orderFormSetting"
                      v-bind:commitFun="addItemOrder"
                      v-bind:cancelFun="closeAddOrder">
            </form-vue>
        </div>
        <div class="dialog" v-show="showAddService">
            <div class="dialog-title">添加服务记录</div>
            <form-vue v-bind:formSetting="serviceFormSetting"
                      v-bind:commitFun="addItemService"
                      v-bind:cancelFun="closeAddService">
            </form-vue>
        </div>
    <table-vue v-bind:tableSetting="tableSetting"
               v-bind:formSetting="formSetting"
               v-bind:filterSetting="filterSetting"
               v-bind:detailSetting="detailSetting"
               v-bind:paginationSetting="paginationSetting"
               v-bind:actionBtnSetting="actionBtnSetting"
               v-bind:formCommit="editItem"
               v-bind:addItem="addItem"
               v-bind:jumpPagFunc="jumpPagFunc"
               v-bind:delItem="delItem"
               v-bind:filterCommit="filterCommit"
               @toAddOrder="showAddOrderForm"
               @toAddService="showAddServiceForm">
    </table-vue>

    </div>
</template>

<script>
    import  Table from '../../components/vue/table/table'
    import  Mask from '../../components/vue/mask/mask'
    import  Form from '../../components/vue/form/form'
    import FunTool from '@/utils/function.js'
export default{
    name:'customerInfo',
    inject:["reload"],
    components: {
        'table-vue':Table,
        'mask-vue':Mask,
        'form-vue':Form
    },
    data(){
        return {
            pageNo:0,
            condition:null,
            showAddOrder:false,
            showAddService:false,
            isShowMask:false,
            currentCusID:'',
            softTypeArr:[],
            serviceFormSetting:{
                formStruArr: [{
                    name: '已交服务费',
                    nameCode: 'servicePrize',
                    type: 'input',
                    textType: 'number'
                },{
                    name: '服务描述',
                    nameCode: 'desc',
                    type: 'textarea',
                    textType: 'textarea'
                },{
                    name:"服务时间",
                    nameCode:'createTime',
                    type:'datePicker'
                }]
            },
            orderFormSetting:{
                formStruArr: [{
                    name: '软件类型',
                    nameCode: 'softTypeID',
                    type: 'select',
                    initValue:'',
                    selectOpt:[]
                },{
                    name: '收货地址',
                    nameCode: 'addr',
                    type: 'textarea',
                    textType:'textarea'
                },{
                    name:'电脑配置',
                    nameCode:'computerConfig',
                    type: 'textarea',
                    textType:'textarea'
                },{
                    name:"下单时间",
                    nameCode:'createTime',
                    type:'datePicker'
                },{
                    name:'备注',
                    nameCode:'remark',
                    type: 'textarea',
                    textType:'textarea',
                    allowNull:true
                },{
                    name:'价格',
                    nameCode:'prize',
                    type: 'input',
                    textType:'number'
                }]
            },
            tableSetting:{
                dataList:{},
                thArr:["#","淘宝ID","真实姓名","手机号","订单数","服务次数","创建日期"],
                hasAction: true,
                hasDetail: true,
                hasFilter: true,
                hasPagination:true,
                showID:false
            },
            actionBtnSetting:[{
                name:'新增订单',
                style:'color:#fff;width:60px;background:#34bfa3;border:1px solid #34bfa3',
                actionName:'toAddOrder'
            },{
                name:'新增服务',
                style:'color:#fff;width:60px;background:#34bfa3;border:1px solid #34bfa3',
                actionName:'toAddService'
            }],
            detailSetting:{
                detailShowColIndex:[1,2,3,7],
                detailArr:["淘宝ID","真实姓名","手机号","备注"]
            },
            formSetting: {
                editColIndex: [1, 2, 3,7],
                formStruArr: [{
                    name: '淘宝ID',
                    nameCode: 'tbID',
                    type: 'input',
                    textType: 'text'
                },{
                    name: '真实姓名',
                    nameCode: 'realName',
                    type: 'input',
                    textType: 'text'
                },
                    {
                        name: '手机号',
                        nameCode: 'tel',
                        type: 'input',
                        textType: 'tel'
                    },{
                        name: '备注',
                        nameCode: 'remark',
                        type: 'textarea',
                        textType: 'textarea',
                        allowNull:true
                    }]
            },
                filterSetting:{
                    filterArr:[
                        {
                            name:'淘宝ID',
                            nameCode:'tbID',
                            type:'input',
                            initValue:''
                        },
                        {
                            name:'手机号',
                            nameCode:'tel',
                            type:'input',
                            initValue:'',
                        },
                        {
                            name:['开始日期','结束时间'],
                            nameCode:['startTime','endTime'],
                            type:'dateZones',
                            initValue:'',
                        }
                    ]
                },
            paginationSetting:{
                totalPage: 10,
                pageSize:10
            }
        }
    },
    mounted(){
        let obj=new URLSearchParams();
        obj.append('tbID', '');
        obj.append('tel', '');
        obj.append('startTime', '');
        obj.append('endTime', '');
        obj.append('pageNo', this.pageNo);
        obj.append('length', this.paginationSetting.pageSize);
        this.condition=obj;
        this.getData(obj);
        this.getSoftType();
    },
    methods:{
        showAddOrderForm:function(msg){
            this.currentCusID=msg;
            this.showAddOrder=!this.showAddOrder;
        },
        showAddServiceForm:function(msg){
            this.currentCusID=msg;
            this.showAddService=!this.showAddService;
        },
        closeAddService:function(){
            this.currentCusID='';
            this.showAddService=!this.showAddService;
        },
        closeAddOrder:function(){
            this.currentCusID='';
            this.showAddOrder=!this.showAddOrder;
        },
        getData:function(obj){
            let root=this;
            root.$http.post('/api/customer/getNum',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                if(res.data.status==="success"){
                    root.paginationSetting.totalPage=res.data.data.num;
                }
            });
            this.getResult(this.condition);
        },
        editItem:function(obj){
            let _this=this;
            this.isShowMask=true;
            _this.$http.post('/api/customer/update',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                this.isShowMask=false;
                // success callback
                if(res.data.status==="success"){
                    _this.reload()
                }
            });
        },
        addItem:function(obj){
            let _this=this;
            this.isShowMask=true;
            _this.$http.post('/api/customer/insert',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                this.isShowMask=false;
                // success callback
                if(res.data.status==="success"){
                    _this.reload()
                }else{
                    this.$message({
                        type: 'info',
                        message: '插入失败!'
                    });
                }
            });
        },
        delItem:function(obj){
            let _this=this;
            this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShowMask=true;
                _this.$http.post('/api/customer/delete',obj,{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    this.isShowMask=false;
                    // success callback
                    if(res.data.status==="success"){
                        _this.reload();
                    }else{
                        this.$message({
                            type: 'info',
                            message: '删除失败!'
                        });
                    }
                });
            }).catch(() => {
                this.isShowMask=false;
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        jumpPagFunc:function(pageNo){
            this.pageNo=pageNo-1;
            this.condition.delete("pageNo");
            this.condition.append('pageNo', this.pageNo);
            this.getResult(this.condition);
        },
        filterCommit:function(obj){
            let root=this;
            this.pageNo=0;
            this.condition=obj;
            obj.delete('pageNo');
            obj.delete('length');
            obj.append('pageNo', this.pageNo);
            obj.append('length', this.paginationSetting.pageSize);
            this.getData(obj);
        },
        getResult:function(obj){
            let root=this;
            root.$http.post('/api/customer/search',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                // success callback
                if(res.data.status==="success"){
                    //修改为适合table的数据格式
                    let values=FunTool.getObjectValues(res.data.data.data);
                    let tableData=[];
                    values.forEach((item)=>{
                        tableData.push({
                            isEdit:false,
                            showDetail:false,
                            tdData:item
                        });
                    });
                    root.tableSetting.dataList=tableData;
                }
            });
        },
        getSoftType:function(){
            let root=this;
            root.$http.post('/api/softtype/getAll',new URLSearchParams(),{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                // success callback
                if(res.data.status==="success"){
                    //修改为适合table的数据格式

                    res.data.data.data.forEach((item)=>{
                        root.softTypeArr.push({
                            id:item.id,
                            label:item.selltype
                        });
                    });
                    root.orderFormSetting.formStruArr[0].selectOpt=root.softTypeArr;
                   // console.log(root.softTypeArr);
                }
            });
        },
        addItemService:function(obj){
            obj.append('cusID', this.currentCusID);
            this.$http.post('/api/customerServe/addInCus',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                if(res.data.status==="success"){
                    this.reload();
                    this.$message({
                        type: 'info',
                        message: '新增成功!'
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: '新增失败!'
                    });
                }
            });
        },
        addItemOrder:function(obj){
            obj.append('cusID', this.currentCusID);
            this.$http.post('/api/customerOrder/addInCus',obj,{
                headers:{
                    'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                }
            }).then(res => {
                if(res.data.status==="success"){
                    this.reload();
                    this.$message({
                        type: 'info',
                        message: '新增成功!'
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: '新增失败!'
                    });
                }
            });
        }
    }
}
</script>

<style scoped>
    .table-container{
        background: #fff;
        padding:10px;
        box-sizing: border-box;
    }
    .dialog{
        position: fixed;
        z-index:999;
        width:500px;
        height:400px;
        overflow-y:auto;
        left:50%;
        top:50%;
        background: #fff;
        margin-left:-250px;
        margin-top:-200px;
        border-radius: 5px;
    }
    .dialog-title{
        line-height:48px;
        padding:0px 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #f5f5f5;
    }
</style>
