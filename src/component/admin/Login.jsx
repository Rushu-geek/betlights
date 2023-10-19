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
import { Alert, Modal } from 'react-bootstrap';

const AdminLogin = () => {

    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");

    const [selectColor1, setSelectColor1] = useState("");
    const [selectColor2, setSelectColor2] = useState("");

    const [message, setMessage] = useState({ display: false, msg: "", type: "" })

    useEffect(() => {
        getColors();
    }, []);

    const getColors = async () => {
        try {
            const colorRef = collection(db, 'colors');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(colorRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setSelectColor1(tmpArray[0]?.color1);
            setSelectColor2(tmpArray[0]?.color2);
        } catch (err) {
            console.log(err);
        }
    }

    const onLogin = async (e) => {
        e.preventDefault();
        // this.setState({ message: { display: false, msg: "", type: '' } })
        setMessage({ display: false, msg: "", type: "" })
        const loginData = {
            number: number,
            password: password
        }
        const service = new UserDataService();

        try {
            let dbUser = {};
            // console.log(loginData);
            let user = await service.queryUserByUserName(loginData.number);

            console.log(user.size);

            if (!user.size) {
                alert("user doesn't exist");
                return
            }

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
                        alert("Invalid password");
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
                } else {
                    alert("user doesn't exist")
                }
            });
        } catch (e) {
            console.log(e);
        }

    }


    return (
        <div className='text-center'>
            <Helmet pageTitle="Admin login" />

            <Modal style={{ height: 600 }} centered show={true}>
                <Modal.Header className='text-center' style={{
                    backgroundImage: `linear-gradient(${selectColor1},${selectColor2})`,
                    borderBottomColor: selectColor2,
                }} closeButton>
                    <h4 className='mt-2' style={{ color: '#fff' }}>Admin Login</h4>

                </Modal.Header>
                <form onSubmit={(e) => onLogin(e)}>
                    <Modal.Body style={{ backgroundColor: selectColor2, top: 0 }}>
                        {message.display && <Alert variant={message.type}>
                            {message.msg}
                        </Alert>}
                        <div className="rn-form-group">
                            <input
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                style={{ borderRadius: 7, backgroundColor: 'white' }}
                                type="text"
                                name="User Name"
                                placeholder="User Name"
                                required
                            />
                        </div>
                        <div className="rn-form-group mt-3">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRadius: 7, backgroundColor: 'white' }}
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: selectColor2, borderTopColor: selectColor2, alignContent: 'center', justifyContent: 'center' }}>
                        <button style={{color: 'white', borderColor: 'white'}} type="submit" className="rn-btn">
                            <span>Login</span>
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>


        </div>
    )
}

export default AdminLogin