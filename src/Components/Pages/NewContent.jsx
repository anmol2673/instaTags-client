import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../Design/NewContent.css';

const NewContent = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [numberOfTags, setNumberOfTags] = useState(10);
  const [keywords, setKeywords] = useState('');
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isEditing, setIsEditing] = useState(false);
  const descriptionDivRef = useRef(null);

  const handleGenerate = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('language', selectedLanguage);
    formData.append('tags', numberOfTags);
    formData.append('keywords', keywords);
    formData.append('image', image);
    formData.append('model', selectedModel);
  
    try {
      const generateResponse = await axios.post('http://localhost:9000/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { imagePath } = generateResponse.data;
      const fullImageURL = `${process.env.REACT_APP_BASE_URL}/uploads/${imagePath}`;
  
      // Convert selected image file to base64 format
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(image);
  
      const descriptionResponse = await axios.post('http://localhost:9000/api/generate-description', {
        imageUrl: fullImageURL,
        model: selectedModel // Include the selected model in the request
      });
  
      setDescription(descriptionResponse.data.description);
  
      setSelectedLanguage('');
      setNumberOfTags(10);
      setKeywords('');
      setImage(null);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating the image. Please try again.');
    }
  };
  
  const handleSave = async () => {
    console.log('Base64 Image:', base64Image);
    console.log('Description:', description);
    if (description) {
      try {
        const response = await axios.post('http://localhost:9000/save', {
          imageUrl: base64Image, // Corrected to use the image URL
          description,
        });
        console.log('Save response:', response.data);
        alert('Image URL and description saved successfully.');
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the data. Please try again.');
      }
    } else {
      alert('No description to save.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.innerText);
  };

  useEffect(() => {
    if (descriptionDivRef.current && !isEditing) {
      descriptionDivRef.current.innerText = description;
    }
  }, [description, isEditing]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className='new-content'>
      <section className='left-side'>
        <form onSubmit={handleGenerate} method='POST'>
          <h1>Upload Image</h1>
          <div className='upload-image'>
            {base64Image && <img src={base64Image} alt="Selected" />}
          </div>
          <div className='upload-button'>
            <input type="file" onChange={handleImageChange} />
          </div>
          <table>
            <tbody>
              <tr>
                <td>Language</td>
                <td>
                  <select 
                    value={selectedLanguage} 
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Number of Tags</td>
                <td>
                  <input 
                    type="number" 
                    placeholder="Number of tags" 
                    value={numberOfTags}
                    onChange={(e) => setNumberOfTags(e.target.value)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Keywords</td>
                <td>
                  <input 
                    type="text" 
                    placeholder="Keywords (comma-separated)" 
                    value={keywords} 
                    onChange={(e) => setKeywords(e.target.value)} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Generate</button>
        </form>
      </section>
      <section className='right-side-section'>
        <div className="model-dropdown">
          <h2>Select Model</h2>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4-turbo">GPT-4-Turbo</option>
          </select>
        </div>

        {description && (
          <div className='description'>
            <h2>Image Description</h2>
            <div 
              className={`editable-div ${isEditing ? 'editing' : ''}`} 
              contentEditable={isEditing} 
              ref={descriptionDivRef}
              onInput={handleDescriptionChange}
              suppressContentEditableWarning={true}
            >
              {description}
            </div>
            <button onClick={toggleEditMode}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NewContent;
