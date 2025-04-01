import React, { useState } from "react";
import axios from "axios";

const API_PROXY = "/api/proxy"; // Use a reverse proxy

function ImageSearchApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);
  const [similarImages, setSimilarImages] = useState(null);
  const [textSearchQuery, setTextSearchQuery] = useState("");
  const [textSearchResults, setTextSearchResults] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ✅ Fixed classifyImage function
  const classifyImage = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(`${API_PROXY}/classify-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setClassificationResults(response.data);
    } catch (error) {
      console.error("Classification error:", error);
      alert("Image classification failed");
    }
  };

  const searchSimilarImages = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(`${API_PROXY}/search-similar-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSimilarImages(response.data);
    } catch (error) {
      console.error("Similar image search error:", error);
      alert("Similar image search failed");
    }
  };

  const searchImagesByText = async () => {
    if (!textSearchQuery) {
      alert("Please enter a search query");
      return;
    }

    try {
      const response = await axios.get(`${API_PROXY}/search-images-by-text`, {
        params: { query: textSearchQuery },
      });

      setTextSearchResults(response.data.images);
    } catch (error) {
      console.error("Text-based image search error:", error);
      alert("Text-based image search failed");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Image Search Application</h1>

      {/* Image Upload Section */}
      <div>
        <h2>Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {selectedFile && (
          <div>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{ maxWidth: "300px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      {/* Image Classification */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={classifyImage}>Classify Image</button>
        {classificationResults && (
          <div>
            <h3>Classification Results:</h3>
            <ul>
              {classificationResults.top_predictions.map((pred, index) => (
                <li key={index}>
                  {pred.category}: {(pred.confidence * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Similar Image Search */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={searchSimilarImages}>Search Similar Images</button>
        {similarImages && (
          <div>
            <h3>Similar Images in Category: {similarImages.category}</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {similarImages.similar_images.map((img, index) => (
                <div key={index} style={{ margin: "5px" }}>
                  <img
                    src={img.url}
                    alt={`Similar ${index}`}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <p>{img.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text-Based Image Search */}
      <div style={{ marginTop: "20px" }}>
        <h2>Text-Based Image Search</h2>
        <input
          type="text"
          value={textSearchQuery}
          onChange={(e) => setTextSearchQuery(e.target.value)}
          placeholder="Enter search query"
        />
        <button onClick={searchImagesByText}>Search</button>

        {textSearchResults && (
          <div>
            <h3>Search Results:</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {textSearchResults.map((img, index) => (
                <div key={index} style={{ margin: "5px", textAlign: "center" }}>
                  <img
                    src={img.url}
                    alt={`Result ${index}`}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <p>{img.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageSearchApp;
