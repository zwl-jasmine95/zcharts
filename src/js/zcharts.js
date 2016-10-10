function zcharts(params) {
    var defaultOpts = {
        
    };
    var zcharts = {};


    zcharts.drawDoubleyAxis = function (id,option) {
        var opts = {};
        var width = option.container.width;
        var height = option.container.height;
        var padding = option.padding;

        var svg = d3.select('body').select('#'+id).append('svg')  //绘制画图区域
            .attr('width',width)
            .attr('height',height);

        option.series.map(function (d,i) {
            d.color = option.color[i];
        });

        var barData = [];
        var lineData = [];
        var barLegend = [];
        option.series.map(function (d,i) {
            if(d.type == 'bar'){
                barData.push(d);
                barLegend.push(d.name);
            }else if(d.type == 'line'){
                lineData.push(d);
            }
        });

        var xLabel = option.xAxis.data;
        var xScale = d3.scale.ordinal()
            .domain(xLabel)
            .rangeRoundBands([0,width-padding.left-padding.right],.1);
        var xAxisScale = d3.scale.ordinal()  //柱状图x区间段比例尺
            .domain(barLegend)    //legend为数据的名称
            .rangeRoundBands([0,xScale.rangeBand()]);
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        option.series.map(function (d,i) {
            var yMax = d3.max(d.data,function (v,j) {
                return v;
            });
            var yScale = d3.scale.linear()
                .domain([0,yMax])
                .range([height-padding.top-padding.bottom]);
            var yAxis;
            if(i == 0){
                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');
            }else if(i == 1){
                yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('right');
            }
            if(d.type == 'bar'){
                zcharts.drawBar(width,height,barData,xScale,xLabel,xAxisScale,yScale);
            }else if(d.type == 'line'){
                zcharts.drawLine(barData,xScale,xLabel,yScale)
            }
            //添加x轴
            svg.append('g')
                .attr('class','x axis')
                .attr('transform','translate(' + padding.left + ',' + (height - padding.bottom) + ')')
                .call(xAxis)
                //增加x坐标值说明
                .append('text')
                .text('月份')
                .attr('transform','translate(' + (width - padding.right - padding.left) + ',' + 18 + ')');
            //添加y轴
            svg.append('g')
                .attr('class','y axis')
                .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                .call(yAxis)
                //增加y坐标值说明
                .append('text')
                .text('数量')
                .attr('transform','translate(' + -25 + ',' + -5 + ')');

        });
    };

    zcharts.drawBar = function (option) {
        var defaultOpts = {
            svg : null,
            width : null,
            height : null,
            padding : null,
            barData : null,
            xScale : null,
            xLabel : null,
            xAxisScale : null,
            yScale : null
        };
        var width = option.width || defaultOpts.width,
            svg = option.svg || defaultOpts.svg,
            height = option.height || defaultOpts.height,
            padding = option.padding || defaultOpts.padding,
            barData = option.barData || defaultOpts.barData,
            xScale = option.xScale || defaultOpts.xScale,
            xLabel = option.xLabel || defaultOpts.xLabel,
            xAxisScale = option.xAxisScale || defaultOpts.xAxisScale,
            yScale = option.yScale || defaultOpts.yScale;
        
        barData.map(function (d,i) {
            //画柱状图
            svg.selectAll('.rect' + i )
                .data(d.data)
                .enter()
                .append('rect')
                .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
                .attr('x',function (v,j) {  //柱状x轴偏移
                    return xScale(xLabel[j]) + xAxisScale(d.name);
                })
                .attr('y',function (v,j) {  //柱状y轴偏移
                    return yScale(v);
                })
                .attr('width',xAxisScale.rangeBand()) //柱状宽度
                .attr('height',function (d,i) {   //柱状高度
                    return height-yScale(d)-padding.top-padding.bottom;
                })
                .attr('fill',d.color);  //颜色
            
        });
    };
    zcharts.drawLine = function (option) {
        var defaultOpts = {
            svg : null,
            width : null,
            height : null,
            padding : null,
            lineData : null,
            xScale : null,
            xLabel : null,
            xAxisScale : null,
            yScale : null
        };
        var width = option.width || defaultOpts.width,
            svg = option.svg || defaultOpts.svg,
            height = option.height || defaultOpts.height,
            padding = option.padding || defaultOpts.padding,
            lineData = option.lineData || defaultOpts.lineData,
            xScale = option.xScale || defaultOpts.xScale,
            xLabel = option.xLabel || defaultOpts.xLabel,
            xAxisScale = option.xAxisScale || defaultOpts.xAxisScale,
            yScale = option.yScale || defaultOpts.yScale;

        lineData.map(function (d,i) {
            //画折线
            var line = d3.svg.line()
                .x(function(v,j) {
                    return xScale(xLabel[j]);
                })
                .y(function(v,j) {
                    return yScale(v);
                })
                .interpolate('linear');
            //插入折线
            svg.append('path')
                .attr('class', 'line')
                .attr('stroke', d.color)
                .attr('d', line(d.data))
                .attr('transform','translate(' + (padding.left + xScale.rangeBand()/2) + ',' + padding.top + ')');

            //打点
            var circle = svg.selectAll('.circle')
                .data(d.data)
                .enter()
                .append('circle')
                .attr('class', 'linecircle')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 3)
                .attr('stroke', d.color)
                .attr('transform','translate(' + (padding.left + xScale.rangeBand()/2) + ',' + padding.top + ')');

            
        });
    };
    zcharts.drawSvg = function (id,option) {
        var opts = {};
        var width = option.container.width,
            height = option.container.height,
            padding = option.padding;

        var svg = d3.select('body').select('.'+id).append('svg')  //绘制画图区域
            .attr('width',width)
            .attr('height',height);

        option.series.map(function (d,i) {
            d.color = option.color[i];
        });

        var barData = [];
        var lineData = [];
        var barLegend = [];
        option.series.map(function (d,i) {
            if(d.type == 'bar'){
                barData.push(d);
                barLegend.push(d.name);
            }else if(d.type == 'line'){
                lineData.push(d);
            }
        });

        var xLabel = option.xAxis.data;
        var yMax = d3.max(option.series,function (d,i) {
            return d3.max(d.data,function (v,j) {
                return v;
            });
        });

        var xScale = d3.scale.ordinal()
            .domain(xLabel)
            .rangeRoundBands([0,width-padding.left-padding.right],.1);
        var xAxisScale = d3.scale.ordinal()  //柱状图x区间段比例尺
            .domain(barLegend)    //legend为数据的名称
            .rangeRoundBands([0,xScale.rangeBand()]);
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        var yScale = d3.scale.linear()  //y轴比例尺
            .domain([0,yMax])
            .range([height-padding.top-padding.bottom,0]);

        var yAxis = d3.svg.axis()  //y轴
            .scale(yScale)
            .orient('left');

        opts.svg = svg;
        opts.width = width;
        opts.height = height;
        opts.padding = padding;
        opts.xScale = xScale;
        opts.xAxisScale = xAxisScale;
        opts.yScale = yScale;
        opts.xLabel = xLabel;
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
            .call(xAxis)
            //增加x坐标值说明
            .append('text')
            .text('月份')
            .attr('transform','translate(' + (width - padding.right - padding.left) + ',' + 18 + ')');
        //添加y轴
        svg.append('g')
            .attr('class','y axis')
            .attr('transform','translate(' + padding.left + ',' + padding.top + ')')
            .call(yAxis)
            //增加y坐标值说明
            .append('text')
            .text('数量')
            .attr('transform','translate(' + -25 + ',' + -5 + ')');

    };
    
    return zcharts;
}