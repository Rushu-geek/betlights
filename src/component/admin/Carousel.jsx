import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const Carousel = () => {

    const [imageUpload, setImageUpload] = useState();
    const [carouselImages, setCarouselImages] = useState();
    const [carouselType, setCarouselType] = useState("web");

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);



    const showCarouselImages = async () => {
        const carouselRef = collection(db, 'carousel');
        const dbService = new UserDataService();

        const data = await dbService.getAllData(carouselRef);
        let tmpArray = [];

        data.forEach((doc) => {
            let obj = doc.data();

            obj.id = doc.id;
            tmpArray.push(obj);
        });
        console.log(tmpArray);
        setCarouselImages(tmpArray);
    }

    const addCarouselImage = () => {
        if (!imageUpload) {
            return;
        }
        try {

            const carouselRef = collection(db, 'carousel');

            const imagesArr = Object.values(imageUpload);
            console.log(Object.values(imageUpload));

            imagesArr.map((image) => {
                const imageRef = ref(storage, `/rationalImages/${image.name}`);
                uploadBytes(imageRef, image).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        console.log(url);
                        const dbService = new UserDataService()
                        let image = { url, carouselType }
                        const pushImage = await dbService.addData(image, carouselRef);
                        console.log(pushImage);
                        showCarouselImages();
                        // showImages();
                    })
                })
            })
            showCarouselImages();
            // showImages();

        } catch (err) {
            console.log(err);
        }
    }

    const deleteCarouselImage = async (id) => {

        try {
            const dbService = new UserDataService();
            const data = await dbService.deleteData(db, 'carousel', id);

            console.log(data)
            showCarouselImages();
        } catch (err) {
            console.log(err);
        }


    }

    useEffect(() => {
        showCarouselImages();
    }, []);


    return (
        <div className=''>
            <Helmet pageTitle="Admin" />

            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />
            <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h2 className='text-center'>Carousel Images</h2>

                    <input type='file' multiple onChange={(e) => setImageUpload(e.target.files)} />
                    Mobile: <input style={{}} type="radio" name="carouselType" id="" value="mobile" onChange={(e) => { setCarouselType(e.target.value) }} />
                    Web: <input type="radio" name="carouselType" id="" value="web" onChange={(e) => { setCarouselType(e.target.value) }} />

                    <button className='mt-3' onClick={addCarouselImage}>Add Image</button>

                    <div className='mt-3 row'>

                        {
                            carouselImages?.map((imageObj) => {
                                return (
                                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12'>
                                        <div>
                                            <img height="300px" width="500px" src={imageObj.url} alt="carousel image" />
                                        </div>
                                        <div>

                                            <button onClick={() => { deleteCarouselImage(imageObj?.id) }}>Delete</button>
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

export default Carousel