Connect Four AI
===============

Artificial Intelligence for the Connect Four game in JavaScript


Summary
=======

This is a JavaScript implementation of the [MinMax Algorithm](https://en.wikipedia.org/wiki/Minimax) for the [Connect Four](https://en.wikipedia.org/wiki/Connect_Four) game. This was developed for a competition during the [Developers Conference Porto Alegre](http://www.thedevelopersconference.com.br/tdc/2015/portoalegre/trilhas), and should be submitted at https://lig4.globo.com/playground.

Due to the competition rules, is not known the exact ranking of this algorithm at the end of the competition: the ranking was closed 1 hour before the time limit for submission. At the last time that the online ranking was checked before being closed, this algorithm was performing 7th in a range of 42 distinct implementations.


Implementation Details
======================

The online submission for the competition required the full source code in a webform. This AI was developed in the file algorithm.js, and copy-and-paste from this file to the webform was used to submit the latest version of the algorithm.

The online form required an 'Algorithm' object with a 'move' function. This function receives the current game configuration and the set of available moves, and returns the number of the column that we want to make the next move. To understand the code structure, you may start looking at the 'move' method.

All functions that implement the Connect Four rules are tested with on the tests.html and tests.js files. To run the tests, just open the tests.html file on a browser. [QUnit](https://qunitjs.com/) was used to develop the unit tests.

There is also a small game test file that lets a human player play against this AI. It was implemented on the local-game.html and local.js files. To play against this AI, open local-game.html in a browser and click 'Algorithm starts (P)' to let the AI start playing or 'Human starts (O)' to let the human player starts the game. At each turn, the human player should enter on the column number (between 0 and 6) in the 'Your move' field and press enter. The human pieces are represented by the 'O' character, while the AI pieces are represented by the 'P' character. Please note that this is just a 'debugging tool' developed during a competition, and may miss a lot of functional and usability features that I didn't care about during that event :)


