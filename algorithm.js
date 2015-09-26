
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

    var maxLevel = 5;

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
            //cons ole.log("entrando minmaxWithAlphaBetaPruning");
            var move = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), true, maxLevel, 0, 0);
            return move.move;
        }
        else {
            return 3; // if we will start, just pick the column 3
        }
    };

    /**************************************************************************
     * REGRAS DO JOGO
     *************************************************************************/

    /**
     * Retorna a lista de movimentos possíveis (ou seja, os números das colunas
     * que ainda possuem espaço para colocar peças).
     */
    this.getAvailableMoves = function() {
        var moves = [];
        for(var c=0; c<columns; c++) {
            if( this.getPlace(c, 0)==null ) {
                moves.push(c);
            }
        }
        return moves;
    };

    /**
     * Retorna true se houver o jogador especificadona coluna/linha indicados.
     * Retorna false se não houver peça alguma ou houver o oponente na casa
     * indicada. O jogador é especificado por um boleano indicando se o jogador
     * a ser considerado é o informado em 'this.player' (true) ou o oponente
     * (false).
     */
    this.isPlayerAt = function(column, row, currentPlayer) {
        var place = this.getPlace(column, row);
        //cons ole.log('isPlayerAt:'+column.toString()+row.toString()+'='+place+this.player+currentPlayer+((place==this.player)==currentPlayer));
        return place!=null && (place==this.player)==currentPlayer;
    };

    /**
     * Retorna o jogador que está ocupando a linha/coluna indicados, ou null se
     * a casa estiver vazia
     */
    this.getPlace = function(column, row) {
        return this.gameBoard[column][row];
    };

    /**
     * Preenche a linha/coluna indicados com o nome do jogador informado.
     * Se player for null, remove qualquer peça da casa.
     */
    this.setPlace = function(column, row, player) {
        this.gameBoard[column][row] = player;
    };

    /**
     * Executa um movimento. Irá adicionar uma peça do jogador informado
     * na coluna informada, na posição mais baixa e vaga possível.
     */
    this.doMove = function(column, player) {
        for(var r=rows-1; r>=0; r--) {
            if( this.getPlace(column, r)==null ) {
                this.setPlace(column, r, player);
                return
            }
        }
    };

    /**
     * Remove a peça mais ao topo da coluna informada.
     *
     * (Ok, as regras do jogo não permitem desfazer movimentos.
     * Esse método é necessário para experimentar movimentos
     * durante o processamento da jogada).
     */
    this.undoMove = function(column) {
        for(var r=0; r<rows; r++) {
            if( this.getPlace(column, r)!=null ) {
                this.setPlace(column, r, null);
                return
            }
        }
    };

    /**
     * Retorna true se ha uma vitória para um jogador.
     * currentPlayer deve ser true se estou testando para
     * o jogador especificado em 'this.player', false se for para
     * o oponente.
     */
    this.isVictory = function(currentPlayer) {
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {
                //cons ole.log('checking '+c.toString()+r.toString()+ '='+ this.getPlace(c, r) + ': ' + (currentPlayer ? ' currentPlayer: ' : ' notCurrentPlayer: ')+(this.isPlayerAt(c, r, currentPlayer)) );

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    // vertical
                    var isWin = true;
                    var count;
                    for( count=0; count<4 && (r-count)>=0 && isWin; count++ ) {
                        //cons ole.log('wining '+c.toString()+r.toString()+'='+this.getPlace(c, r));
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
                        //cons ole.log('wining '+(c+count).toString()+(r-count).toString()+'='+this.getPlace(c+count, r-count));
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


    /**************************************************************************
     * METODOS AUXILIARES
     *************************************************************************/

    /**
     * Retorna o nome do oponente da partida (aquele cujo nome
     * é diferente do especificado em this.player).
     */
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
    };

    /**
     * Imprime o gameBoard atual no //cons ole do navegador.
     */
    this.logGame = function() {
        //cons ole.log( this.getGameBoardAsString() );
    };

    /**
     * Retorna o gameboard atual em um formato string legivel.
     * Nota: o nome do jogador corrente será substituido por 'P'
     * (player) e oponente por 'O'. Isso facilita a leitura
     * durante o debugging.
     */
    this.getGameBoardAsString = function() {
        var playerId = 'P';
        var opponentId = 'O';
        var rowsStrings = ['gameBoard'];
        for( var r=0; r<rows; r++ ) {
            var row = [];
            for(var c=0; c<columns; c++ ) {
                var place = this.getPlace(c, r);
                if( place==this.player ) {
                    row.push( playerId );
                }
                else if( place!=null ) {
                    row.push( opponentId );
                }
                else row.push( ' ' );
            }
            rowsStrings.push( '|'+row.join('|')+'|' );
        }
        return rowsStrings.join('\n');
    };

    /**
     * Faz o parsing da lista de strings em um gameboard.
     *
     * Usado para especificar os testes.
     */
    this.parseGameBoard = function(theRows) {
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
    };


    /**************************************************************************
     * ALGORITMO MINMAX
     *************************************************************************/

     /**
      * The minmax algorithm with alpha-beta pruning.
      *
      * Details here: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
      */
    this.minmaxWithAlphaBetaPruning = function(availableMoves, currentPlayer, level, min, max) {
        //cons ole.log( "minmax: level:"+level+" availableMoves:"+availableMoves + " min:"+min+' max:'+max );
        //this.logGame();

        if(availableMoves.length==0 || level<=0 || this.isVictory(currentPlayer) ) {
            var score = this.gameScore(currentPlayer, level);
            //cons ole.log("returning score: "+score);
            return {score:score, move:null};
        }
        var best = {score:Number.NEGATIVE_INFINITY, move:null};
        for( var i=0; i<availableMoves.length; i++ ) {
            var currentMove = availableMoves[i];

            if( best.score > min ) {
                min = best.score;
            }
            this.doMove( currentMove, currentPlayer? this.player : this.otherPlayer );

            var theMove = this.minmaxWithAlphaBetaPruning(this.getAvailableMoves(), !currentPlayer, level-1, -max, -min);
            theMove = {score:-theMove.score, move:theMove.move};

            this.undoMove( currentMove );

            if(theMove.score > best.score) {
                best.score = theMove.score;
                best.move = currentMove;
                //cons ole.log('Updating score:'+best.score+" best move:"+best.move);
            }
            if(best.score > max) {
                //cons ole.log('break');
                break
            }
        }
        //cons ole.log('returning bestscore:'+best.score+" best move:"+best.move);
        //this.logGame();
        return best
    };

    /**
     * The function that computes the gamescore for the current gameboard
     */
    this.gameScore = function(currentPlayer, level) {
        if( this.isVictory(currentPlayer) ) {
            if( currentPlayer ) {
                return 10000;
            }
            else {
                return 20000;
            }
        }
        else {
            return this.getGameScore(currentPlayer)*level;
        }
    };

    this.getGameScore = function(currentPlayer) {
        var score = 0;
        var r, c;
        for( r=rows-1; r>=0; r-- ) {
            for( c=0; c<columns; c++ ) {

                if( this.isPlayerAt(c, r, currentPlayer) ) {
                    //cons ole.log('player at '+c.toString()+r.toString());
                    var count;

                    // vertical
                    var playerCount=0;
                    var oppontCount=0;
                    for( count=0; count<4 && (r-count)>=0; count++ ) {
                        if( this.isPlayerAt(c, r-count, currentPlayer) ) {
                            //cons ole.log('++'+c.toString()+(r-count).toString());
                            playerCount++;
                        }
                        else if( this.isPlayerAt(c, r-count, !currentPlayer) ) {
                            oppontCount++
                        }
                    }
                    //cons ole.log('playerCount:'+playerCount+' oppontCount:'+oppontCount);
                    if( playerCount>0 && oppontCount==0 ) {
                        if( playerCount==2 ) {
                            score+=3;
                        }
                        if( playerCount==3 ) {
                            score+=8;
                        }
                    }


                    // horizontal
                    var playerCount=0;
                    var oppontCount=0;
                    for( count=0; count<4 && (c+count)<columns; count++ ) {
                        if( this.isPlayerAt(c+count, r, currentPlayer) ) {
                            //cons ole.log('++'+(c+count).toString()+r.toString());
                            playerCount++;
                        }
                        else if( this.isPlayerAt(c+count, r, !currentPlayer) ) {
                            oppontCount++
                        }
                    }
                    //cons ole.log('playerCount:'+playerCount+' oppontCount:'+oppontCount);
                    if( playerCount>0 && oppontCount==0 ) {
                        if( playerCount==2 ) {
                            score+=3;
                        }
                        if( playerCount==3 ) {
                            score+=8;
                        }
                    }

                    // diagonal direita
                    var playerCount=0;
                    var oppontCount=0;
                    for( count=0; count<4 && (r-count)>=0 && (c+count)<columns; count++ ) {
                        if( this.isPlayerAt(c+count, r-count, currentPlayer) ) {
                            playerCount++;
                        }
                        else if( this.isPlayerAt(c+count, r-count, !currentPlayer) ) {
                            oppontCount++
                        }
                    }
                    if( playerCount>0 && oppontCount==0 ) {
                        if( playerCount==2 ) {
                            score+=3;
                        }
                        if( playerCount==3 ) {
                            score+=8;
                        }
                    }

                    // diagonal esquerda
                    var playerCount=0;
                    var oppontCount=0;
                    for( count=0; count<4 && (r-count)<rows && (c-count)>=0; count++ ) {
                        if( this.isPlayerAt(c-count, r-count, currentPlayer) ) {
                            playerCount++;
                        }
                        else if( this.isPlayerAt(c-count, r-count, !currentPlayer) ) {
                            oppontCount++
                        }
                    }
                    if( playerCount>0 && oppontCount==0 ) {
                        if( playerCount==2 ) {
                            score+=3;
                        }
                        if( playerCount==3 ) {
                            score+=8;
                        }
                    }
                }
            }
        }
        return score;
    };
}
