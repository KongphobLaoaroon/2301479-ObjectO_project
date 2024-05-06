// import React, { useEffect, useState } from 'react';
// import './instructor_list.css'
// import axios from 'axios'
// function InstructorList({ refresh }) {
//     const [instructors, setInstructors] = useState([]);

//     useEffect(() => {
//         const fetchInstructors = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/instructors');
//                 const data = await response.json();
                
//                 setInstructors(data);
//             } catch (error) {
//                 console.error('Error fetching instructors:', error);
//             }
//         };

//         fetchInstructors();
//     }, [refresh]);

//     const handleDelete = async (instructorId) => {
//         try {
//             await axios.delete(`http://localhost:5000/instructor/${instructorId}`);
//             setInstructors(instructors.filter(instructor => instructor._id !== instructorId));
//             alert('Instructor deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting instructor:', error);
//             alert('Error deleting instructor.');
//         }
//     };
    

//     return (
//         <div>
//             <h2>Instructors</h2>
//             <div className="instructor-container">
//                 {instructors.map((instructor) => (  
//                     <div key={instructor._id} className="instructor-card">
//                         <h3>{instructor.EnglishName} ({instructor.ThaiName})</h3>
//                         {/* <p>Degree: {instructor.degree}</p> */}
//                         {/* <p>Position: {instructor.position}</p> */}
//                         <p>Office: {instructor.Office}</p>
//                         <p>Phone: {instructor.Phone}</p>
//                         {/* <p>Fax: {instructor.Fax}</p> */}
//                         <p>Email: {instructor.Email}</p>
//                         {/* <p>Educations: {instructor.Educations}</p> */}
//                         <p>Research Field: {instructor.Research_field}</p>
//                         {/* <p>Papers: {instructor.Papers}</p> */}
//                         <img src={instructor.picture} alt={instructor.EnglishName} className="instructor-image" />
//                         {/* <button onClick={() => handleDelete(instructor._id)}>Delete</button> */}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default InstructorList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './instructor_list.css';

function InstructorList({ refresh,AUser }) {
    const [instructors, setInstructors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const isAdmin = (AUser) => {AUser.email.endsWith("@student.chula.ac.th")};
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch('http://localhost:5000/instructors');
                const data = await response.json();
                setInstructors(data);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        fetchInstructors();
    }, [refresh]);

    const handleDelete = async (instructorId) => {
        try {
            await axios.delete(`http://localhost:5000/instructor/${instructorId}`);
            setInstructors(instructors.filter(instructor => instructor._id !== instructorId));
            alert('Instructor deleted successfully!');
        } catch (error) {
            console.error('Error deleting instructor:', error);
            alert('Error deleting instructor.');
        }
    };

    const filteredInstructors = instructors.filter(instructor => {
        const fullName = `${instructor.EnglishName} ${instructor.ThaiName}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        
        <div className='content-container'>
            <h2>List of Instructors</h2>
            <div className="input-container">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
            />
            </div>
            <div className="instructor-container">
                {filteredInstructors.map((instructor) => (
                    <div key={instructor._id} className="instructor-card">
                        <h3>{instructor.EnglishName} ({instructor.ThaiName})</h3>
                        <p>Office: {instructor.Office}</p>
                        <p>Phone: {instructor.Phone}</p>
                        <p>Email: {instructor.Email}</p>
                       
                         
                        <p>Research Field: {Array.isArray(instructor.Research_field) ? instructor.Research_field.join(', ') : Object.values(instructor.Research_field).map(fi => (<p>{fi}</p>))}</p> 
                        <img src={instructor.picture} alt={instructor.EnglishName} className="instructor-image" />
                        {AUser && AUser.isAdmin && <button onClick={() => handleDelete(instructor._id)}>Delete</button>}      
                        
                       
                    </div>
                ))}
            </div>
        </div>
    
    );
}

export default InstructorList;