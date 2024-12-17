/**
File: script.js
GUI Assignment: HW4
Description: This is the JS code for my interactive times-table web page. It has 
added JQuery features in order to make validation of the form easier, enable having 
multiple tables open at once, and deletion of one or more tables at once.
Contact Email: Xavier_Freitas@student.uml
Xavier Freitas, UMass Lowell Computer Science, xfreitas@cs.uml.edu
Copyright (c) 2024 by Xavier. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by XF on December 17, 2024 at 12:30PM
**/

$(document).ready(function () {
    const form = document.querySelector("form");

    // Initialize JQuery Tabs UI
    $("#tabs-container").tabs();

    // For numbering the tabs for ID purposes
    let tabCounter = 1;

    // Initialize sliders and bind input fields
    // Source: https://api.jqueryui.com/slider/
    $("#minColSlider").slider({
        min: -50,
        max: 50,
        value: $("#minColNum").val(),
        slide: function (event, ui) {
            $("#minColNum").val(ui.value);  // Update the input field with slider value
            if ($("#timesTableForm").valid()) { // Only update table if form is valid
                updateTable();
            }
        }
    });
    $("#minRowSlider").slider({
        min: -50,
        max: 50,
        value: $("#minRowNum").val(),
        slide: function (event, ui) {
            $("#minRowNum").val(ui.value);  // Update the input field with slider value
            if ($("#timesTableForm").valid()) { // Only update table if form is valid
                updateTable();
            }
            
        }
    });
    $("#maxColSlider").slider({
        min: -50,
        max: 50,
        value: $("#maxColNum").val(),
        slide: function (event, ui) {
            $("#maxColNum").val(ui.value);  // Update the input field with slider value
            if ($("#timesTableForm").valid()) { // Only update table if form is valid
                updateTable();
            }
        }
    });
    $("#maxRowSlider").slider({
        min: -50,
        max: 50,
        value: $("#maxRowNum").val(),
        slide: function (event, ui) {
            $("#maxRowNum").val(ui.value);  // Update the input field with slider value
            if ($("#timesTableForm").valid()) { // Only update table if form is valid
                updateTable();
            }
        }
    });


    $("#minColNum").on("input", function () {
        $("#minColSlider").slider("value", $(this).val()); // When input field changes, update the slider value
        if ($("#timesTableForm").valid()) { // Only update table if form is valid
            updateTable();
        }
    });
    $("#minRowNum").on("input", function () {
        $("#minRowSlider").slider("value", $(this).val()); // When input field changes, update the slider value
        if ($("#timesTableForm").valid()) { // Only update table if form is valid
            updateTable();
        }
    });
    $("#maxColNum").on("input", function () {
        $("#maxColSlider").slider("value", $(this).val()); // When input field changes, update the slider value
        if ($("#timesTableForm").valid()) { // Only update table if form is valid
            updateTable();
        }
    });
    $("#maxRowNum").on("input", function () {
        $("#maxRowSlider").slider("value", $(this).val()); // When input field changes, update the slider value
        if ($("#timesTableForm").valid()) { // Only update table if form is valid
            updateTable();
        }
    });

    // Adding method to the validator so it can also check if
    // the min is greater than max, as that was one of my conditions
    // in the previous assignment, hw3
    // Source: https://jqueryvalidation.org/jQuery.validator.addMethod/
    $.validator.addMethod("minLessThanMax", function (value, element, params) {
        const minVal = parseInt($(params.minField).val());
        const maxVal = parseInt(value);
        return minVal < maxVal;
    }, "Min value must be less than max value.");

    // Validating the #timesTableForm element, allowing for the use of the
    // JQuery validator instead of manually checking with vanilla JS
    // Source: https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
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

            // Create a new tab
            const tabID = `tab-${tabCounter}`;  // Setting element ID for tab
            const tabTitle = `Col: ${minColNum} to ${maxColNum}, Row: ${minRowNum} to ${maxRowNum}`;  // Tab title based on input
    
            // Add the tab to the tab list with a delete button and check box
            // for being able to delete a singular tab or multiple checked tabs
            // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
            const tabHTML = `
            <li id="tab-li-${tabCounter}">
                <input type="checkbox" class="tab-checkbox" data-tab-id="${tabID}"> 
                <a href="#${tabID}">${tabTitle}</a>
                <button class="delete-tab" data-tab-id="${tabID}">X</button>
            </li>`;

            $("#tabs").append(tabHTML);
            // Add the table content panel for the tab
            const tableContainer = $("<div id='" + tabID + "' class='table-panel'></div>")[0]; // Extracting the DOM object from the JQuery object
            makeTable(minColNum, minRowNum, maxColNum, maxRowNum, tableContainer); // Generate table for the tab
            $("#tabs-content").append(tableContainer); // Append the table to the tab

            // Refresh the tabs widget
            $("#tabs-container").tabs("refresh");

            // Set the active tab to the one the user just created
            $("#tabs-container").tabs("option", "active", tabCounter - 1);

            // Update tabCounter for next tabID
            tabCounter++;

            // Set up the result paragraph for successful form entry using the new JQuery features I learned
            $("#textresult").text("Success! Your table has been added below:").removeClass().addClass("alert alert-success");
        }
    });

    // Delete Single Tab
    // Reference Sources:
    // Source: https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs
    // Source: https://jqueryui.com/tabs/#manipulation
    $(document).on("click", ".delete-tab", function () {
        const tabNum = $(this).data("tab-id");

        // Remove the tab and its content
        $(`#tabs li a[href='#${tabNum}']`).parent().remove(); // Remove tab
        $(`#${tabNum}`).remove(); // Remove content

        // Refresh the tabs after deleting
        $("#tabs-container").tabs("refresh");
    });

    // Delete Multiple Tabs
    // Reference Sources:
    // *The sources used for the single deletion*
    // Additional source: https://api.jquery.com/checked-selector/
    $("#delete-selected-tabs").on("click", function () {
        // Find all the checked checkboxes using the class selector and :checked function
        $("input.tab-checkbox:checked").each(function () { // function applied to each checked checkbox
            const tabNum = $(this).data("tab-id");
    
            // Remove the tab and its content
            $(`#tabs li a[href='#${tabNum}']`).parent().remove(); // Remove tab
            $(`#${tabNum}`).remove(); // Remove content
        });
    
        // Refresh the tabs after deleting
        $("#tabs-container").tabs("refresh");
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

// Updating the preview table
function updateTable() {
    // Get the values from the input fields
    const minColNum = parseInt($("#minColNum").val());
    const minRowNum = parseInt($("#minRowNum").val());
    const maxColNum = parseInt($("#maxColNum").val());
    const maxRowNum = parseInt($("#maxRowNum").val());

    // Regenerate the table with the current values
    // Have to access "[0]" or else it would be the JQuery object not the DOM one
    const tablePreview = $("#previewTable")[0];
    tablePreview.innerHTML = ""; // Clear the previous table
    makeTable(minColNum, minRowNum, maxColNum, maxRowNum, tablePreview);
}