var rows = 6;
var columns = 7;


QUnit.test( "parseGameBoard", function( assert ) {

    var alg = new Algorithm()
    alg.gameBoard = alg.parseGameBoard([
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|O| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| |O|O| |O|O|',
    ]);

    deepEqual(alg.gameBoard, [
        ['P', 'P', 'O', 'P', 'P', 'P'], // 0
        [null, null, null, null, null, null], // 1
        [null, null, null, null, null, 'O'], // 2
        [null, null, null, null, null, 'O'], // 3
        [null, null, null, null, null, null], // 4
        [null, null, null, null, null, 'O'], // 5
        [null, null, null, null, null, 'O'], // 6
    ])
});

QUnit.test( "getPlace", function( assert ) {

    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|O| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| |O|O| |O|O|',
    ]);

    equal(alg.getPlace(0, 0), 'P');
    equal(alg.getPlace(0, 5), 'P');
    equal(alg.getPlace(1, 0), null);
    equal(alg.getPlace(1, 5), null);
    equal(alg.getPlace(2, 0), null);
    equal(alg.getPlace(2, 5), 'O');
    equal(alg.getPlace(6, 0), null);
    equal(alg.getPlace(6, 5), 'O');
});

QUnit.test( "isPlayerAt", function( assert ) {

    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|O| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| |O|O| |O|O|',
    ]);

    // P
    equal(alg.isPlayerAt(0, 0, true), true);
    equal(alg.isPlayerAt(0, 0, false), false);

    // P
    equal(alg.isPlayerAt(0, 5, true), true);
    equal(alg.isPlayerAt(0, 5, false), false);

    // ' '
    equal(alg.isPlayerAt(1, 0, true), false);
    equal(alg.isPlayerAt(1, 0, false), false);

    // O
    equal(alg.isPlayerAt(2, 5, true), false);
    equal(alg.isPlayerAt(2, 5, false), true);

});

QUnit.test( "victory vertical", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
    ]);
    equal( alg.isVictory(true), true );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '|O| | | | | | |',
        '|O| | | | | | |',
        '|O| | | | | | |',
        '|O| | | | | | |',
    ]);
    equal( alg.isVictory(false), true );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '|O| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
    ]);
    equal( alg.isVictory(true), false );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
    ]);
    equal( alg.isVictory(true), false );

});

QUnit.test( "victory horizontal", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P|P|P|P| | | |',
    ]);
    equal( alg.isVictory(true), true );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P|P|P|O| | | |',
    ]);
    equal( alg.isVictory(true), false );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P|P|P| | | | |',
    ]);
    equal( alg.isVictory(true), false );

});

QUnit.test( "victory diagonal direita", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | |P| | | |',
        '| | |P| | | | |',
        '| |P| | | | | |',
        '|P| | | | | | |',
    ]);
    equal( alg.isVictory(true), true );
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '|O| | | | |P| |',
        '|P| | | |P|O|O|',
        '|P| |P|P|O|O|O|',
        '|P| |P|O|O|O|P|',
    ]);
    equal( alg.isVictory(true), true );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | |O| | | |',
        '| | |P| | | | |',
        '| |P| | | | | |',
        '|P| | | | | | |',
    ]);
    //alg.logGame();
    equal( alg.isVictory(true), false );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | |P| | | | |',
        '| |P| | | | | |',
        '|P| | | | | | |',
    ]);
    equal( alg.isVictory(true), false );

});

QUnit.test( "victory diagonal esquerda", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | |P| | | |',
        '| | | | |P| | |',
        '| | | | | |P| |',
        '| | | | | | |P|',
    ]);
    //alg.logGame();
    equal( alg.isVictory(true), true );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | |O| | | |',
        '| | | | |P| | |',
        '| | | | | |P| |',
        '| | | | | | |P|',
    ]);
    //alg.logGame();
    equal( alg.isVictory(true), false );

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | |P| | |',
        '| | | | | |P| |',
        '| | | | | | |P|',
    ]);
    equal( alg.isVictory(true), false );

});

QUnit.test( "do move", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
    ]);
    equal( alg.getPlace(0, 5), null );
    alg.doMove(0, 'P');
    equal( alg.getPlace(0, 5), 'P' );
    alg.doMove(0, 'O');
    equal( alg.getPlace(0, 4), 'O' );
});

QUnit.test( "available moves", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
    ]);
    deepEqual( alg.getAvailableMoves(), [0, 1, 2, 3, 4, 5, 6] );
    alg.gameBoard = alg.parseGameBoard([
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
    ]);
    deepEqual( alg.getAvailableMoves(), [1, 2, 3, 4, 5, 6] );
});


QUnit.test( "undo move", function( assert ) {
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P| | | | | | |',
        '|P| | | | | | |',
    ]);
    alg.undoMove(0);
    deepEqual( alg.getPlace(0,4), null );
    deepEqual( alg.getPlace(0,5), 'P' );
    alg.undoMove(0);
    deepEqual( alg.getPlace(0,5), null );
});



QUnit.test( "minmax 1", function( assert ) {
    console.log( "minmax 1" );
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | |O| | | |',
        '|P| | |O| | | |',
        '|P| | |O| | | |',
    ]);

    //alg.logGame();

    var move = alg.move( alg.getAvailableMoves(), alg.gameBoard );
    alg.doMove(move, alg.player);
    //console.log('Result')
    //alg.logGame();
    equal( alg.getPlace(3,2), 'P' );
});


QUnit.test( "minmax 2", function( assert ) {
    console.log( "minmax 2" );
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '|O|O|O| | | | |',
        '|P|P|P| | | | |',
        '|O|P|O| | | | |',
        '|P|O|O|O| | | |',
        '|O|P|P|P|O| | |',
        '|P|P|O|O|P| | |',
    ]);
    alg.logGame();

    var move = alg.move( alg.getAvailableMoves(), alg.gameBoard );
    alg.doMove(move, alg.player);
    alg.logGame();
    equal( alg.getPlace(3,1), null );
});



QUnit.test( "gamescore 1", function( assert ) {
    console.log( "minmax 2" );
    var alg = new Algorithm()
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P|P| |P| | | |',
    ]);
    //alg.logGame();
    var score1 = alg.getGameScore(true);

    alg.gameBoard = alg.parseGameBoard([
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '| | | | | | | |',
        '|P| | | | | | |',
        '|P| | |P| | | |',
    ]);
    //alg.logGame();
    var score2 = alg.getGameScore(true);

    console.log('score1:'+score1+' score2:'+score2);
    equal(score1>score2, true);
});
