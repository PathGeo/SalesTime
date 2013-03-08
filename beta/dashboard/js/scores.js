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
			['Feb 1',  -62],
			['Feb 2',  -48],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -33],
			['Feb 7',  -8],
			['Feb 8',  -10],
			['Feb 9',  -18],
			['Feb 10',  3],
			['Feb 11',  6],
			['Feb 12',  12],
			['Feb 13',  20],
			['Feb 14',  36],
			['Feb 15',  10],
			['Feb 16',  -8],
			['Feb 17',  0], 
			['Feb 18',  16],
			['Feb 19',  20],
			['Feb 20',  26],
			['Feb 21',  22],
			['Feb 22',  20],
			['Feb 23',  30],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  70],
			['Feb 27',  65],
			['Feb 28',  77],
			['Mar 1',  82]     
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
			['Mar 1',  261],
			['Mar 2',  252]      
		]
		return data_daily_vis;
	}
	if (condition == "weeklyVis"){

		var data_weekly_vis  = [
			['Date', 'Visibilty'],
			['Feb 1',  -55],
			['Feb 2',  -45],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -28],
			['Feb 7',  -10],
			['Feb 8',  -16],
			['Feb 9',  -18],
			['Feb 10',  2],
			['Feb 11',  6],
			['Feb 12',  -12],
			['Feb 13',  -20],
			['Feb 14',  10],
			['Feb 15',  30],
			['Feb 16',  45],
			['Feb 17',  28], 
			['Feb 18',  34],
			['Feb 19',  50],
			['Feb 20',  42],
			['Feb 21',  49],
			['Feb 22',  55],
			['Feb 23',  47],
			['Feb 24',  60],
			['Feb 25',  63],
			['Feb 26',  70],
			['Feb 27',  65],
			['Feb 28',  77],
			['Mar 1',  88]    
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

