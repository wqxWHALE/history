var imageAniTime = 75,
	imageEndWidth = 2.49,
	repeatFlag = false;

var width = window.innerWidth,
	height = window.innerHeight;
console.log(width);
console.log(height);

var canvas1 = document.getElementById("pic");
var context1 = canvas1.getContext("2d");
canvas1.style.marginLeft = -width / 2 + "px";
canvas1.width = width;
canvas1.height = height;

var offCanvas = document.createElement("canvas");
var offContext = offCanvas.getContext("2d");
offCanvas.style.marginLeft = -width / 2 + "px";
offCanvas.width = width;
offCanvas.height = height;

var offCanvasArr = [];

var txImgUrl = [];
for (var i = 1; i <= 95; i++) {
	var urlTemp = "./images/tx/tx" + i + ".jpg?v=1.7";
	txImgUrl.push(urlTemp);
}

var txImgObjs = [];
var store1 = {};

var r = document.getElementById("repeatBtn");
var h = window.innerHeight;

//console.log(canvas1.width);
//console.log(Math.random()*canvas1.width);

loadComplete();

function loadImg() {
	for (var i = 0; i < txImgUrl.length; i++) {
		var txImg = new Image();
		txImg.src = txImgUrl[i];
		txImg.onload = function () {
			txImgObjs.push(this);
		};
	}
}
function loadComplete() {
	loadImg();
	initLogo();
}

function initLogo() {
	var logoImg = new Image();
	logoImg.src = "./images/logo.png?v=1.83";
	logoImg.crossOrigin = "anonymous";
	logoImg.onload = function () {
		offContext.clearRect(0, 0, canvas1.width, canvas1.height);
		offContext.drawImage(
			logoImg,
			(canvas1.width - 165) / 2,
			(canvas1.height - 240) / 2 - 80,
			165,
			240
		);
		// 获得像素点坐标
		getPoints();
		//refreshPoints1(true);
		// 动画
		var checkImg = setInterval(function () {
			//console.log(txImgObjs.length);
			//console.log(txImgUrl.length);
			if (txImgObjs.length == txImgUrl.length) {
				refreshPoints1(false);
				context1.drawImage(offCanvas, 0, 0);
				clearInterval(checkImg);
				becomeLogo();
			}
		}, 50);
	};
}

function becomeLogo() {
	refreshPoints1(true);
}

// 实例方法
function Dot(coord, maxX, imgIndex) {
	// 一开始新建实例的圆心坐标
	//this.arcX = width / 2;
	//this.arcY = height / 2;
	//获得随机点
	this.arcX = getRandowX(maxX);
	this.arcY = getRandowY();

	this.orgArcX = this.arcX;
	this.orgArcY = this.arcY;
	//获得随机缩放数值

	// 默认透明度
	this.opacity = getRandowOpacity;
	// 初始时间
	this.start = 0;

	this.imageWidth = getRandowWidth();
	this.imageHeight = this.imageWidth;

	this.startWidth = this.imageWidth;
	this.startHeight = this.imageHeight;

	this.cacheCanvas = document.createElement("canvas");
	this.cacheCtx = this.cacheCanvas.getContext("2d");
	this.cacheCanvas.width = this.startWidth;
	this.cacheCanvas.height = this.startHeight;
	this.cacheCtx.drawImage(
		txImgObjs[imgIndex],
		0,
		0,
		this.startWidth,
		this.startHeight
	);

	// 绘制方法
	this.draw = function (ctx) {
		offContext.drawImage(
			this.cacheCanvas,
			this.arcX,
			this.arcY,
			this.imageWidth,
			this.imageHeight
		);

		//offContext.drawImage(txImgObjs[imgIndex],this.arcX, this.arcY,this.imageWidth,this.imageHeight);
		// 填充绘制的圆
		//ctx.fillStyle = 'rgba(59,166,241,'+ this.opacity +')';
		//}
	};
}

function getPoints() {
	// 间隙大小
	var gap = 2;
	var imgData = offContext.getImageData(0, 0, width, height).data;

	points = [];
	var pos = [];

	var x = 0,
		y = 0,
		index = 0;
	for (var i = 0; i < imgData.length; i += 4 * gap) {
		if (imgData[i + 3] == 255) {
			// 塞入此时的坐标
			pos.push({
				x: x,
				y: y,
			});
		}
		index = Math.floor(i / 4);
		x = index % width;
		y = Math.floor(index / width);
		if (x >= width - gap) {
			i += gap * 4 * width;
		}
	}
	points = pos;
	console.log(points.length);
}

function refreshPoints1(refreshFlag) {
	var canvas = document.querySelector("#pic");
	var context = canvas.getContext("2d");
	// 画布尺寸
	var width = canvas.width;
	var height = canvas.height;

	// 是否继续不断重绘标志量
	var flag = true;

	// 绘制坐标移动与绘制
	var draw = function () {
		// 位置移动
		for (var index in store1) {
			var dot = store1[index];

			// 目标位置
			var startX = dot.startX;
			var startY = dot.startY;

			// 结束时间
			var end = imageAniTime;

			var distanceX = dot.distanceX;
			var distanceY = dot.distanceY;

			var distanceWidth = dot.startWidth - imageEndWidth;
			var everyWidth = distanceWidth / end;

			dot.start++;
			//Tween.Expo.easeOutTween.Linear
			var arcX = Tween.Linear(dot.start, startX, distanceX, end);
			var arcY = Tween.Linear(dot.start, startY, distanceY, end);

			if (dot.imageWidth > imageEndWidth) {
				dot.imageWidth -= everyWidth;
			}
			if (dot.imageHeight > imageEndWidth) {
				dot.imageHeight -= everyWidth;
			}

			// 动画结束，停止继续绘制
			if (dot.start >= end) {
				dot.arcX = distanceX + startX;
				dot.arcY = distanceY + startY;
				flag = false;
			} else {
				dot.arcX = arcX;
				dot.arcY = arcY;
			}
			// 根据新圆心坐标绘制圆
			dot.draw(offContext);
		}
	};

	var init = function () {
		// 看看点实例够不够，因为不同图形的坐标点个数是不一样的
		//console.log(Object.keys(store1).length);
		//console.log(points.length);
		var lengthExist = Object.keys(store1).length;
		var lengthPoints = points.length;

		if (lengthExist > lengthPoints) {
			// 原来有些点要隐藏
			(function () {
				for (var index in store1) {
					var dot = store1[index];
					// 初始化动画时间
					dot.start = 0;
					if (index >= lengthPoints) {
						// 多余的实例看不见

						dot.opacity = 0;
					}
				}
			})();
		}

		// 对即将参与动画的点进行数据初始化

		points.forEach(function (coord, index) {
			var dot = store1[index];
			if (!dot) {
				var imgIndex;
				if (index % txImgObjs.length == 0) {
					imgIndex = 0;
				} else {
					imgIndex = index % txImgObjs.length;
				}
				dot = new Dot(coord, 500, imgIndex);
				store1[index] = dot;
			}

			// 给予dot目标位置
			dot.startX = dot.arcX;
			dot.startY = dot.arcY;

			dot.endX = coord.x;
			dot.endY = coord.y;

			// 确定好移动距离
			dot.distanceX = coord.x - dot.arcX;
			dot.distanceY = coord.y - dot.arcY;
			// 初始化动画时间
			dot.start = 0;
		});
	};

	// 初始化
	init();
	//alert("initCompete");

	// 绘制画布上所有的圆圈圈
	// 画布渲染
	var render = function () {
		// 清除画布
		context1.clearRect(0, 0, width, height);
		offContext.clearRect(0, 0, width, height);

		draw();
		//alert("drawComplete");
		if (refreshFlag) {
			context1.drawImage(offCanvas, 0, 0);
		}
		//var offCanvasTemp=offCanvas;
		//offCanvasArr.push(offCanvasTemp);
		// 继续渲染
		if (refreshFlag) {
			if (flag == true) {
				requestAnimationFrame(render);
			} else {
				r.style.opacity = 0;
				r.style.display = "block";

				var repeatTimer = setInterval(function () {
					if (Number(r.style.opacity) < 1) {
						r.style.opacity = Number(r.style.opacity) + 0.1;
					} else {
						clearInterval(repeatTimer);
						r.addEventListener("click", repeat, false);
						function repeat() {
							r.removeEventListener("click", repeat, false);
							toOriginal();
						}
					}
				}, 50);
			}
		}
	};

	render();
}

function toOriginal() {
	canvas1.style.opacity = 1;
	r.style.opacity = 1;

	var orginalTimer = setInterval(function () {
		if (Number(canvas1.style.opacity > 0)) {
			canvas1.style.opacity = Number(canvas1.style.opacity) - 0.1;
			r.style.opacity = Number(r.style.opacity) - 0.1;
			//cn.style.opacity=Number(cn.style.opacity)-0.1;
		} else {
			clearInterval(orginalTimer);
			canvas1.style.display = "none";
			r.style.display = "none";
			canvas1.style.display = 1;
			r.style.display = 1;
			offContext.clearRect(0, 0, width, height);
			for (var index in store1) {
				var dot = store1[index];
				dot.arcX = getRandowX(500);
				dot.arcY = getRandowY();
				dot.imageWidth = dot.startWidth;
				dot.imageHeight = dot.startWidth;
				dot.draw(offContext);
			}
			context1.clearRect(0, 0, width, height);
			context1.drawImage(offCanvas, 0, 0);
		}
	}, 50);
}

function getRandowOpacity() {
	var randowOpacity = Math.floor(Math.random() * 0.6);
	return randowOpacity;
}

function getRandowWidth() {
	var randowWidth = Math.floor(Math.random() * (40 - 5 + 1) + 5);
	return randowWidth;
}
//获得随机点
function getRandowX(maxX) {
	var randowX = Math.random() * canvas1.width;
	if (randowX < canvas1.width / 2) {
		randowX -= Math.random() * maxX;
	} else {
		randowX += Math.random() * maxX;
	}
	return randowX;
}

function getRandowY() {
	var randowY = Math.random() * canvas1.height;
	if (randowY < canvas1.height / 2) {
		randowY -= Math.random() * 200;
	} else {
		randowY += Math.random() * 200;
	}
	return randowY;
}
