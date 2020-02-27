<template>
    <div class="table-container">
        <mask-vue v-show="isShowMask"></mask-vue>
        <table-vue v-bind:tableSetting="tableSetting"
                   v-bind:filterSetting="filterSetting"
                   v-bind:formSetting="formSetting"
                   v-bind:detailSetting="detailSetting"
                   v-bind:filterCommit="filterCommit"
                   v-bind:formCommit="editItem"
                   v-bind:jumpPagFunc="jumpPagFunc"
                   v-bind:paginationSetting="paginationSetting"
                   v-bind:addItem="addItem"
                   v-bind:delItem="delItem"></table-vue>
    </div>
</template>

<script>
    import  Table from '../../components/vue/table/table'
    import  Mask from '../../components/vue/mask/mask'
    import FunTool from '@/utils/function.js'
    export default{
        name:"customerOrder",
        inject:["reload"],
        data(){
            return {
                pageNo:0,
                isShowMask:false,
                condition:null,
                customerArr:[],
                softTypeArr:[],
                tableSetting:{
                    dataList:{},
                    //0 2,3,5,6
                    //0,1,2,3,4
                    showColIndex:[0,2,3,5,8],
                    thArr:["#","淘宝ID","手机号","软件类型","创建日期"],
                    hasAction: true,
                    hasDetail: true,
                    hasFilter: true,
                    hasPagination:true,
                    allowAdd:true,
                    showID:false
                },
                formSetting: {
                    editColIndex: [2,3,5,6,7,8,9,10],
                    formStruArr: [{
                        name: '淘宝ID',
                        nameCode: 'tbID',
                        type: 'inputAutoSearch',
                        searchAction:this.searchTbID
                    },{
                        name: '手机号',
                        nameCode: 'tel',
                        type: 'input',
                        textType: 'tel'
                    },{
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
                        allowNull:true,
                    },{
                        name:'价格',
                        nameCode:'prize',
                        type: 'input',
                        textType:'number'
                    }]
                },
                filterSetting:{
                    filterArr:[
                        {
                            name:'淘宝ID',
                            nameCode:'tbID',
                            type:'inputAutoSearch',
                            initValue:'',
                            searchAction:this.searchTbID
                        },
                        {
                            name:'手机号',
                            nameCode:'tel',
                            type:'input',
                            initValue:'',
                        },
                        {
                            name:'软件类型',
                            nameCode:'softTypeID',
                            type:'select',
                            initValue:'',
                            selectOpt:[]
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
                },
                detailSetting:{
                    detailShowColIndex:[2,3,5,6,7,8,9,10],
                    detailArr:["淘宝ID","手机号","软件类型","地址","电脑配置","创建日期","备注","价格"]
                },
            }
        },
        components:{
            "table-vue":Table,
            'mask-vue':Mask,
        },
        mounted(){
            let obj=new URLSearchParams();
            obj.append('tbID', '');
            obj.append('tel', '');
            obj.append('softTypeID', '');
            obj.append('startTime', '');
            obj.append('endTime', '');
            obj.append('pageNo', this.pageNo);
            obj.append('length', this.paginationSetting.pageSize);
            this.condition=obj;
            this.getData(obj);
            this.getSoftType();
            this.getCustomer();
        },
        methods:{
            getData:function(obj){
                let root=this;
                root.$http.post('/api/customerOrder/getNum',obj,{
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
            jumpPagFunc:function(pageNo){
                this.pageNo=pageNo-1;
                this.condition.delete("pageNo");
                this.condition.append('pageNo', this.pageNo);
                this.getResult(this.condition);
            },
            filterCommit:function(obj){
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
                root.$http.post('/api/customerOrder/search',obj,{
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
                       // console.log("root.tableSetting.dataList:");
                        //console.log(root.tableSetting.dataList);
                    }
                });
            },
            getCustomer:function(){
                let root=this;
                root.$http.post('/api/customer/getAll',new URLSearchParams(),{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if(res.data.status==="success"){
                        //修改为适合table的数据格式

                        res.data.data.data.forEach((item)=>{
                            root.customerArr.push({
                                id:item.id,
                                value:item.tbid
                            });
                        });
                    }
                });
            },
            searchTbID:function(queryString,cb){
                //console.log(this.customerArr);
                let data = this.customerArr;
                let results = queryString ? data.filter(this.createFilter(queryString)) : data;
                cb(results);
            },
            createFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
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
                        root.formSetting.formStruArr[2].selectOpt=root.softTypeArr;
                        root.filterSetting.filterArr[2].selectOpt=root.softTypeArr;
                        //console.log(root.softTypeArr);
                    }
                });
            },
            editItem:function(obj){
                let _this=this;
                this.isShowMask=true;
                this.$http.post('/api/customerOrder/update',obj,{
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
                            message: '更新失败',
                            type: 'warning'
                        });
                    }
                });
            },
            addItem:function(obj){
                this.isShowMask=true;
                this.$http.post('/api/customerOrder/add',obj,{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    this.isShowMask=false;
                    if(res.data.status==="success"){
                        this.reload()
                    }else{
                        this.$message({
                            type: 'info',
                            message: '新增失败!'
                        });
                    }
                });
            },
            delItem:function(obj){
                let root=this;
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isShowMask=true;
                    root.$http.post('/api/customerOrder/delete',obj,{
                        headers:{
                            'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                        }
                    }).then(res => {
                        this.isShowMask=false;
                        // success callback
                        if(res.data.status==="success"){
                            root.reload();
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
</style>
