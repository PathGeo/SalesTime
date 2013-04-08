
function getCompetitorScores(dealer){

	if(dealer == "dealerA"){
		var lineData = [
			['Date', 'Reputation', 'Visibility'],
			['Feb 1', 32, -12],
			['Feb 2', 31, -14],
			['Feb 3', 29, -22],
			['Feb 4', 36, -32],
			['Feb 5', 23, -29],
			['Feb 6', 22, -44],
			['Feb 7', 12, -56],
			['Feb 8', 6, -51],
			['Feb 9', 0, -32],
			['Feb 10', -8, -29],
			['Feb 11', -6, -16],
			['Feb 12', -6, -25],
			['Feb 13', 12, -25],
			['Feb 14', -7, -13],
			['Feb 15', 10, -14],
			['Feb 16', -6, -2],
			['Feb 17', 18, 10],
			['Feb 18', 26, 13],
			['Feb 19', 22, 25],
			['Feb 20', 37, 33],
			['Feb 21', 45, 44],
			['Feb 22', 61, 62],
			['Feb 23', 38, 70],
			['Feb 24', 36, 73],
			['Feb 25', 42, 85],
			['Feb 26', 57, 93],
			['Feb 27', 60, 89],
			['Feb 28', 67, 99]
		]
		return lineData;
	}
	
	if(dealer == "dealerB"){
		var lineData = [
			['Date', 'Reputation', 'Visibility'],
			['Feb 1', -75, -62],
			['Feb 2', -69, -52],
			['Feb 3', -66, -45],
			['Feb 4', -54, -39],
			['Feb 5', -46, -24],
			['Feb 6', -36, -32],
			['Feb 7', -22,-22],
			['Feb 8', -26, -12],
			['Feb 9', -16, -12],
			['Feb 10', -8, 10],
			['Feb 11', -6, 23],
			['Feb 12', -6, 53],
			['Feb 13', -12, 35],
			['Feb 14', 7, 43],
			['Feb 15', 20, 44],
			['Feb 16', 36, 52],
			['Feb 17', 38, 60],
			['Feb 18', 36, 43],
			['Feb 19', 32, 55],
			['Feb 20', 47, 43],
			['Feb 21', 55,54],
			['Feb 22', 69, 62],
			['Feb 23', 81, 60],
			['Feb 24', 66, 55],
			['Feb 25', 62, 75],
			['Feb 26', 55, 86],
			['Feb 27', 40, 82],
			['Feb 28', 42, 92]
		]
		return lineData;
	}
	
	if(dealer == "yourself"){
		var lineData = [
			['Date', 'Reputation', "Visibility"],
			['Feb 1',  -62, -55],
			['Feb 2',  -48, -48],
			['Feb 3',  -48, -33],
			['Feb 4',  -33, -22],
			['Feb 5',  -22, -28],
			['Feb 6',  -33, -10],
			['Feb 7',  -8, -16],
			['Feb 8',  -10, -18],
			['Feb 9',  -18, 2],
			['Feb 10',  3, 6],
			['Feb 11',  6, -12],
			['Feb 12',  12, -20],
			['Feb 13',  20, 10],
			['Feb 14',  36, 30],
			['Feb 15',  10, 45],
			['Feb 16',  -8, 12],
			['Feb 17',  0, 34], 
			['Feb 18',  16, 50],
			['Feb 19',  20, 38],
			['Feb 20',  26, 49],
			['Feb 21',  22, 42],
			['Feb 22',  20, 34],
			['Feb 23',  30, 45],
			['Feb 24',  45, 63],
			['Feb 25',  63, 77],
			['Feb 26',  70, 70],
			['Feb 27',  65, 79],
			['Feb 28',  77, 88]
		]
		return lineData;
	}
}