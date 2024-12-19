/**
File: script.js
GUI Assignment: HW5
Description: This is the JS code for my interactive times-table web page. It has 
added JQuery features in order to make validation of the form easier, enable having 
multiple tables open at once, and deletion of one or more tables at once.
Contact Email: Xavier_Freitas@student.uml
Xavier Freitas, UMass Lowell Computer Science, xfreitas@cs.uml.edu
Copyright (c) 2024 by Xavier. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by XF on December 17, 2024 at 12:30PM
**/

// associative array used for scrabble values
// Source: Jesse M. Heines, UMass Lowell Computer Science, 2015
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;

// global variable to assign unique IDs to tiles
var uniqueId = 0;

// global variable to track the last placed tile's index
var lastPlacedCellIndex = -1;

$(document).ready(function () {
    // users score
    var score = 0;

    // generate initial user tiles
    generateRandomTiles(7);

    // make each tile draggable
    $('.tile').draggable({
        revert: 'invalid' // return the tile to original position if not dropped on valid cell
    });
    
    // make each board-cell droppable
    $('.board-cell').droppable({
        accept: '.tile',  // only accept tiles for dropping
        drop: function(event, ui) {
            var tile = ui.helper;  // the dragged tile
            var tileLetter = tile.data('letter');  // get letter data from dragged tile
            var tileId = tile.data('id');  // get the unique ID of the dragged tile
            var currentCellIndex = $(this).index();  // get the index of the current cell
    
            // if the cell already contains a tile and it's not the same tile, replace it
            if ($(this).data('letter') && $(this).data('id') !== tileId) {
                var existingTile = $('.tile[data-id="' + $(this).data('id') + '"]');
                $('#tileHolder').append(existingTile);
                existingTile.css({
                    position: 'relative',
                    top: 0,
                    left: 0
                });
    
                // place new tile
                $(this).append(tile);
                tile.css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                });
                $(this).data('letter', tileLetter);
                $(this).data('id', tileId);
            } else {
                // use getNextAvailableSlot to find the next available slot
                var nextAvailableSlot = getNextAvailableSlot();
                if (nextAvailableSlot && nextAvailableSlot.index() === currentCellIndex) {
                    // if current cell is next available slot, place tile
                    $(this).append(tile);
                    tile.css({
                        position: 'absolute',
                        top: 0,
                        left: 0
                    });
                    $(this).data('letter', tileLetter);
                    $(this).data('id', tileId);
                    lastPlacedCellIndex = currentCellIndex;  // update the last placed cell index
                } else {
                    // if not a valid placement, reject the tile placement with animation
                    ui.helper.animate({
                        top: 0,
                        left: 0
                    }, 300);  // animate the tile back to its original position
                }
            }
        },
        hoverClass: 'hovered'  // class for cell hover effect
    });    

    // make tileHolder droppable (so tiles can be dropped back into it)
    $('#tileHolder').droppable({
        accept: '.tile',  // only accept tiles for dropping
        drop: function(event, ui) {
            var tile = ui.helper;  // the dragged tile
            tile.css({
                position: 'relative',
                top: 0,
                left: 0
            });
            $(this).append(tile); // place tile back in tileHolder
        }
    });

    // allow tiles to be dragged back to tileHolder
    $('.tile').on('dragstart', function(event, ui) {
        // remove tile association with board-cell if present
        var parentCell = $(this).parent('.board-cell');
        if (parentCell.length > 0) {
            parentCell.removeData('letter'); // clear letter data from cell
            parentCell.removeData('id'); // clear letter data from cell
        }
    });

    // logic for the submit button
    $('#submitButton').on('click', function () {
        var wordScore = 0;
        var wordLength = 0;
        var firstTileIndex = -1;
        var lastTileIndex = -1;
    
        // loop through each board cell and check tiles
        $('.board-cell').each(function () {
            var tileLetter = $(this).data('letter'); // get tile letter if present
            var currentCellIndex = $(this).index();
    
            if (tileLetter) {
                // track first and last tile positions
                if (firstTileIndex === -1) firstTileIndex = currentCellIndex;
                lastTileIndex = currentCellIndex;
    
                // calculate score
                if (wordLength === 1) {
                    // double word score (tile #2)
                    wordScore += 2 * (ScrabbleTiles[tileLetter]["value"]);
                } else {
                    wordScore += ScrabbleTiles[tileLetter]["value"];
                }
    
                wordLength++;
            }
        });
    
        // check for gaps between first and last tile
        var hasGap = false;
        for (var i = firstTileIndex; i <= lastTileIndex; i++) {
            if (!$('.board-cell').eq(i).data('letter')) {
                hasGap = true;
                break;
            }
        }
    
        // if there's gaps, prevent submission
        if (hasGap) {
            alert("There are gaps between the tiles. Please place the tiles without gaps before submitting.");
            return;
        }
    
        // double word score (tile #6)
        if (wordLength >= 6) {
            wordScore *= 2;
        }
    
        // update total score and display it
        score += wordScore;
        $('#scoreDisplay').text(`Score: ${score}`);
    
        // reset last placed cell index
        lastPlacedCellIndex = -1;

        // clear the board if submit is successful
        $('.board-cell').each(function () {
            $(this).empty();
            $(this).removeData('letter');
        });

        if(wordLength > 0) {
            generateRandomTiles(wordLength);
        }
    
        // log to console (for debugging)
        console.log(`Word score: ${wordScore}, Total score: ${score}`);
    });

    // logic for the reset button
    $('#resetButton').on('click', function () {
        // reset score and update display
        score = 0;
        $('#scoreDisplay').text(`Score: ${score}`);
    
        // reset ScrabbleTiles' "number-remaining" to original values
        for (var letter in ScrabbleTiles) {
            if (ScrabbleTiles.hasOwnProperty(letter)) {
                ScrabbleTiles[letter]["number-remaining"] = ScrabbleTiles[letter]["original-distribution"];
            }
        }
    
        // clear the tileHolder and generate 7 new tiles
        $('#tileHolder').empty();
        generateRandomTiles(7);
    
        // clear any tiles on the board
        $('.board-cell').each(function () {
            $(this).empty();       // remove any tiles visually
            $(this).removeData('letter'); // remove letter data
        });
    
        // reset last placed cell index
        lastPlacedCellIndex = -1;

        // log for debugging
        console.log("Game reset! Score cleared and new tiles generated.");
    });    
});

// function to generate random tiles and display them in the tileHolder
function generateRandomTiles(numTiles) {
    var letterPool = [];

    // build the letter pool based on number-remaining
    for (var letter in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(letter)) {
            var remaining = ScrabbleTiles[letter]["number-remaining"];
            for (var i = 0; i < remaining; i++) {
                letterPool.push(letter);
            }
        }
    }

    // randomly select tiles and add them to the tileHolder
    for (var j = 0; j < numTiles && letterPool.length > 0; j++) {
        var randomIndex = Math.floor(Math.random() * letterPool.length);
        var selectedLetter = letterPool[randomIndex];

        // update number-remaining for the selected letter
        ScrabbleTiles[selectedLetter]["number-remaining"]--;

        // remove the selected letter from the pool
        letterPool.splice(randomIndex, 1);

        // create a unique ID for each tile
        uniqueId++;

        // create the tile div dynamically
        var tileDiv = $('<div></div>', {
            "class": "tile",
            "data-letter": selectedLetter,
            "data-id": uniqueId,  // add the unique ID
            "style": `background-image: url('images/tiles/Scrabble_Tile_${selectedLetter}.jpg');`
        });

        // make new tile draggable
        tileDiv.draggable({
            revert: 'invalid'
        });

        // append the tile div to the tileHolder
        $('#tileHolder').append(tileDiv);
    }
}

// function for calculating the next available board-cell slot
function getNextAvailableSlot() {
    // loop through all board cells to find the first empty slot
    for (var i = 0; i < $('.board-cell').length; i++) {
        var cell = $('.board-cell').eq(i);

        // check if the cell is empty (does not have a tile assigned)
        if (!cell.data('letter')) {
            return cell; // return the first empty cell found
        }
    }

    // if no available slot is found, return null (board is full or no slots left)
    return null;
}

// function to determine current cell is valid for placement
function validCellSlot(currentCellIndex) {
    // if no tiles have been placed yet, the first cell (index 0) is available
    if (lastPlacedCellIndex === -1) {
        return currentCellIndex === 0;
    }
    // if it's the first tile or adjacent to the last placed tile, it's a valid slot
    return currentCellIndex === 0 || currentCellIndex === lastPlacedCellIndex + 1;
}