import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputImage, setInputImage] = useState(null);
  const [predictedImage, setPredictedImage] = useState(null);
  const [segmentationType, setSegmentationType] = useState('gland');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Display the input image
    const reader = new FileReader();
    reader.onloadend = () => {
      setInputImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSegmentationChange = (event) => {
    setSegmentationType(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`http://127.0.0.1:5000/predict/${segmentationType}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setPredictedImage(imageObjectURL);
      } else {
        alert('Failed to get prediction');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching prediction');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Meimobian Gland Segmentation</h1>
      </nav>
      <div className="container">
        <div className="upload-section">
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <select onChange={handleSegmentationChange} value={segmentationType}>
            <option value="gland">Gland Segmentation</option>
            <option value="eyelid">Eyelid Segmentation</option>
          </select>
          <button onClick={handleSubmit} className="upload-button">Predict</button>
        </div>
        <div className="result-section">
          {inputImage && (
            <div className="image-container">
              <h2>Input Image</h2>
              <img src={inputImage} alt="Input" />
            </div>
          )}
          {predictedImage && (
            <div className="image-container">
              <h2>Predicted Image</h2>
              <img src={predictedImage} alt="Predicted" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
