function log(player, move) {
    var log = $('#log');
    log.val((log.val()+'\n'+player+' move was '+move).trim());
}

$('#player').click(function(){
    $('#log').empty();
    
    var alg = new Algorithm();
    alg.player = 'P';
    alg.gameBoard = alg.getNewGameBoard();

    var move = alg.move( alg.getAvailableMoves(), alg.gameBoard );
    alg.doMove(move, alg.player);
    log('P', move);

    $('#output').val( alg.getGameBoardAsString(true) );
    $('#column').focus();
});

$('#oponent').click(function(){
    $('#log').empty();
    var alg = new Algorithm();
    alg.player = 'P';
    alg.gameBoard = alg.getNewGameBoard();
    $('#output').val( alg.getGameBoardAsString(true) );
    $('#column').focus();
});

$('#column').keyup(function(e){
    if ( event.which == 13 ) {
        event.preventDefault();
        var value = parseInt( $('#column').val() );
        if( value>=0 && value<7 ) {
            var alg = new Algorithm();
            alg.player = 'P';
            alg.gameBoard = alg.parseGameBoard( $('#output').val().split('\n') );
            alg.doMove(value, 'O');
            log('O', value);

            if( alg.isVictory(false) ) {
                $('#log').prepend('<p>Victory!</p>')
            }
            else {
                var move = alg.move( alg.getAvailableMoves(), alg.gameBoard );
                alg.doMove(move, alg.player);
                log('P', move);
                if( alg.isVictory(true) ) {
                    $('#log').prepend('<p>Victory!</p>')
                }
            }
            $('#output').val( alg.getGameBoardAsString(true) );
            $('#column').val('').focus();
        }
    }
});