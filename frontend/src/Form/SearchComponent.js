import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchComponent.css';

function SearchComponent({ refresh }) {
  const [projectDescription, setProjectDescription] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [field,setField] = useState('');
  useEffect(() => {
    if (refresh) {
      handleSearch();
    }
  }, [refresh]);

  const handleSearch = async () => {
    console.log('Searching...'); // Log that the search is being initiated
    try {
      const response = await axios.post('http://localhost:5000/calculate_field', { description: projectDescription });
      console.log('Calculated fields:', response.data.fields);
  
      const fields = response.data.fields;
      setField(fields)
      const instructorsResponse = await axios.post('http://localhost:5000/instructors_by_fields', { fields });
      console.log('Instructors response:', instructorsResponse.data);
  
      setSearchResults(instructorsResponse.data);
      
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
    <div className='content-container'>
      <div class="container">
  <h2>Description of your project here</h2>
</div>
      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        placeholder="Enter your project description..."
      />
      <button className="searchButton" onClick={handleSearch}>find instructor</button>
      </div>
      <div className='content-container'>
      <h1>Match fields</h1>
      {Array.isArray(field) ? field.join(', ') : Object.values(field).map(fi => (<p>{fi}</p>))}
      <h1>Match Instructors</h1>
      
      <div className="instructor-container">
        
        {searchResults.map((instructor, index) => (  
          
          <div key={index} className="instructor-card">
            
            <h3>{instructor.EnglishName} ({instructor.ThaiName}) </h3>
                        <p>Office: {instructor.Office}</p>
                        <p>Phone: {instructor.Phone}</p>
                        {/* <p>Fax: {instructor.Fax}</p> */}
                        <p>Email: {instructor.Email}</p>
                        {/* <p>Educations: {instructor.Educations}</p> */}
                        <p>Research Field: {Array.isArray(instructor.Research_field) ? instructor.Research_field.join(', ') : Object.values(instructor.Research_field).map(fi => (<p>{fi}</p>))}</p>
                        {/* <p>Papers: {instructor.Papers}</p> */}
                        <img src={instructor.picture} alt={instructor.EnglishName} className="instructor-image" />
            {/* Add other instructor details here if needed */}
          </div>
          
         
          
        ))}
      </div>
    </div>
    </div>
  );
}

export default SearchComponent;