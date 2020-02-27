<template>
    <div class="chart-item">
    <div id="weekSaleChart"></div>
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
                salesMonStatus:{
                    title: {
                        text: '本月销售情况'
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
            this.initChart();
        },
        watch: {
            'softTypeArr': function () {
                let root=this;
                let now = new Date(); //当前日期
                let nowMonth = now.getMonth(); //当前月
                let nowYear = now.getFullYear(); //当前年
                let monWeekArr=this.getMonWeekNumber(nowYear,nowMonth);
                this.salesMonStatus.xAxis[0].data=monWeekArr;
                let weekStartNumber=this.getMonFirstWeekNumber(nowYear,nowMonth);
                root.$http.post('/api/customerOrder/monStatistics',new URLSearchParams(),{
                    headers:{
                        'token':localStorage.getItem('Authorization')　　　//也是在本地中拿到token
                    }
                }).then(res => {
                    // success callback
                    if(res.data.status==="success"){
                        //修改为适合table的数据格式
                        let result=res.data.data.data;

                        for(let i=0;i<root.softTypeArr.length;i++){
                            root.salesMonStatus.legend.data.push(root.softTypeArr[i].selltype);
                            let item={
                                name:root.softTypeArr[i].selltype,
                                type:'line',
                                areaStyle: {},
                                data:[]
                            };
                            for(let n=0;n<monWeekArr.length;n++) {
                                item.data.push(0);
                            }
                            console.log("===="+item.data);
                            for(let j=0;j<result.length;j++){
                                //console.log("xh");
                                //console.log(resultViewArr[j].SellTypeID+","+root.softTypeArr[i].id);
                                if(result[j].SellTypeID===root.softTypeArr[i].id){
                                    for(let k=0;k<monWeekArr.length;k++){
                                        console.log("k"+k);
                                        if(result[j].weekNumber-k===weekStartNumber){
                                            item.data[k]=result[j].countNumber;
                                            break;
                                        }
                                    }
                                }
                            }
                           // console.log("item");
                            //console.log(item);
                            root.salesMonStatus.series.push(item);
                        }
                        //console.log("series");
                        //console.log(root.salesMonStatus.series);
                        root.initChart();
                    }
                });
            }
        },
        methods:{
            initChart:function(){
                let saleChart = echarts.init(document.getElementById('weekSaleChart'),'macarons');
                saleChart.setOption(this.salesMonStatus);
            },
            getMonFirstWeekNumber:function(nowYear,nowMonth){
                let thisMothFristDay=new Date(nowYear, nowMonth, 1);
                let thisYearFristDay=new Date(nowYear,0,1);
                let thisDayNo = Math.round((thisMothFristDay.valueOf() - thisYearFristDay.valueOf()) / 86400000);
                // console.log(thisMothFristDay);
                // console.log(thisYearFristDay);
                // console.log(thisDayNo);
                // console.log(thisYearFristDay.getDay());
                return Math.ceil(
                    (thisDayNo + thisYearFristDay.getDay()) / 7
                );
            },
            getMonWeekNumber:function (year, month) {
                let thisMonFristDay=new Date(year, month, 1);
                let nextMonFristDay=new Date(year,month+1,1);
                let thisDayNo=Math.abs(Math.round((thisMonFristDay.valueOf() - nextMonFristDay.valueOf()) / 86400000));
                let week_count=Math.ceil((thisDayNo+thisMonFristDay.getDay()+(7-nextMonFristDay.getDay()+1))/7);
                let weekArr=[];
                for(let i=0;i<week_count;i++){
                    weekArr.push("第"+(i+1)+"周")
                }
                return weekArr;
            }
        }
    }
</script>

<style scoped>
    .chart-item{
        height:350px;
        width:100%;
        padding:20px;
        box-sizing: border-box;
        background:#fff;
        margin-bottom:20px;
    }
    #weekSaleChart{
        height:100%;
        width:100%;
    }
</style>
