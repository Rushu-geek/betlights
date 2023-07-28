import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SideBar from './SideBar';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const AvailableSites = () => {

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    const [siteImageUpload, setSiteImageUpload] = useState();
    const [siteImages, setSiteImages] = useState();
    const [sideBarState, setSideBarState] = useState("open");

    const showSitesImages = async () => {
        try {
            const sitesRef = collection(db, 'sites');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(sitesRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setSiteImages(tmpArray);
        } catch (err) {
            console.log(err);
        }
    }

    const addSitesImage = () => {
        if (!siteImageUpload) {
            return;
        }
        try {

            console.log(siteImageUpload)
            const sitesRef = collection(db, 'sites');

            const imagesArr = Object.values(siteImageUpload);
            console.log(Object.values(siteImageUpload));

            imagesArr.map((image) => {


                const img = new Image();
                img.src = URL.createObjectURL(image);


                img.onload = () => {
                    alert(img.height);
                    alert(img.width);

                    if ((img?.height == 1080 && img?.width == 1920) || (img?.width == 390 && img?.height == 300)) {

                        if (image?.size * 0.001 <= 200) {



                        } else {
                            alert("Image size should not exceed 200 kb.")

                        }
                    } else {
                        alert("Image width should be 1920 pixels and height should be 1080 pixels.");
                    }

                };

                img.onerror = (err) => {
                    console.log("img error");
                    console.error(err);
                };


                // -------------
                const imageRef = ref(storage, `/siteImages/${image.name}`);
                uploadBytes(imageRef, image).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        console.log(url);
                        const dbService = new UserDataService()
                        let image = { url }
                        const pushImage = await dbService.addData(image, sitesRef);
                        console.log(pushImage);
                        showSitesImages();
                    })
                })
            })
            showSitesImages();

        } catch (err) {
            console.log(err);
        }
    }

    const deleteSiteImage = async (id) => {

        try {
            const dbService = new UserDataService();
            const data = await dbService.deleteData(db, 'sites', id);

            console.log(data)
            showSitesImages();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        disableBodyScroll(document)
        showSitesImages();
    }, []);




    return (

        <div style={{ overflow: "hidden" }} className=''>
            <Helmet pageTitle="Admin" />


            {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}

            <div className='row'>
                <div onClick={() => { sideBarState == "open" ? setSideBarState("close") : setSideBarState("open") }} className={sideBarState == "open" ? 'col-xl-3 col-lg-3 col-md-3 col-sm-2 col-2' : 'col-xl-1 col-lg-1 col-md-1 col-sm-2 col-2'}>
                    <SideBar />
                </div>

                <div className={sideBarState == "open" ? 'col-xl-9 col-lg-9 col-md-9 col-sm-10 col-10' : 'col-xl-11 col-lg-11 col-md-11 col-sm-10 col-10'}>

                    <div className="designer-portfolio-area ptb--70 bg_color--1">
                        <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                            <h2 className='text-center'>Available Sites</h2>

                            <input accept='image/*' type='file' multiple onChange={(e) => setSiteImageUpload(e.target.files)} />

                            <button className='mt-3' onClick={addSitesImage}>Add Sites</button>

                            <div style={{overflow:"scroll",overflowX:"hidden", height:"50vh"}} className='mt-3 row'>

                                {
                                    siteImages?.map((imageObj) => {
                                        return (
                                            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12'>
                                                <div>
                                                    <img src={imageObj.url} alt="offer image" />
                                                </div>
                                                <div>

                                                    <button onClick={() => { deleteSiteImage(imageObj?.id) }}>Delete</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvailableSites