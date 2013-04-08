
function getData(chartType){

	if(chartType == "pie"){
		var pieData = [
			['Keyword', 'Total Mentions'],
			['Ford Fusion', 55],
			['Ford Escape', 42],
			['Ford Fiesta', 15]
		]
		return pieData;
	}
	
	if(chartType == "bar"){
		var barData = [
			['Date', 'Ford Fusion', 'Ford Escape', 'Ford Fiesta'],
			['Feb 1-Feb 7', 55, 33, 22],
			['Feb 8-Feb 14', 40, 39, 8],
			['Feb 15-Feb 21', 72, 42, 19],
			['Feb 22-Feb 28', 56, 40, 12]
		]
		return barData;
	}
	
	if(chartType == "line"){
		var lineData = [
			['Date', 'Ford Fusion', 'Ford Escape', 'Ford Fiesta'],
			['Feb 22', 6, 12, 7],
			['Feb 23', 8, 10, 3],
			['Feb 24', 6, 3, 1],
			['Feb 25', 12, 5, 2],
			['Feb 26', 7, 3, 1],
			['Feb 27', 10, 4, 0],
			['Feb 28', 7, 3, 1]
		]
		return lineData;
	}
}