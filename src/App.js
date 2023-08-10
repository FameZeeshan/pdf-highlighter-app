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

    const boundingBoxHeight =
      highlightedBoundingBox[5] - highlightedBoundingBox[1];

    return {
      left: `${(highlightedBoundingBox[0] / pdfWidth) * 100}%`,
      top: `${(highlightedBoundingBox[1] / pdfHeight) * 100}%`,
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
            Country
          </button>
          <button
            onClick={() =>
              handleButtonClick("SECURITIES AND EXCHANGE COMMISSION")
            }
          >
            SECURITIES AND EXCHANGE COMMISSION
          </button>
          <button onClick={() => handleButtonClick("Washington, D.C. 20549")}>
            Address
          </button>
          <button
            onClick={() =>
              handleButtonClick("Common Stock, $0.00000625 par value per share")
            }
          >
            Common Stock, $0.00000625 par value per share
          </button>
          <button onClick={() => handleButtonClick("2.125% Notes due 2021")}>
            2.125% Notes due 2021
          </button>
          <button
            onClick={() => handleButtonClick("www.microsoft.com/investor")}
          >
            www.microsoft.com/investor
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfHighlighterApp;
