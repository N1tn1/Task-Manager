import React, { useState } from 'react';
import axios from 'axios';
import style from './styles/SignInRegister.module.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/signin');
    };

    const handleRegisterAnother = () => {
        setSuccess(false);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            await axios.post('http://localhost:3000/api/auth/register', {
                username,
                email,
                password,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response.data.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className={style.formcontainer}>
            
            
            {success ? (
                <div className={style.success}>
                    <p style={{ color: 'green' }}>Registration successful! You can now sign-in or register another user</p>
                    <button onClick={handleSignIn} className={style.btn}>Sign In</button> {''}
                    <button onClick={handleRegisterAnother} className={style.btn}>Register</button>
                </div>
                
            ) : (
                <>
                    <h2 className={style.header}>Register</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            className={style.input}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            className={style.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            className={style.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleSignIn} className={style.btn}>Sign In</button> {''}
                    <button className={style.btn} type="submit">Register</button>
                </form>
                </>
            )}
        </div>
    );
};

export default Register;