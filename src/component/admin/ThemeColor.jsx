import React, { useEffect, useState } from 'react'
import HeaderThree from '../header/HeaderThree';
import { Helmet } from 'react-helmet';
import UserDataService from '../../services/userService';
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChromePicker } from 'react-color'


import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";


const ThemeColor = () => {

    const [selectColor1, setSelectColor1] = useState("#18b0c8");
    const [selectColor2, setSelectColor2] = useState("#022c43");
    const [objId, setObjId] = useState("");

    // const [color1, setColor1] = useColor("hex", "#18b0c8");
    // const [color2, setColor2] = useColor("hex", "#022c43");

    const getColors = async () => {
        try {
            const colorRef = collection(db, 'colors');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(colorRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            setSelectColor1(tmpArray[0]?.color1);
            setSelectColor2(tmpArray[0]?.color2);
            setObjId(tmpArray[0]?.id)

        } catch (err) {
            console.log(err);
        }
    }

    const updateColor = async () => {
        try {
            if (!selectColor1 || !selectColor2) {
                alert("Please select both colors.")
                return;
            } else {

                let resObj =
                {
                    color1: selectColor1,
                    color2: selectColor2
                }

                const dbService = new UserDataService();
                const data = await dbService.updateData(db, 'colors', objId, resObj);
                console.log(data);
                getColors()

            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getColors();
    }, [])

    return (

        <div className=''>
            <Helmet pageTitle="Admin" />

            <div className="designer-portfolio-area bg_color--1">
                <div className="wrapper">

                    <div className='row'>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12'>
                            <h4 className='text-center'>Theme Color 1</h4>

                            <div className='p-1 m-1'>
                                <ChromePicker
                                    color={selectColor1}
                                    onChangeComplete={(color) => { setSelectColor1(color.hex) }}
                                    disableAlpha={true}
                                />
                            </div>
                        </div>

                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12'>
                            <h4 className='text-center'>Theme Color 2</h4>

                            <div className='p-1 m-1'>
                                <ChromePicker
                                    color={selectColor2}
                                    onChangeComplete={(color) => { setSelectColor2(color.hex) }}
                                    disableAlpha={true}
                                />
                            </div>
                        </div>

                    </div>

                    <button className='btn-outline-primary' onClick={updateColor}>Update</button>


                </div>
            </div>
        </div>

    )
}

export default ThemeColor