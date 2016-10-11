(function () {
    var timeOption = {
        padding:{top:100,bottom:100,left:50,right:100},
        container:{width:700,height:400},
        color:['#95CCE6','#B6A2DE','#FED23D','#4087D7','#CBD87E'],
        legend:["融资数量","融资金额"],
        xAxis : 
        {
            data : ["北京加双筷子科技有限公司","北京小桔科技有限公司","南京途牛科技有限公司"],
            name: "创业公司"
        },
        yAxis : [
            {
                name: "融资数量"
            },
            {
                name: "融资金额"
            }
        ],
        series: [
            {
                name:'融资数量',
                type:'line',
                yAxisIndex:0,
                data:[4,8,9]
            },
            {
                name:'融资金额',
                type:'line',
                yAxisIndex:1,
                data:[18981,3310106,1199877]
            }
        ]
    };
    var chart = new zcharts(timeOption);
    chart.drawSvg('time',timeOption);

})();