import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SocialMedia = () => {

    const [instaLink, setInstaLink] = useState("");
    const [telegramLink, setTelegramLink] = useState("");
    const [linkedInLink, setLinkedInLink] = useState("");
    const [fbLink, setFbLink] = useState("");
    const [linkId, setLinkId] = useState("");

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);



    const showSocialMediaLinks = async () => {
        try {
            const socialRef = collection(db, 'social');
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
            setFbLink(tmpArray[0]?.social?.fb);
            setInstaLink(tmpArray[0]?.social?.insta);
            setLinkedInLink(tmpArray[0]?.social?.lin);
            setTelegramLink(tmpArray[0]?.social.tele);

        } catch (err) {
            console.log(err);
        }
    }

    const updateSocialMediaLinks = async () => {
        try {
            if (!fbLink || !instaLink || !linkedInLink || !telegramLink || !linkId) {
                alert("No field can be empty.")
                return;
            } else {

                let resObj = 
                    {
                        id: linkId,
                        social: {
                            fb: fbLink,
                            insta: instaLink,
                            lin: linkedInLink,
                            tele: telegramLink
                        }
                    }

                const dbService = new UserDataService();
                const data = await dbService.updateData(db, 'social', linkId, resObj);
                console.log(data);
                showSocialMediaLinks()

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

                    <h6 className='text-center'>Manage Social Media</h6>
                    <div style={{ width: "200%" }} className='row'>

                        <label htmlFor="facebook" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>facebook</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setFbLink(e.target.value) }} value={fbLink} />
                    </div>

                    <div style={{ width: "200%" }} className='row mt-2'>

                        <label htmlFor="Instagram" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Instagram</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setInstaLink(e.target.value) }} value={instaLink} />
                    </div>

                    <div style={{ width: "200%" }} className='row mt-2'>

                        <label htmlFor="LinkedIn" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>LinkedIn</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setLinkedInLink(e.target.value) }} value={linkedInLink} />
                    </div>

                    <div style={{ width: "200%" }} className='row mt-2'>

                        <label htmlFor="Telegram" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Telegram</label>

                        <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" onChange={(e) => { setTelegramLink(e.target.value) }} value={telegramLink} />
                    </div>

                    <div style={{ width: "200%" }} className='row'>
                        <button className='m-3 btn-outline-primary' onClick={updateSocialMediaLinks}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocialMedia