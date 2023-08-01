import React, { useEffect, useState, useCallback } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone'

const Logo = () => {

    const [logoImage, setLogoImage] = useState("");
    const [uploadedLogoImage, setUploadedLogoImage] = useState();

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);


    const showLogo = async () => {
        try {
            const logoRef = collection(db, 'logo');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(logoRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setUploadedLogoImage(tmpArray);
        } catch (err) {
            console.log(err);

        }
    }

    const uploadLogo = async (image, currentLogoId = null) => {
        try {

            if (!image) {
                return;
            }
            const logoRef = collection(db, 'logo');

            const dbService = new UserDataService()


            if (currentLogoId) {
                const delData = await dbService.deleteData(db, 'logo', currentLogoId);
                console.log(delData)
            }

            // if (delData) {
            const imgRef = ref(storage, `/logoImage/${image.name}`);
            uploadBytes(imgRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {
                    console.log(url);
                    let image = { url }
                    const pushImage = await dbService.addData(image, logoRef);
                    console.log(pushImage);
                    showLogo()
                })
            })
            showLogo();
            setLogoImage(undefined)
            // }

        } catch (err) {
            console.log(err);

        }
    }

    useEffect(() => {
        showLogo();
    }, [])


    const onDrop = useCallback(acceptedFiles => {

        if (acceptedFiles?.length == 1) {

            setLogoImage(acceptedFiles[0])
            console.log(acceptedFiles)
        } else {
            alert("You can only upload one logo image.")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "image/*", onDrop })


    return (
        <div>
            <Helmet pageTitle="Admin" />

            {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}
            <div className="designer-portfolio-area bg_color--1">
                <div className="wrapper">

                    <div>
                        <h4 className='text-center'>Manage Logo</h4>

                        <div className='row p-4' style={{ border: "1px solid black" }}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>Drag & drop some Logo image here, or click to select Image</p>
                                }
                            </div>



                            {logoImage && (<>


                                <div className='text-center col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                                    <img height="100px" width="100px" src={URL.createObjectURL(logoImage)} alt="Logo image preview" />
                                </div>

                            </>)}
                        </div>


                        {/* <input accept='image/*' className='mt-3' type="file" onChange={(e) => setLogoImage(e.target.files[0])} name="" id="" /> */}

                        {uploadedLogoImage?.length <= 1 && (
                            <div>
                                {uploadedLogoImage?.map((logo, index) => {
                                    return (
                                        <>
                                            <img height="200px" width="200px" src={logo.url} alt="Logo Image" />

                                            <button className='btn mt-3' onClick={() => { uploadLogo(logoImage, logo.id) }}>Change Logo</button>
                                        </>
                                    )
                                })}

                                {uploadedLogoImage?.length == 0 && (

                                    <button className='mt-3' onClick={() => { uploadLogo(logoImage) }}>Change Logo</button>

                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Logo