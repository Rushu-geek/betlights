import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
            // }

        } catch (err) {
            console.log(err);

        }
    }

    useEffect(() => {
        showVideo()
    }, [])

    return (
        <div>
            <Helmet pageTitle="Admin" />

            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />

            <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">

                <div className="wrapper plr--70 plr_sm--30 plr_md--30">


                    {uploadedVideoImage?.length <= 1 && (
                        <div>

                            {uploadedVideoImage?.map((video, index) => {
                                return (
                                    <>
                                        <video autoPlay loop muted style={{ width: '50%', height: '50%' }}>
                                            {!isMobileDevice && <source id='mp4' src={video.url} type='video/mp4' />}

                                            {isMobileDevice && <source id='mp4' src={video.url} type='video/mp4' />}
                                        </video>
                                        <button className='mt-3' onClick={() => { uploadVideo(newvideo, video.id) }}>Change Video</button>
                                    </>
                                )
                            })}

                            {uploadedVideoImage?.length == 0 && (
                                <button className='mt-3' onClick={() => { uploadVideo(newvideo) }}>Change Video</button>

                            )}
                            <input className='mt-3' type="file" onChange={(e) => setNewVideo(e.target.files[0])} name="" id="" />
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Video