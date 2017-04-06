class PackingDetailController < ApplicationController
	def index
		if params[:code].to_s.length == 4
			@counties_code = County.find_by_sql ["select * from cities c where c.code = ?",params[:code].to_s]
		    
		    @packing_weight= Packing.find_by_sql ["select ci.title,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by ci.title",params[:code].to_s]
		    @packing_amount = Packing.find_by_sql ["select ci.title,SUM(packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by ci.title",params[:code].to_s]
		    @by_category = Packing.find_by_sql ["select p.category,sum(p.packing_amount) as packing_sum from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.category",params[:code].to_s]
		    @by_uniformity = Packing.find_by_sql ["select p.uniformity,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.uniformity",params[:code].to_s]
		    @by_packing_type = Packing.find_by_sql ["select p.packing_type,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.packing_type",params[:code].to_s]
		    @by_status = Packing.find_by_sql ["select r.status,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by r.status",params[:code].to_s]
		   
		    @packing_weight_by_counties = Packing.find_by_sql ['select ci.title,SUM(p.packing_amount) as sum,SUM(p.packing_amount * cast(p.average_weight as numeric(5,2))) as weight from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by ci.title',params[:code].to_s]
		    @by_category_counties = Packing.find_by_sql ['select p.category,ci.title,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.category,ci.title',params[:code].to_s]
		    @by_type_counties = Packing.find_by_sql ['select p.packing_type,ci.title,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.packing_type,ci.title',params[:code].to_s]
		    @by_status_counties = Packing.find_by_sql ['select ci.title,r.status,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by r.status,ci.title',params[:code].to_s]
		    @by_uniformity_counties = Packing.find_by_sql ['select p.uniformity,ci.title,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where ci.code = ? group by p.uniformity,ci.title',params[:code].to_s]
			
			@city = City.find_by_sql ['select c.title,c.code from cities c where c.code = ?',params[:code].to_s]
			respond_to do |format|
			   format.html
			   format.json { render json:{ city: @city,
			                               by_category: @by_category, 
		    	                           packing_sum: @packing_amount,
		    	                           packing_weight: @packing_weight,
		    	                           by_uniformity: @by_uniformity,
		    	                           by_packing_type: @by_packing_type,
		    	                           by_status: @by_status,
		    	                           packing_weight_by_counties: @packing_weight_by_counties,
		    	                           by_category_counties: @by_category_counties,
		    	                           by_type_counties: @by_type_counties,
		    	                           by_status_counties: @by_status_counties,
		    	                           by_uniformity_counties: @by_uniformity_counties,
		    	                           counties_code:@counties_code }}
			end

		elsif params[:code].to_s.length == 6
			@counties_code = County.find_by_sql ["select * from counties c where c.code = ?",params[:code].to_s]
			
			@packing_weight= Packing.find_by_sql ["select c.title,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by c.title",params[:code].to_s]
		    @packing_amount = Packing.find_by_sql ["select c.title,SUM(packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by c.title",params[:code].to_s]
		    @by_category = Packing.find_by_sql ["select p.category,sum(p.packing_amount) as packing_sum from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by p.category",params[:code].to_s]
		    @by_uniformity = Packing.find_by_sql ["select p.uniformity,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by p.uniformity",params[:code].to_s]
		    @by_packing_type = Packing.find_by_sql ["select p.packing_type,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by p.packing_type",params[:code].to_s]
		    @by_status = Packing.find_by_sql ["select r.status,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where c.code = ? group by r.status",params[:code].to_s]
		    
		    @packing_weight_by_counties = Packing.find_by_sql ['select c.title,SUM(cast(p.average_weight as float) * p.packing_amount) as sum,SUM(p.packing_amount) as weight from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code = ? group by c.title',params[:code].to_s]
		    @by_category_counties = Packing.find_by_sql ['select p.category,c.title,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code = ? group by p.category,c.title',params[:code].to_s]
		    @by_type_counties = Packing.find_by_sql ['select p.packing_type,c.title,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code = ? group by p.packing_type,c.title',params[:code].to_s]
		    @by_status_counties = Packing.find_by_sql ['select c.title,r.status,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code = ? group by r.status,c.title',params[:code].to_s]
		    @by_uniformity_counties = Packing.find_by_sql ['select p.uniformity,c.title,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where c.code = ? group by p.uniformity,c.title',params[:code].to_s]
			
			@county = County.find_by_sql ['select c.title,c.code from counties c where c.code = ?',params[:code].to_s]	
			respond_to do |format|
			   format.html
			   format.json { render json:{ county: @county,
			                               by_category: @by_category, 
		    	                           packing_sum: @packing_amount,
		    	                           packing_weight: @packing_weight,
		    	                           by_uniformity: @by_uniformity,
		    	                           by_packing_type: @by_packing_type,
		    	                           by_status: @by_status,
		    	                           packing_weight_by_counties: @packing_weight_by_counties,
		    	                           by_category_counties: @by_category_counties,
		    	                           by_type_counties: @by_type_counties,
		    	                           by_status_counties: @by_status_counties,
		    	                           by_uniformity_counties: @by_uniformity_counties,
		    	                           counties_code:@counties_code }}
			end

		elsif params[:code].to_s.length == 10
			if params[:type] == "sum"
				if params[:room_no] == "0"
					@sum = Packing.find_by_sql ['select r.room_no,c.party_b,c.work_started,c.work_finished,f.breed,sum(cast(p.average_weight as float) * p.packing_amount),sum(p.packing_amount) as packing_amount from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join contracts c on c.task_id = t.id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? group by r.room_no,f.breed,c.party_b,c.work_started,c.work_finished order by cast(r.room_no as int),c.work_started',params[:station_code]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ sum: @sum }}
					end
				else
					@sum = Packing.find_by_sql ['select r.room_no,c.party_b,c.work_started,c.work_finished,f.breed,sum(cast(p.average_weight as float) * p.packing_amount),sum(p.packing_amount) as packing_amount from packings p left join fresh_tobaccos f on f.task_id = p.task_id left join tasks t on t.id = p.task_id left join contracts c on c.task_id = t.id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? and r.room_no = ? group by r.room_no,f.breed,c.party_b,c.work_started,c.work_finished order by cast(r.room_no as int),c.work_started',params[:station_code],params[:room_no]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ sum: @sum }}
					end
				end
				
			elsif params[:type] == "category"
				if params[:room_no] == "0"
					@category = Packing.find_by_sql ['select r.room_no,p.category,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? group by r.room_no,p.category order by cast(r.room_no as int)',params[:station_code]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ category: @category }}
					end
				else
					@category = Packing.find_by_sql ['select r.room_no,p.category,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? and r.room_no = ? group by r.room_no,p.category order by cast(r.room_no as int)',params[:station_code],params[:room_no]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ category: @category }}
					end
				end
			elsif params[:type] == "uniformity"
				if params[:room_no] == "0"
					@uniformity = Packing.find_by_sql ['select r.room_no,p.uniformity,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? group by r.room_no,p.uniformity order by cast(r.room_no as int)',params[:station_code]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ uniformity: @uniformity }}
					end
				else
					@uniformity = Packing.find_by_sql ['select r.room_no,p.uniformity,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? and r.room_no = ? group by r.room_no,p.uniformity order by cast(r.room_no as int)',params[:station_code],params[:room_no]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ uniformity: @uniformity }}
					end
				end
			elsif params[:type] == "packing_type"
				if params[:room_no] == "0"
					@packing_type = Packing.find_by_sql ['select r.room_no,p.packing_type,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? group by r.room_no,p.packing_type order by cast(r.room_no as int)',params[:station_code]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ packing_type: @packing_type }}
					end
				else
					@packing_type = Packing.find_by_sql ['select r.room_no,p.packing_type,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? and r.room_no = ? group by r.room_no,p.packing_type order by cast(r.room_no as int)',params[:station_code],params[:room_no]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ packing_type: @packing_type }}
					end
				end
			elsif params[:type] == "status"
				if params[:room_no] == "0"
					@status = Packing.find_by_sql ['select r.room_no,r.status,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? group by r.room_no,r.status order by cast(r.room_no as int)',params[:station_code]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ status: @status }}
					end
				else
					@status = Packing.find_by_sql ['select r.room_no,r.status,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id where s.code = ? and r.room_no = ? group by r.room_no,r.status order by cast(r.room_no as int)',params[:station_code],params[:room_no]]
					respond_to do |format|
					   format.html
					   format.json { render json:{ status: @status }}
					end
				end
			else
				@counties_code = County.find_by_sql ["select * from stations s where s.code = ?",params[:code].to_s]
			
				@packing_weight= Packing.find_by_sql ["select s.title,sum(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by s.title",params[:code].to_s]
			    @packing_amount = Packing.find_by_sql ["select s.title,SUM(packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by s.title",params[:code].to_s]
			    @by_category = Packing.find_by_sql ["select p.category,sum(p.packing_amount) as packing_sum from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by p.category",params[:code].to_s]
			    @by_uniformity = Packing.find_by_sql ["select p.uniformity,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by p.uniformity",params[:code].to_s]
			    @by_packing_type = Packing.find_by_sql ["select p.packing_type,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on t.room_id = r.id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by p.packing_type",params[:code].to_s]
			    @by_status = Packing.find_by_sql ["select r.status,SUM(p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id left join cities ci on ci.id = c.city_id where s.code = ? group by r.status",params[:code].to_s]
			    
			    @packing_weight_by_counties = Packing.find_by_sql ['select s.title,SUM(p.packing_amount) as sum,SUM(p.packing_amount * cast(p.average_weight as numeric(5,2))) as weight from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code = ? group by s.title',params[:code].to_s]
			    @by_category_counties = Packing.find_by_sql ['select p.category,s.title,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code = ? group by p.category,s.title',params[:code].to_s]
			    @by_type_counties = Packing.find_by_sql ['select p.packing_type,s.title,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code = ? group by p.packing_type,s.title',params[:code].to_s]
			    @by_status_counties = Packing.find_by_sql ['select s.title,r.status,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code = ? group by r.status,s.title',params[:code].to_s]
			    @by_uniformity_counties = Packing.find_by_sql ['select p.uniformity,s.title,SUM(cast(p.average_weight as float) * p.packing_amount) from packings p left join tasks t on t.id = p.task_id left join rooms r on r.id = t.room_id left join stations s on s.id = r.station_id left join counties c on c.id = s.county_id where s.code = ? group by p.uniformity,s.title',params[:code].to_s]
				
				@station = Station.find_by_sql ['select s.title,s.code from stations s where s.code =?',params[:code].to_s]
				@rooms = Room.find_by_sql ['select r.id,r.room_no,r.address,r.station_id from rooms r left join stations s on s.id = r.station_id where s.code = ? order by r.address',params[:code].to_s]
				respond_to do |format|
				   format.html
				   format.json { render json:{ station: @station,
				                               by_category: @by_category, 
			    	                           packing_sum: @packing_amount,
			    	                           packing_weight: @packing_weight,
			    	                           by_uniformity: @by_uniformity,
			    	                           by_packing_type: @by_packing_type,
			    	                           by_status: @by_status,
			    	                           packing_weight_by_counties: @packing_weight_by_counties,
			    	                           by_category_counties: @by_category_counties,
			    	                           by_type_counties: @by_type_counties,
			    	                           by_status_counties: @by_status_counties,
			    	                           by_uniformity_counties: @by_uniformity_counties,
			    	                           counties_code:@counties_code,
			    	                           rooms:@rooms }}
				end
			end
			
		end	
	end

end
