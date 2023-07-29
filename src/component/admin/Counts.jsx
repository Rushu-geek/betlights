import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const Counts = () => {

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    const [countId, setCountId] = useState("");
    const [obj1, setObj1] = useState({ count: "", name: "" });
    const [obj2, setObj2] = useState({ count: "", name: "" });
    const [obj3, setObj3] = useState({ count: "", name: "" });


    const showCounts = async () => {
        try {
            const countsRef = collection(db, 'counter');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(countsRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setCountId(tmpArray[0]?.id)
            setObj1(tmpArray[0]?.counters[0]);
            setObj2(tmpArray[0]?.counters[1]);
            setObj3(tmpArray[0]?.counters[2]);
        } catch (err) {
            console.log(err);

        }
    }

    const updateSocialMediaLinks = async () => {
        try {
            if (!obj1?.name || !obj1?.count || !obj2?.name || !obj2?.count || !obj3?.name || !obj3?.count) {
                alert("No field can be empty.")
                return;
            } else {

                let resObj =
                {
                    id: countId,
                    counters: [obj1, obj2, obj3]
                }

                const dbService = new UserDataService();
                const data = await dbService.updateData(db, 'counter', countId, resObj);
                console.log(data);
                showCounts()

            }
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        showCounts();
    }, [])

    const onChangeObj1 = (e) => {

        const value = e.target.value;
        const name = e.target.name;
        setObj1(curr => {
            return {
                ...curr,
                [name]: value
            }
        })
    }

    const onChangeObj2 = (e) => {

        const value = e.target.value;
        const name = e.target.name;
        setObj2(curr => {
            return {
                ...curr,
                [name]: value
            }
        })
    }

    const onChangeObj3 = (e) => {

        const value = e.target.value;
        const name = e.target.name;
        setObj3(curr => {
            return {
                ...curr,
                [name]: value
            }
        })
    }

    return (

        <div className='container'>
            <Helmet pageTitle="Admin" />

            <div style={{}} className="designer-portfolio-area bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">

                    <h6 className='text-center'>Manage Data</h6>

                    <div className='p-3 m-2'>
                        <div style={{ width: "200%" }} className='row'>

                            <label htmlFor="Text" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Text</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" name='name' onChange={onChangeObj1} value={obj1?.name} />
                        </div>

                        <div style={{ width: "200%" }} className='row mt-2'>

                            <label htmlFor="Count" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Count</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="number" name='count' onChange={onChangeObj1} value={obj1?.count} />
                        </div>
                    </div>

                    <div className='p-3 m-2'>
                        <div style={{ width: "200%" }} className='row'>

                            <label htmlFor="Text" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Text</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" name='name' onChange={onChangeObj2} value={obj2?.name} />
                        </div>

                        <div style={{ width: "200%" }} className='row mt-2'>

                            <label htmlFor="Count" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Count</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="number" name='count' onChange={onChangeObj2} value={obj2?.count} />
                        </div>
                    </div>

                    <div className='p-3 m-2'>
                        <div style={{ width: "200%" }} className='row'>

                            <label htmlFor="Text" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Text</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="text" name='name' onChange={onChangeObj3} value={obj3?.name} />
                        </div>

                        <div style={{ width: "200%" }} className='row mt-2'>

                            <label htmlFor="Count" className='mt-2 col-lg-2 col-xl-2 col-md-2 col-sm-2 col-2'>Count</label>

                            <input className='col-lg-4 col-xl-4 col-md-4 col-sm-4 col-4' type="number" name='count' onChange={onChangeObj3} value={obj3?.count} />
                        </div>
                    </div>

                    <div style={{ width: "200%" }} className='row'>
                        <button className='m-3 btn-outline-primary' onClick={updateSocialMediaLinks}>Update</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Counts