(function($) {
    $('#protocolStartDate').datepicker({
        format: 'yyyy-mm-dd'
    });
    $('#protocolEndDate').datepicker({
        format: 'yyyy-mm-dd'
    });
    
    $.ajax({
        type: "get",
        url: "/rooms",
        dataType: 'json',
        success: function(data) {
            for (var i = 0; i < data.stations.length; i++) {
                $("#stations").append("<option value='" + data.stations[i].id + "''>" + data.stations[i].title + "</option>")
            }
        }
    });
    $("#search_btn").click(function() {
        var addresses = $("#addresses").val();
        var stations = $("#stations").val();
        var protocolStartDate = $("#protocolStartDate").val();
        var protocolEndDate = $("#protocolEndDate").val();
        //console.log(addresses+"",stations+"",protocolStartDate+"",protocolEndDate+"")
        if (addresses == "" || stations == "" || protocolStartDate == "" || protocolEndDate == "") {
            alert("请输入完整搜索条件");
        } else {
            $(".row1").animate({
                'margin-top': 0
            });
            $(".line").append('<div class="row"><div class="col-md-12"><div id="chartContainer" style="height: 400px; width: 100%;"></div></div></div>');
            var url = "http://120.25.101.68:8081/stations/" + stations + "/addresses/" + addresses + "/status?startTime=" + protocolStartDate + "&endTime=" + protocolEndDate;
            //console.log(url);
            $("#searchModal").modal('toggle');
            console.log(url)
            $.ajax({
                type: "get",
                url: url,
                /*"http://120.25.101.68:8081/stations/6/addresses/00001/status?startTime=2016-6-1&endTime=2016-7-1"*/
                dataType: 'json',
                success: function(data) {
                    console.log(data)
                    var opt = "<div class='col-md-12' style='height:50px;'><span>开始日期:" + protocolStartDate + "</span><span>结束日期:" + protocolEndDate + "</span></div>";
                    $(".date-info").html(opt);
                    $("#searchModal").modal('toggle');
                    var data = data.result;
                    var dataPoints=[];
                    var StartDateTime; 
                    var EndDateTime;
                    //if(data.length>0)
                    {
                      //StartDateTime= data[0].createdAt.split('.')[0];
                      //EndDateTime= data[data.length-1].createdAt.split('.')[0];
                      //StartDateTime= StartDateTime.replace('T',' ');
                      //EndDateTime= EndDateTime.replace('T',' ');
                      StartDateTime=new Date(protocolStartDate.split('-')[0], protocolStartDate.split('-')[1] - 1, protocolStartDate.split('-')[2], '00', '00', '00');
                      EndDateTime=new Date(protocolEndDate.split('-')[0], protocolEndDate.split('-')[1]-1, protocolEndDate.split('-')[2], '23', '59', '59');
                      //console.log(StartDateTime);
                      //console.log(EndDateTime);
                    }
                    var chart = new CanvasJS.Chart("chartContainer", {
                        culture: "es",
                        zoomEnabled:true,
                        animationEnabled: true,
                        axisX: {
                            gridColor: "Silver",
                            tickColor: "silver",
                            interval: 1,
                            intervalType: "day",
                            valueFormatString: "MM-DD",
                            labelAngle: -50,
                            minimum : StartDateTime,
                            maximum : EndDateTime,
                            viewportMinimum : StartDateTime,
                            viewportMaximum : EndDateTime
                        },
                        toolTip: {
                            shared: true,
                            contentFormatter: function(e) {
                                var content = " ";
                                for (var i = 0; i < e.entries.length; i++) {
                                    content += e.entries[i].dataSeries.name + " " + "<strong>" + e.entries[i].dataPoint.y + "</strong>";
                                    content += "<br/>";
                                    if (i == e.entries.length - 1) {
                                        //console.log(e.entries[i].dataPoint.x)
                                        //console.log(format(e.entries[i].dataPoint.x, 'yyyy-MM-dd HH:mm:ss'))
                                        var opt = "<strong>" + format(e.entries[i].dataPoint.x, 'yyyy-MM-dd HH:mm:ss') + "</strong>";
                                        opt += "<br/>" + content
                                    }
                                }
                                return opt;
                            }
                        },
                        theme: "theme2",
                        axisY: {
                            gridColor: "Silver",
                            tickColor: "silver",
                
                        },
                        legend: {
                            verticalAlign: "center",
                            horizontalAlign: "right"
                        },
                        data: dataPoints,
                        legend: {
                            /*cursor: "pointer",
                            itemclick: function(e) {
                                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                    e.dataSeries.visible = false;
                                } else {
                                    e.dataSeries.visible = true;
                                }
                                chart.render();
                            }*/
                        }
                    });
                    //var dryPoints = [];
                    //var wetPoints = [];
                    //var windPoints = [];
                    //var hSpeedPoints = [];
                    //var lSpeedPoints = [];
//                    console.log(data[5524]);
//                    console.log(data.length);
//                    for (var i = 0; i < data.length; i++) {
//                        if (i > 5500) {
//                            console.log(data[i].createdAt)
//                        }
//                    }
                    var lastdate=0;
                    var lLine=0
                    for (var i = 0; i < data.length; i ++) {
                        var s = data[i].alarm;
                        var ss = data[i].normal;
                        var alarm = s.split(",");
                        var normal = ss.split(",");
                        var wetball = (parseFloat(alarm[6]) * 256 + parseFloat(alarm[7])) / 10;
                        var dryball = (parseFloat(alarm[4]) * 256 + parseFloat(alarm[5])) / 10;
                        var wind_door_status = getBits(normal[10], 0);
                        var combustion_fan_status = getBits(normal[10], 2);
                        var high_speed = getBits(normal[10], 6);
                        var low_speed = getBits(normal[10], 7);
                        var dateTime = data[i].createdAt.split('.')[0];
                        var date = dateTime.split('T')[0];
                        var time = dateTime.split('T')[1];
                        var object = {
                            createdAt: data[i].createdAt.split('.')[0],
                            dry: dryball,
                            wet: wetball
                        };
                        var createdAt = (new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2], time.split(':')[0], time.split(':')[1] - 1, time.split(':')[2])).getTime();
                        if (dryball<1 || dryball>=80 || wetball<1 || wetball>=80)
                        {
                          continue;
                        }
                        if (lastdate==0)
                        {
                          console.log(dryball);
                          console.log(wetball);
                          lastdate=createdAt;
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            lineThickness: 2,
                            markerSize: 1,
                            name: "干球实际温度",
                            markerType: "square",
                            color: "#F08080",
                            valueFormatString: "YYYY-MM-DD:HH:mm:ss",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            name: "湿球实际温度",
                            color: "#20B2AA",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            name: "循环风机高速",
                            color: "#CD8C95",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            name: "循环风机低速",
                            color: "#EEEE00",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            name: "风门状态",
                            color: "#CD2626",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: true,
                            name: "助燃风机状态",
                            color: "#AAAAAA",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                        }
                        if (createdAt-lastdate>30000)
                        {
                          lLine++;
                          //console.log(createdAt);
                          //console.log(lastdate);
                          lastdate=createdAt;
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            lineThickness: 2,
                            markerSize: 1,
                            name: "干球实际温度",
                            markerType: "square",
                            color: "#F08080",
                            valueFormatString: "YYYY-MM-DD:HH:mm:ss",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            name: "湿球实际温度",
                            color: "#20B2AA",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                         dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            name: "循环风机高速",
                            color: "#CD8C95",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            name: "循环风机低速",
                            color: "#EEEE00",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                          dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            name: "风门状态",
                            color: "#CD2626",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                           dataPoints.push({
                            type: "line",
                            visible: true,
                            showInLegend: false,
                            name: "助燃风机状态",
                            color: "#AAAAAA",
                            lineThickness: 2,
                            markerSize: 1,
                            xValueType: "dateTime",
                            dataPoints: []
                          });
                        }
                        dataPoints[lLine*6].dataPoints.push({x: createdAt,y: dryball});
                        dataPoints[lLine*6+1].dataPoints.push({x: createdAt,y: wetball});
                        dataPoints[lLine*6+2].dataPoints.push({x: createdAt,y: high_speed});
                        dataPoints[lLine*6+3].dataPoints.push({x: createdAt,y: low_speed});
                        dataPoints[lLine*6+4].dataPoints.push({x: createdAt,y: wind_door_status});
                        dataPoints[lLine*6+5].dataPoints.push({x: createdAt,y: combustion_fan_status});
                    } 
                    //dataPoints[0].dataPoints=dryPoints;
                    //dataPoints[1].dataPoints=wetPoints;
                    //dataPoints[2].dataPoints=windPoints;
                    //dataPoints[3].dataPoints=hSpeedPoints;
                    //dataPoints[4].dataPoints=lSpeedPoints;
                    chart.render();
                }
            })
        }

    })

})(jQuery)

function getBits(s, y) {
    var j = parseInt(s);
    return (j >> y) & 0x01;
}
var format = function(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0': '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g,
    function(a) {
        switch (a) {
        case 'yyyy':
            return tf(t.getFullYear());
            break;
        case 'MM':
            return tf(t.getMonth() + 1);
            break;
        case 'mm':
            return tf(t.getMinutes());
            break;
        case 'dd':
            return tf(t.getDate());
            break;
        case 'HH':
            return tf(t.getHours());
            break;
        case 'ss':
            return tf(t.getSeconds());
            break;
        }
    })
}