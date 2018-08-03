	// console.log("test");
var gameBoard = [[0,0,0,0],
				 [0,0,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

// make and populate 2-2048
// var value_list = [];
// for (var i = 2; i <= 2048; i=i*2){
// 	value_list.push("val"+i);
// }
function sameState(array1, array2) {
    if (!Array.isArray(array1) && !Array.isArray(array2)) {
        return array1 === array2;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0, len = array1.length; i < len; i++) {
        if (!sameState(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
}
//prints in console to see the history
function printScriptBoard(){
	res = "------ BOARD ------";
	for (var i = 0; i < gameBoard.length; i++){
		res += "\n"
		res += gameBoard[i];
	}
	console.log(res)
}


function rotate(matrix,deg) {
	for(var x = 0; x < deg / 90; x ++){
	// reverse the rows
		matrix = matrix.reverse();

		// swap the symmetric elements
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < i; j++) {
			var temp = matrix[i][j];
			matrix[i][j] = matrix[j][i];
			matrix[j][i] = temp;
			}
		}
	}
};
function manageBoard(board){
	var movement  = [[0,0,0,0],
					 [0,0,0,0],
					 [0,0,0,0],
					 [0,0,0,0]]

	//in the "right" stete"

	//starting at the far right side
	for (var j = 0; j < 4; j++) {
		curCell	= 2;
		//next cell that can merge/slide into
		nextCell= curCell + 1;
		while(curCell >= 0){
			//can merge
			if (board[j][nextCell] == board[j][curCell] && board[j][nextCell] != 0){
				board[j][nextCell] *= 2;
				board[j][curCell] = 0;
				movement[j][curCell] += nextCell - curCell
				nextCell --;
				curCell = nextCell - 1
			//current is a zero
			} else if (board[j][curCell] == 0) {
				curCell --;
			//can slide
			} else if (board[j][curCell]>0 && board[j][nextCell]==0) {
				board[j][nextCell] = board[j][curCell];
				board[j][curCell] = 0;
				movement[j][curCell] += nextCell - curCell
				curCell = nextCell - 1
			//mismatch, next cell gets shifted
			} else if(board[j][curCell] != board[j][nextCell]){
				nextCell --;
				//cur and next are the same
				if (curCell == nextCell)
					curCell--;
			}
			//in case something is forgoten to break infinite loop
			else {
				curCell --;
				nextCell --;
			}
		}
	}
	return movement
}

function animate(dir,moves,board){

	for (var row = 0; row < 4; row++) {
		for (var col = 3; col >= 0; col--) {
			cur = document.getElementsByClassName("cell r"+row+" c"+col)[0];
			move = moves[row][col]

			// 
			var value = board[row][col];

			newClassName = "cell r" +row+ " c" +col+ " val" +value; 
			if (value !== 0) {
				innerVal = "<span>"+value+"</span>";
			} else {
				innerVal = "<span></span>";
			}
			

			// if(! cur.classList.contains("val0")){
				// cur.style.zIndex = ""+1000*(i+1);
				// cur.style.left = 10 + "%"
				switch (dir){
					case "right":
						$(cur).animate({ left: 25*move + "%" },50*move,"linear").delay(50*move).attr("class",newClassName).html(innerVal).removeAttr("style");
						break;
					case "left":
						$(cur).animate({ right: 25*move + "%" },50*move,"linear").delay(50*move).attr("class",newClassName).html(innerVal).removeAttr("style");
						break;
					case "up":
						$(cur).animate({ bottom: 25*move + "%" },50*move,"linear").delay(50*move).attr("class",newClassName).html(innerVal).removeAttr("style");
						break;
					case "down":
						$(cur).animate({ top: 25*move + "%" },50*move,"linear").delay(50*move).attr("class",newClassName).html(innerVal).removeAttr("style");
						break;
				}
			// }
		}
	}
}
function removeStyle(){
	for (var i = 0; i < 4; i++) {
		curRow = document.getElementsByClassName("c"+i);
		for (var j = 0; j < 4; j++) {
			c = curRow[j];
			$(c).removeAttr("style").delay(300)
		}
	}
}
//place random value on a blank spot in board
function addRandom(board){
	//get all empty cell in 2D array
	var emptyCell = board.reduce(
		function(a,e,i){
			e.reduce(
				function(b,f,j){
					if (f === 0)
						a.push([i,j]);
					return b;},[])
			return a;},[])
	if (emptyCell.length === 0){
		return false;
	} else {
		var value = Math.random() < .9 ? 2 : 4;
		var pos = Math.floor(Math.random()*emptyCell.length);
		var spawnLoc = emptyCell[pos];
		board[spawnLoc[0]][spawnLoc[1]] = value;
		return true;
	}
}
//gameboard -> HTML
function boardToHtml(board){
	for (var row = 0; row < 4; row++){
		for (var col = 0; col < 4; col++){
			var value = board[row][col];

			var cur = document.getElementsByClassName("r"+row+" c"+col);
			cur[0].className = "cell r" +row+ " c" +col+ " val" +value; 
			if (value !== 0) {
				$(cur[0]).html("<span>"+value+"</span>").delay(300);
			} else {
				$(cur[0]).html("<span></span>").delay(300);
			}
		}
	}
}
function onBoardChange(board,ang,dir){
	//copy the board
	var oldboard = board.map(function(arr) {
    	return arr.slice();
	});

	//first update javscript board
	rotate(board,ang);
	var movements = manageBoard(board);
	rotate(board,360-ang);
	rotate(movements,360-ang);



	if(!sameState(board,oldboard)){
		//then animate the direction
		animate(dir,movements,board);
		// removeStyle();
		//then add random piece
		addRandom(board);
		//now update the html correclty
		boardToHtml(board);
		printScriptBoard();
	}
}




document.onkeydown = function(e) {
	e = e || window.event;
	switch(e.which || e.keyCode) {
		case 37: // left
			onBoardChange(gameBoard,180,"left")
			break;
		case 38: // up
			onBoardChange(gameBoard,90,"up")
			break;
		case 39: // right
			onBoardChange(gameBoard,360,"right")
			break;
		case 40: // down
			onBoardChange(gameBoard,270,"down")
			break;
		default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

window.onload = function(){
	addRandom(gameBoard);
	addRandom(gameBoard);
	boardToHtml(gameBoard);
 	printScriptBoard();
}
