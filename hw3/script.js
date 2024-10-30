/**
File: script.js
GUI Assignment: HW3
Description: This is the JS code for my interactive times-table web page
Contact Email: Xavier_Freitas@student.uml
Xavier Freitas, UMass Lowell Computer Science, xfreitas@cs.uml.edu
Copyright (c) 2024 by Xavier. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by XF on October 27, 2024 at 9:50PM
**/

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const resultParagraph = document.getElementById("textresult");
    const tableContainer = document.getElementById("timestable");

    form.addEventListener("submit", function(event) {
        // Prevents the form from submitting by refreshing the page
        // Source: https://www.w3schools.com/jsref/event_preventdefault.asp
        event.preventDefault();

        // Get values from the form input fields
        // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
        const minColNum = parseInt(document.getElementById("minColNum").value);
        const minRowNum = parseInt(document.getElementById("minRowNum").value);
        const maxColNum = parseInt(document.getElementById("maxColNum").value);
        const maxRowNum = parseInt(document.getElementById("maxRowNum").value);

        // Create the default output string
        let output = "Awaiting input!";

        // Source for editing/changing class names
        // Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
        // Check for invalid boundary ranges
        if ((minColNum < -50 || minColNum > 50) || (minRowNum < -50 || minRowNum > 50) ||
        (maxColNum < -50 || maxColNum > 50) || (maxRowNum < -50 || maxRowNum > 50)) {
            // Create output string for the user
            output = "Invalid range for one or more of the outputs! Minimum value is -50 and maximum value is 50.";
            
            resultParagraph.className = "";
            resultParagraph.classList.add("alert", "alert-danger");

            // Clear any previously existing table
            tableContainer.innerHTML = "";
        } else if ((minColNum >= maxColNum) || (minRowNum >= maxRowNum)) {
            output = "Invalid range for one or more of the outputs! Min range can NOT be greater than or equal to max range.";
            
            resultParagraph.className = "";
            resultParagraph.classList.add("alert", "alert-danger");

            // Clear any previously existing table
            tableContainer.innerHTML = "";
        } else {
            output = "Success! Bellow is your table:"
            
            resultParagraph.className = "";
            resultParagraph.classList.add("alert", "alert-success");

            // Clear any previously existing table
            tableContainer.innerHTML = "";
            makeTable(minColNum, minRowNum, maxColNum, maxRowNum, tableContainer);
        }

        // Update the result paragraph with the output
        resultParagraph.textContent = output;
    });
});

// makeTable Function: the function that is executed in order to fully
// develop and update the interactive times table
// Append Child Source
// Source: https://www.w3schools.com/jsref/met_node_appendchild.asp
// JS change CSS Style Source
// Source: https://www.w3schools.com/jsref/prop_html_style.asp
function makeTable(minCol, minRow, maxCol, maxRow, tableElement) {
    // Creating the table and adding classes
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped"); // Bootstrap table classes added
    table.style.textAlign = "center";
    
    // Create thead and tbody elements
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create the header row and top-left-most element
    const headerRow = document.createElement("tr");
    let topleft = document.createElement("th");
    topleft.textContent = "X"
    topleft.style.border = "1px solid #000000";
    headerRow.appendChild(topleft); // Top-left corner will just be "X"

    // Add column headers
    for (let col = minCol; col <= maxCol; col++) {
        const th = document.createElement("th");
        th.textContent = col; // Set colum headers
        th.style.border = "1px solid #000000";
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