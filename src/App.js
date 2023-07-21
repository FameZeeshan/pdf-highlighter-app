import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import pdfData from "./sample.json";
import pdfFile from "./sample.pdf";
import "./pdfStyles.css"; // Import the CSS file

const PdfHighlighterApp = () => {
  const [highlightedBoundingBox, setHighlightedBoundingBox] = useState(null);

  // Function to handle the button click and search for the bounding box
  const handleButtonClick = (searchText) => {
    let boundingBox = null;

    for (let i = 0; i < pdfData.analyzeResult.readResults.length; i++) {
      const line = pdfData.analyzeResult.readResults[i].lines.find(
        (line) => line.text === searchText
      );

      // Check if the line with the search text is found
      if (line && line.boundingBox.length === 8) {
        boundingBox = line.boundingBox;
        break;
      }
    }

    console.log("Search Text:", searchText);
    console.log("Bounding Box:", boundingBox);

    setHighlightedBoundingBox(boundingBox);
  };

  // Function to calculate the highlighter position
  const calculateHighlighterPosition = () => {
    if (!highlightedBoundingBox) return {};

    // Assuming the bounding box coordinates are in inches
    const pdfWidth = 8.5; // Width of the PDF in inches
    const pdfHeight = 11; // Height of the PDF in inches

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
      <div style={{ flex: 1 }}>
        <h5>PDF Highlighter App</h5>
        <div className="pdf-container">
          <Document file={pdfFile}>
            {/* Render each page with the "pdf-page" class */}
            <Page pageNumber={1} className="pdf-page" />
          </Document>
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
        }}
      >
        {/* Add your content here */}
        <h5>Form</h5>

        <button onClick={() => handleButtonClick("UNITED STATES")}>
          Search for "UNITED STATES"
        </button>
      </div>
    </div>
  );
};

export default PdfHighlighterApp;
