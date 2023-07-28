import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderThree from '../component/header/HeaderThree';
import UserDataService from '../services/userService';
import { Button } from 'react-bootstrap';

function AdminPassword() {

    const [newPassword, setNewPassword] = useState("")

    const updatePassword = async () => {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        user.password = newPassword;
        const service = new UserDataService();
        try {
            const update = await service.updateUser(user.userId, user);
            alert("Password Updated!")
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Helmet pageTitle="Admin" />
            {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}
            <div className='col-6' style={{ marginTop: 100 }}>
                <h1>Change Password</h1>
                <h3>Enter New Password</h3>
                <input type='password' onChange={(e) => setNewPassword(e.target.value)} />
                <Button className='mt-3' variant="outline-dark" onClick={() => updatePassword()} >
                    Save
                </Button>
            </div>
        </>
    )
}

export default AdminPassword;