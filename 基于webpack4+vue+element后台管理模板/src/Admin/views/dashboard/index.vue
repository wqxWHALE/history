<template>
    <div class="dashboard-container">
        <data-tab-vue v-bind:tabs="tabArr"></data-tab-vue>
        <div class="chart-box">
        <div style="overflow:hidden;margin-bottom:10px;">
            <div class="row-half-1">
                <income-soft-vue></income-soft-vue>
            </div>
            <div class="row-half-2">
                <income-year-vue></income-year-vue>
            </div>
        </div>
            <week-of-month-vue v-bind:softTypeArr="softTypeArr"></week-of-month-vue>
            <every-month-vue v-bind:softTypeArr="softTypeArr"></every-month-vue>
        </div>
    </div>
</template>
<script>
    import  DataTab from '../../components/vue/data-tabs/data-tabs'
    import WeekOfMonth from './charts/weekofmonth'
    import EveryMonth from './charts/everymonth'
    import IncomeSoft from './charts/incomesoft'
    import IncomeYear from './charts/incomeyear'
    export default {
        name: 'Dashboard',
        data(){
            return {
                softTypeArr:[],
                tabArr:[
                    {icon:"fa-flag",name:"本月订单量",num:"0"},
                    {icon:"fa-rocket",name:"本月服务次数",num:"0"},
                    {icon:"fa-users",name:"客户总数",num:"0"},
                    {icon:"fa-line-chart",name:"总订单量",num:"0"}
                    ]
            }
        },
        components: {
            'data-tab-vue':DataTab,
            'week-of-month-vue':WeekOfMonth,
            'every-month-vue':EveryMonth,
            'income-soft-vue':IncomeSoft,
            'income-year-vue':IncomeYear
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData:function(){
                this.$http.post('/api/statistics/getTab',new URLSearchParams(),{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if (res.data.status === "success") {
                        this.tabArr[0].num=res.data.data[0].monthOrderNum;
                        this.tabArr[1].num=res.data.data[0].monthServiceNum;
                        this.tabArr[2].num=res.data.data[0].cusNum;
                        this.tabArr[3].num=res.data.data[0].orderNum;
                    }
                });
                this.$http.post('/api/softtype/getAll',new URLSearchParams(),{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if (res.data.status === "success") {
                        this.softTypeArr=res.data.data.data;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .chart-box{
        padding:0 30px;
        box-sizing: border-box;
        margin-top:10px;
    }
    .row-half-1{
        width:50%;
        float:left;
        padding: 0px 10px 10px 0px;
        box-sizing: border-box;
    }
    .row-half-2{
        width:50%;
        float:left;
        padding: 0px 0px 10px 10px;
        box-sizing: border-box;
    }
</style>
