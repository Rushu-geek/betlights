import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Offers = () => {

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    const [offerImageUpload, setOfferImageUpload] = useState();
    const [offerImages, setOfferImages] = useState();


    const showOfferImages = async () => {
        try {
            const offerRef = collection(db, 'offers');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(offerRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setOfferImages(tmpArray);
        } catch (err) {
            console.log(err);
        }
    }

    const addOfferImage = () => {
        if (!offerImageUpload) {
            return;
        }
        try {

            const carouselRef = collection(db, 'offers');

            const imagesArr = Object.values(offerImageUpload);
            console.log(Object.values(offerImageUpload));

            imagesArr.map((image) => {
                const imageRef = ref(storage, `/offerImages/${image.name}`);
                uploadBytes(imageRef, image).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        console.log(url);
                        const dbService = new UserDataService()
                        let image = { url }
                        const pushImage = await dbService.addData(image, carouselRef);
                        console.log(pushImage);
                        showOfferImages();
                    })
                })
            })
            showOfferImages();

        } catch (err) {
            console.log(err);
        }
    }

    const deleteOfferImage = async (id) => {

        try {
            const dbService = new UserDataService();
            const data = await dbService.deleteData(db, 'offers', id);

            console.log(data)
            showOfferImages();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        showOfferImages();
    }, []);

    return (

        <div className=''>
            <Helmet pageTitle="Admin" />

            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />
            <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h2 className='text-center'>Offers</h2>

                    <input accept='image/*' type='file' multiple onChange={(e) => setOfferImageUpload(e.target.files)} />

                    <button className='mt-3' onClick={addOfferImage}>Add Offers</button>

                    <div className='mt-3 row'>

                        {
                            offerImages?.map((imageObj) => {
                                return (
                                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12'>
                                        <div>
                                            <img height="300px" width="500px" src={imageObj.url} alt="offer image" />
                                        </div>
                                        <div>

                                            <button onClick={() => { deleteOfferImage(imageObj?.id) }}>Delete</button>
                                            <p>{imageObj?.carouselType}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>



                </div>
            </div>
        </div>
    )
}

export default Offers