import React, { useState } from 'react';
// Import Bootstrap Form and Button components
import { Form, Button } from 'react-bootstrap';
// Import custom CSS for this component
import './Login.css';

const Login = (props) => {
  // State for storing username input
  const [name, setName] = useState('');
  // State for storing ID input
  const [id, setId] = useState('');

  // Handler for username input change
  const onChangeName = (e) => setName(e.target.value);

  // Handler for ID input change
  const onChangeId = (e) => setId(e.target.value);

  // Called when user clicks Submit button
  const login = () => {
    // Calls login function passed in props with user details
    props.login({ name, id });
    // Redirects to the homepage after login
    props.history.push('/');
  };

  return (
    <div className="login-container">
      {/* Login Form */}
      <Form>
        {/* Username Field */}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={onChangeName}
          />
        </Form.Group>

        {/* ID Field */}
        <Form.Group>
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter id"
            value={id}
            onChange={onChangeId}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" onClick={login}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
