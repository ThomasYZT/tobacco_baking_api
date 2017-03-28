(function(){
	var detail_code = $(".detail_code").text();
	$.ajax({
		type:"get",
		url:"/fresh_detail/"+detail_code,
		dataType:'json',
		success:function(data){
			console.log(data);
			if(detail_code.length == 4){
				$(".active").text(data.city[0].title+"鲜烟数据统计");
				$(".room_row").css({display:"none"});
			}else if(detail_code.length == 6){
				$(".active").text(data.county[0].title+"鲜烟数据统计");
				$(".room_row").css({display:"none"});
			}else if(detail_code.length == 10){
				$(".room_row").css({display:""});
				$(".active").text(data.station[0].title+"鲜烟数据统计");
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

			for(var i=0;i<data.by_breed.length;i++){
				$(".breed_tr").append("<th>"+data.by_breed[i].breed+"</th>");
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
	if($(e).hasClass("maturity")){
		data.type = 'maturity';
		$.ajax({
			type:"get",
			url:"/fresh_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				for(var i=0;i<data.fresh_sum.length;i++){
					for(var j=0;j<data.maturity.length;j++){
						if(data.fresh_sum[i].room_no == data.maturity[j].room_no){
							data.maturity[j].fresh_sum = data.fresh_sum[i].sum;
						}
					}
				}
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>鲜烟总量</th><th>适熟烟叶</th><th>欠熟烟叶</th><th>过熟烟叶</th></tr></thead></table></div>');
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
			      data:data.maturity,
			      columns:[
			        {data:'room_no'},
			        {data:'fresh_sum'},
			        {data:'weight_of_mature'},
			        {data:'weight_of_immature'},
			        {data:'weight_of_over_mature'}	 	        
			      ]
				});
			}
		});
	}else if($(e).hasClass("breed")){
		data.type = 'breed';
		$.ajax({
			type:"get",
			url:"/fresh_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				/*var breed_data = [];
				var obj = {};
				obj.room_no = data.breed[0].room_no;
				obj.sum = data.breed[0].sum;
				obj.breed = [{breed:data.breed[0].breed,sum:data.breed[0].sum}];
				breed_data.push(obj);
				obj = null;
				for(var i=1;i<data.breed.length;i++){
					var sum = 0;
					for(var j=0;j<breed_data.length;j++){
						if(data.breed[i].room_no == breed_data[j].room_no){
							sum += 1 ;
							_x = j;
						}
					}
					if(sum == 0){
						var _obj = {};
						_obj.room_no = data.breed[i].room_no;
						_obj.sum = data.breed[i].sum;
						_obj.breed = [{breed:data.breed[i].breed,sum:data.breed[i].sum}];
						breed_data.push(_obj);
					}else{
						var _obj = {};
						_obj.breed = data.breed[i].breed;
						_obj.sum = data.breed[i].sum;
						breed_data[_x].breed.push(_obj);
						breed_data[_x].sum += _obj.sum;
					}
				}*/
				var breed_data = [[data.breed[0]]];
				var status = false;
				for(var i=1; i<data.breed.length; i++){
					if(data.breed[i].room_no == breed_data[breed_data.length-1][breed_data[breed_data.length-1].length-1].room_no){
						breed_data[breed_data.length-1].push(data.breed[i]);
					}else{
						breed_data.push([data.breed[i]])
					}
					
				}
				console.log(breed_data);
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr><th rowspan="2">烤房编号</th><th colspan="4">第一烤</th><th colspan="4">第二烤</th><th colspan="4">第三烤</th></tr><tr><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th></tr></thead></table></div>');
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
			      data:breed_data,
			      columns:[
			        {data:'[]',render:function(data,index,row){
			        	return data[0].room_no;
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].work_started + "~" + data[0].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].work_started + "~" + data[1].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].work_started + "~" + data[2].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].sum;
			        	}else{
			        		return " ";
			        	}
			        }}
			      ]
				});
			}

		});
	}else if($(e).hasClass("type")){
		data.type = 'type';
		$.ajax({
			type:"get",
			url:"/fresh_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>鲜烟类型</th><th>重量</th></tr></thead></table></div>');
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
			      data:data.type,
			      columns:[
			        {data:'room_no'},
			        {data:'tobacco_type'},
			        {data:'sum'}        
			      ]
				});
			}
		});
	}else if($(e).hasClass("water_content")){
		data.type = 'water_content';
		$.ajax({
			type:"get",
			url:"/fresh_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>含水量</th><th>重量</th></tr></thead></table></div>');
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
			      data:data.water_content,
			      columns:[
			        {data:'room_no'},
			        {data:'water_content'},
			        {data:'sum'}        
			      ]
				});
			}
		});
	}
}

function initData(data){
	//定义统计数据
	var breed_sum = 0;  //鲜烟总量
	var breed_statistic = []; //品种统计数据
	var type_statistic = [];  //类型统计数据
	var part_statistic = [];  //部位统计数据
	var maturity_statistic = [];  //成熟度统计数据
	var tTrolleys_data = [];  //表格数据
	var tTrolleys2_data = [];  //表格数据
	console.log(data.by_breed.length)

	//按烟品种统计数据
	if(data.by_breed.length != 0){
		for(var i=0;i<data.by_breed.length;i++){
			var map = {};
			map.name = data.by_breed[i].breed;
			map.y = parseInt(data.by_breed[i].weight_sum);
			breed_statistic.push(map);
			breed_sum += parseInt(data.by_breed[i].weight_sum);  //统计鲜烟总量
		}
		breed_statistic[0].sliced = true;
		breed_statistic[0].selected = true;
	}

	//按部位统计数据
	if(data.by_part.length != 0){
		for(var i=0;i<data.by_part.length;i++){
			var map = {};
			map.name = data.by_part[i].part;
			map.y = parseInt(data.by_part[i].weight_sum);
			part_statistic.push(map);
		}
		part_statistic[0].sliced = true;
		part_statistic[0].selected = true;
	}

	//按类型统计数据
	if(data.by_type.length != 0){
		for(var i=0;i<data.by_type.length;i++){
			var map = {};
			map.name = data.by_type[i].tobacco_type;
			map.y = parseInt(data.by_type[i].weight_sum);
			type_statistic.push(map);
		}
		type_statistic[0].sliced = true;
		type_statistic[0].selected = true;
	}
	
	
	//按成熟度统计数据

	var maturity = ["欠熟","适熟","过熟"];
	for(var i=0;i<maturity.length;i++){
		var map = {};
		map.name = maturity[i];
		if(maturity[i] == "欠熟"){
			map.y = parseInt(data.by_maturity[0].weight_of_immature);
			maturity_statistic.push(map);
		}else if(maturity[i] == "过熟"){
			map.y = parseInt(data.by_maturity[0].weight_of_over_mature);
			maturity_statistic.push(map);
		}else if(maturity[i] == "适熟"){
			map.y = parseInt(data.by_maturity[0].weight_of_mature);
			map.sliced = true;
			map.selected = true;
			maturity_statistic.push(map);
		}
		
	}
	
	//初始化统计图表
	initChart( breed_sum, breed_statistic, part_statistic, maturity_statistic, type_statistic);
	
	//表格数据统计
	if(data.by_breed.length != 0){
		for(var i=0;i<data.by_breed.length;i++){
			var map = {};
			map.breed = data.by_breed[i].breed;
			map.weight_sum = parseInt(data.by_breed[i].weight_sum);
			tTrolleys_data.push(map);
		}
	}
	
	if(data.by_part.length != 0){
		for(var i=0;i<data.by_part.length;i++){
			var map = {};
			map.part = data.by_part[i].part;
			map.weight_sum = parseInt(data.by_part[i].weight_sum);
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
	}
	

	//tTrolleys表格数据总计
	if(tTrolleys_data.length != 0){
		for(var j=0;j<tTrolleys_data.length;j++){
			for(var i=0;i<data.by_breed_maturity.length;i++){
				if(data.by_breed_maturity[i].breed == tTrolleys_data[j].breed){
					if(data.by_breed_maturity[i].weight_of_mature){
						tTrolleys_data[j].weight_of_mature = data.by_breed_maturity[i].weight_of_mature;
					}else{
						tTrolleys_data[j].weight_of_mature = 0;
					}

					if(data.by_breed_maturity[i].weight_of_immature){
						tTrolleys_data[j].weight_of_immature = data.by_breed_maturity[i].weight_of_immature;
					}else{
						tTrolleys_data[j].weight_of_immature = 0;
					}

					if(data.by_breed_maturity[i].weight_of_over_mature){
						tTrolleys_data[j].weight_of_over_mature = data.by_breed_maturity[i].weight_of_over_mature;
					}else{
						tTrolleys_data[j].weight_of_over_mature = 0;
					}
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

			for(var i=0;i<data.by_breed_type.length;i++){
				if(data.by_breed_type[i].breed == tTrolleys_data[j].breed){
					if(data.by_breed_type[i].tobacco_type == "干旱"){
						tTrolleys_data[j].aridity = data.by_breed_type[i].sum;
					}else if(data.by_breed_type[i].tobacco_type == "返青"){
						tTrolleys_data[j].greenup = data.by_breed_type[i].sum;
					}else if(data.by_breed_type[i].tobacco_type == "正常"){
						tTrolleys_data[j].normal = data.by_breed_type[i].sum;
					}
				}
			}
		}
	}
	
	//tTrolleys2表格数据总计
	if(tTrolleys2_data.length != 0){
		for(var j=0;j<tTrolleys2_data.length;j++){
			for(var i=0;i<data.by_part_maturity.length;i++){
				if(data.by_part_maturity[i].part == tTrolleys2_data[j].part){
					if(data.by_part_maturity[i].weight_of_mature){
						tTrolleys2_data[j].weight_of_mature = data.by_part_maturity[i].weight_of_mature;
					}else{
						tTrolleys2_data[j].weight_of_mature = 0;
					}

					if(data.by_part_maturity[i].weight_of_immature){
						tTrolleys2_data[j].weight_of_immature = data.by_part_maturity[i].weight_of_immature;
					}else{
						tTrolleys2_data[j].weight_of_immature = 0;
					}

					if(data.by_part_maturity[i].weight_of_over_mature){
						tTrolleys2_data[j].weight_of_over_mature = data.by_part_maturity[i].weight_of_over_mature;
					}else{
						tTrolleys2_data[j].weight_of_over_mature = 0;
					}
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

			for(var i=0;i<data.by_part_type.length;i++){
				if(data.by_part_type[i].part == tTrolleys2_data[j].part){
					if(data.by_part_type[i].tobacco_type == "干旱"){
						tTrolleys2_data[j].aridity = data.by_part_type[i].sum;
					}else if(data.by_part_type[i].tobacco_type == "返青"){
						tTrolleys2_data[j].greenup = data.by_part_type[i].sum;
					}else if(data.by_part_type[i].tobacco_type == "正常"){
						tTrolleys2_data[j].normal = data.by_part_type[i].sum;
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
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data;
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'up_leaf_sum',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'middle_leaf_sum',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'down_leaf_sum',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }}
	      ]
		});
	}

	if(tTrolleys2_data.length != 0){
		initTable2(tTrolleys2_data);
	}
	
}

function initTable2(tTrolleys2_data){
	if(tTrolleys2_data[0].breed.length == 1){
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
	      initComplete:function(data){
	      	console.log(data)
	      	/*for(var i=0;i<data.by_breed.length;i++){
				var map = {};
				map.breed = data.by_breed[i].breed;
				map.weight_sum = parseInt(data.by_breed[i].weight_sum);
				tTrolleys_data.push(map);
				$(".breed_tr").append("<th>"+data.by_breed[i].breed+"</th>");
			}*/
	      },
	      columns:[
	        {data:'part'},
	        {data:'weight_sum'},
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data;
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum
	        }}/*,
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	if(data[1]){
	        		return data[1].sum
	        	}else{
	        		return "";
	        	}
	        }}*/
	      ]
		});
	}else if(tTrolleys2_data[0].breed.length == 2){
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
	      createdRow: function ( row, data, index ) {
	        //console.log(data.breed)
	        for(var i=0;i<data.breed.length;i++){
	        	console.log(data[i+7])
	        }
	        
	      },
	      columns:[
	        {data:'part'},
	        {data:'weight_sum'},
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data;
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	if(data[1]){
	        		return data[1].sum
	        	}else{
	        		return "";
	        	}
	        }}
	      ]
		});
	}else if(tTrolleys2_data[0].breed.length == 3){
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
	      initComplete:function(data){
	      	console.log(data)
	      	/*for(var i=0;i<data.by_breed.length;i++){
				var map = {};
				map.breed = data.by_breed[i].breed;
				map.weight_sum = parseInt(data.by_breed[i].weight_sum);
				tTrolleys_data.push(map);
				$(".breed_tr").append("<th>"+data.by_breed[i].breed+"</th>");
			}*/
	      },
	      createdRow: function ( row, data, index ) {
	        
	        //console.log(data.breed)
	        for(var i=0;i<data.breed.length;i++){
	        	console.log(data[i+7])
	        }
	        
	      },
	      columns:[
	        {data:'part'},
	        {data:'weight_sum'},
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data;
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[1].sum
	        	
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[2].sum;
	        }}
	      ]
		});
	}else if(tTrolleys2_data[0].breed.length == 4){
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
	      initComplete:function(data){
	      	console.log(data)
	      	/*for(var i=0;i<data.by_breed.length;i++){
				var map = {};
				map.breed = data.by_breed[i].breed;
				map.weight_sum = parseInt(data.by_breed[i].weight_sum);
				tTrolleys_data.push(map);
				$(".breed_tr").append("<th>"+data.by_breed[i].breed+"</th>");
			}*/
	      },
	      createdRow: function ( row, data, index ) {
	        
	        //console.log(data.breed)
	        for(var i=0;i<data.breed.length;i++){
	        	console.log(data[i+7])
	        }
	        
	      },
	      columns:[
	        {data:'part'},
	        {data:'weight_sum'},
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data;
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data;
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[1].sum
	        	
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[2].sum;
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[3].sum;
	        }}
	      ]
		});
	}
	 
}

function initChart( breed_sum, breed_statistic, part_statistic, maturity_statistic, type_statistic){
	$('#container').highcharts({  //图表展示容器，与div的id保持一致
        chart: {
            type: 'column'  //指定图表的类型，默认是折线图（line）
        },
        title: {
            text: '鲜烟总量'  //指定图表标题
        },
        credits: { enabled: false},
        
        xAxis: {
            categories: ['鲜烟总量']  //指定x轴分组
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
            name: '鲜烟总量(公斤)',  //数据列名
            data: [breed_sum]  //数据
        }]
    });

	$('#container2').highcharts({
            title: {
                text: '鲜烟品种'
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
                text: '鲜烟部位'
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
                text: '鲜烟成熟度'
            },
            credits: { enabled: false},
            
           	tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '重量(公斤)',
                data: maturity_statistic
            }]
        });

	$('#container5').highcharts({
            title: {
                text: '鲜烟类型'
            },
            credits: { enabled: false},
            
           	tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '重量(公斤)',
                data: type_statistic
            }]
        });
}
