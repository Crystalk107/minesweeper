'use strict'
var MINE = "X";
var FLAG = "F";

var gStartTime = 0;
var gEndTime = 0;
var gTotalTime = (gStartTime/1000) - (gEndTime/1000);


var gBoard = [];
var gLevel = null;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function cellRightClicked(event, posI, posJ) {
    if (event.which === 3) {
        var elCell = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
        setFlag(elCell, posI, posJ);
    }
}

function setFlag(elCell, posI, posJ) {
    elCell.classList.toggle('flagged');
    if (elCell.innerText === FLAG) {
        gGame.markedCount--
        elCell.innerText = '';
    }
    else {
        elCell.innerText = FLAG;
        gGame.markedCount++;
    }

}


function startCount() {
    gGame.isOn = true;
    gStartTime = new Date().getTime();
}

function initGame() {
    gLevel = chooseDifficulity();
    gBoard = buildBoard(gLevel);
    createMines(gBoard);
    generateMineCounter(gBoard);
    renderBoard(gBoard, 'table');
}



function setLevel(size, mines) {
    var level = {
        size,
        mines
    }
    return level;
}

function chooseDifficulity(num) {
    var levelSet;
    switch (num) {
        case 0:
            levelSet = setLevel(4, 2);
            break;
        case 1:
            levelSet = setLevel(8, 12);
            break;
        case 2:
            levelSet = setLevel(12, 30);
            break;
        default:
            levelSet = setLevel(4, 2);
            break;

    }
    return levelSet;
}

function buildBoard(level) {
    var board = [];

    for (var i = 0; i < level.size; i++) {
        board[i] = [];
        for (var j = 0; j < level.size; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }

            board[i][j] = cell;
        }

    }
    return board;
}

function createMines(board) {
    var numOfMines = gLevel.mines;
    for (var i = 0; i < numOfMines; i++) {
        var x = getRandomIntInclusive(0, gLevel.size - 1)
        var y = getRandomIntInclusive(0, gLevel.size - 1)
        board[x][y].isMine = true;
    }

}


function cellLeftClicked(elCell, posI, posJ) {

    if (elCell.innerText === FLAG) return;

    if (gBoard[posI][posJ].isMine === true) clickedMine();

    if (gBoard[posI][posJ].minesAroundCount > 0) clickedCounter(elCell, posI, posJ);

    if (gBoard[posI][posJ].minesAroundCount === 0 && gBoard[posI][posJ].isMine === false) revealBlock(posI, posJ);



    checkGameOver();




}

function revealBlock(posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].minesAroundCount > 0) {
                isShown(i, j);
                var counter = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
                counter.innerText = gBoard[i][j].minesAroundCount;
            }
            else if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
                isShown(i, j);
            }
        }


    }

}

function isShown(posI, posJ) {
    gBoard[posI][posJ].isShown = true;
    var element = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
    element.classList.add('shown');
    gGame.shownCount = document.querySelectorAll('.shown').length;
    console.log(gGame.shownCount);

}

function clickedMine() {
    var mine = document.querySelectorAll(".mine");
    for (var i = 0; mine.length > i; i++) {
        mine[i].innerText = MINE;
    }
    isGameLose();

}

function clickedCounter(elCell, posI, posJ) {
    elCell.innerText = gBoard[posI][posJ].minesAroundCount;
    isShown(posI, posJ);

}

function setMineNegsCount(posI, posJ) {
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

function generateMineCounter(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (!board[i][j].isMine) {
                var numOfMines = setMineNegsCount(i, j);
                board[i][j].minesAroundCount = numOfMines;
            }
        }

    }

}



function cellMarked(elCell) {

}

function checkGameOver() {
    if (gGame.shownCount + gLevel.mines === gLevel.size ** 2) isGameWon(); // add flag condition
}

function isGameWon() {

    console.log('Victory!');

}

function isGameLose() {
    gGame.isOn = false;

}

function expandShown(board, elCell, i, j) {

}