# uchart 散点图横轴需显示为时间的解决方案

需实现横轴显示日期，但官方的横轴只能允许是数字（https://www.ucharts.cn/v2/#/demo/index）  
环境：uniapp  
方案：  
1、根据后端返回的时间数据，找出第一天和最后一天  
2、将时间段的每一天补全,然后将每一天时间映射为数字，具体实现看 exchangeData 函数  
3、根据要求横轴显示个数从时间段找出需要显示的分割点，自定义横轴并显示

```
<template>
	<view class="card-layout">
		<view class="charts-box">
			<view v-if="!showChart" class="no-data-tip">暂无数据</view>
			<view class="charts-box__instance" v-if="showChart">
				<qiun-data-charts
					type="scatter"
					:opts="opts"
					:chartData="chartData"
					:canvas2d="true"
					:canvasId="'scatterCanvas'" />
				<view class="x-axis" v-if="showChart">
					<view style="width: 140rpx"></view>
					<view style="display: flex; flex: 1">
						<view
							class="split-block"
							v-for="value in splitTimeArr"
							:key="value"
							>{{ value }}</view
						>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs";
	import { xAxisStyle, yAxisStyle } from "@/const/echart/option";
	export default {
		props: {
			data: {
				type: Array,
				default: () => {
					return [];
				},
			},
		},
		data() {
			return {
				showChart: true,
				splitTimeArr: [],
				chartData: {},
				// 图例列表
				//您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["rgba(49, 128, 255, 0.5)"],
					padding: [15, 15, 0, 15],
					dataLabel: false,
					enableScroll: false,
					legend: {
						show: false,
					},
					xAxis: {
						...xAxisStyle,
						boundaryGap: "justify",
						fontColor: "#fff",
					},
					yAxis: {
						...yAxisStyle,
						data: [
							{
								// disableGrid: false,
								// gridType: "dash",
								// gridColor: "#E5E6EB",
								axisLine: false,
								unit: "    ",
								format: "yAxisDemo3",
								title: "万元",
								titleOffsetX: -100,
							},
						],
					},
					extra: {
						scatter: {},
					},
				},
			};
		},
		onReady() {
			this.getServerData();
		},
		watch: {
			data: {
				handler(newVal) {
					//console.log("new data",newVal);
					this.data = newVal;
					this.getServerData();
				},
			},
		},
		methods: {
			getServerData() {
				let data = [];
				if (this.data.length > 0) {
					this.showChart = true;
					data = this.exchangeData(this.data);
					console.log("newData", data);
				} else {
					this.showChart = false;
				}

				//console.log("final", data);

				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					series: [
						{
							data: data,
						},
					],
				};
				this.chartData = JSON.parse(JSON.stringify(res));
				//}, 500);
			},
			exchangeData(data) {
				//step 1 补全数组 先将日期补全 formattedDates 为开头日期和结束日期的每一天数组
				//const year = 2023;
				const startDate = dayjs(`${data[0].date}`);
				const endDate = dayjs(`${data[data.length - 1].date}`);
				let formattedDates = [];
				let currentDate = startDate;

				while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
					formattedDates.push(currentDate.format("MM-DD"));
					currentDate = currentDate.add(1, "day");
				}

				//用于记录数据对应的值
				let dic = {};
				data.forEach((item) => {
					let flag = item.dateFormat;
					dic[flag] = item.items;
				});
				// console.log("dic",dic);

				let newData = [];

				for (let i = 0; i < formattedDates.length; i++) {
					//console.log(formattedDates[i]);
					let num = formattedDates[i];
					newData.push({
						date: i, //将formattedDates 与数字做键值映射
						values: dic[num] ? dic[num] : [],
					});
				}

				// console.log("newData",newData);

				//找到X轴需要展示的label
				this.splitTimeArr = this.splitArrayIntoThreeSegments(formattedDates);

				//step 2 转换数据为uchart需要的格式
				return newData.flatMap((obj) =>
					obj.values.map((value) => [obj.date, value])
				);
			},
			//获取分割点
			splitArrayIntoThreeSegments(arr) {
				const length = arr.length;
				if (length > 5) {
					const segmentSize = Math.floor(length / 3);
					const segment1End = segmentSize - 1;
					const segment2End = 2 * segmentSize - 1;
					const splitPoints = [
						arr[0],
						arr[segment1End],
						arr[segment2End],
						arr[length - 1],
					];
					return splitPoints;
				}
				//对于小于等于5的做特殊处理
				switch (length) {
					case 5:
						return [arr[0], arr[2], arr[4]];
						break;
					case 4:
						return arr;
						break;
					case 3:
						for (let i = 1; i < arr.length; i += 2) {
							arr.splice(i, 0, "");
						}
						return arr;
						break;
					case 2:
						return this.insertSpace(arr, 3);
						break;
					case 1:
						return this.insertSpace(arr, 2);
						break;
				}
			},
			//用于 case 1 2的函数
			insertSpace(arr, spaceNum) {
				let emptyStrings = Array(spaceNum).fill("");
				// 在数组中间插入 N 个空字符串
				if (arr.length === 2) {
					let middlePosition = Math.floor(arr.length / 2);
					arr.splice(middlePosition, 0, ...emptyStrings);
				} else {
					arr.splice(1, 0, ...emptyStrings);
				}
				return arr;
			},
		},
	};
</script>

<style scoped lang="scss">
	.no-data-tip {
		width: 100%;
		font-size: 24rpx;
		text-align: center;
		color: #949eaf;
		background: #f6f9ff;
		line-height: 94rpx;
	}
	.card-layout {
		width: 100%;
		padding-bottom: 24rpx;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.charts-box__instance {
		position: relative;
		width: 100%;
		height: 100%;
		.x-axis {
			position: absolute;
			top: 100%;
			margin-top: -12rpx;
			width: 100%;
			display: flex;
			.split-block {
				flex: 1;
				text-align: center;
				font-size: 24rpx;
			}
			.split-block:first-child,
			.split-block:nth-child(2) {
				text-align: left;
			}
			.split-block:last-child {
				text-align: right;
			}
		}
	}
</style>
```

```
export const xAxisStyle = {
	disableGrid: true,
	gridType: "dash",
	gridColor: "#E5E6EB",
};

//yAxis 效果
export const yAxisStyle = {
	disableGrid: false,
	gridType: "dash",
	gridColor: "#E5E6EB",
	showTitle: true,
};
```
