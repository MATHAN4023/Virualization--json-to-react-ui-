import React,{useState} from "react";
import sketch1 from './logo/sketch1.jpeg';
import sketch2 from './logo/sketch2.jpeg';
import Qr_code from './logo/Qr.png';
import credentials from './login_credential.json';

function Login({access_provider}) {
    const [username,setusername]=useState();
    const [password,setpassword]=useState();

    const validate_login=async()=>{
        const check_username=credentials.username;
        const check_password =credentials.password;
        if(check_username===username && check_password===password){
            access_provider()
            sessionStorage.setItem('access',true);
        } else{
            alert("invalid credentials")
        }
    }
    
    return (
        <>
            <div className='content'>
                <div className='digital_scan'>
                    <div className="TempoIot">Power Monitoring</div>
                    <div className="ds">digital Simplified</div>
                    <img src={Qr_code} style={{ height: '100px', width: '100px' }} alt="Qr" />
                    <div className="para">It's beginning of machines taking over the world</div>
                    <div className="powered_by">
                        Powered by <span className="Quantanics">Quantanics</span>
                    </div>
                </div>
                <div className='login_inputs'>
                    <div className="all_inputs">
                        <div className="logo">
                            {/* <img src={Logo} alt="Logo" /> */}
                        </div>
                        <input type="text" placeholder='Username' className='login_inputs_individual' value={username} onChange={e=>{setusername(e.target.value)}} />
                        <input type="password" placeholder='Password' className='login_inputs_individual' value={password} onChange={e=>{setpassword(e.target.value)}} />
                        <div className="login_btn_div">
                            <input type="submit" className='login_btn' value={"Login"} onClick={validate_login} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='sketch_images'>
                <img src={sketch1} alt="sketch1" className='sketch1' />
                <img src={sketch2} alt="sketch2" className='sketch2' />
            </div>
        </>
    )
}

export default Login;