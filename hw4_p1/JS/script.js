/**
File: script.js
GUI Assignment: HW4
Description: This is the JS code for my interactive times-table web page. It now
also has added JQuery features in order to make validation of the form easier.
Contact Email: Xavier_Freitas@student.uml
Xavier Freitas, UMass Lowell Computer Science, xfreitas@cs.uml.edu
Copyright (c) 2024 by Xavier. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by XF on November 26, 2024 at 6:30PM
**/

$(document).ready(function () {
    const form = document.querySelector("form");

    // Adding method to the validator so it can also check if
    // the min is greater than max, as that was one of my conditions
    // in the previous assignment, hw3
    // Source:
    // https://jqueryvalidation.org/jQuery.validator.addMethod/
    $.validator.addMethod("minLessThanMax", function (value, element, params) {
        const minVal = parseInt($(params.minField).val());
        const maxVal = parseInt(value);
        return minVal < maxVal;
    }, "Min value must be less than max value.");

    // Validating the #timesTableForm element, allowing for the use of the
    // JQuery validator instead of manually checking with vanilla JS
    // Source:
    // https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
    $("#timesTableForm").validate({
        rules: {
            minColNum: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            minRowNum: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            maxColNum: {
                required: true,
                number: true,
                range: [-50, 50],
                minLessThanMax: { minField: "#minColNum" } // Giving #minColNum to compare with maxColNum
            },
            maxRowNum: {
                required: true,
                number: true,
                range: [-50, 50],
                minLessThanMax: { minField: "#minRowNum" } // Giving #minRowNum to compare with maxRowNum
            }
        },
        messages: { // The error messages for when out of range or minLessThanMax returns true
            minColNum: {
                range: "Please enter a number between -50 and 50"
            },
            minRowNum: {
                range: "Please enter a number between -50 and 50"
            },
            maxColNum: {
                range: "Please enter a number between -50 and 50",
                minLessThanMax: "Max Col Num must be greater than Min Col Num" // Error message for minLessThanMax function on this parameter
            },
            maxRowNum: {
                range: "Please enter a number between -50 and 50",
                minLessThanMax: "Max Row Num must be greater than Min Row Num" // Error message for minLessThanMax function on this parameter
            }
        },
        submitHandler: function (form, event) {
            // Prevent the default form submission
            event.preventDefault();

            // Parse the numbers entered to ints
            const minColNum = parseInt(document.getElementById("minColNum").value);
            const minRowNum = parseInt(document.getElementById("minRowNum").value);
            const maxColNum = parseInt(document.getElementById("maxColNum").value);
            const maxRowNum = parseInt(document.getElementById("maxRowNum").value);
    
            // Set up the result paragraph for successful form entry
            const resultParagraph = document.getElementById("textresult");
            resultParagraph.textContent = "Success! Below is your table:";
            resultParagraph.className = ""; // Reset class
            resultParagraph.classList.add("alert", "alert-success");

            // Clear and regenerate the table
            const tableContainer = document.getElementById("timestable");
            tableContainer.innerHTML = ""; // Clear old table
            makeTable(minColNum, minRowNum, maxColNum, maxRowNum, tableContainer);
        }
    });
});


// makeTable Function: the function that is executed in order to fully
// develop and update the interactive times table
//
// Append Child Source: https://www.w3schools.com/jsref/met_node_appendchild.asp
// JS change CSS Style Source: https://www.w3schools.com/jsref/prop_html_style.asp
function makeTable(minCol, minRow, maxCol, maxRow, tableElement) {
    // Creating the table and adding classes
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped"); // Bootstrap table classes added
    
    // Creating thead and tbody elements
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Creating the header row and top-left-most element
    const headerRow = document.createElement("tr");
    let topleft = document.createElement("th");
    topleft.textContent = "X"
    topleft.style.border = "1px solid #000000";
    topleft.style.backgroundColor = "darkgray";
    headerRow.appendChild(topleft); // Top-left corner will just be "X" (for multiplication)

    // Add column headers
    for (let col = minCol; col <= maxCol; col++) {
        const th = document.createElement("th");
        th.textContent = col; // Set colum headers
        th.style.border = "1px solid #000000";
        th.style.backgroundColor = "darkgray";
        th.classList.add("top-header"); // Class to make header row fixed
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow); // Add top header row to table head

    // Generate the rows for the table
    for (let row = minRow; row <= maxRow; row++) {
        const tr = document.createElement("tr");

        // Add row headers
        const rowHeader = document.createElement("th");
        rowHeader.textContent = row; // Set row headers
        rowHeader.style.border = "1px solid #000000";
        rowHeader.style.backgroundColor = "darkgray";
        rowHeader.classList.add("left-header"); // Class to make 1st column fixed
        tr.appendChild(rowHeader);

        // Add cells for multiplication
        for (let col = minCol; col <= maxCol; col++) {
            const td = document.createElement("td");
            td.textContent = row * col; // multiplication for each cell
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    // Append thead and tbody to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Append the table to tableElement (the timestable div)
    tableElement.appendChild(table);
}