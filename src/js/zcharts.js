function zcharts(params) {

    params.series.map(function (d,i) {

    });
    var defaultOpts = {
        padding:{top:100,bottom:100,left:100,right:100},
        container:{width:600,height:400},
        color:['#95CCE6','#B6A2DE','#FED23D','#4087D7','#CBD87E'],
        legend:[],
        xAxis :
        {
            data : [],
            name: "",
            xAxisLable : {
                rotate : 0,
                margin : 0     //刻度标签与轴线之间的距离
            }
        },
        yAxis : [
            {
                name: ""
            }
        ],
        series: [
            {
                name:'融资数量',
                type:'bar',
                yAxisIndex:0,
                data:[4,8,9]
            },
            {
                name:'融资金额',
                type:'bar',
                yAxisIndex:1,
                data:[18981,3310106,1199877]
            }
        ]
    };

    var zcharts = {};

    zcharts.drawSvg = function (id,option) {
        var opts = {};   //需要传递给画图区域的参数

        var width = option.container.width,
            height = option.container.height,
            padding = option.padding;

        var svg = d3.select('body').select('#'+id).append('svg')  //绘制画图区域
            .attr('width',width)
            .attr('height',height);

        var tooltip = d3.select("body")   //提示框
            .append("div")
            .attr("class","tooltip")
            .style("opacity",0.0);

        /**
         * 保存通用参数
         * (1)画板及其长宽、边距
         * (2)绘图数据
         * (3)提示框tooltip
         */
        opts.svg = svg;
        opts.width = width;
        opts.height = height;
        opts.padding = padding;
        opts.series = option.series;
        opts.legend = option.legend;
        opts.tooltip = tooltip;

        /**
         * 判断绘图数据类型
         * (1)饼图单独绘制（一条数据类型为饼图，其他数据类型必然为饼图）
         * (2)柱状图、折线图可混合绘制
         */
        if(option.series[0].type == 'pie'){
            option.series.map(function (d,i) {
                d.data.map(function (v,j) {
                    v.color = option.color[(i + 1) * j];
                });
            });

            zcharts.drawPie(opts);

        }else{
            var barData = [];
            var lineData = [];
            var xAxisBarNum = [];   //绘制group bar时XScale定义域

            /**
             * 处理柱状、折线的初始数据
             * (1)获取柱状图、折线图的独立数据
             * (2)获取x轴每个刻度的输入域——根据stack的值判断x轴每个刻度中柱状的个数
             */
            option.series.map(function (d,i) {
                d.color = option.color[i]; //给每组数据插入颜色

                if(d.type == 'bar'){
                    barData.push(d);

                    /**
                     * 获取xAxisBarNum的值
                     * (1)当stack为空时，即没有设置值，则该柱状图单独绘制，name值插入xAxisBarNum
                     * (2)当stack有值时，若xAxisBarNum中没有值与它相同，则插入stack的值，否则不插入。
                     */
                    if(!d.stack){
                        xAxisBarNum.push(d.name);
                    }else{
                        if(!xAxisBarNum && !xAxisBarNum.length) {  /*xAxisBarNum为空时*/
                            xAxisBarNum.push(d.stack);
                        }else{
                            var tag = 0;
                            xAxisBarNum.map(function (v,j) {
                                if(d.stack == v) {
                                    tag = 1;
                                }
                            });
                            if(tag == 0){
                                xAxisBarNum.push(d.stack);
                            }
                        }
                    }

                }else if(d.type == 'line'){
                    lineData.push(d);
                }
            });

            /**堆叠布局函数*/
            var stack = d3.layout.stack()   //构造一个新的默认的堆叠布局。
                .values(function (v,j) { return v.data });

            /**
             * 堆叠布局
             *          ——柱状图
             * (1)处理barData，使其每一项的data的子项从数字变为对象.方便获取y0
             * (2)给stack值为null的数据单独计算基线
             * (3)单独获取stack值相同的需要堆叠的数据
             * (4)给单独获取的堆叠数据计算基线——添加y0参数
             */
            var tempBar = {};  //将barData根据stack的值进行分组
            barData.map(function (d,i) {
                var objdata = [];
                d.data.map(function (v,j) {
                    var obj = {};
                    obj.x = option.xAxis.data[j];
                    obj.y = v;
                    objdata.push(obj);
                });
                d.data = objdata;

                /*将stack值相同的数据放在一个数组里*/
                var stackName = d.stack || d.name;
                tempBar[stackName] = tempBar[stackName] || [];
                tempBar[stackName].push(d);
            });

            for(var i in tempBar){
                var d = tempBar[i];
                stack(d);
                /*将获取到y0的数据塞回原数据barData*/
                d.map(function (v,j) {
                    barData.map(function (m,k) {
                        if(m.name == v.name){
                            m.data = v.data;
                        }
                    });
                });
            }

            /**
             * 堆叠布局
             *          ——折线图
             * (1)处理lineData，使其每一项的data的子项从数字变为对象.方便获取y0
             * (2)给stack值为null的数据单独计算基线
             * (3)单独获取stack值相同的需要堆叠的数据
             * (4)给单独获取的堆叠数据计算基线——添加y0参数
             */
            var tempLine = {};  //将barData根据stack的值进行分组
            lineData.map(function (d,i) {
                var objdata = [];
                d.data.map(function (v,j) {
                    var obj = {};
                    obj.x = option.xAxis.data[j];
                    obj.y = v;
                    objdata.push(obj);
                });
                d.data = objdata;

                /*将stack值相同的数据放在一个数组里*/
                var stackName = d.stack || d.name;
                tempLine[stackName] = tempLine[stackName] || [];
                tempLine[stackName].push(d);
            });

            for(var i in tempLine){
                var d = tempLine[i];
                stack(d);
                /*将获取到y0的数据塞回原数据barData*/
                d.map(function (v,j) {
                    lineData.map(function (m,k) {
                        if(m.name == v.name){
                            m.data = v.data;
                        }
                    });
                });
            }

            /**
             * 绘制x轴比例尺
             */
            var x = {};
            x.xName = option.xAxis.name;  //x轴说明文字
            x.xLabel = option.xAxis.data;

            x.xScale = d3.scale.ordinal()
                .domain(x.xLabel)
                .rangeRoundBands([0,width-padding.left-padding.right],.1);
            x.xAxisScale = d3.scale.ordinal()  //柱状图x区间段比例尺
                .domain(xAxisBarNum)    //xAxisBarNum为数据的名称
                .rangeRoundBands([0,x.xScale.rangeBand()],.1);
            x.xAxis = d3.svg.axis()
                .scale(x.xScale)
                .orient('bottom')
                .tickPadding(10);

            /**
             * 绘制y轴比例尺
             */
            var y = {};
            y.yAxis = [];
            y.yName = [];
            var y0Max = 0;
            var y1Max = 0;

            option.series.map(function (d,i) {
                var max = d3.max(d.data,function (v,j) {
                        return v.y + v.y0;
                });
                if(d.yAxisIndex == 0){
                    y0Max = y0Max > max ? y0Max : max;
                }else if(d.yAxisIndex == 1){
                    y1Max = y1Max > max ? y1Max : max;
                }
            });

            option.yAxis.map(function (d,i) {
                y.yName.push(d.name);  //y轴说明文字
            });

            y.yScale0 = d3.scale.linear()  //y轴比例尺
                .domain([0,y0Max])
                .range([height-padding.top-padding.bottom,0]);
            var yA0 = d3.svg.axis()  //y轴
                .scale(y.yScale0)
                .orient('left')
                .tickPadding(10);
            y.yScale1 = d3.scale.linear()  //y轴比例尺
                .domain([0,y1Max])
                .range([height-padding.top-padding.bottom,0]);
            var yA1 = d3.svg.axis()  //y轴
                .scale(y.yScale1)
                .orient('right')
                .tickPadding(10);

            y.yAxis.push(yA0);y.yAxis.push(yA1);

            /**
             * end of axis scale
             */

            //添加x轴
            svg.append('g')
                .attr('class','x axis')
                .attr('transform','translate(' + padding.left + ',' + (height - padding.bottom) + ')')
                .call(x.xAxis)
                //增加x坐标值说明
                .append('text')
                .text(x.xName)
                .attr('transform','translate(' + (width - padding.right - padding.left) + ',' + 25 + ')');


            //旋转x轴刻度尺
            d3.selectAll("g.x g.tick text")
                .attr("x", -option.xAxis.xAxisLable.margin)
                .attr("transform", "rotate(" + option.xAxis.xAxisLable.rotate + ")");

            //添加y轴
            option.yAxis.map(function (d,i) {
                var yaxis;
                if(i == 0){
                    yaxis = svg.append('g')
                        .attr('class','y axis')
                        .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                        .call(y.yAxis[i]);
                }else if(i == 1){
                    yaxis = svg.append('g')
                        .attr('class','y axis')
                        .attr('transform','translate(' + (width - padding.right) + ',' + padding.top + ')')
                        .call(y.yAxis[i]);
                }
                yaxis.append('text')
                    .text(y.yName[i])
                    .attr('transform','translate(' + -25 + ',' + -15 + ')');
            });

            /**
             * 保存柱状图、折线图的绘制参数
             * (1)x、y轴数据-比例尺、标签...
             * (2)绘图数据
             */
            opts.x = x;
            opts.y = y;
            opts.barData = barData;
            opts.lineData = lineData;

            if(barData && barData.length){
                zcharts.drawBar(opts);
            }
            if(lineData && lineData.length){
                zcharts.drawLine(opts);
            }
        }
    };

    zcharts.drawBar = function (option) {
        var defaultOpts = {
            svg : null,
            tooltip : null,
            width : null,
            height : null,
            padding : null,
            barData : null,
            xAxisBarNum : null,
            x : null,
            y : null
        };
        var width = option.width || defaultOpts.width,
            height = option.height || defaultOpts.height,
            svg = option.svg || defaultOpts.svg,
            tooltip = option.tooltip || defaultOpts.tooltip,
            padding = option.padding || defaultOpts.padding,
            barData = option.barData || defaultOpts.barData,
            x = option.x || defaultOpts.x,
            y = option.y || defaultOpts.y;

        barData.map(function (d,i) {
            var group = svg.append("g")  //用g表示一个数据组，每个数据组里是对应数据块
                .attr("class","rectGroup")
                .attr("fill",d.color)
                .attr("transform","translate(" + padding.left + "," + padding.top + ")");

            //画柱状图
            var rect = group.selectAll('.rect' + i )
                .data(d.data)
                .enter()
                .append('rect')
                .attr('width',x.xAxisScale.rangeBand()) //柱状宽度
                .attr('fill',d.color);  //颜色

            if(d.stack){
                rect.attr('x',function (v,j) {  //柱状x轴偏移
                    return x.xScale(v.x) + x.xAxisScale(d.stack);
                });
            }else{
                rect.attr('x',function (v,j) {  //柱状x轴偏移
                    return x.xScale(v.x) + x.xAxisScale(d.name);
                });
            }
            if(d.yAxisIndex == 0){
                rect.attr('y',function (v,j) {  //柱状y轴偏移
                        return y.yScale0(v.y0)-(height-padding.top - padding.bottom - y.yScale0(v.y));
                    })
                    .attr('height',function (v,j) {   //柱状高度
                        return height-padding.top - padding.bottom - y.yScale0(v.y);
                    });

            }else if(d.yAxisIndex == 1){
                rect.attr('y',function (v,j) {  //柱状y轴偏移
                        return y.yScale1(v.y + v.y0);
                    })
                    .attr('height',function (v,j) {   //柱状高度
                        return height-y.yScale1(v.y + v.y0)-padding.top-padding.bottom;
                    });
            }
        });
        svg.selectAll("rect")
            .on("mouseover",function(v,j){
                d3.select(this).attr('opacity',0.8);
                /**
                 *鼠标移入时，
                 *（1）通过 selection.html() 来更改提示框的文字
                 *（2）通过更改样式 left 和 top 来设定提示框的位置
                 *（3）设定提示框的透明度为0.6
                 */
                tooltip.html(barData[Math.floor(j/x.xLabel.length)].name + "<br />" +
                        v.x + ":" + v.y)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity",0.6);
            })
            .on("mousemove",function(d){
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout",function(d){
                d3.select(this).attr('opacity',1);
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
                tooltip.style("opacity",0.0);
            });
    };
    zcharts.drawLine = function (option) {
        var defaultOpts = {
            svg : null,
            tooltip : null,
            padding : null,
            lineData : null,
            x : null,
            y : null
        };
        var svg = option.svg || defaultOpts.svg,
            tooltip = option.tooltip || defaultOpts.tooltip,
            padding = option.padding || defaultOpts.padding,
            lineData = option.lineData || defaultOpts.lineData,
            x = option.x || defaultOpts.x,
            y = option.y || defaultOpts.y;

        lineData.map(function (d,i) {
            var line,circle;
            //画折线
            if(d.yAxisIndex == 0){
                line = d3.svg.line()
                    .x(function(v,j) {
                        return x.xScale(v.x);
                    })
                    .y(function(v,j) {
                        return y.yScale0(v.y + v.y0);
                    })
                    .interpolate('linear');
            }else if(d.yAxisIndex == 1){
                line = d3.svg.line()
                    .x(function(v,j) {
                        return x.xScale(v.x);
                    })
                    .y(function(v,j) {
                        return y.yScale1(v.y + v.y0);
                    })
                    .interpolate('linear');
            }
            //插入折线
            svg.append('path')
                .attr('class', 'line')
                .attr('stroke', d.color)
                .attr('d', line(d.data))
                .attr('transform','translate(' + (padding.left + x.xScale.rangeBand()/2) + ',' + padding.top + ')');

            //打点
            circle = svg.selectAll('.circle')
                .data(d.data)
                .enter()
                .append('circle')
                .attr('class', 'linecircle')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 3)
                .attr('stroke', d.color)
                .attr('transform','translate(' + (padding.left + x.xScale.rangeBand()/2) + ',' + padding.top + ')');
        });
        svg.selectAll("circle")
            .on("mouseover",function(v,j){
                /**
                 *鼠标移入时，
                 *（1）通过 selection.html() 来更改提示框的文字
                 *（2）通过更改样式 left 和 top 来设定提示框的位置
                 *（3）设定提示框的透明度为0.6
                 */
                d3.select(this).style('fill',lineData[Math.floor(j/x.xLabel.length)].color)
                    .attr('r',3.5);
                tooltip.html(lineData[Math.floor(j/x.xLabel.length)].name + "<br />" +
                        v.x + ":" + v.y)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity",0.6);
            })
            .on("mousemove",function(d){
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout",function(d){
                d3.select(this).style('fill','#fff')
                    .attr('r',3);
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
                tooltip.style("opacity",0.0);
            });
    };

    zcharts.drawPie = function (option) {
        var defaultOpts = {
            svg : null,
            tooltip : null,
            width : null,
            height : null,
            series : null
        };

        var width = option.width || defaultOpts.width,
            height = option.height || defaultOpts.height,
            svg = option.svg || defaultOpts.svg,
            tooltip = option.tooltip || defaultOpts.tooltip,
            series = option.series || defaultOpts.series;

        var pie = d3.layout.pie(); //构造一个新的默认的饼布局

        series.map(function (d,i) {
            var data = [];
            d.data.map(function (v,j) {
                data.push(v.value);
            });

            var piedata = pie(data);  //转换后的数据

            var arc = d3.svg.arc()  //弧生成器
                .innerRadius(d.radius[0])   //设置内半径
                .outerRadius(d.radius[1]);  //设置外半径

            var piebox = svg.append("g")
                .attr("class","piebox");

            /**
             * 绘制饼图
             */
            var arcs = piebox.selectAll("g")  //生成圆弧（g）
                .data(piedata)
                .enter()
                .append("g")
                .attr("transform","translate(" + (width * d.center[0]) + "," + (height * d.center[1]) + ")");

            arcs.on("mouseover",function(v,j){
                    d3.select(this).attr('opacity',0.6);
                    /**
                     *鼠标移入时，
                     *（1）通过 selection.html() 来更改提示框的文字
                     *（2）通过更改样式 left 和 top 来设定提示框的位置
                     *（3）设定提示框的透明度为0.6
                     */
                    tooltip.html(d.name + "<br />" +
                            d.data[j].name + ":" + d.data[j].value)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity",0.6);
                })
                .on("mousemove",function(d){
                    /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
                    tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px");
                })
                .on("mouseout",function(d){
                    d3.select(this).attr('opacity',1);
                    /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
                    tooltip.style("opacity",0.0);
                });

            var path = arcs.append("path")
                .attr("fill",function(v,j){
                    return d.data[j].color;
                })
                .attr("d",function(v){
                    return arc(v);
                });

            arcs.append("text")
                .attr("transform",function(d){
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor","middle")
                .text(function(d){
                    return d.data;
                });

            /**
             * 绘制说明文字
             */


            /**
             * 绘制指示折线
             */


        });

    };
    zcharts.drawLegend = function (option) {
        var defaultOpts = {
            svg : null,
            tooltip : null,
            padding : null,
            lineData : null
        };
        var svg = option.svg || defaultOpts.svg,
            tooltip = option.tooltip || defaultOpts.tooltip,
            padding = option.padding || defaultOpts.padding,
            lineData = option.lineData || defaultOpts.lineData,
            barData = option.lineData || defaultOpts.barData;

        var legend = svg.append('g')
            .attr('class','legend')
            .attr('transform','translate(' + padding.left + ',' + (height - padding.bottom) + ')');
        legend.selectAll('rect')
            .data(barData)
            .enter()
            .append('rect')
            .attr();

    };

    return zcharts;
}