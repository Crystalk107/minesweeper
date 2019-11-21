'use strict'


function renderBoard(board, selector) {
    var strHTML = '<tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var className = '';
            var isFlagged = '';
            if (cell.isMine) {
                className += 'mine ';
            }
            if (cell.minesAroundCount > 0) {
                className += 'counter ';
            }
            if (cell.isMarked) {
                className += 'flagged ';
                isFlagged += FLAG;
            }

            strHTML += `\t<td
            data-i=${i}  data-j=${j}
            class="${className}" onclick="cellLeftClicked(this, ${i}, ${j})" oncontextmenu="cellRightClicked(event, ${i}, ${j})">${isFlagged}</td>\n`
        }
        strHTML += '</tr>\n'
    } strHTML += '</tbody>\n'
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


