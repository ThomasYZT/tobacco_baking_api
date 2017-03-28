(function(){
	var detail_code = $(".detail_code").text();
	$.ajax({
		type:"get",
		url:"/packing_detail/"+detail_code,
		dataType:'json',
		success:function(data){
			console.log(data);
			if(detail_code.length == 4){
				$(".active").text(data.city[0].title+"装烟数据统计");
			}else if(detail_code.length == 6){
				$(".active").text(data.county[0].title+"装烟数据统计");
			}else if(detail_code.length == 10){
				$(".active").text(data.station[0].title+"装烟数据统计");
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

			console.log(data);
			var packing_weight = 0;
			var packing_sum = 0;
			var packing_category = [];
			var packing_type = [];
			var uniformity = [];
			var status = [];
			var tTrolleys_data = [];
			for(var i=0;i<data.packing_weight.length;i++){
				packing_weight = parseFloat(data.packing_weight[i].sum);
			}
			for(var i=0;i<data.packing_sum.length;i++){
				packing_sum = parseFloat(data.packing_sum[i].sum);
			}

			for(var i=0;i<data.packing_weight_by_counties.length;i++){
				var map = {};
				map.title = data.packing_weight_by_counties[i].title;
				map.weight = parseFloat(data.packing_weight_by_counties[i].weight);
				map.sum = parseFloat(data.packing_weight_by_counties[i].sum);
				tTrolleys_data.push(map);
			}

			for(var i=0;i<data.by_category.length;i++){
				var map = {};
				map.name = data.by_category[i].category;
				map.y = data.by_category[i].packing_sum;
				packing_category.push(map);
			}
			packing_category[0].sliced = true;
			packing_category[0].selected = true;

			for(var i=0;i<data.by_packing_type.length;i++){
				var map = {};
				if(data.by_packing_type[i].packing_type == "各竿/夹量基本一致"){
					map.name = "正确";
					map.y = data.by_packing_type[i].sum;
					packing_type.push(map);
				} else if(data.by_packing_type[i].packing_type == "各竿/夹量不一致") {
					map.name = "不正确";
					map.y = data.by_packing_type[i].sum;
					map.sliced = true;
					map.selected = true;
					packing_type.push(map);
				}
			}

			for(var i=0;i<data.by_uniformity.length;i++){
				var map = {};
				map.name = data.by_uniformity[i].uniformity;
				map.y = data.by_uniformity[i].sum;
				uniformity.push(map);
			}
			uniformity[0].sliced = true;
			uniformity[0].selected = true;
			
			for(var i=0;i<data.by_status.length;i++){
				var map = {};
				if(data.by_status[i].status == "f"){
					map.name = "不正确";
					map.y = data.by_status[i].sum;
					status.push(map);
				}else{
					map.name = "正确";
					map.y = data.by_status[i].sum;
					map.sliced = true;
					map.selected = true;
					status.push(map);
				}
			}
			//初始化表格数据
			for(var j=0;j<tTrolleys_data.length;j++){
				for(var i=0;i<data.by_category_counties.length;i++){
					if(tTrolleys_data[j].title == data.by_category_counties[i].title){
						if(data.by_category_counties[i].category == "混编"){
							tTrolleys_data[j].mixed = data.by_category_counties[i].sum;
						}else{
							tTrolleys_data[j].homogeny = data.by_category_counties[i].sum;
						}
					}
				}

				for(var i=0;i<data.by_type_counties.length;i++){
					if(tTrolleys_data[j].title == data.by_type_counties[i].title){
						if(data.by_type_counties[i].packing_type == "各竿/夹量基本一致"){
							tTrolleys_data[j].packing_uniformity = data.by_type_counties[i].sum;
						}else{
							tTrolleys_data[j].packing_ununiformity = data.by_type_counties[i].sum;
						}
					}
				}

				for(var i=0;i<data.by_status_counties.length;i++){
					if(tTrolleys_data[j].title == data.by_status_counties[i].title){
						if(data.by_status_counties[i].status == "f"){
							tTrolleys_data[j].f = data.by_status_counties[i].sum;
						}else{
							tTrolleys_data[j].t = data.by_status_counties[i].sum;
						}
					}
				}

				for(var i=0;i<data.by_uniformity_counties.length;i++){
					if(tTrolleys_data[j].title == data.by_uniformity_counties[i].title){
						if(data.by_uniformity_counties[i].uniformity == "前稀后密"){
							tTrolleys_data[j].front_less = data.by_uniformity_counties[i].sum;
						}else if(data.by_uniformity_counties[i].uniformity == "前密后稀"){
							tTrolleys_data[j].tail_less = data.by_uniformity_counties[i].sum;
						}else{
							tTrolleys_data[j].uniformity = data.by_uniformity_counties[i].sum;
						}
					}
				}

				for(var i=0;i<data.counties_code.length;i++){
					if(tTrolleys_data[j].title == data.counties_code[i].title){
						tTrolleys_data[j].code = data.counties_code[i].code;
					}
				}
			}
			console.log(tTrolleys_data)

			initChart(packing_weight, packing_sum, packing_category, packing_type, uniformity, status);
			initTable(tTrolleys_data);


		}
	});

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
			url:"/packing_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>竿数</th><th>总量</th><th>照片</th></tr></thead></table></div>');
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
			      data:data.sum,
			      columns:[
			        {data:'room_no'},
			        {data:'packing_amount'},
			        {data:'sum'},
			        {data:'room_no',render:function(data){
			        	
			        	return '<button class="img">查看</button>';
			        }}     
			      ],
			      initComplete: function(data) {
			      	$(".img").on('click',function(){
		        		$("#Modal").modal('toggle');
		        	});
			      }
				});
			}
		});
		
	}else if($(e).hasClass("category")){
		data.type = 'category';
		$.ajax({
			type:"get",
			url:"/packing_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>编竿分类</th><th>总量</th></tr></thead></table></div>');
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
			      data:data.category,
			      columns:[
			        {data:'room_no'},
			        {data:'category'},
			        {data:'sum'}       
			      ]
				});
			}
		});
	}else if($(e).hasClass("uniformity")){
		data.type = 'uniformity';
		$.ajax({
			type:"get",
			url:"/packing_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>均匀性</th><th>总量</th></tr></thead></table></div>');
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
			      data:data.uniformity,
			      columns:[
			        {data:'room_no'},
			        {data:'uniformity'},
			        {data:'sum'}       
			      ]
				});
			}
		});
	}else if($(e).hasClass("packing_type")){
		data.type = 'packing_type';
		$.ajax({
			type:"get",
			url:"/packing_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>装烟类型</th><th>总量</th></tr></thead></table></div>');
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
			      data:data.packing_type,
			      columns:[
			        {data:'room_no'},
			        {data:'packing_type'},
			        {data:'sum'}       
			      ]
				});
			}
		});
	}else if($(e).hasClass("status")){
		data.type = 'status';
		$.ajax({
			type:"get",
			url:"/packing_detail/"+detail_code,
			dataType:'json',
			data:data,
			success:function(data){
				console.log(data);
				$("#room_details").remove();
				$(".room_row").find(".box-body").append('<div class="col-md-12" id="room_details"><table class="table table-striped table-hover" id="room_analysis"><thead><tr>'+
                      									'<th>烤房编号</th><th>分类装烟情况</th><th>总量</th></tr></thead></table></div>');
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
			      data:data.status,
			      columns:[
			        {data:'room_no'},
			        {data:'status',render:function(data){
			        	if(data == 'f'){
			        		return '错误';
			        	}else{
			        		return '正确';
			        	}
			        }},
			        {data:'sum'}       
			      ]
				});
			}
		});
	}

}

function initTable(tTrolleys_data){
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
	            {data:'title'},
	            {data:'weight'},
	            {data:'sum'},
	            {data:'homogeny',render:function(data,type,row){
	            	if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'mixed',render:function(data,type,row){
	              	if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'packing_uniformity',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'packing_ununiformity',render:function(data,type,row){
	                if(data){
	            		return data;
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'t',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'f',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'uniformity',render:function(data,type,row){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'tail_less',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }},
	            {data:'front_less',render:function(data,type,full){
	                if(data){
	            		return parseFloat(data).toFixed(2);
	            	}else{
	            		return "0";
	            	}
	            }}
	          ]
			});
}

function initChart(packing_weight, packing_sum, packing_category, packing_type, uniformity, status){
	
	$('#container').highcharts({  //图表展示容器，与div的id保持一致
        chart: {
            type: 'column'  //指定图表的类型，默认是折线图（line）
        },
        title: {
            text: '编装烟统计'  //指定图表标题
        },
        credits: { enabled: false},
        xAxis: {
            categories: ['装烟量','杆数']  //指定x轴分组
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
        	name:'统计',
            data: [{
            	name:'装烟量(公斤)',
            	y:parseInt(packing_weight)
            },{
            	name:'杆数(杆)',
            	y:packing_sum
            }] 
        }]
    });

	$('#container2').highcharts({
            title: {
                text: '分类编烟统计(杆)'
            },
            credits: { enabled: false},
            tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}竿</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
           
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '杆数',
                data: packing_category
            }]
        });

	$('#container3').highcharts({
            title: {
                text: '竿/夹内均匀性统计(杆)'
            },
            credits: { enabled: false},
            
           	tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}竿</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '杆数',
                data: packing_type
            }]
        });

	$('#container4').highcharts({
            title: {
                text: '分类装烟情况'
            },
            credits: { enabled: false},
            
           	tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '重量(公斤)',
                data: status
            }]
        });

	$('#container5').highcharts({
            title: {
                text: '装烟均匀性统计'
            },
            credits: { enabled: false},
            
           	tooltip: {
            	pointFormat: '{series.name}:<p>{point.y}公斤</p><br/> 比重:<p>{point.percentage:.1f}%</p>'
       		},
            plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: false }, showInLegend: true } },
            series: [{
                type: 'pie',
                name: '重量(公斤)',
                data: uniformity
            }]
        });
}