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

			//表格数据初始化
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
				
				
				var breed_data = [[data.breed[0]]];
				for(var i=1; i<data.breed.length; i++){
					if(data.breed[i].room_no == breed_data[breed_data.length-1][breed_data[breed_data.length-1].length-1].room_no){
						breed_data[breed_data.length-1].push(data.breed[i]);
					}else{
						breed_data.push([data.breed[i]])
					}
					
				}
				console.log(breed_data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr><th rowspan="2">烤房编号</th><th colspan="5">第一烤</th><th colspan="5">第二烤</th><th colspan="5">第三烤</th><th colspan="5">第四烤</th><th colspan="5">第五烤</th><th colspan="5">第六烤</th></tr><tr><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th><th>烟农</th><th>时间</th><th>品种</th><th>重量</th><th>照片</th></tr></thead></table></div>');
				$("#room_analysis").DataTable({
				  paging: true,//分页
			      ordering: true,//是否启用排序
			      searching: false,//搜索
			      scrollX: true,
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
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	return data[0].room_no;
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].work_started + " 至 " + data[0].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[0]){
			        		return data[0].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[0]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].work_started + " 至 " + data[1].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[1]){
			        		return data[1].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[1]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].work_started + " 至 " + data[2].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[2]){
			        		return data[2].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[2]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[3]){
			        		return data[3].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[3]){
			        		return data[3].work_started + " 至 " + data[3].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[3]){
			        		return data[3].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[3]){
			        		return data[3].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[3]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[4]){
			        		return data[4].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[4]){
			        		return data[4].work_started + " 至 " + data[4].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[4]){
			        		return data[4].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[4]){
			        		return data[4].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[4]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[5]){
			        		return data[5].party_b;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[5]){
			        		return data[5].work_started + " 至 " + data[5].work_finished;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[5]){
			        		return data[5].breed;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[5]){
			        		return data[5].sum;
			        	}else{
			        		return " ";
			        	}
			        }},
			        {data:'[]',sWidth:"40px",render:function(data,index,row){
			        	if(data[5]){
			        		return '<img src="#" alt="" />';
			        	}else{
			        		return " ";
			        	}
			        }},
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
				var analysis_data = [];
				var map = {};
				map.room_no = data.type[0].room_no;
				map.normal = 0;
				map.greenup = 0;
				map.aridity = 0;
				if($.trim(data.type[0].tobacco_type) == "正常"){
					map.normal = data.type[0].sum;
				}else if($.trim(data.type[0].tobacco_type) == "返青"){
					map.greenup = data.type[0].sum;
				}else if($.trim(data.type[0].tobacco_type) == "干旱"){
					map.aridity = data.type[0].sum;
				}
				analysis_data.push(map);
				for(var i=1; i<data.type.length; i++){
					var status = false;
					var _x = null;
					for(var j=0; j<analysis_data.length; j++){
						if(data.type[i].room_no == analysis_data[j].room_no){
							console.log(i)
							status = true;
							_x = j;
						}
					}
					if(status){
						if($.trim(data.type[i].tobacco_type) == "正常"){
							analysis_data[_x].normal += data.type[i].sum;
						}else if($.trim(data.type[i].tobacco_type) == "返青"){
							analysis_data[_x].greenup += data.type[i].sum;
						}else if($.trim(data.type[i].tobacco_type) == "干旱"){
							analysis_data[_x].aridity += data.type[i].sum;
						}
					}else{
						var map = {};
						map.room_no = data.type[i].room_no;
						map.normal = 0;
						map.greenup = 0;
						map.aridity = 0;
						if($.trim(data.type[i].tobacco_type) == "正常"){
							map.normal = data.type[i].sum;
						}else if($.trim(data.type[i].tobacco_type) == "返青"){
							map.greenup = data.type[i].sum;
						}else if($.trim(data.type[i].tobacco_type) == "干旱"){
							map.aridity = data.type[i].sum;
						}
						analysis_data.push(map);
					}
				}
				console.log(analysis_data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr><th rowspan="2">烤房编号</th><th colspan="2">正常</th><th colspan="2">返青</th><th colspan="2">干旱</th></tr><tr><th>总重</th><th>占比</th><th>总重</th><th>占比</th><th>总重</th><th>占比</th></tr></thead></table></div>');
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
			      data:analysis_data,
			      columns:[
			        {data:'room_no'},
			        {data:'normal',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'normal',render:function(data,type,full){
			        	var sum = full.normal+full.greenup+full.aridity;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }},
			        {data:'greenup',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'greenup',render:function(data,type,full){
			        	var sum = full.normal+full.greenup+full.aridity;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }},
			        {data:'aridity',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'aridity',render:function(data,type,full){
			        	var sum = full.normal+full.greenup+full.aridity;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }}         
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
				var analysis_data = [];
				var map = {};
				map.room_no = data.water_content[0].room_no;
				map.middle = 0;
				map.small = 0;
				map.big = 0;
				if($.trim(data.water_content[0].water_content) == "适中"){
					map.middle = data.water_content[0].sum;
				}else if($.trim(data.water_content[0].water_content) == "较小"){
					map.small = data.water_content[0].sum;
				}else if($.trim(data.water_content[0].water_content) == "较大"){
					map.big = data.water_content[0].sum;
				}
				analysis_data.push(map);
				for(var i=1; i<data.water_content.length; i++){
					var status = false;
					var _x = null;
					for(var j=0; j<analysis_data.length; j++){
						if(data.water_content[i].room_no == analysis_data[j].room_no){
							status = true;
							_x = j;
						}
					}
					if(status){
						if($.trim(data.water_content[i].water_content) == "适中"){
							analysis_data[_x].middle += data.water_content[i].sum;
						}else if($.trim(data.water_content[i].water_content) == "较小"){
							analysis_data[_x].small += data.water_content[i].sum;
						}else if($.trim(data.water_content[i].water_content) == "较大"){
							analysis_data[_x].big += data.water_content[i].sum;
						}
					}else{
						var map = {};
						map.room_no = data.water_content[i].room_no;
						map.middle = 0;
						map.small = 0;
						map.big = 0;
						if($.trim(data.water_content[i].water_content) == "适中"){
							map.middle = data.water_content[i].sum;
						}else if($.trim(data.water_content[i].water_content) == "较小"){
							map.small = data.water_content[i].sum;
						}else if($.trim(data.water_content[i].water_content) == "较大"){
							map.big = data.water_content[i].sum;
						}
						analysis_data.push(map);
					}
				}
				console.log(analysis_data)
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr><th rowspan="3">烤房编号</th><th colspan="6">含水量</th></tr><tr><th colspan="2">适中</th><th colspan="2">较小</th><th colspan="2">较大</th></tr><tr><th>重量</th><th>占比</th><th>重量</th><th>占比</th><th>重量</th><th>占比</th></tr></thead></table></div>');
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
			      data:analysis_data,
			      columns:[
			        {data:'room_no'},
			        {data:'middle',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'middle',render:function(data,type,full){
			        	var sum = full.middle+full.small+full.big;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }},
			        {data:'small',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'small',render:function(data,type,full){
			        	var sum = full.middle+full.small+full.big;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }},
			        {data:'big',render:function(data){
			        	return data.toFixed(2);
			        }},
			        {data:'big',render:function(data,type,full){
			        	var sum = full.middle+full.small+full.big;
			        	var p = (data/sum*100).toFixed(2);
			        	return p+'%';
			        }}        
			      ]
				});
			}
		});
	}
}

function initData(data){
	/*
	 * 定义统计数据
	 */
	var breed_sum = 0;  //鲜烟总量
	var breed_statistic = []; //品种统计数据,饼状图
	var type_statistic = [];  //类型统计数据,饼状图
	var part_statistic = [];  //部位统计数据,饼状图
	var maturity_statistic = [];  //成熟度统计数据,饼状图
	var tTrolleys_data = [];  //表格数据
	var tTrolleys2_data = [];  //表格数据
	var has_same = false;
	var _x = null;
	var map = {};

	/*
	 * 按烟品种统计数据
	 */
	if(data.by_breed.length != 0){
		map.name = $.trim(data.by_breed[0].breed);
		map.breed = $.trim(data.by_breed[0].breed);  //品种统计表格初始化
		map.y = parseInt(data.by_breed[0].weight_sum);
		map.weight_sum = parseInt(data.by_breed[0].weight_sum);  //品种统计表格初始化
		map.up_leaf_sum = 0;  //品种统计表格初始化
		map.middle_leaf_sum = 0;  //品种统计表格初始化
		map.down_leaf_sum = 0;  //品种统计表格初始化
		map.aridity = 0;  //品种统计表格初始化
		map.greenup = 0;  //品种统计表格初始化
		map.normal = 0;  //品种统计表格初始化
		breed_sum += parseInt(data.by_breed[0].weight_sum);
		breed_statistic.push(map);
		tTrolleys_data.push(map);  //品种统计表格初始化

		for(var i=1;i<data.by_breed.length;i++){
			has_same = false;
			_x = null;
			for(var j=0; j<breed_statistic.length; j++){
				if($.trim(breed_statistic[j].name) == $.trim(data.by_breed[i].breed)){
					has_same = true;
					_x = j;
				}
			}
			if(has_same){
				breed_statistic[_x].y += parseInt(data.by_breed[i].weight_sum);
				tTrolleys_data[_x].weight_sum += parseInt(data.by_breed[i].weight_sum);  //品种统计表格初始化
			}else {
				map = {};
				map.breed = $.trim(data.by_breed[i].breed);  //品种统计表格初始化
				map.name = $.trim(data.by_breed[i].breed);
				map.y = parseInt(data.by_breed[i].weight_sum);
				map.weight_sum = parseInt(data.by_breed[i].weight_sum);  //品种统计表格初始化
				map.up_leaf_sum = 0;  //品种统计表格初始化
				map.middle_leaf_sum = 0;  //品种统计表格初始化
				map.down_leaf_sum = 0;  //品种统计表格初始化
				map.aridity = 0;  //品种统计表格初始化
				map.greenup = 0;  //品种统计表格初始化
				map.normal = 0;  //品种统计表格初始化
				breed_statistic.push(map);
				tTrolleys_data.push(map);  //品种统计表格初始化
			}
			breed_sum += parseInt(data.by_breed[i].weight_sum);  //统计鲜烟总量
		}
		breed_statistic[0].sliced = true;
		breed_statistic[0].selected = true;

	}

	/*
	 * 按部位统计数据
	 */
	if(data.by_part.length != 0){
		map = {};
		map.name = $.trim(data.by_part[0].part);
		map.y = parseInt(data.by_part[0].weight_sum);
		part_statistic.push(map);
		for(var i=1;i<data.by_part.length;i++){
			has_same = false;
			_x = null;
			for(var j=0; j<part_statistic.length; j++){
				if($.trim(part_statistic[j].name) == $.trim(data.by_part[i].part)){
					has_same = true;
					_x = j;
				}
			}
			if(has_same){
				part_statistic[_x].y += parseInt(data.by_part[i].weight_sum);
			}else{
				map = {};
				map.name = $.trim(data.by_part[i].part);
				map.y = parseInt(data.by_part[i].weight_sum);
				part_statistic.push(map);
			}
		}
		part_statistic[0].sliced = true;
		part_statistic[0].selected = true;
	}

	/*
	 * 按类型统计数据
	 */
	if(data.by_type.length != 0){
		map = {};
		map.name = $.trim(data.by_type[0].tobacco_type);
		map.y = parseInt(data.by_type[0].weight_sum);
		type_statistic.push(map);
		for(var i=1;i<data.by_type.length;i++){
			has_same = false;
			_x = null;
			for(var j=0; j<type_statistic.length; j++){
				if($.trim(type_statistic[j].name) == $.trim(data.by_type[i].tobacco_type)){
					has_same = true;
					_x = j;
				}
			}
			if(has_same){
				type_statistic[_x].y += parseInt(data.by_type[i].weight_sum);
			}else{
				map = {};
				map.name = $.trim(data.by_type[i].tobacco_type);
				map.y = parseInt(data.by_type[i].weight_sum);
				type_statistic.push(map);
			}
		}
		type_statistic[0].sliced = true;
		type_statistic[0].selected = true;
	}
	
	
	/*
	 * 按成熟度统计数据
	 */
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
	
	/*
	 * tTrolleys2表格数据初始化
	 */
	if(data.by_part.length != 0){
		for(var i=0;i<part_statistic.length;i++){
			map = {};
			map.part = part_statistic[i].name;
			map.weight_sum = parseInt(part_statistic[i].y);
			map.aridity = 0;
			map.greenup = 0;
			map.normal = 0;
			map.weight_of_mature = 0;
			map.weight_of_immature = 0;
			map.weight_of_over_mature = 0;
			var breed = [];
			for(var j=0;j<breed_statistic.length;j++){
				breed.push({
					name: breed_statistic[j].breed,
					sum: 0
				})
			}
			map.breed = breed;
			tTrolleys2_data.push(map);
		}
	}
	for(var i=0;i<breed_statistic.length;i++){
		$(".breed_tr").append("<th>"+breed_statistic[i].breed+"</th>");
	}

	//tTrolleys表格数据总计
	if(tTrolleys_data.length != 0){
		for(var j=0;j<tTrolleys_data.length;j++){
			for(var i=0;i<data.by_breed_maturity.length;i++){
				if($.trim(data.by_breed_maturity[i].breed) == tTrolleys_data[j].breed){
					if(data.by_breed_maturity[i].weight_of_mature){
						tTrolleys_data[j].weight_of_mature = parseFloat(parseFloat(data.by_breed_maturity[i].weight_of_mature).toFixed(2));
					}else{
						tTrolleys_data[j].weight_of_mature = 0;
					}

					if(data.by_breed_maturity[i].weight_of_immature){
						tTrolleys_data[j].weight_of_immature = parseFloat(parseFloat(data.by_breed_maturity[i].weight_of_immature).toFixed(2));
					}else{
						tTrolleys_data[j].weight_of_immature = 0;
					}

					if(data.by_breed_maturity[i].weight_of_over_mature){
						tTrolleys_data[j].weight_of_over_mature = parseFloat(parseFloat(data.by_breed_maturity[i].weight_of_over_mature).toFixed(2));
					}else{
						tTrolleys_data[j].weight_of_over_mature = 0;
					}
				}
			}

			for(var i=0;i<data.by_breed_part.length;i++){
				if($.trim(data.by_breed_part[i].breed) == tTrolleys_data[j].breed){
					if($.trim(data.by_breed_part[i].part) == "上部叶"){
						tTrolleys_data[j].up_leaf_sum += data.by_breed_part[i].sum;
					}else if($.trim(data.by_breed_part[i].part) == "中部叶"){
						tTrolleys_data[j].middle_leaf_sum += data.by_breed_part[i].sum;
					}else if($.trim(data.by_breed_part[i].part) == "下部叶"){
						tTrolleys_data[j].down_leaf_sum += data.by_breed_part[i].sum;
					}
				}
			}

			for(var i=0;i<data.by_breed_type.length;i++){
				if($.trim(data.by_breed_type[i].breed) == tTrolleys_data[j].breed){
					if($.trim(data.by_breed_type[i].tobacco_type) == "干旱"){
						tTrolleys_data[j].aridity += data.by_breed_type[i].sum;
					}else if($.trim(data.by_breed_type[i].tobacco_type) == "返青"){
						tTrolleys_data[j].greenup += data.by_breed_type[i].sum;
					}else if($.trim(data.by_breed_type[i].tobacco_type) == "正常"){
						tTrolleys_data[j].normal += data.by_breed_type[i].sum;
					}
				}
			}
		}
	}
	
	//tTrolleys2表格数据总计
	if(tTrolleys2_data.length != 0){
		for(var j=0;j<tTrolleys2_data.length;j++){
			for(var i=0;i<data.by_part_maturity.length;i++){
				if($.trim(data.by_part_maturity[i].part) == tTrolleys2_data[j].part){
					if(data.by_part_maturity[i].weight_of_mature){
						tTrolleys2_data[j].weight_of_mature += parseFloat(parseFloat(data.by_part_maturity[i].weight_of_mature).toFixed(2));
					}else{
						tTrolleys2_data[j].weight_of_mature = 0;
					}

					if(data.by_part_maturity[i].weight_of_immature){
						tTrolleys2_data[j].weight_of_immature += parseFloat(parseFloat(data.by_part_maturity[i].weight_of_immature).toFixed(2));
					}else{
						tTrolleys2_data[j].weight_of_immature = 0;
					}

					if(data.by_part_maturity[i].weight_of_over_mature){
						tTrolleys2_data[j].weight_of_over_mature += parseFloat(parseFloat(data.by_part_maturity[i].weight_of_over_mature).toFixed(2));
					}else{
						tTrolleys2_data[j].weight_of_over_mature = 0;
					}
				}
			}

			for(var i=0;i<data.by_breed_part.length;i++){
				if($.trim(data.by_breed_part[i].part) == tTrolleys2_data[j].part){
					for(var k=0;k<tTrolleys2_data[j].breed.length;k++){
						if($.trim(data.by_breed_part[i].breed) == tTrolleys2_data[j].breed[k].name){
							tTrolleys2_data[j].breed[k].sum += parseFloat(data.by_breed_part[i].sum);
						}
					}
				}
			}

			for(var i=0;i<data.by_part_type.length;i++){
				if($.trim(data.by_part_type[i].part) == tTrolleys2_data[j].part){
					if($.trim(data.by_part_type[i].tobacco_type) == "干旱"){
						tTrolleys2_data[j].aridity = parseFloat(data.by_part_type[i].sum);
					}else if($.trim(data.by_part_type[i].tobacco_type) == "返青"){
						tTrolleys2_data[j].greenup = parseFloat(data.by_part_type[i].sum);
					}else if($.trim(data.by_part_type[i].tobacco_type) == "正常"){
						tTrolleys2_data[j].normal = parseFloat(data.by_part_type[i].sum);
					}
				}
			}
		}

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
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'middle_leaf_sum',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'down_leaf_sum',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
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
	            	return data.toFixed(2);
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum.toFixed(2);
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
	            	return data.toFixed(2);
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum.toFixed(2);
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	if(data[1]){
	        		return data[1].sum.toFixed(2);
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
	      
	      },
	      createdRow: function ( row, data, index ) {
	        
	      },
	      columns:[
	        {data:'part'},
	        {data:'weight_sum'},
	        {data:'weight_of_immature',render:function(data,type,full){
	            if(data){
	            	return data.toFixed(2);
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum.toFixed(2);
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[1].sum.toFixed(2);
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[2].sum.toFixed(2);
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
	            	return data.toFixed(2);
	            }else{
	            	return "0";
	            }
	        }},
	        {data:'weight_of_mature',render:function(data,type,row){
	        	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'weight_of_over_mature',render:function(data,type,row){
	          	if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'normal',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'greenup',render:function(data,type,row){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'aridity',render:function(data,type,full){
	            if(data){
	        		return data.toFixed(2);
	        	}else{
	        		return "0";
	        	}
	        }},
	        {data:'breed',render:function(data,type,full){
	            return data[0].sum.toFixed(2);
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[1].sum.toFixed(2);
	        	
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[2].sum.toFixed(2);
	        }},
	        {data:'breed',render:function(data,type,full){
	        	//console.log(data[1])
	        	return data[3].sum.toFixed(2);
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
