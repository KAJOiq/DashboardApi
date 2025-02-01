import { useState } from 'react';
import useAppStore from '../store/useAppStore';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    PhoneNumber: '',
    Password: '',
    Sex: '',
    DOB: '',
    RoleId: '',
  });

  const { addUser } = useAppStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.UserName) {
      alert('Username is required');
      return false;
    }
    if (!formData.Email || !/\S+@\S+\.\S+/.test(formData.Email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!formData.PhoneNumber) {
      alert('Phone number is required');
      return false;
    }
    if (!formData.Password) {
      alert('Password is required');
      return false;
    }
    if (!formData.RoleId) {
      alert('Role is required');
      return false;
    }
    if (!formData.Sex) {
      alert('Sex is required');
      return false;
    }
    if (!formData.DOB) {
      alert('Date of birth is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log('Form Data:', formData);

    const formDataToSend = new FormData();
    formDataToSend.append('UserName', formData.UserName);
    formDataToSend.append('Email', formData.Email);
    formDataToSend.append('PhoneNumber', formData.PhoneNumber);
    formDataToSend.append('Password', formData.Password);
    formDataToSend.append('Sex', formData.Sex);
    formDataToSend.append('DOB', formData.DOB);
    formDataToSend.append('RoleId', formData.RoleId);

    try {
      const response = await fetch('http://localhost:5091/api/account/register', {
        method: 'POST',
        body: formDataToSend, 
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        let data = null;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Error: Expected JSON, but got:', text);
          alert('Unexpected response format. Please try again later.');
          return;
        }

        addUser(data); 
        alert('User added successfully!');
      } else {
        const errorText = await response.text(); 
        console.error('Error response:', errorText);  
        alert(errorText || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);  
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <h2>Add New User</h2>
      <input
        type="text"
        name="UserName" 
        placeholder="Username"
        value={formData.UserName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="Email" 
        placeholder="Email"
        value={formData.Email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="PhoneNumber" 
        placeholder="Phone Number"
        value={formData.PhoneNumber}
        onChange={handleChange}
      />
      <input
        type="password"
        name="Password"  
        placeholder="Password"
        value={formData.Password}
        onChange={handleChange}
      />
      <select name="Sex" value={formData.Sex} onChange={handleChange}>
        <option value="">Select Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="date"
        name="DOB" 
        placeholder="Date of Birth"
        value={formData.DOB}
        onChange={handleChange}
      />
      <select name="RoleId" value={formData.RoleId} onChange={handleChange}>
        <option value="">Select Role</option>
        {/* Hardcoded roles */}
        <option value="22c53b8f-4e38-4b6d-8b12-0c14af849b1e">Supervisor</option>
        <option value="619e67a2-dafe-4452-8333-208cdc19b083">Student</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
