import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../../router/template/views/Home';
import Readme from '../../router/template/views/Readme';
import ReduxDemo from './components/redux-demo';
import './app.css';
import logo from './assets/images/logo.png';

function App() {
    return (
        <div className="container">
            <img src={logo} alt=""/>
            每一份感情都值得被珍爱
                <ReduxDemo/>
            <nav>
                <Link to="/home">Home</Link>
                <span style={{ margin: '0 10px' }}>|</span>
                <Link to="/readme">Readme</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/readme" element={<Readme/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
