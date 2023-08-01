import React, { useEffect, useState, useCallback } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone'

const Video = () => {

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);


    const [newvideo, setNewVideo] = useState("");
    const [uploadedVideoImage, setUploadedVideoImage] = useState();


    const showVideo = async () => {
        try {
            const videoRef = collection(db, 'video');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(videoRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setUploadedVideoImage(tmpArray);
        } catch (err) {
            console.log(err);

        }
    }


    const uploadVideo = async (video, currentVideoId = null) => {
        try {


            if (!video) {
                return;
            }

            if ((video?.size * 0.000001) <= 5) {

                const videoRef = collection(db, 'video');

                const dbService = new UserDataService()

                if (currentVideoId) {
                    const delData = await dbService.deleteData(db, 'video', currentVideoId);
                    console.log(delData)
                }

                // if (delData) {
                const imgRef = ref(storage, `/video/${video.name}`);
                uploadBytes(imgRef, video).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        console.log(url);
                        let video = { url }
                        const pushvideo = await dbService.addData(video, videoRef);
                        console.log(pushvideo);
                        showVideo()
                    })
                })
                showVideo()
                setNewVideo(undefined)
                // }

            }
            else {
                alert("Video size should not exceed 5mb.")
            }

        } catch (err) {
            console.log(err);

        }
    }

    const onDrop = useCallback(acceptedFiles => {

        if (acceptedFiles?.length == 1) {
            setNewVideo(acceptedFiles[0])
            console.log(acceptedFiles)
        }
        else {
            alert("You can only upload one video.")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "video/*", onDrop })


    useEffect(() => {
        showVideo()
    }, [])

    return (
        <div>
            <Helmet pageTitle="Admin" />

            {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}

            <div className="designer-portfolio-area bg_color--1">

                <div className="wrapper">

                    <h4 className='text-center'>Manage Video</h4>

                    <div className='row p-4' style={{ border: "1px solid black" }}>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <p>Drag & drop Video here, or click to select Video</p>
                            }
                        </div>

                        {newvideo && (

                            <div className='text-center col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>

                                <video height="70px" width="300px" src={URL.createObjectURL(newvideo)}></video>
                            </div>
                        )}

                    </div>

                    {/* <input accept='video/*' className='mt-3 mb-5' type="file" onChange={(e) => setNewVideo(e.target.files[0])} name="" id="" /> */}


                    {uploadedVideoImage?.length <= 1 && (
                        <div className='row'>
                            {uploadedVideoImage?.map((video, index) => {
                                return (
                                    <>
                                        <video className='m-2' autoPlay loop muted style={{ width: '50%', height: '50%' }}>
                                            {!isMobileDevice && <source id='mp4' src={video.url} type='video/mp4' />}

                                            {isMobileDevice && <source id='mp4' src={video.url} type='video/mp4' />}
                                        </video>
                                        <button className='btn mt-3' onClick={() => { uploadVideo(newvideo, video.id) }}>Change Video</button>
                                    </>
                                )
                            })}

                            {uploadedVideoImage?.length == 0 && (
                                <button className='mt-3' onClick={() => { uploadVideo(newvideo) }}>Change Video</button>

                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Video