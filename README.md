# zcharts
基于d3.js写的简单图表插件

### 一、介绍
这是我闲暇时间开发的一款插件，主要是利用d3.js的知识，仿照echarts的模式开发的。所有js代码封装成为一个函数，和echarts一样，对外提供了一个配置参数，在使用的时候，按照需要来配置参数，就可以生成对应的图表。

---

### 二、使用方式
1.  获取js文件和css文件
将本GitHub的dist文件夹中的zcharts.min.js下载在项目中。需要注意的是，此js文件依赖d3以及jQuery，可以在本GitHub的bower_components文件寻找。

2. 引入js文件以及css文件
```html
    <script src="bower_components/d3/d3.min.js"></script>
    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="dist/zchart.min.js"></script>
    <link href="dist/zchart.min.css" type="text/css" rel="stylesheet">
```

3. 增加图表容器
在HTML中添加一个用来放置图表的容器，并指定大小。
```html
<div id="time"></div>
```
```css
.time{
            background-color: #fff;
            width:700px;
            height: 400px;
            display: inline-block;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);
        }
```

4. js配置图表参数
```javascript
var timeOption = {
        padding:{top:100,bottom:100,left:50,right:100},
        container:{width:700,height:400},
        color:['#95CCE6','#B6A2DE','#FED23D','#4087D7','#CBD87E'],
        legend:{
            data:["融资数量","融资金额"]
        },
        xAxis :
        {
            data : ["北京加双筷子科技有限公司","北京小桔科技有限公司","南京途牛科技有限公司"],
            name: "创业公司",
            xAxisLable : {
                rotate : -20,
                margin : 40     //刻度标签与轴线之间的距离
            }
        },
        yAxis : [
            {
                name: "融资"
            }
        ],
        series: [
            {
                name:'融资数量',
                type:'line',
                yAxisIndex:0,
                data:[9,23,5]
            },
            {
                name:'融资金额',
                type:'line',
                yAxisIndex:0,
                data:[15,6,18]
            }
        ]
    };

```
>**参数说明：**

>**padding**：定义图表和容器之间的内边距。<br>
>**container**：定义容器的长宽。<br>
>**color**：定义图表对象的颜色，通常为一个数组。一组数据对应数组中的一个颜色。<br>
>**legend**：定义图例。用来显示图表中每一组数据的含义。<br>
>
>**xAxis**：定义x轴。<br>
>>data: 定义x轴显示的内容。<br>
>>name: 定义x轴表示的数据体现的对象。<br>
>>xAxisLable : 定义x轴上的刻度标签。rotate表示旋转的角度，margin表示刻度标签与轴线之间的距离。<br>

>**yAxis**：<br>
>*通常为数组。若需要两个y轴，则里面应该包含两个对象*<br>
>>name: 定义x轴表示的数据体现的对象。<br>

>**series**：<br>
>*用来定义y轴的数据，通常为数组。数组中每个对象都代表一组y轴数据。*<br>
>>name: 定义数据体现的对象。<br>
>>type: 定义数据显示的形式。bar为柱状图，line为折线图，pie为饼图。<br>
>>yAxisIndex: 定义这组数据依赖的y轴，为0则表示对应第一条y轴，为1则对应第二条y轴。（只要一条y轴的时候所有数据的该值都为0）。<br>
>>data:定义该数据的数值。通常为数组。<br>


5. 生成图表
```javascript
 var chart = new zcharts(timeOption);
 chart.initSvg('time',timeOption);
```
---

### 三、案例
为了显示demo效果，上传代码中任然包含bower_components文件。
#### 1.柱状图：
（1）[普通柱状图demo](https://zwl-jasmine95.github.io/zcharts/test/bar/bar.html) <br>
（2）[折、柱混合图demo](https://zwl-jasmine95.github.io/zcharts/test/bar/bar-line.html) <br>
（3）[堆叠柱状图demo](https://zwl-jasmine95.github.io/zcharts/test/bar/stack-bar.html) <br>
#### 2.折线图：
（1）[普通折线图demo](https://zwl-jasmine95.github.io/zcharts/test/line/line.html) <br>
（2）[堆叠折线图demo](https://zwl-jasmine95.github.io/zcharts/test/line/stack-line.html) <br>
#### 3.饼图：
（1）[饼图demo](https://zwl-jasmine95.github.io/zcharts/test/pie/pie.html) <br>

---

### 四、D3.js知识
[d3.js官网](https://d3js.org/) <br>

D3 的全称是（Data-Driven Documents），顾名思义可以知道是一个**被数据驱动的文档**。听名字有点抽象，说简单一点，其实就是一个 JavaScript 的函数库，使用它主要是用来做**数据可视化**的。
根据D3的官方定义：
> D3.js是一个JavaScript库，它可以通过数据来操作文档。D3可以通过使用HTML、SVG和CSS把数据鲜活形象地展现出来。D3严格遵循Web标准，因而可以让你的程序轻松兼容现代主流浏览器并避免对特定框架的依赖。同时，它提供了强大的可视化组件，可以让使用者以数据驱动的方式去操作DOM。    ——D3维基（2013年8月）

