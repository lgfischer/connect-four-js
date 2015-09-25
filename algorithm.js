
'use strict';

/*
 * A função Algorithm encapsula a lógica das jogadas.
 * A instância do Algorithm persiste durante toda a partida.
 */

function Algorithm() {
    
    this.player = 'lgfischer';
    this.otherPlayer = null;

    var rows = 6;
    var columns = 7;
    
    var gameBoard = null;

    var maxLevel = 4;

    /*
     * Cada chamada de 'move' corresponde a uma peça jogada.
     * Esse recebe as colunas disponíveis do tabuleiro
     * e o estado atual do mesmo.
     */
    this.move = function (availableColumns, gameBoard) {
        /*
         * Exemplo dos argumentos passados
         *
         * availableColumns: [0, 1, 2, 3, 4, 5, 6]
         *
         * gameBoard: [
         *  [null, null, null, null, null, null], // 0
         *  [null, null, null, null, null, null], // 1
         *  [null, null, null, null, null, null], // 2
         *  [null, null, null, null, null, null], // 3
         *  [null, null, null, null, null, null], // 4
         *  [null, null, null, null, null, null], // 5
         *  [null, null, null, null, null, null], // 6
         * ]
         *
         * O retorno deve ser o índice númerico
         * de uma coluna válida, para que a jogada
         * seja realizada com sucesso.
         */
        this.gameBoard = gameBoard;
        this.otherPlayer = this.getOtherPlayer(this.player);

        if( this.otherPlayer ) {
            //console.log("entrando alphaBeta");
            var move = this.alphaBeta(this.getAvailableMoves(), true, maxLevel, 0, 0);
            return move.move;
        }
        else {
            return 3; // if we will start, just pick the column 3
        }
    };

    this.alphaBeta = function(availableMoves, currentPlayer, level, min, max) {
        console.log( "alphaBeta: level:"+level+" availableMoves:"+availableMoves + " min:"+min+' max:'+max );
        this.logGame();

        if(availableMoves.length==0 || level<=0 || this.isVictory(currentPlayer) ) {
            //console.log("returning current score");
            return {score:this.gameScore(currentPlayer), move:null};
        }
        var best = {score:Number.NEGATIVE_INFINITY, move:null};
        for( var i=0; i<availableMoves.length; i++ ) {
            var currentMove = availableMoves[i];

            if( best.score > min ) {
                min = best.score;
            }
            this.doMove( currentMove, currentPlayer? this.player : this.otherPlayer );
            var theMove = this.alphaBeta(this.getAvailableMoves(), !currentPlayer, level-1, -max, -min);
            theMove = {score:-theMove.score, move:theMove.move};

            this.undoMove( currentMove );

            if(theMove.score > best.score) {
                best.score = theMove.score;
                best.move = currentMove;
                console.log('Updating score:'+best.score+" best move:"+best.move);
            }
            if(best.score > max) {
                console.log('break: max='+max+' score:'+best.score);
                break
            }
        }
        console.log('returning bestscore:'+best.score+" best move:"+best.move);
        this.logGame();
        return best
    };

    this.doMove = function(column, player) {
        for(var r=rows-1; r>=0; r--) {
            if( this.getPlace(column, r)==null ) {
                this.setPlace(column, r, player);
                return
            }
        }
    };

    this.undoMove = function(column) {
        for(var r=0; r<rows; r++) {
            if( this.getPlace(column, r)!=null ) {
                this.setPlace(column, r, null);
                return
            }
        }
    };

    this.getAvailableMoves = function() {
        var moves = [];
        for(var c=0; c<columns; c++) {
            if( this.getPlace(c, 0)==null ) {
                moves.push(c);
            }
        }
        return moves;
    };

    this.getOtherPlayer = function(player) {
        for( var r=0; r<rows; r++ ) {
            for( var c=0; c<columns; c++) {
                var place = this.getPlace(c, r);
                if( place!=null && place!=player ) {
                    return place;
                }
            }
        }
        return null;
    }

    
    /**
     * Retorna true se ha uma vitória para um jogador.
     * currentPlayer deve ser true se estou testando para
     * o jogador de nome em player, false se for para
     * o oponente.
     */
    this.isVictory = function(currentPlayer) {
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {
                //console.log('checking '+c.toString()+r.toString()+ '='+ this.getPlace(c, r) + ': ' + (currentPlayer ? ' currentPlayer: ' : ' notCurrentPlayer: ')+(this.isPlayerAt(c, r, currentPlayer)) );

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    // vertical
                    var isWin = true;
                    var count;
                    for( count=0; count<4 && (r-count)>=0 && isWin; count++ ) {
                        //console.log('wining '+c.toString()+r.toString()+'='+this.getPlace(c, r));
                        isWin = this.isPlayerAt(c, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // horizontal
                    isWin = true;
                    for( count=0; count<4 && (c+count)<columns && isWin; count++ ) {
                        isWin = this.isPlayerAt(c+count, r, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // diagonal direita
                    isWin = true;
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns && isWin; count++ ) {
                        //console.log('wining '+(c+count).toString()+(r-count).toString()+'='+this.getPlace(c+count, r-count));
                        isWin = this.isPlayerAt(c+count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                    // diagonal esquerda
                    isWin = true;
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0 && isWin; count++ ) {
                        isWin = this.isPlayerAt(c-count, r-count, currentPlayer);
                    }
                    if( isWin && count==4 ) {
                        return true
                    }
                }
            }
        }
        return false;
    };

    this.getGameScore = function(currentPlayer) {
        var score = 0;
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    // vertical
                    var isWin = true;
                    var count;
                    for( count=0; count<4 && (r-count)>=0 && isWin; count++ ) {
                        //console.log('wining '+c.toString()+r.toString()+'='+this.getPlace(c, r));
                        isWin = this.isPlayerAt(c, r-count, currentPlayer);
                    }
                    if( count==1 ) {
                        score+=2;
                    }
                    if( count==2 ) {
                        score+=4;
                    }
                    if( count==3 ) {
                        score+=8;
                    }

                    // horizontal
                    isWin = true;
                    for( count=0; count<4 && (c+count)<columns && isWin; count++ ) {
                        isWin = this.isPlayerAt(c+count, r, currentPlayer);
                    }
                    if( count==1 ) {
                        score+=2;
                    }
                    if( count==2 ) {
                        score+=4;
                    }
                    if( count==3 ) {
                        score+=8;
                    }

                    // diagonal direita
                    isWin = true;
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns && isWin; count++ ) {
                        //console.log('wining '+(c+count).toString()+(r-count).toString()+'='+this.getPlace(c+count, r-count));
                        isWin = this.isPlayerAt(c+count, r-count, currentPlayer);
                    }
                    if( count==1 ) {
                        score+=2;
                    }
                    if( count==2 ) {
                        score+=4;
                    }
                    if( count==3 ) {
                        score+=8;
                    }

                    // diagonal esquerda
                    isWin = true;
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0 && isWin; count++ ) {
                        isWin = this.isPlayerAt(c-count, r-count, currentPlayer);
                    }
                    if( count==1 ) {
                        score+=2;
                    }
                    if( count==2 ) {
                        score+=4;
                    }
                    if( count==3 ) {
                        score+=8;
                    }
                }
            }
        }
        return score;
    };

    this.gameScore = function(currentPlayer) {
        if( this.isVictory(currentPlayer) ) {
            if( currentPlayer ) {
                return 100;
            }
            else {
                return 200;
            }
        }
        else {
            return this.getGameScore(currentPlayer);
        }
    };
    
    this.isPlayerAt = function(column, row, currentPlayer) {
        var place = this.getPlace(column, row);
        //console.log('isPlayerAt:'+column.toString()+row.toString()+'='+place+this.player+currentPlayer+((place==this.player)==currentPlayer));
        return place!=null && (place==this.player)==currentPlayer;
    };
    
    this.getPlace = function(column, row) {
        return this.gameBoard[column][row];
    };
    
    this.setPlace = function(column, row, player) {
        this.gameBoard[column][row] = player;
    };

    this.logGame = function() {
        var c, r;
        var playerId = 'P';
        var opponentId = 'O';
        console.log('gameBoard');
        for( r=0; r<rows; r++ ) {
            var msg = [];
                for( c=0; c<columns; c++ ) {
                var place = this.getPlace(c, r);
                if( place==this.player ) {
                    msg.push( playerId );
                }
                else if( place!=null ) {
                    msg.push( opponentId );
                }
                else msg.push( ' ' );
            }
            console.log((r).toString()+'|'+msg.join('|')+'|');
        }
    };

    this.gameBoardFromStrings = function(theRows) {
        var c, r;
        var gameBoard = [];
        for(c=0; c<columns; c++) {
            gameBoard.push([]);
            for(r=0; r<rows; r++) {
                gameBoard[c].push([]);
            }
        }
        for(c=0; c<columns; c++) {
            for(r=0; r<rows; r++) {
                var pos = theRows[r].replace(/\|/g, "").charAt(c);
                if( pos != ' ' ) {
                    gameBoard[c][r] = pos;
                }
                else {
                    gameBoard[c][r] = null;
                }
            }
        }
        return gameBoard;
    }
}
