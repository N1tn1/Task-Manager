import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <header className="header">
                <h1>Stay Organized</h1>
                <p>Manage your tasks effortlessly with this intuitive interface</p>
            </header>
            <section className="features-list">
                <h2>Features:</h2>
                    <ul>
                        <li>Add, remove, and edit todos</li>
                        <li>Mark tasks as complete</li>
                        <li>Organize tasks by categories</li>
                        <li>Responsive design for mobile and desktop</li>
                    </ul>
            </section>
            <section className="buttons">
                <Link to="/signin">
                    <button className="todoBtn">Get Started</button>
                </Link>
                <p style={{ cursor: 'not-allowed', color: 'blue'}}> Learn more </p>
            </section>
            <footer>
                <p>Contact us at support@taskmanagers.com</p>
          </footer>
        </div>
    );
}


export default Home;