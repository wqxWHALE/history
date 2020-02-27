<template>
    <div class="chart-item">
        <div class="option-box">
            <div class="option-item" v-on:click="getThisYearData" :class="{'btn-default-simple':cur===0}">今年</div>
            <div class="option-item" v-on:click="getLastYearData" :class="{'btn-default-simple':cur===1}">去年</div>
        </div>
        <div class="chart-show">
            <div id="saleChart"></div>
        </div>

    </div>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/theme/macarons.js'
    export default {
        name: 'weekofmonth',
        props: {
            softTypeArr:{
                type:Array
            }
        },
        data(){
            return {
                cur:0,
                salesMonStatus:{
                    title: {
                        text: '销售情况'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:[]
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            minInterval: 1
                        }
                    ],
                    series : [

                    ]
                }
            }
        },
        mounted() {
            this.getThisYearData();
        },
        watch:{
            'softTypeArr':function(){
                this.getThisYearData();
            }
        },
        methods: {
            initChart: function () {
                let saleChart = echarts.init(document.getElementById('saleChart'),'macarons');
                saleChart.setOption(this.salesMonStatus);
            },
            getThisYearData: function () {
                let root = this;
                root.cur = 0;
                let monArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                this.salesMonStatus.xAxis[0].data = monArr;
                root.salesMonStatus.series = [];
                this.$http.post('/api/customerOrder/yearStatistics', new URLSearchParams(), {
                    headers: {
                        'token': localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if (res.data.status === "success") {
                        //修改为适合table的数据格式
                        let result = res.data.data.data;
                       // console.log("root.softTypeArr.length"+root.softTypeArr.length);
                        root.salesMonStatus.legend.data=[];
                        for (let i = 0; i < root.softTypeArr.length; i++) {
                            root.salesMonStatus.legend.data.push(root.softTypeArr[i].selltype);
                            let item = {
                                name: root.softTypeArr[i].selltype,
                                type: 'line',
                                areaStyle: {},
                                data: [0,0,0,0,0,0,0,0,0,0,0,0]
                            };

                            for (let j = 0; j < result.length; j++) {
                                if (result[j].SellTypeID === root.softTypeArr[i].id) {
                                    item.data[result[j].monthNo-1]=result[j].countNumber;
                                }
                            }
                            //console.log("item");
                            //console.log(item.data);
                            root.salesMonStatus.series.push(item);
                        }
                       // console.log("series");
                        //console.log(root.salesMonStatus.series);
                        root.initChart();
                    }
                });
            },
            getLastYearData: function () {
                let root = this;
                root.cur = 1;
                let monArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                this.salesMonStatus.xAxis[0].data = monArr;
                root.salesMonStatus.series = [];
                root.$http.post('/api/customerOrder/lastYearStatistics', new URLSearchParams(), {
                    headers: {
                        'token': localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if (res.data.status === "success") {
                        //修改为适合table的数据格式
                        let result = res.data.data.data;
                        root.salesMonStatus.legend.data=[];
                        for (let i = 0; i < root.softTypeArr.length; i++) {
                            root.salesMonStatus.legend.data.push(root.softTypeArr[i].selltype);
                            let item = {
                                name: root.softTypeArr[i].selltype,
                                type: 'line',
                                areaStyle: {},
                                data: [0,0,0,0,0,0,0,0,0,0,0,0]
                            };
                            for (let j = 0; j < result.length; j++) {
                                if (result[j].SellTypeID === root.softTypeArr[i].id) {
                                        item.data[result[j].monthNo-1]=result[j].countNumber;
                                }

                            }
                            //console.log("item");
                            //console.log(item);
                            root.salesMonStatus.series.push(item);
                        }
                        //console.log("series");
                        //console.log(root.salesMonStatus.series);
                        root.initChart();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .chart-item{
        width:100%;
        padding:20px;
        box-sizing: border-box;
        background:#fff;
    }
    .chart-show{
        height:350px;
        width:100%;
    }
    #saleChart{
        height:100%;
        width:100%;
    }
    .option-box{
        overflow: hidden;
        border-bottom:1px solid #f5f5f5;
        margin-bottom:30px;
    }
    .option-item{
       float:left;
        width:50%;
        line-height:42px;
        text-align: center;
    }
</style>
