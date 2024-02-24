import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const HowItWorks = () => {

    const [deposit, setDeposit] = useState("");
    const [payment, setPayment] = useState("");
    const [getId, setGetId] = useState("");
    const [linkId, setLinkId] = useState("");

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);



    const showSocialMediaLinks = async () => {
        try {
            const socialRef = collection(db, 'howItWorks');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(socialRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setLinkId(tmpArray[0]?.id)
            setDeposit(tmpArray[0].deposit);
            setPayment(tmpArray[0].payment)
            setGetId(tmpArray[0].getid)
        } catch (err) {
            console.log(err);
        }
    }

    const updateSocialMediaLinks = async () => {
        try {
            if (!deposit || !payment || !getId) {
                alert("No field can be empty.")
                return;
            } else {

                let resObj = 
                    {
                        id: linkId,
                        deposit: deposit,
                        payment: payment,
                        getid: getId
                    }

                const dbService = new UserDataService();
                const data = await dbService.updateData(db, 'howItWorks', linkId, resObj);
                console.log(data);
                showSocialMediaLinks();
                alert("Changes applied successfully")


            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        showSocialMediaLinks();
    }, [])

    return (
        <div className='container'>
            <Helmet pageTitle="Admin" />

            <div style={{}} className="designer-portfolio-area bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h4 className='text-center'>Manage How It Works</h4>
                    <div style={{ width: "200%" }} className='row'>

                        <label htmlFor="facebook" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Deposit Money</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setDeposit(e.target.value) }} value={deposit} />
                    </div>

                    <div style={{ width: "200%" }} className='row mt-2'>

                        <label htmlFor="Instagram" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Send us payment screenshot</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setPayment(e.target.value) }} value={payment} />
                    </div>

                    <div style={{ width: "200%" }} className='row mt-2'>

                        <label htmlFor="LinkedIn" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Get your ID</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setGetId(e.target.value) }} value={getId} />
                    </div>

                    <div style={{ width: "200%" }} className='row'>
                        <button className='m-3 btn-outline-primary' onClick={updateSocialMediaLinks}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks