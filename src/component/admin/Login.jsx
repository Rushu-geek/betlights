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
import { Modal } from 'react-bootstrap';

const AdminLogin = () => {

    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");

    const [selectColor1, setSelectColor1] = useState("");
    const [selectColor2, setSelectColor2] = useState("");

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
        <div className='text-center'>
            <Helmet pageTitle="Admin login" />

            <Modal style={{height: 600}} centered show={true}>
                <Modal.Header className='text-center' style={{
                    backgroundImage: `linear-gradient(${selectColor1},${selectColor2})`,
                    borderBottomColor: selectColor2,
                }} closeButton>
                    <h4 className='mt-2' style={{color: '#fff'}}>Admin Login</h4>
                    
                </Modal.Header>
                <form onSubmit={(e) => onLogin(e)}>
                    <Modal.Body style={{ backgroundColor: selectColor2, top: 0 }}>
                        <div className="rn-form-group">
                            <PhoneInput
                                defaultCountry="IN"
                                value={number}
                                onChange={phone => setNumber(phone)}
                                style={{ borderRadius: 7, backgroundColor: 'white'}}
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
                                style={{ borderRadius: 7, backgroundColor: 'white'}}
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: selectColor2, borderTopColor: selectColor2, alignContent: 'center', justifyContent: 'center' }}>
                        <button type="submit" className="rn-btn">
                            <span>Login</span>
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>


        </div>
    )
}

export default AdminLogin