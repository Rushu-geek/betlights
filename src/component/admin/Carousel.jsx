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
        try {
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
        } catch (err) {
            console.log(err);

        }
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

                // getting the dimensions of the Image.
                const img = new Image();
                img.src = URL.createObjectURL(image);

                img.onload = () => {

                    if ((img?.height == 1080 && img?.width == 1920) || (img?.width == 390 && img?.height == 300)) {

                        if (image?.size * 0.001 <= 200) {
                            const imageRef = ref(storage, `/carouselImages/${image.name}`);
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

            <div className="designer-portfolio-area bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h6 className='text-center'>Carousel Images</h6>

                    <input accept='image/*' type='file' multiple onChange={(e) => setImageUpload(e.target.files)} />
                    Mobile: <input style={{}} type="radio" name="carouselType" id="" value="mobile" onChange={(e) => { setCarouselType(e.target.value) }} />
                    Web: <input type="radio" name="carouselType" id="" value="web" onChange={(e) => { setCarouselType(e.target.value) }} />

                    <button className='mt-3' onClick={addCarouselImage}>Add Image</button>

                    <div className='mt-3 row'>

                        {
                            carouselImages?.map((imageObj) => {
                                return (
                                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12'>
                                        <div>
                                            <img height="100px" width="200px" src={imageObj.url} alt="carousel image" />
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