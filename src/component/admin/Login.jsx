import React, { useEffect, useState, useCallback } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const AdminLogin = () => {

    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async (e) => {
        e.preventDefault();
        // this.setState({ message: { display: false, msg: "", type: '' } })
        const loginData = {
            number: number,
            password: password
        }
        const service = new UserDataService();

        try {
            let dbUser = {};
            // console.log(loginData);
            let user = await service.queryUserByPhone(loginData.number);

            console.log(user.size);
            user.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                if (doc.id) {
                    dbUser = {
                        userId: doc.id,
                        email: doc.data().email,
                        fullName: doc.data()?.fullName,
                        password: doc.data().password,
                        number: doc.data()?.number,
                        role: doc.data().role
                    }

                    if (loginData.password != dbUser.password) {
                        // this.setState({ message: { display: true, msg: "Invalid password", type: 'danger' } })
                        return;
                    }

                    localStorage.setItem('currentUser', JSON.stringify({
                        userId: doc.id,
                        email: doc.data().email,
                        fullName: doc.data().fullName,
                        password: doc.data().password,
                        number: doc.data().number,
                        role: doc.data().role
                    }))
                    // this.setState({ isLoggedIn: true, showLogin: false });
                    if (dbUser.role == "admin" || dbUser.role == "sadmin") {
                        window.location.replace('/admin/');
                        localStorage.setItem('isAdmin', 'true');
                        return
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }

    }


    return (
        <div className='text-center' style={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Helmet pageTitle="Admin login" />

            <div className="text-center ptb--200" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h3>Admin Login</h3>
                <div className="plr--300">

                    <div className="rn-form-group">
                        <PhoneInput
                            defaultCountry="IN"
                            value={number}
                            onChange={phone => setNumber(phone)}
                            // style={inputStyleNo}
                            type="text"
                            name="Number"
                            placeholder="Mobile Number"
                            required
                        />
                    </div>
                    <div className="rn-form-group mt-3">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // style={inputStyle}
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button onClick={(e) => onLogin(e)} type="submit" className="btn btn-secondary mt-3">
                        <span>Login</span>
                    </button>

                </div>
            </div>


        </div>
    )
}

export default AdminLogin