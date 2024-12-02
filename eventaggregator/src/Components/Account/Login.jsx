import React from 'react'
import './Account.css';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';

const Login = ({ isOpen, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content login">
                <button className="close-btn" onClick={onClose}> &times; </button>
                <div className='flex-div'>
                    <Logo className="logo" />   
                    <h2>Login to Event Aggregator</h2>
                </div>
                <form>
                    <div className="container username">
                        <div>
                            <h4>Username/Email</h4>
                        </div>
                        <div className="input-box username">
                            <input type="text" />
                        </div>
                    </div>
                    <div className="container password">
                        <div>
                            <h4> Password </h4>
                        </div>
                        <div className="input-box password">
                            <input type="text" />
                        </div>
                    </div>
                    <div>
                        <label> Forgot Username or Password?</label>
                    </div>
                    <div className="flex-div">
                        <button className="button log-in"> Log In </button>
                    </div>
                    <div>
                        <label> Don't have an account? Sign up here</label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
