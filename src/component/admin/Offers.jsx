import React, { useEffect, useState, useCallback } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone'


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

                const img = new Image();
                img.src = URL.createObjectURL(image);


                img.onload = () => {
                    if ((img?.height == 553 && img?.width == 1014)) {

                        if (image?.size * 0.001 <= 200) {

                            const imageRef = ref(storage, `/offerImages/${image.name}`);
                            uploadBytes(imageRef, image).then((snapshot) => {
                                getDownloadURL(snapshot.ref).then(async (url) => {
                                    console.log(url);
                                    const dbService = new UserDataService()
                                    let image = { url }
                                    const pushImage = await dbService.addData(image, carouselRef);
                                    console.log(pushImage);
                                    showOfferImages();
                                    alert("Changes applied successfully")
                                })
                            })

                        } else {
                            alert("Image size should not exceed 200 kb.")
                        }
                    } else {
                        alert("Image width should be 1014 pixels and height should be 553 pixels.");
                    }

                };

                img.onerror = (err) => {
                    console.log("img error");
                    console.error(err);
                };
            })
            showOfferImages();
            setOfferImageUpload(undefined)

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

    const onDrop = useCallback(acceptedFiles => {

        setOfferImageUpload(acceptedFiles)
        console.log(acceptedFiles)

        // Do something with the files
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "image/*", onDrop })

    return (

        <div className=''>
            <Helmet pageTitle="Admin" />

            <div style={{}} className="designer-portfolio-area bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h2 className='text-center'>Offers</h2>


                    <div className='p-4' style={{ border: "1px solid black" }}>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p style={{fontFamily:"arial"}}>Drop the files here ...</p> :
                                    <p style={{fontFamily:"arial"}}>Drag & drop some Images here, or click to select Images</p>
                            }
                        </div>

                        <div className='row'>
                            {offerImageUpload?.map((image) => {
                                return (<>
                                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12'>
                                        <img height="100px" width="200px" src={URL.createObjectURL(image)} alt="image preview" />
                                    </div>
                                </>)
                            })}
                        </div>
                    </div>

                    {/* <input accept='image/*' type='file' multiple onChange={(e) => setOfferImageUpload(e.target.files)} /> */}

                    <button className='mt-3' onClick={addOfferImage}>Add Offers</button>

                    <div className='mt-3 row'>

                        {
                            offerImages?.map((imageObj) => {
                                return (
                                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12'>
                                        <div>
                                            <img src={imageObj.url} alt="offer image" />
                                        </div>
                                        <div>

                                            <button onClick={() => { deleteOfferImage(imageObj?.id) }}>Delete</button>
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