import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import InstructorForm from "./Form/instructor_form";
import FieldForm from "./Form/fields_form";
import InstructorList from "./List/instructor_list";
import Appheader from "./Form/Appheader";
import SearchComponent from "./Form/SearchComponent";
import axios from 'axios';
import Pagefind from "./Pagefind";
import Pageintructor from "./Pageintuctor";
import { Route, Routes } from 'react-router-dom';
const clientId =
  "475022846419-l1hvar46ijfcmpa3o92atm2ej8sik0ng.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response.profileObj);
    const userData = response.profileObj;
  
    // Check if the user is an admin based on some criteria (e.g., email domain)
    const isAdmin = userData.email.endsWith("@student.chula.ac.th");
  
    // Update user object with admin status
    userData.isAdmin = isAdmin;
  
    setUser(userData);
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const [refreshInstructors, setRefreshInstructors] = useState(false);
  const [refreshFields, setRefreshFields] = useState(false);

  const handleInstructorAdded = () => {
    setRefreshInstructors((prev) => !prev); // Toggle the state to trigger re-fetching
  };

  const handleFieldAdded = () => {
    setRefreshFields((prev) => !prev); // Toggle the state to trigger re-fetching
  };
  const handleSearchChange = () => {
    setSearchQuery((prev) => !prev);
  };
  
  
 
  return (
    
    <div>
      <Appheader/>
      {user ? (
      <div >
        <GoogleLogout
            clientId={clientId}
            buttonText="Log out"
            onLogoutSuccess={handleLogout}
          />
           {user.isAdmin && <InstructorForm onInstructorAdded={handleInstructorAdded} refreshFields={refreshFields} />}
      </div>
    ) : (
      <div>
         <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      </div>
    )}
    
      <Routes>
        <Route path="/" element={<Pagefind  />} />
        <Route path="about" element={<Pageintructor User ={user}/>} />
        
      </Routes>
     
      {/* {user ? (
          */}
         
          
          {/* <Appheader  /> */}
          {/* <div className="content-container">
          <img src={user.imageUrl}></img> 
          <h2>Welcome, {user.name} test</h2> 
          <p>Email: {user.email}</p> 
         
          <GoogleLogout
            clientId={clientId}
            buttonText="Log out"
            onLogoutSuccess={handleLogout}
          />
          </div> */}
          {/* <InstructorForm onInstructorAdded={handleInstructorAdded} refreshFields={refreshFields} />  */}
          {/* <SearchComponent onSearchChange={handleSearchChange} refresh={refreshInstructors} />
          <InstructorList refresh={refreshInstructors} /> */}
          {/* <FieldForm onFieldAdded={handleFieldAdded}/>  */}
          
       
      {/* ) : (
        <div>
        <Appheader/>
        <h2>Welcome , Guest</h2>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
        
        <InstructorList refresh={refreshInstructors} />
        
        </div>
      )} */}
    </div>
  );
}

export default App;
