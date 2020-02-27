<template>
    <div class="chart-item">
        <div id="allSaleYearPie"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/theme/macarons.js'
    export default{
        data(){
            return{
                salesMonStatus:{
                    title : {
                        text: '今年总收入占比',
                        subtext: '',
                        x:'center',
                        textStyle:{
                            fontSize:16
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: []
                    },
                    series : [
                        {
                            name: '销售总金额',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods:{
            initChart:function(){
                let saleChart = echarts.init(document.getElementById('allSaleYearPie'),'macarons');
                saleChart.setOption(this.salesMonStatus);
            },
            getData:function(){
                let root=this;
                root.$http.post('/api/statistics/getAllSaleThisYearData', new URLSearchParams(), {
                    headers: {
                        'token': localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if (res.data.status === "success") {
                        //修改为适合table的数据格式
                        let result = res.data.data;
                        for(let i=0;i<result.length;i++){
                            root.salesMonStatus.legend.data.push(result[i].SellType);
                            root.salesMonStatus.series[0].data.push({
                                value:result[i].saleMoney, name:result[i].SellType
                            });
                        }
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
        height:250px;
        padding:20px 10px;
        box-sizing: border-box;
        background:#fff;
    }
    #allSaleYearPie{
        height:100%;
        width:100%;
    }
</style>
