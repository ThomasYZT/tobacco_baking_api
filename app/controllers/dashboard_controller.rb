class DashboardController < ApplicationController
	def index
		now_time = Time.now
		start_time = now_time.year.to_s + "-" + now_time.month.to_s + "-01 00:00:00"
		end_time = now_time.year.to_s + "-" + now_time.month.to_s + "-" + Time.days_in_month(now_time.month).to_s + " 11:59:59"
		@time = [now_time.year.to_s,now_time.month.to_s]
		if session[:code].to_s.length == 6
			#@dry_sum = DryTobacco.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?',"%"+session[:code].to_s+"%"]
			#@used_room = Room.find_by_sql ["select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			#@used_area = Contract.find_by_sql ["select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? group by party_b) as a","%"+session[:code].to_s+"%"]
			#@fresh_sum = FreshTobacco.find_by_sql ["select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			
			@dry_sum = StandardDatum.find_by_sql ['select sum(dry_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@used_room = StandardDatum.find_by_sql ['select sum(using_rooms) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@used_area = @used_room[0].sum.to_i * 20
			@fresh_sum = StandardDatum.find_by_sql ['select sum(fresh_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]

			error_maturity = FreshTobacco.find_by_sql ['select f.id from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature = 0',"%"+session[:code].to_s+"%"]
			if error_maturity
				error_maturity.each do |error|
					maturity = FreshTobacco.find_by_id(error.id)
					maturity.update_attribute('weight_of_mature',1.00)
				end
			end

			@using_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step = 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@over_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step > 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			#@average_room = Room.find_by_sql ['select r.room_no,COUNT(r.room_no),sum(c.amount) from rooms r left join stations s on s.id = r.station_id left join tasks t on t.room_id = r.id left join contracts c on c.task_id = t.id where s.code like ? group by r.room_no',"%"+session[:code].to_s+"%"]
			@average_room = StandardDatum.find_by_sql ['select sum(total_bake_num) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@station_name = Station.find_by_sql ['select s.title from stations s where s.code = ?',session[:code].to_s]
			@maturity = FreshTobacco.find_by_sql ['select sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_immature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_immature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_mature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_over_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_over_mature from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@this_m_get = FreshTobacco.find_by_sql ['select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and p.created_at between ? and ?',"%"+session[:code].to_s+"%","2016-06-01","2016-06-30"]
			@this_m_use_area = Contract.find_by_sql ['select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and con.created_at between ? and ? group by party_b) as a',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_use_room = Room.find_by_sql ['select count(*) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step >= 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@this_m_baking_sum = Packing.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and d.created_at between ? and ?',start_time,end_time]
			@every_c_d_per = DryTobacco.find_by_sql ['select s.title,sum(dd.weight_zz)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as zz,sum(dd.weight_wq)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as wq,sum(dd.weight_q)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as q,sum(dd.weight_zs)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as zs from dry_details dd left join dry_tobaccos d on d.id = dd.dry_tobacco_id left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code like ? group by s.title order by s.title',"%"+session[:code].to_s+"%"]
			

			respond_to do |format|
			  format.html
			  format.json { render json:{ used_room: @used_room,
			                              used_area: @used_area,
			                              fresh_sum: @fresh_sum,
			                              average_room: @average_room,
			                              maturity: @maturity,
			                              this_m_get: @this_m_get,
			                              this_m_use_area: @this_m_use_area,
			                              this_m_use_room: @this_m_use_room,
			                              this_m_baking_sum: @this_m_baking_sum,
			                              every_c_d_per: @every_c_d_per,
			                              dry_sum: @dry_sum,
			                              station_name: @station_name,
			                              using_rooms: @using_rooms,
			                              over_rooms: @over_rooms,
			                              time: @time }}
			end	
		
		elsif session[:code].to_s.length == 4
			@counties = County.find_by_sql ['select c.title,c.code from counties c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@stations = Station.find_by_sql ['select s.title,s.code from stations s where s.code like ?',"%"+session[:code].to_s+"%"]
			#@dry_sum = DryTobacco.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?',"%"+session[:code].to_s+"%"]
			#@used_room = Room.find_by_sql ["select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			#@used_area = Contract.find_by_sql ["select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? group by party_b) as a","%"+session[:code].to_s+"%"]
			#@fresh_sum = FreshTobacco.find_by_sql ["select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			
			@dry_sum = StandardDatum.find_by_sql ['select sum(dry_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@used_room = StandardDatum.find_by_sql ['select sum(using_rooms) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@used_area = @used_room[0].sum.to_i * 20
			@fresh_sum = StandardDatum.find_by_sql ['select sum(fresh_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]

			@city_name = City.find_by_sql ['select c.title from cities c where c.code = ?',session[:code].to_s]
			@using_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step = 5 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@over_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step > 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			#@average_room = Room.find_by_sql ['select r.room_no,COUNT(r.room_no),sum(c.amount) from rooms r left join stations s on s.id = r.station_id left join tasks t on t.room_id = r.id left join contracts c on c.task_id = t.id where s.code like ? group by r.room_no',"%"+session[:code].to_s+"%"]
			@average_room = StandardDatum.find_by_sql ['select sum(total_bake_num) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			@maturity = FreshTobacco.find_by_sql ['select sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_immature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_immature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_mature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_over_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_over_mature from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@this_m_get = FreshTobacco.find_by_sql ['select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and p.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_use_area = Contract.find_by_sql ['select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and con.created_at between ? and ? group by party_b) as a',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_use_room = Room.find_by_sql ['select count(*) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step >= 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_baking_sum = Packing.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and d.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@every_c_d_per = DryTobacco.find_by_sql ['select c.title,sum(dd.weight_zz)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as zz,sum(dd.weight_wq)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as wq,sum(dd.weight_q)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as q,sum(dd.weight_zs)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as zs from dry_details dd left join dry_tobaccos d on d.id = dd.dry_tobacco_id left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code like ? group by c.title order by c.title',"%"+session[:code].to_s+"%"]
			
			
			respond_to do |format|
			  format.html
			  format.json { render json:{ used_room: @used_room,
			                              used_area: @used_area,
			                              fresh_sum: @fresh_sum,
			                              average_room: @average_room,
			                              maturity: @maturity,
			                              this_m_get: @this_m_get,
			                              this_m_use_area: @this_m_use_area,
			                              this_m_use_room: @this_m_use_room,
			                              this_m_baking_sum: @this_m_baking_sum,
			                              every_c_d_per: @every_c_d_per,
			                              dry_sum: @dry_sum,
			                              counties: @counties,
			                              stations: @stations, 
			                              city_name: @city_name,
			                              using_rooms: @using_rooms,
			                              over_rooms: @over_rooms,
			                              time: @time }}
			end
		elsif session[:code].to_s.length == 2
			@cities = City.find_by_sql ['select c.title,c.code from cities c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@counties = County.find_by_sql ['select c.title,c.code from counties c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@stations = Station.find_by_sql ['select s.title,s.code from stations s where s.code like ?',"%"+session[:code].to_s+"%"]
			#@dry_sum = DryTobacco.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?',"%"+session[:code].to_s+"%"]
			@dry_sum = StandardDatum.find_by_sql ['select sum(dry_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			#@used_room = Room.find_by_sql ["select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			@used_room = StandardDatum.find_by_sql ['select sum(using_rooms) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			#@used_area = Contract.find_by_sql ["select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? group by party_b) as a","%"+session[:code].to_s+"%"]
			@used_area = @used_room[0].sum.to_i * 20
			#@fresh_sum = FreshTobacco.find_by_sql ["select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ?","%"+session[:code].to_s+"%"]
			@fresh_sum = StandardDatum.find_by_sql ['select sum(fresh_weight) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			#@average_room = Room.find_by_sql ['select r.room_no,COUNT(r.room_no),sum(c.amount) from rooms r left join stations s on s.id = r.station_id left join tasks t on t.room_id = r.id left join contracts c on c.task_id = t.id where s.code like ? group by r.room_no',"%"+session[:code].to_s+"%"]
			@average_room = StandardDatum.find_by_sql ['select sum(total_bake_num) from standard_data s where s.code like ?',"%"+session[:code].to_s+"%"]
			error_maturity = FreshTobacco.find_by_sql ['select f.id from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature = 0',"%"+session[:code].to_s+"%"]
			if error_maturity
				error_maturity.each do |error|
					maturity = FreshTobacco.find_by_id(error.id)
					maturity.update_attribute('weight_of_mature',1.00)
				end
			end
			@maturity = FreshTobacco.find_by_sql ['select sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_immature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_immature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_mature,sum((cast(p.average_weight as float) * p.packing_amount) * (f.weight_of_over_mature/(f.weight_of_immature + f.weight_of_mature + f.weight_of_over_mature))) as weight_of_over_mature from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@this_m_get = FreshTobacco.find_by_sql ['select sum(cast(average_weight as float) * packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and p.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_use_area = Contract.find_by_sql ['select sum(a.avg) from (select distinct con.party_b,avg(con.amount) from contracts con left join tasks t on t.id = con.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and con.created_at between ? and ? group by party_b) as a',"%"+session[:code].to_s+"%",start_time,end_time]
			@this_m_use_room = Room.find_by_sql ['select count(*) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step >= 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@using_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step = 5 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']
			@over_rooms = Room.find_by_sql ['select count(distinct t.room_id) from tasks t left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where t.step > 6 and s.code like ? and t.created_at between ? and ?',"%"+session[:code].to_s+"%",'2016-06-01','2016-06-30']

			@this_m_baking_sum = Packing.find_by_sql ['select sum(d.weight * p.packing_amount)/1000 as sum from dry_tobaccos d left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code like ? and d.created_at between ? and ?',"%"+session[:code].to_s+"%",start_time,end_time]
			@every_c_d_per = DryTobacco.find_by_sql ['select ci.title,sum(dd.weight_zz)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as zz,sum(dd.weight_wq)/sum(amount_weight) * sum(d.weight * p.packing_amount)/3000 as wq,sum(dd.weight_q)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as q,sum(dd.weight_zs)/sum(amount_weight) *sum(d.weight * p.packing_amount)/3000 as zs from dry_details dd left join dry_tobaccos d on d.id = dd.dry_tobacco_id left join packings p on p.task_id = d.task_id left join tasks t on t.id = d.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code like ? group by ci.title order by ci.title',"%"+session[:code].to_s+"%"]

			respond_to do |format|
			  format.html
			  format.json { render json:{ used_room: @used_room,
			                              used_area: @used_area,
			                              fresh_sum: @fresh_sum,
			                              average_room: @average_room,
			                              maturity: @maturity,
			                              this_m_get: @this_m_get,
			                              this_m_use_area: @this_m_use_area,
			                              this_m_use_room: @this_m_use_room,
			                              this_m_baking_sum: @this_m_baking_sum,
			                              every_c_d_per: @every_c_d_per,
			                              dry_sum: @dry_sum,
			                              cities: @cities,
			                              counties: @counties,
			                              stations: @stations,
			                              using_rooms: @using_rooms,
			                              over_rooms: @over_rooms,
			                              time: @time }}
			end				
		end 
	end

	def getlist
		if session[:code].to_s.length == 6
			@stations = Station.find_by_sql ['select s.title,s.code from stations s where s.code like ?',"%"+session[:code].to_s+"%"]
			respond_to do |format|
			  format.html
			  format.json { render json:{ stations: @stations }}
			end	
		elsif session[:code].to_s.length == 4
			@counties = County.find_by_sql ['select c.title,c.code from counties c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@stations = Station.find_by_sql ['select s.title,s.code from stations s where s.code like ?',"%"+session[:code].to_s+"%"]
			respond_to do |format|
			  format.html
			  format.json { render json:{ counties: @counties,
			                              stations: @stations }}
			end	
		elsif session[:code].to_s.length == 2
			@cities = City.find_by_sql ['select c.title,c.code from cities c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@counties = County.find_by_sql ['select c.title,c.code from counties c where c.code like ?',"%"+session[:code].to_s+"%"] 
			@stations = Station.find_by_sql ['select s.title,s.code from stations s where s.code like ?',"%"+session[:code].to_s+"%"]
			respond_to do |format|
			  format.html
			  format.json { render json:{ cities: @cities,
			                              counties: @counties,
			                              stations: @stations }}
			end	
		end
				
				
	end
end
