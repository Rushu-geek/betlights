import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Testimonials = () => {

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    const [siteImageUpload, setSiteImageUpload] = useState();
    const [siteImages, setSiteImages] = useState();


    return (

        <div className=''>
            <Helmet pageTitle="Admin" />

            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />
            <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h2 className='text-center'>Testimonials</h2>
                </div>
            </div>
        </div>
    )
}

export default Testimonials