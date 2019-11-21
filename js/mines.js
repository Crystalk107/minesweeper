'use strict'

function createMines(board) {
    var numOfMines = gLevel.mines;
    for (var i = 0; i < numOfMines; i++) {
        var x = getRandomIntInclusive(0, gLevel.size - 1)
        var y = getRandomIntInclusive(0, gLevel.size - 1)
        if (board[x][y].isMine === false) board[x][y].isMine = true
        else i--;
    }

}
function setMineNegsCount(posI, posJ) { //checks for number of mines around a cell
    var counter = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === posI && j === posJ) continue;

            if (gBoard[i][j].isMine)
                counter++
        }
    }
    return counter;
}
function generateMineCounter(board) { //implement counters for each relevent cell
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (!board[i][j].isMine) {
                var numOfMines = setMineNegsCount(i, j);
                board[i][j].minesAroundCount = numOfMines;
            }
        }
    }
}
function clickedMine() {

    var mine = document.querySelectorAll(".mine");
    for (var i = 0; mine.length > i; i++) {
        mine[i].innerHTML = MINE;
        mine[i].classList.add('shown');
    }
    isGameLose();
    gGameLost = true;// mine is clicked, it's a lose.}}

}
function showMineWarning(posI, posJ) {


    var element = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
    element.classList.add('hint');
    gBoard[posI][posJ].isShown = true;
    element.innerHTML = MINE;
}

function hideMineWarning(posI, posJ) {

    var element = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
    element.classList.remove('hint');
    gBoard[posI][posJ].isShown = false;
    if (gGame.isOn === true)
    element.innerHTML = '';
}

function clickedMineCounter(posI, posJ) {
    setShown(posI, posJ);
    var element = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
    var numOfMines = gBoard[posI][posJ].minesAroundCount;
    if (numOfMines != 0) element.innerText = numOfMines;



}



