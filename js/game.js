'use strict'
var MINE = "&#128163;";
var FLAG = "&#128681;";
var WIN_SMILEY = '&#128526;';
var LOSE_SMILEY = '&#128561;';
var REGULAR_SMILEY = '&#128578;';


var gStartTime = null;
var gTotalTime = 0;
var gGameLost;
var gFirstClick;
var gHintMode;
var gHintTimer;
var gDiff = 0;
var gLife;
var gBoard = [];
var gLevel = null;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: gTotalTime
}

function initGame() {
    document.querySelector('.flags').innerHTML = gGame.markedCount;
    document.querySelector('div.popup').style.display = "none";
    var hints = document.querySelectorAll('.hintButton');
    for (var i = 0; i < hints.length; i++) {
        hints[i].style.display = "block"
    }
    document.querySelector('.timerSeconds').innerText = 0;
    clearInterval(gStartTime)
    gStartTime = null;
    gTotalTime = 0
    gFirstClick = false;
    gGameLost = false;
    gHintMode = false;
    gLife = 3;
    document.querySelector('.lives').innerHTML = gLife;
    gLevel = setGlobalLevel(gDiff);
    gBoard = buildBoard(gLevel);
    createMines(gBoard);
    generateMineCounter(gBoard);
    renderBoard(gBoard, 'table');
    document.querySelector('.smiley').innerHTML = REGULAR_SMILEY;

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

function resetBoard(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board.minesAroundCount = 0;
            if (board[i][j].isMine = true) {
                board[i][j].isMine = false;
                // var mine = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
                // mine.classList.remove('mine');
                if (board[i][j].minesAroundCount > 0) {
                    board[i][j].minesAroundCount = 0;
                    //     var counter = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
                    // counter.classList.remove('counter');
                }
            }
        }

    }
    createMines(board);
    generateMineCounter(board);
    renderBoard(board, 'table')
}

function startTimer() {
    gGame.isOn = true;
    gTotalTime++;
    gGame.secsPassed = gTotalTime;
    document.querySelector('.timerSeconds').innerText = gTotalTime;
}

function cellRightClicked(event, posI, posJ) {
    if (event.which === 3) {
        var elCell = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
        setFlag(elCell, posI, posJ);

    }

}

function cellLeftClicked(elCell, posI, posJ) {

    if (gStartTime === null) gStartTime = setInterval(startTimer, 1000);

    if (gBoard[posI][posJ].isMarked) return;

    if (gHintMode) {

        showHint(posI, posJ);
        gHintMode = false;
        gHintTimer = setTimeout(function () { removeHint(posI, posJ) }, 1000);
        return;
    }

    if (gFirstClick === false && gBoard[posI][posJ].isMine === true) {
        resetBoard(gBoard);
    }

    if (gGameLost === true) return;


    if (gBoard[posI][posJ].isMine === true && gFirstClick === true) {
        if (!isAlive()) clickedMine();
        else {
            showMineWarning(posI, posJ);
            setTimeout(function(){hideMineWarning(posI, posJ)}, 1000);
        }
    }

    if (gBoard[posI][posJ].minesAroundCount > 0) clickedMineCounter(posI, posJ);

    if (gBoard[posI][posJ].minesAroundCount === 0 && gBoard[posI][posJ].isMine === false) expandShown(posI, posJ);

    isGameWon(); // check for winning conditions left clicking






    gFirstClick = true;
}

function createLevel(size, mines) {
    var level = {
        size,
        mines
    }
    return level;
}

function setGlobalLevel(num) {
    var levelSet;
    switch (num) {
        case 0:
            levelSet = createLevel(4, 2);
            break;
        case 1:
            levelSet = createLevel(8, 12);
            break;
        case 2:
            levelSet = createLevel(12, 30);
            break;
        default:
            levelSet = createLevel(4, 2);
            break;

    }
    return levelSet;
}
function setLevelChosen(num) {
    gDiff = num;
    initGame();
}


function setShown(posI, posJ) {
    gBoard[posI][posJ].isShown = true;
    var element = document.querySelector('[data-i="' + posI + '"][data-j="' + posJ + '"]');
    element.classList.add('shown');
    gGame.shownCount = document.querySelectorAll('.shown').length;

}


function setFlag(elCell, posI, posJ) {
    if (gGameLost === true) return;
    elCell.classList.toggle('flagged');
    var cell = gBoard[posI][posJ];
    if (cell.isMarked === true) {
        cell.isMarked = false;
        gGame.markedCount--
        elCell.innerText = '';

    }
    else {
        cell.isMarked = true;
        elCell.innerHTML = FLAG;
        gGame.markedCount++;

    }
    document.querySelector('.flags').innerHTML = gGame.markedCount;
    isGameWon(); // check for winning conditions in case of flagging aka. right clicking

}

function isAlive() {
    var alive = true;
    if (gLife !== 1) { // still lives left
        gLife--;
        document.querySelector('.lives').innerHTML = gLife;
        return true;
    } else return false;

}


function expandShown(posI, posJ) { //when user clicks empty cells, reveal cells

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var cell = gBoard[i][j];
            if (cell.isMarked === true) continue; //don't show cell if flagged
            if (cell.minesAroundCount > 0) {
                setShown(i, j);
                var counter = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
                counter.innerText = cell.minesAroundCount;
            }
            else if (cell.minesAroundCount === 0 && !cell.isMine) {
                setShown(i, j);
            }
        }


    }

}

function enterHintMode(elCell) {
    gHintMode = true;
    document.querySelector('div.popup').style.display = "block";
    elCell.style.display = "none";



}

function showHint(posI, posJ) { //checks for number of mines around a cell

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var element = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
            if (gBoard[i][j].isShown) continue;
            element.classList.add('hint');
            if (gBoard[i][j].isMine)
                element.innerHTML = MINE;
            if (gBoard[i][j].minesAroundCount > 0)
                element.innerText = gBoard[i][j].minesAroundCount;
        }
    }
}

function removeHint(posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var element = document.querySelector('[data-i="' + i + '"][data-j="' + j + '"]');
            if (gBoard[i][j].isShown) continue;
            element.classList.remove('hint');
            if (gBoard[i][j].isMine)
                element.innerText = '';
            if (gBoard[i][j].minesAroundCount > 0)
                element.innerText = '';
            if (gBoard[i][j].isMarked)
                element.innerHTML = FLAG;
        }
    } document.querySelector('div.popup').style.display = "none";
}


function isGameWon() {
    if (gGame.shownCount + gLevel.mines === gLevel.size ** 2 && gGame.markedCount === gLevel.mines) {
        gGame.isOn = false;
        clearInterval(gStartTime);
        gGame.markedCount = 0;
        document.querySelector('.smiley').innerHTML = WIN_SMILEY;
        console.log('Victory!');

    }

}

function isGameLose() {
    gLife--;
    document.querySelector('.lives').innerHTML = gLife;
    gGame.isOn = false;
    gGame.markedCount = 0;
    clearInterval(gStartTime);
    document.querySelector('.smiley').innerHTML = LOSE_SMILEY;
    var hints = document.querySelectorAll('.hintButton');
    for (var i = 0; i < hints.length; i++) {
        hints[i].style.display = "none"
    }

}