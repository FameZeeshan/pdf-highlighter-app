import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfData from "./sample.json";
import pdfFile from "./sample.pdf";
import "./pdfStyles.css";

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
    const padding = 0.05; // Adjust this value to properly surround the text

    const boundingBoxHeight =
      highlightedBoundingBox[5] - highlightedBoundingBox[1];

    return {
      left: `${(highlightedBoundingBox[0] / pdfWidth) * 100}%`,
      top: `${((highlightedBoundingBox[1] - padding) / pdfHeight) * 100}%`, // Subtract the padding value
      width: `${
        ((highlightedBoundingBox[2] - highlightedBoundingBox[0]) / pdfWidth) *
        100
      }%`,
      height: `${(boundingBoxHeight / pdfHeight) * 100}%`, // Adjusted height calculation
    };
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left side with PDF */}
      <div
        style={{
          flex: 1,
          backgroundColor: "grey",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          className="pdf-container"
        >
          <Document file={pdfFile}>
            <Page pageNumber={1} className="pdf-page" />
          </Document>
          {highlightedBoundingBox && (
            <div
              className="highlight-box"
              style={{
                position: "absolute",
                border: "3px solid red",
                padding: "2px",
                // padding can be changed if alignment is not perfect

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
