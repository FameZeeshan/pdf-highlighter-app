import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack"; // Import necessary components from the react-pdf library
import pdfData from "./sample.json"; // Import the JSON file containing extracted text and bounding box data
import pdfFile from "./sample.pdf"; // Import the PDF file to be displayed
import "./pdfStyles.css"; // Import the CSS file for styling

const PdfHighlighterApp = () => {
  // State to store the currently highlighted bounding box
  const [highlightedBoundingBox, setHighlightedBoundingBox] = useState(null);

  // Function to handle the button click and search for the bounding box
  const handleButtonClick = (searchText) => {
    // Search for the line containing the searchText in the extracted text data (pdfData)
    const line = pdfData.analyzeResult.readResults[0].lines.find((line) =>
      line.text.includes(searchText)
    );

    // Check if the line with the search text is found
    if (line && line.boundingBox.length === 8) {
      // If found, set the bounding box of the line as the currently highlighted bounding box
      const boundingBox = line.boundingBox;
      console.log("Search Text:", searchText);
      console.log("Bounding Box:", boundingBox);
      setHighlightedBoundingBox(boundingBox);
    } else {
      // If not found, clear the currently highlighted bounding box
      console.log("Search Text:", searchText);
      console.log("No matching bounding box found.");
      setHighlightedBoundingBox(null);
    }
  };

  // Function to calculate the highlighter position
  const calculateHighlighterPosition = () => {
    if (!highlightedBoundingBox) return {};

    // Assuming the bounding box coordinates are in inches
    const pdfWidth = 8.5; // Width of the PDF in inches
    const pdfHeight = 11; // Height of the PDF in inches

    // Calculate and return the position of the highlighter box as a percentage of the PDF dimensions
    return {
      left: `${(highlightedBoundingBox[0] / pdfWidth) * 100}%`,
      top: `${(highlightedBoundingBox[1] / pdfHeight) * 100}%`,
      width: `${
        ((highlightedBoundingBox[2] - highlightedBoundingBox[0]) / pdfWidth) *
        100
      }%`,
      height: `${
        ((highlightedBoundingBox[5] - highlightedBoundingBox[1]) / pdfHeight) *
        100
      }%`,
    };
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left side with PDF */}
      <div
        style={{
          flex: 1,
          backgroundColor: "grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            paddingTop: "140px",
            marginTop: "-140px",
          }}
          className="pdf-container"
        >
          {/* Render the PDF document */}
          <Document file={pdfFile}>
            {/* Render the first page of the PDF */}
            <Page pageNumber={1} className="pdf-page" />
          </Document>
          {/* Show the highlighted bounding box if available */}
          {highlightedBoundingBox && (
            <div
              className="highlight-box"
              style={{
                position: "absolute",
                border: "3px solid red", // You can adjust the border style as needed
                ...calculateHighlighterPosition(),
              }}
            />
          )}
        </div>
      </div>

      {/* Right side with content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1a8fe3",
        }}
      >
        {/* Add your content here */}
        <h5>Form</h5>

        {/* Add buttons with different search texts to highlight specific content */}
        <div className="workingbtn">
          <button onClick={() => handleButtonClick("UNITED STATES")}>
            Search for "Country"
          </button>
          <button
            onClick={() =>
              handleButtonClick("SECURITIES AND EXCHANGE COMMISSION")
            }
          >
            Search for "SECURITIES AND EXCHANGE COMMISSION"
          </button>
          <button onClick={() => handleButtonClick("Washington, D.C. 20549")}>
            Search for "Address"
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfHighlighterApp;
