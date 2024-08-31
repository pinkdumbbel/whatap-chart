const XAXIS_PADDING = 15;
const YAXIS_PADDING = 25;
const DURATION = 1000 * 30;
const MAX_VALUE = 100;
const Y_TICK_COUNT = 5;
const X_TICK_COUNT = 6;
const TOP_PADDING = 15;
const EX_TEXT = "00:00";

class LineChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;

    this.chartWidth = this.canvasWidth - YAXIS_PADDING;
    this.chartHeight = this.canvasHeight - XAXIS_PADDING - TOP_PADDING;

    this.xFormatWidth = this.ctx.measureText(EX_TEXT).width;

    this.setTime();
    this.drawChart();
  }

  //시간을 실시간으로 세팅하는 함수
  setTime = () => {
    this.endTime = Date.now();
    this.startTime = this.endTime - DURATION;
    this.setXInterval();
  };

  setXInterval = () => {
    let xPoint = 0;
    let timeInterval = 1000;

    while (true) {
      xPoint = (timeInterval / DURATION) * this.chartWidth;
      if (xPoint > this.xFormatWidth) break;
      timeInterval *= 2;
    }

    this.xTimeInterval = timeInterval;
  };

  //차트를 그리는 함수
  drawChart = () => {
    const { ctx, canvasWidth, chartWidth, chartHeight } = this;

    ctx.beginPath();
    ctx.moveTo(YAXIS_PADDING, TOP_PADDING);

    //YAXIS
    ctx.lineTo(YAXIS_PADDING, chartHeight + TOP_PADDING);
    const yInterval = MAX_VALUE / (Y_TICK_COUNT - 1);
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";

    for (let i = 0; i < Y_TICK_COUNT; i++) {
      const value = yInterval * i;
      const yPoint =
        TOP_PADDING + chartHeight - (value / MAX_VALUE) * chartHeight;

      ctx.fillText(value, YAXIS_PADDING - 3, yPoint);
    }

    //XAXIS
    ctx.lineTo(canvasWidth, chartHeight + TOP_PADDING);
    ctx.stroke();

    let currentTime = this.startTime - (this.startTime % this.xTimeInterval);

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    while (currentTime < this.endTime + this.xTimeInterval) {
      const xPoint = ((currentTime - this.startTime) / DURATION) * chartWidth;
      const date = new Date(currentTime);
      const text =
        date.getMinutes() + ":" + date.getSeconds().toString().padStart(2, "0");

      ctx.fillText(text, xPoint, chartHeight + TOP_PADDING + 4);
      currentTime += this.xTimeInterval;
    }
  };

  //데이터를 갱신하는 함수
  updateData = () => {};
}

document.addEventListener("DOMContentLoaded", () => {
  new LineChart("lineChart");
});
