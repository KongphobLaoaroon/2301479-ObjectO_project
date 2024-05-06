import React, { useState, useEffect } from 'react';

function InstructorForm({ onInstructorAdded , refreshFields}) {
    const [instructorData, setInstructorData] = useState({
        ThaiName: '',
        EnglishName: '',
        degree: '',
        position: '',
        Office: '',
        Phone: '',
        Fax: '',
        Email: '',
        Educations: [],
        Research_field: [],
        Papers: []
    });
    const [fields, setFields] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Fetch the list of fields from the backend
        fetch('http://localhost:5000/fields')
            .then(response => response.json())
            .then(data => setFields(data))
            .catch(error => console.error('Error fetching fields:', error));
    }, [refreshFields]);

    const handleInputChange = (event) => {
        
        setInstructorData({
            ...instructorData,
            [event.target.name]: event.target.value
        });
    };

    const handleArrayChange = (event) => {
        setInstructorData({
            ...instructorData,
            [event.target.name]: event.target.value.split(',')
        });
    };

    const handleSelectChange = (event) => {
        const options = event.target.options;
        const selectedOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedOptions.push(options[i].value);
            }
        }
        console.log(selectedOptions)
        setInstructorData({
            ...instructorData,
            Research_field: selectedOptions
        });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        Object.keys(instructorData).forEach(key => {
            formData.append(key, Array.isArray(instructorData[key]) ? instructorData[key].join(',') : instructorData[key]);
        });
        
        try {
            const response = await fetch('http://localhost:5000/instructor', {
                method: 'POST',
                body: formData,
            });
            console.log(formData)
            const result = await response.json();
            console.log(result);
            alert('Instructor created successfully!');
            onInstructorAdded(); // Call the callback function
        } catch (error) {
            console.error('Error creating instructor:', error);
            alert('Error creating instructor.');
        }
    };

    return (
        <div>
            <h2>Create Instructor</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Thai Name:
                    <input type="text" name="ThaiName" value={instructorData.ThaiName} onChange={handleInputChange} />
                </label>
                <label>
                    English Name:
                    <input type="text" name="EnglishName" value={instructorData.EnglishName} onChange={handleInputChange} />
                </label>
                {/* Add more input fields for other properties */}
                {/* <label>
                    Educations (comma-separated):
                    <input type="text" name="Educations" value={instructorData.Educations.join(',')} onChange={handleArrayChange} />
                </label> */}
                 <label>
                    Email:
                    <input type="text" name="Email" value={instructorData.Email} onChange={handleInputChange} />
                </label>
                <label>
                    Office:
                    <input type="text" name="Office" value={instructorData.Office} onChange={handleInputChange} />
                </label>
                <label>
                    Research Fields:
                    <select multiple name="Research_field" value={instructorData.Research_field} onChange={handleSelectChange}>
                        {fields.map(field => (
                            <option key={field._id} value={field.field}>{field.field}</option>
                        ))}
                    </select>
                </label>
                {/* <label>
                    Papers (comma-separated):
                    <input type="text" name="Papers" value={instructorData.Papers.join(',')} onChange={handleArrayChange} />
                </label> */}
                 <label>
                    Phone :
                    <input type="text" name="Phone" value={instructorData.Phone} onChange={handleArrayChange} />
                </label> 
                <label>
                    Image:
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default InstructorForm;
