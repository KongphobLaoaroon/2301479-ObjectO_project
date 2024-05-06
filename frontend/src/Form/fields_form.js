import React, { useState } from "react";

function FieldForm({onFieldAdded}) {
  const [field, setField] = useState("");

  const handleInputChange = (event) => {
    setField(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: field }),
      });
      const result = await response.json();
      console.log(result);
      alert("Field created successfully!");
      onFieldAdded()
      
    } catch (error) {
      console.error("Error creating field:", error);
      alert("Error creating field.");
    }
  };

  return (
    <div>
      <h2>Create Field</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Field:
          <input type="text" value={field} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FieldForm;
