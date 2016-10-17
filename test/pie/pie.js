(function () {
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
                name:'融资金额',
                type:'pie',
                radius:[100,30],
                center:[0.5,0.5],
                data:[
                    {name:'A',value:20},
                    {name:'B',value:12},
                    {name:'C',value:36},
                    {name:'D',value:9}
                ]
            }
        ]
    };
    var chart = new zcharts(timeOption);
    chart.initSvg('time',timeOption);

})();