import React, { useState } from "react";
import pdfData from "./sample.json";
import pdfFile from "./sample.pdf";

const PdfHighlighterApp = () => {
  const [highlightedBoundingBox, setHighlightedBoundingBox] = useState(null);

  // Function to handle the button click and search for the bounding box
  const handleButtonClick = (searchText) => {
    let boundingBox = null;
    const regex = new RegExp(`\\b${searchText}\\b`, "i");

    for (const readResult of pdfData.analyzeResult.readResults) {
      for (const line of readResult.lines) {
        if (regex.test(line.text)) {
          boundingBox = line.boundingBox;
          const word = line.words.find((word) => regex.test(word.text));
          if (word && word.boundingBox.length === 8) {
            boundingBox = word.boundingBox;
            break;
          }
        }
      }
      if (boundingBox) break;
    }

    console.log("Search Text:", searchText);
    console.log("Bounding Box:", boundingBox);

    setHighlightedBoundingBox(boundingBox);
  };

  return (
    <div>
      <h1>PDF Highlighter App</h1>
      <button onClick={() => handleButtonClick("UNITED STATES")}>
        Search for "UNITED STATES"
      </button>
      <button onClick={() => handleButtonClick("UNITED")}>
        Search for "UNITED"
      </button>

      <div className="pdf-container">
        <iframe
          src={pdfFile} // Replace with the actual path to your PDF file
          title="PDF Viewer"
          width="100%"
          height="600px"
          frameBorder="0"
        />
        {highlightedBoundingBox && (
          <div
            className="highlight-box"
            style={{
              left: `${
                Math.min(
                  highlightedBoundingBox[0],
                  highlightedBoundingBox[2],
                  highlightedBoundingBox[4],
                  highlightedBoundingBox[6]
                ) * 100
              }%`,
              top: `${
                Math.min(
                  highlightedBoundingBox[1],
                  highlightedBoundingBox[3],
                  highlightedBoundingBox[5],
                  highlightedBoundingBox[7]
                ) * 100
              }%`,
              width: `${
                Math.max(
                  highlightedBoundingBox[0],
                  highlightedBoundingBox[2],
                  highlightedBoundingBox[4],
                  highlightedBoundingBox[6]
                ) -
                Math.min(
                  highlightedBoundingBox[0],
                  highlightedBoundingBox[2],
                  highlightedBoundingBox[4],
                  highlightedBoundingBox[6]
                )
              }%`,
              height: `${
                Math.max(
                  highlightedBoundingBox[1],
                  highlightedBoundingBox[3],
                  highlightedBoundingBox[5],
                  highlightedBoundingBox[7]
                ) -
                Math.min(
                  highlightedBoundingBox[1],
                  highlightedBoundingBox[3],
                  highlightedBoundingBox[5],
                  highlightedBoundingBox[7]
                )
              }%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PdfHighlighterApp;
