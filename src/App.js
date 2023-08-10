import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf"; // Import necessary components from the react-pdf library
import pdfData from "./sample.json";
import pdfFile from "./sample.pdf";
import "./pdfStyles.css"; // Import the CSS file for styling

// Set the worker URL for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfHighlighterApp = () => {
  const [highlightedBoundingBox, setHighlightedBoundingBox] = useState(null);

  const handleButtonClick = (searchText) => {
    const line = pdfData.analyzeResult.readResults[0].lines.find((line) =>
      line.text.includes(searchText)
    );

    if (line && line.boundingBox.length === 8) {
      const boundingBox = line.boundingBox;
      console.log("Search Text:", searchText);
      console.log("Bounding Box:", boundingBox);
      setHighlightedBoundingBox(boundingBox);
    } else {
      console.log("Search Text:", searchText);
      console.log("No matching bounding box found.");
      setHighlightedBoundingBox(null);
    }
  };

  const calculateHighlighterPosition = () => {
    if (!highlightedBoundingBox) return {};

    const pdfWidth = 8.5;
    const pdfHeight = 11;

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
          {/* Render the PDF document using the Document and Page components */}
          <Document file={pdfFile}>
            <Page pageNumber={1} className="pdf-page" />
          </Document>
          {highlightedBoundingBox && (
            <div
              className="highlight-box"
              style={{
                position: "absolute",
                border: "3px solid red",
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

        {/* Add buttons with different search texts */}
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
