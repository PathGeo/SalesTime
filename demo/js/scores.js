function getScore(condition){
	//Reputation Scores
	if (condition == "dailyRep"){
		var data_daily_rep  = [
				['Date', 'Reputation'],
				['Feb 24',  252],
				['Feb 25',  271],
				['Feb 26',  277],
				['Feb 27',  109],
				['Feb 28',  200],
				['Mar 1',  224],
				['Mar 2',  288]        
		]
		return data_daily_rep;
	}
	if (condition == "weeklyRep"){

		var data_weekly_rep  = [
			['Date', 'Reputation'],
			['Jan 27-Feb 2',  120],
			['Feb 3-Feb 9',  100],
			['Feb 10-Feb 16',  222],
			['Feb 17-Feb 23',  252],
			['Feb 24-Mar 2',  288]      
		]
		return data_weekly_rep;
	}
	if (condition == "monthlyRep"){

		var data_monthly_rep  = [
			['Date', 'Reputation'],
			['Oct',  82],
			['Nov',  45],
			['Dec',  155],
			['Jan',  161],
			['Feb',  263],
			['Mar',  288]   
		]
		return data_monthly_rep;
	}
	
	//Visibilty Scores
	if (condition == "dailyVis"){
		var data_daily_vis  = [
			['Date', 'Visibilty'],
			['Feb 24',  121],
			['Feb 25',  138],
			['Feb 26',  171],
			['Feb 27',  206],
			['Feb 28',  145],
			['Mar 1',  251],
			['Mar 2',  252]      
		]
		return data_daily_vis;
	}
	if (condition == "weeklyVis"){

		var data_weekly_vis  = [
			['Date', 'Visibilty'],
			['Jan 27 - Feb 2',  88],
			['Feb 3 - Feb 9',  100],
			['Feb 10 - Feb 16',  180],
			['Feb 17 - Feb 23',  200],
			['Feb 24 - Mar 2',  252]     
		]
		return data_weekly_vis;
	}
	if (condition == "monthlyVis"){

		var data_monthly_vis  = [
			['Date', 'Visibilty'],
			['Oct',  121],
			['Nov',  100],
			['Dec',  142],
			['Jan',  192],
			['Feb',  211],
			['Mar',  252]    
		]
		return data_monthly_vis;
	}
}

