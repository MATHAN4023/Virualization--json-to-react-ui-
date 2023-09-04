import React, { useState } from "react";
import { createRoot } from "react-dom"; // Import createRoot
import './index.css'; // Import any necessary CSS files
import credentials from './login_credential.json';

function Login({ access_provider }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const validate_login = async () => {
        const check_username = credentials.username;
        const check_password = credentials.password;
        if (check_username === username && check_password === password) {
            access_provider();
            sessionStorage.setItem('access', true);
        } else {
            alert("Invalid credentials");
        }
    }

    return (
        < >
            {/* ... rest of your component */}
            < div id="loginform" >
                <FormHeader title="Login" />
                <div>
                    <FormInput
                        description="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                    />
                    <FormInput
                        description="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormButton
                        title="Log in"
                        type="submit"
                        className='login_btn'
                        onClick={validate_login} // Remove the parentheses
                    />

                </div>
                {/* <OtherMethods /> */}


            </div >
        </>
    );
}

// // ... rest of your component

const FormHeader = (props) => (
    <h2 id="headerTitle">{props.title}</h2>
);

const FormButton = (props) => (
    <div id="button" className="row">
        <button onClick={props.onClick}>{props.title}</button>
    </div>
);


const FormInput = (props) => (
    <div className="row">
        <label>{props.description}</label>
        <input
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    </div>
);

// const OtherMethods = (props) => (
//     <div id="alternativeLogin">
//         <label>Or sign in with:</label>
//         <div id="iconGroup">
//             <Facebook />
//             <Twitter />
//             <Google />
//         </div>
//     </div>
// );

// const Facebook = (props) => (
//     <a href="#" id="facebookIcon"></a>
// );

// const Twitter = (props) => (
//     <a href="#" id="twitterIcon"></a>
// );

// const Google = (props) => (
//     <a href="#" id="googleIcon"></a>
// );


// const root = createRoot(document.getElementById('root')); // Use createRoot
// root.render(<Login />);
export default Login; 
