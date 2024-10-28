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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const resultParagraph = document.getElementById("result");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the input fields
        const minColNum = document.getElementById("minColNum").value;
        const minRowNum = document.getElementById("minRowNum").value;
        const maxColNum = document.getElementById("maxColNum").value;
        const maxRowNum = document.getElementById("maxRowNum").value;

        // Create the output string
        const output = `Minimum Column Number: ${minColNum}, Minimum Row Number: ${minRowNum}, Maximum Column Number: ${maxColNum}, Maximum Row Number: ${maxRowNum}`;

        // Update the result paragraph with the output
        resultParagraph.textContent = output;
    });
});
