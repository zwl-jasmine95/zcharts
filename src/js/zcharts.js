function zcharts(option) {
    var defaultOpts = {
        
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

        option.series.map(function (d,i) {  //给每组数据插入颜色
            d.color = option.color[i];
        });

        var barData = [];
        var lineData = [];
        var barLegend = [];   //绘制group bar时XScale定义域
        
        //获取柱状图、折线图的独立数据
        option.series.map(function (d,i) {   
            if(d.type == 'bar'){
                barData.push(d);
                barLegend.push(d.name);
            }else if(d.type == 'line'){
                lineData.push(d);
            }
        });

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
            .domain(barLegend)    //legend为数据的名称
            .rangeRoundBands([0,x.xScale.rangeBand()]);
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
                return v;
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
            // .innerTickSize(-height-padding.left).outerTickSize(0)
            .tickPadding(10);
        y.yScale1 = d3.scale.linear()  //y轴比例尺
            .domain([0,y1Max])
            .range([height-padding.top-padding.bottom,0]);
        var yA1 = d3.svg.axis()  //y轴
            .scale(y.yScale1)
            .orient('right')
            // .innerTickSize(-height-padding.left).outerTickSize(0)
            .tickPadding(10);

        y.yAxis.push(yA0);y.yAxis.push(yA1);

        /**
         * end of axis scale
         */

        opts.svg = svg;
        opts.width = width;
        opts.height = height;
        opts.padding = padding;
        opts.x = x;
        opts.y = y;
        opts.barData = barData;
        opts.lineData = lineData;

        option.series.map(function (d,i) {
            if(d.type == 'bar'){
                zcharts.drawBar(opts);
            }else if(d.type == 'line'){
                zcharts.drawLine(opts);
            }
        });

        //添加x轴
        svg.append('g')
            .attr('class','x axis')
            .attr('transform','translate(' + padding.left + ',' + (height - padding.bottom) + ')')
            .call(x.xAxis)
            //增加x坐标值说明
            .append('text')
            .text(x.xName)
            .attr('transform','translate(' + (width - padding.right - padding.left) + ',' + 25 + ')');
        //添加y轴
        option.yAxis.map(function (d,i) {
            if(i == 0){
                svg.append('g')
                    .attr('class','y axis')
                    .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                    .call(y.yAxis[i])
                    //增加y坐标值说明
                    .append('text')
                    .text(y.yName[i])
                    .attr('transform','translate(' + -25 + ',' + -15 + ')');
            }else if(i == 1){
                svg.append('g')
                    .attr('class','y axis')
                    .attr('transform','translate(' + (width - padding.left) + ',' + padding.top + ')')
                    .call(y.yAxis[i])
                    //增加y坐标值说明
                    .append('text')
                    .text(y.yName[i])
                    .attr('transform','translate(' + -25 + ',' + -15 + ')');
            }
        });
    };

    zcharts.drawBar = function (option) {
        var defaultOpts = {
            svg : null,
            width : null,
            height : null,
            padding : null,
            barData : null,
            x : null,
            y : null
        };
        var width = option.width || defaultOpts.width,
            height = option.height || defaultOpts.height,
            svg = option.svg || defaultOpts.svg,
            padding = option.padding || defaultOpts.padding,
            barData = option.barData || defaultOpts.barData,
            x = option.x || defaultOpts.x,
            y = option.y || defaultOpts.y;

        barData.map(function (d,i) {
            //画柱状图
            if(d.yAxisIndex == 0){
                svg.selectAll('.rect' + i )
                    .data(d.data)
                    .enter()
                    .append('rect')
                    .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                    .attr('x',function (v,j) {  //柱状x轴偏移
                        return x.xScale(x.xLabel[j]) + x.xAxisScale(d.name);
                    })
                    .attr('y',function (v,j) {  //柱状y轴偏移
                        return y.yScale0(v);
                    })
                    .attr('width',x.xAxisScale.rangeBand()) //柱状宽度
                    .attr('height',function (d,i) {   //柱状高度
                        return height-y.yScale0(d)-padding.top-padding.bottom;
                    })
                    .attr('fill',d.color);  //颜色
            }else if(d.yAxisIndex == 1){
                svg.selectAll('.rect' + i )
                    .data(d.data)
                    .enter()
                    .append('rect')
                    .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                    .attr('x',function (v,j) {  //柱状x轴偏移
                        return x.xScale(x.xLabel[j]) + x.xAxisScale(d.name);
                    })
                    .attr('y',function (v,j) {  //柱状y轴偏移
                        return y.yScale1(v);
                    })
                    .attr('width',x.xAxisScale.rangeBand()) //柱状宽度
                    .attr('height',function (d,i) {   //柱状高度
                        return height-y.yScale1(d)-padding.top-padding.bottom;
                    })
                    .attr('fill',d.color);  //颜色
            }

        });
    };
    zcharts.drawLine = function (option) {
        var defaultOpts = {
            svg : null,
            padding : null,
            lineData : null,
            x : null,
            y : null
        };
        var svg = option.svg || defaultOpts.svg,
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
                        return x.xScale(x.xLabel[j]);
                    })
                    .y(function(v,j) {
                        return y.yScale0(v);
                    })
                    .interpolate('linear');
            }else if(d.yAxisIndex == 1){
                line = d3.svg.line()
                    .x(function(v,j) {
                        return x.xScale(x.xLabel[j]);
                    })
                    .y(function(v,j) {
                        return y.yScale1(v);
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
    };

    return zcharts;
}