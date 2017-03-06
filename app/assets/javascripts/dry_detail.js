(function(){
	var detail_code = $(".detail_code").text();
	$.ajax({
		type:"get",
		url:"/dry_detail/"+detail_code,
		dataType:'json',
		success:function(data){
			console.log(data);
			if(detail_code.length == 4){
				$(".active").text(data.city[0].title+"干烟数据统计");
			}else if(detail_code.length == 6){
				$(".active").text(data.county[0].title+"干烟数据统计");
			}else if(detail_code.length == 10){
				$(".active").text(data.station[0].title+"干烟数据统计");
				$(".room_row").css({display:""});
				//获取烤房数据
				for(var i=0;i<data.rooms.length;i++){
					var opt = "<option value='"+data.rooms[i].room_no+"'>"+data.rooms[i].address+"</option>"
					$(".rooms_select").append(opt);
					
				}
				var opt = "<option selected='selected' value='"+0+"'>"+"全部烤房"+"</option>";
				$(".rooms_select").append(opt);
				$(".btn").click(function(){
					var room_no = $(".rooms_select").val();
					room_analysis(this,room_no,detail_code);
				})
			}

			initData(data);
		}
	})
})()

function room_analysis(e,room_no,detail_code){
	var data = {
		station_code:detail_code,
		room_no:room_no
	};
	if($(e).hasClass("sum")){
		data.type = 'sum';
		$.ajax({
			type:"get",
			url:"/dry_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>干烟总量</th></tr></thead></table></div>');
				$("#room_analysis").DataTable({
				  paging: true,//分页
			      ordering: true,//是否启用排序
			      searching: false,//搜索
			      language: {
			        search: '',//右上角的搜索文本，可以写html标签
			        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
			        //下面三者构成了总体的左下角的内容。
			        info: "",//左下角的信息显示，大写的词为关键字。
			        infoEmpty: "",//筛选为空时左下角的显示。
			        infoFiltered: ""//筛选之后的左下角筛选提示，
			      },
			      data:data.dry_sum,
			      columns:[
			        {data:'room_no'},
			        {data:'sum'}        
			      ]
				});
			}
		});
	}else if($(e).hasClass("part")){
		data.type = 'part';
		$.ajax({
			type:"get",
			url:"/dry_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				var _obj = {};
				var part_data = [];
				_obj.room_no = data.part[0].room_no;
				_obj.sum = parseInt(data.part[0].sum);
				_obj.part = [{part:data.part[0].part,sum:parseInt(data.part[0].sum)}];
				part_data.push(_obj);

				for(var i=1; i<data.part.length; i++){
					var sum = 0;
					for(var j=0; j<part_data.length; j++){
						if(data.part[i].room_no == part_data[j].room_no){
							sum += 1;
							_x = j
						}

					}
					if(sum == 0){
						var _obj = {};
						_obj.room_no = data.part[i].room_no;
						_obj.sum = parseInt(data.part[i].sum);
						_obj.part = [{part:data.part[i].part,sum:parseInt(data.part[i].sum)}];
						part_data.push(_obj);
					}else{
						var _obj = {};

						_obj.part = data.part[i].part;
						_obj.sum = parseInt(data.part[i].sum);
						part_data[_x].part.push(_obj);
						part_data[_x].sum += _obj.sum;
					}
				}
				console.log(part_data)
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr><th rowspan="2">烤房编号</th><th rowspan="2">重量</th><th colspan="2">上部叶</th><th colspan="2">中部叶</th><th colspan="2">下部叶</th></tr><tr><th>重量</th><th>占比</th><th>重量</th><th>占比</th><th>重量</th><th>占比</th></tr></thead></table></div>');
				$("#room_analysis").DataTable({
				  paging: true,//分页
			      ordering: true,//是否启用排序
			      searching: false,//搜索
			      language: {
			        search: '',//右上角的搜索文本，可以写html标签
			        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
			        //下面三者构成了总体的左下角的内容。
			        info: "",//左下角的信息显示，大写的词为关键字。
			        infoEmpty: "",//筛选为空时左下角的显示。
			        infoFiltered: ""//筛选之后的左下角筛选提示，
			      },
			      data:part_data,
			      columns:[
			        {data:'room_no'},
			        {data:'sum'},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "上部叶"){
			        			return data[i].sum;
			        		}
			        	}
			        	return " ";
			        }},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "上部叶"){
			        			return (data[i].sum/row.sum*100).toFixed(2) + "%";
			        		}
			        	}
			        	return " ";
			        }},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "中部叶"){
			        			return data[i].sum;
			        		}
			        	}
			        	return " ";
			        }},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "中部叶"){
			        			return (data[i].sum/row.sum*100).toFixed(2) + "%";
			        		}
			        	}
			        	return " ";
			        }},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "下部叶"){
			        			return data[i].sum;
			        		}
			        	}
			        	return " ";
			        }},
			        {data:'part',render:function(data,index,row){
			        	for(var i=0; i<data.length; i++){
			        		if(data[i].part == "下部叶"){
			        			return (data[i].sum/row.sum*100).toFixed(2) + "%";
			        		}
			        	}
			        	return " ";
			        }}     
			      ]
				});
			}
		});
	}else if($(e).hasClass("quality")){
		data.type = 'quality';
		$.ajax({
			type:"get",
			url:"/dry_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>正组</th><th>青烟</th><th>杂色</th><th>不列级</th></tr></thead></table></div>');
				$("#room_analysis").DataTable({
				  paging: true,//分页
			      ordering: true,//是否启用排序
			      searching: false,//搜索
			      language: {
			        search: '',//右上角的搜索文本，可以写html标签
			        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
			        //下面三者构成了总体的左下角的内容。
			        info: "",//左下角的信息显示，大写的词为关键字。
			        infoEmpty: "",//筛选为空时左下角的显示。
			        infoFiltered: ""//筛选之后的左下角筛选提示，
			      },
			      data:data.quality,
			      columns:[
			        {data:'room_no'},
			        {data:'zz',render:function(data){
			        	return parseFloat(data).toFixed(2);
			        }},
			        {data:'q',render:function(data){
			        	return parseFloat(data).toFixed(2);
			        }},
			        {data:'zs',render:function(data){
			        	return parseFloat(data).toFixed(2);
			        }},
			        {data:'wq',render:function(data){
			        	return parseFloat(data).toFixed(2);
			        }}        
			      ]
				});
			}
		});
	}else if($(e).hasClass("breed")){
		data.type = 'breed';
		$.ajax({
			type:"get",
			url:"/dry_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>品种</th><th>重量</th></tr></thead></table></div>');
				
				$("#room_analysis").DataTable({
				  paging: true,//分页
			      ordering: true,//是否启用排序
			      searching: false,//搜索
			      language: {
			        search: '',//右上角的搜索文本，可以写html标签
			        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
			        //下面三者构成了总体的左下角的内容。
			        info: "",//左下角的信息显示，大写的词为关键字。
			        infoEmpty: "",//筛选为空时左下角的显示。
			        infoFiltered: ""//筛选之后的左下角筛选提示，
			      },
			      data:data.breed,
			      columns:[
			        {data:'room_no'},
			        {data:'breed'},
			        {data:'sum'}        
			      ]
				});
			}
		});
	}
}

function initData(data){
	//定义统计数据
			var breed_sum = 0;  //干烟总量
			var breed_statistic = [];  //品种统计数据
			var quality_statistic = [];  //品质统计数据
			var part_statistic = [];  //部位统计数据
			var tTrolleys_data = [];  //表格数据
			var tTrolleys2_data = [];  //表格数据

			//按烟品种统计数据
			for(var i=0; i<data.by_breed.length; i++){
				var map = {};
				map.name = data.by_breed[i].breed;
				map.y = parseInt(data.by_breed[i].sum);
				breed_statistic.push(map);
				breed_sum += parseInt(data.by_breed[i].sum);
			}
			breed_statistic[0].sliced = true;
			breed_statistic[0].selected = true;
			//按部位统计数据
			for(var i=0;i<data.by_part.length;i++){
				var map = {};
				map.name = data.by_part[i].part;
				map.y = parseInt(data.by_part[i].sum);
				part_statistic.push(map);
			}
			part_statistic[0].sliced = true;
			part_statistic[0].selected = true;

			//按质量统计数据
			for(var i=0;i<3;i++){
				var map = {};
				if(i == 0){
					map.name = "正组";
					map.y = parseInt(data.by_quality[0].zz);
					quality_statistic.push(map);
				}else if(i == 1){
					map.name = "青烟";
					map.y = parseInt(data.by_quality[0].q);
					quality_statistic.push(map);
				}else if(i == 2){
					map.name = "杂色";
					map.y = parseInt(data.by_quality[0].zs);
					quality_statistic.push(map);
				}
				
			}
			quality_statistic[0].sliced = true;
			quality_statistic[0].selected = true;
			//初始化统计图表
			initChart( breed_sum, breed_statistic, part_statistic, quality_statistic );
			//表格数据统计
			for(var i=0;i<data.by_breed.length;i++){
				var map = {};
				map.breed = data.by_breed[i].breed;
				map.weight_sum = parseInt(data.by_breed[i].sum);
				tTrolleys_data.push(map);
				$(".breed_tr").append("<th>"+data.by_breed[i].breed+"</th>");
			}

			for(var i=0;i<data.by_part.length;i++){
				var map = {};
				map.part = data.by_part[i].part;
				map.weight_sum = parseInt(data.by_part[i].sum);
				var breed = [];
				for(var j=0;j<data.by_breed.length;j++){
					breed.push({
						name: data.by_breed[j].breed,
						sum: 0
					})
				}
				map.breed = breed;
				tTrolleys2_data.push(map);
			}

			//tTrolleys表格数据总计
			for(var j=0; j<tTrolleys_data.length; j++){
				for(var i=0; i<data.by_breed_quality.length; i++){
					if(data.by_breed_quality[i].breed == tTrolleys_data[j].breed){
						tTrolleys_data[j].zz = data.by_breed_quality[i].zz;
						tTrolleys_data[j].q = data.by_breed_quality[i].q;
						tTrolleys_data[j].zs = data.by_breed_quality[i].zs;
					}
				}

				for(var i=0;i<data.by_breed_part.length;i++){
					if(data.by_breed_part[i].breed == tTrolleys_data[j].breed){
						if(data.by_breed_part[i].part == "上部叶"){
							tTrolleys_data[j].up_leaf_sum = data.by_breed_part[i].sum;
						}else if(data.by_breed_part[i].part == "中部叶"){
							tTrolleys_data[j].middle_leaf_sum = data.by_breed_part[i].sum;
						}else if(data.by_breed_part[i].part == "下部叶"){
							tTrolleys_data[j].down_leaf_sum = data.by_breed_part[i].sum;
						}
					}
				}

			}

			//tTrolleys2表格数据总计
			for(var j=0;j<tTrolleys2_data.length;j++){
				for(var i=0; i<data.by_part_quality.length; i++){
					if(data.by_part_quality[i] == tTrolleys2_data[j].part){
						for(var k=0;k<tTrolleys2_data[j].breed.length;k++){
							if(data.by_breed_part[i].breed == tTrolleys2_data[j].breed[k].name){
								tTrolleys2_data[j].breed[k].sum = data.by_breed_part[i].sum;
							}
						}
					}
				}

				for(var i=0; i<data.by_part_quality.length; i++){
					if(data.by_part_quality[i].part == tTrolleys2_data[j].part){
						tTrolleys2_data[j].zz = parseFloat(data.by_part_quality[i].zz).toFixed(2);
						tTrolleys2_data[j].q = parseFloat(data.by_part_quality[i].q).toFixed(2);
						tTrolleys2_data[j].zs = parseFloat(data.by_part_quality[i].zs).toFixed(2);
					}
				}

				for(var i=0;i<data.by_breed_part.length;i++){
					if(data.by_breed_part[i].part == tTrolleys2_data[j].part){
						for(var k=0;k<tTrolleys2_data[j].breed.length;k++){
							if(data.by_breed_part[i].breed == tTrolleys2_data[j].breed[k].name){
								tTrolleys2_data[j].breed[k].sum = data.by_breed_part[i].sum;
							}
						}
					}
				}
			}
			console.log(tTrolleys2_data);
			//初始化datatable
			$("#tTrolleys").DataTable({
			  paging: false,//分页
		      ordering: false,//是否启用排序
		      searching: false,//搜索
		      language: {
		        search: '',//右上角的搜索文本，可以写html标签
		        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
		        //下面三者构成了总体的左下角的内容。
		        info: "",//左下角的信息显示，大写的词为关键字。
		        infoEmpty: "",//筛选为空时左下角的显示。
		        infoFiltered: ""//筛选之后的左下角筛选提示，
		      },
		      data:tTrolleys_data,
		      columns:[
	            {data:'breed'},
	            {data:'weight_sum'},
	            {data:'zz',render:function(data,type,full){
	                if(data){
	                	return parseFloat(data).toFixed(2);
	                }else{
	                	return "0";
	                }
	            }},
	            {data:'q',render:function(data,type,row){
	            	if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'zs',render:function(data,type,row){
	            	if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'up_leaf_sum',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'middle_leaf_sum',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'down_leaf_sum',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }}
	          ]
			});
			
			$("#tTrolleys2").DataTable({
			  paging: false,//分页
		      ordering: false,//是否启用排序
		      searching: false,//搜索
		      language: {
		        search: '',//右上角的搜索文本，可以写html标签
		        zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
		        //下面三者构成了总体的左下角的内容。
		        info: "",//左下角的信息显示，大写的词为关键字。
		        infoEmpty: "",//筛选为空时左下角的显示。
		        infoFiltered: ""//筛选之后的左下角筛选提示，
		      },
		      pagingType: "full_numbers",//分页样式的类型
		      data:tTrolleys2_data,
		      columns:[
	            {data:'part'},
	            {data:'weight_sum'},
	            {data:'zz',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'q',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'zs',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'breed',render:function(data,type,full){
	                return data[0].sum
	            }}
	          ]
			});
}

function initChart( breed_sum, breed_statistic, part_statistic, quality_statistic ){
	$('#container').highcharts({  //图表展示容器，与div的id保持一致
        chart: {
            type: 'column'  //指定图表的类型，默认是折线图（line）
        },
        title: {
            text: '干烟总量'  //指定图表标题
        },
        credits: { enabled: false},
        xAxis: {
            categories: ['干烟总量']  //指定x轴分组
        },
        yAxis: {
            title: {
                text: ''  //指定y轴的标题
            }
        },
        legend: {
        	enabled:false
        },
        series: [{  //指定数据列
            name: '干烟总量(公斤)',  //数据列名
            data: [breed_sum]  //数据
        }]
    });

    $('#container2').highcharts({
        title: {
            text: '干烟品种'
        },
        credits: { enabled: false},
        tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
       
        plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
        series: [{
            type: 'pie',
            name: '重量(公斤)',
            data: breed_statistic
        }]
    });

    $('#container3').highcharts({
        title: {
            text: '干烟部位'
        },
        credits: { enabled: false},
        tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
       
        plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
        series: [{
            type: 'pie',
            name: '重量(公斤)',
            data: part_statistic
        }]
    });

    $('#container4').highcharts({
        title: {
            text: '干烟品质'
        },
        credits: { enabled: false},
        tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
       
        plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
        series: [{
            type: 'pie',
            name: '重量(公斤)',
            data: quality_statistic
        }]
    });
}