function getScore(condition){
	if (condition == "daily"){
		var data_daily  = [
				['Date', 'Reputation'],
				['Feb 24',  252],
				['Feb 25',  271],
				['Feb 26',  277],
				['Feb 27',  109],
				['Feb 28',  200],
				['Mar 1',  224],
				['Mar 2',  288]        
		]
		return data_daily;
	}
	if (condition == "weekly"){

		var data_weekly  = [
			['Date', 'Reputation'],
			['Jan 27-Feb 2',  120],
			['Feb 3-Feb 9',  100],
			['Feb 10-Feb 16',  222],
			['Feb 17-Feb 23',  252],
			['Feb 24-Mar 2',  288]      
		]
		return data_weekly;
	}
	if (condition == "monthly"){

		var data_monthly  = [
			['Date', 'Popularity'],
			['Oct',  121],
			['Nov',  100],
			['Dec',  142],
			['Jan',  192],
			['Feb',  211],
			['Mar',  252]    
		]
		return data_monthly;
	}
}

