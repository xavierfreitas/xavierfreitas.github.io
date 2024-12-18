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
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  } ;

$(document).ready(function () {
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
            
            // check if cell already has a tile by checking if letter data exists
            if ($(this).data('letter')) {
                var existingTile = $('.tile[data-letter="' + $(this).data('letter') + '"]');
                
                // append the existing tile back to the tileHolder
                $('#tileHolder').append(existingTile);
                existingTile.css({ // reset positioning to go back in the tile holder
                    position: 'relative',
                    top: 0,
                    left: 0
                });
            }

            // move the dragged tile to the cell
            $(this).append(tile);  // append the tile to the cell
            
            tile.css({ // reset positioning to fit in cell
                position: 'absolute',
                top: 0,
                left: 0
            });
            
            $(this).data('letter', tileLetter);  // store letter of the tile in board-cell
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
        }
    });
});