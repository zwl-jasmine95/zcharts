(function () {
    var timeOption = {
        padding:{top:100,bottom:100,left:100,right:100},
        container:{width:700,height:400},
        color:['#f42448','#9abf1a','#de7921','#e4dd44','#ff5108'],
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
                data:[4,8,9]
            },
            {
                name:'融资',
                type:'line',
                data:[2,7,10]
            }
            // {
            //     name:'融资金额',
            //     type:'line',
            //     data:[18981,3310106,1199877]
            // }
        ]
    };
    var chart = new zcharts(timeOption);
    chart.drawSvg('time',timeOption);

})();