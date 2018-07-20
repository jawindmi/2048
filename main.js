	// console.log("test");
var gameBoard = [0,0,0,0,
				 0,0,0,0,
				 0,0,0,0,
				 0,0,0,0]

var movement  = [0,0,0,0,
				 0,0,0,0,
				 0,0,0,0,
				 0,0,0,0]

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

// make and populate 2-2048
var value_list = [];
for (var i = 2; i <= 2048; i=i*2){
	value_list.push("val"+i);
}


function printScriptBoard(){
	res = "------ BOARD ------";
	for (var i = 0; i < gameBoard.length; i++){
		if (i%4 == 0){res+="\n";}
		res += gameBoard[i];
	}
	console.log(res)
}

//place random value on a blank spot in board
function addRandom(board){
	var emptyCell = board.reduce(function(a,e,i){if (e === 0)a.push(i);return a;},[])
	if (emptyCell.length === 0){
		return null;
	} else {
		var value = Math.random() < .9 ? 2 : 4;
		var spawnLoc = emptyCell[Math.floor(Math.random()*emptyCell.length)];
		board[spawnLoc] = value;
	}
}

//gameboard -> HTML
function bordToHtml(board){
	for (var row = 0; row < 4; row++){
		for (var col = 0; col < 4; col++){
			var value = board[row*4 + col];

			var cur = document.getElementsByClassName("r"+row+" c"+col);
			cur[0].className = "cell r" +row+ " c" +col+ " val" +value; 
			if (value !== 0) {
				cur[0].innerHTML = "<span>"+value+"</span>";
			} else {
				cur[0].innerHTML = "<span></span>";
			}
		}
	}
}

function manageBoard(board,dir){
	var oldBoard = board.slice();
	var noMerge = 5;
	//in the "right" stete"

	//starting at the far right side
	for (var j = 0; j < 4; j++) {
		noMerge = 5;

		// for (var i = 2; i >= 0; i--) {
		// 	//if it's merged once, don't do it 

		// 	curCell	= i+(4*j);
		// 	nextCell= curCell + 1;
		// 	noMerge = curCell + 2

		// 	while(curCell >= 4*j){
		// 		if (board[nextCell] == board[curCell] && curCell <= noMerge){
		// 			board[nextCell] *= 2;
		// 			board[curCell] = 0;
		// 			noMerge = nextCell;

		// 		} else if (board[nextCell] === 0){
		// 			board[nextCell] = board[curCell];
		// 			board[curCell] = 0;
		// 		} else if(board[nextCell] != 0 && board[nextCell]!= board[curCell]){
		// 			break
		// 		}
		// 		curCell --;
		// 		nextCell --;
				
		// 	}
		// }
		curCell	= 2+(4*j);
		nextCell= curCell + 1;
		noMerge = curCell + 2;
		while(curCell >= 4*j){
			//can merge
			if (board[nextCell] == board[curCell]){
				board[nextCell] *= 2;
				board[curCell] = 0;

				curCell --;
				nextCell --;
			} else if (board[curCell] == 0) {
				
			}
		}


	}

}


function animate(dir){
	if (dir==="right"){
		for (var i = 3; i >= 0; i--) {
			curRow = document.getElementsByClassName("c"+i);
			console.log(curRow)
			for (var j = 0; j < 4; j++) {
				c = curRow[j];

				if(! c.classList.contains("val0")){
					c.style.zIndex = ""+1000*(i+1);
					
					if(i !==3){

					}
				}
				
			}
		}
	}
}

function onBoardChange(board,dir){
	//first update javscript board
	manageBoard(board,dir);

	bordToHtml(board);	

	//then animate the direction

	//then add random piece
	addRandom(board);

	//now update the html correclty
	bordToHtml(board);

	//debugging
	// printScriptBoard();
}




document.onkeydown = function(e) {
	e = e || window.event;
	switch(e.which || e.keyCode) {
		case 37: // left
		break;

		case 38: // up
		break;

		case 39: // right
			// animate("right")
			onBoardChange(gameBoard,"right")
		break;

		case 40: // down
		break;

		default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};









 window.onload = function(){

	addRandom(gameBoard);
	addRandom(gameBoard);
	bordToHtml(gameBoard);
}
