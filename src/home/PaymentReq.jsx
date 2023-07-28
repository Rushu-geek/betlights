import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderThree from '../component/header/HeaderThree';
import TabThree from "../elements/tab/TabThree";
import UserDataService from '../services/userService';
import ServiceOne from '../elements/service/ServiceOne';
import { Button } from 'react-bootstrap';
import storage from '../firebaseStorage';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import SideBar from '../component/admin/SideBar';


function PaymentReq() {

    const [paymentReq, setPaymentReq] = useState([]);
    const [bankNo, setBankNo] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [holder, setHolder] = useState("");
    const [bankName, setBankName] = useState("");
    const [upi, setUpi] = useState("");
    const [paymentDetailId, setPaymentDetailId] = useState("");
    const [singleImage, setSingleImage] = useState("");
    const [sideBarState, setSideBarState] = useState("open");


    useEffect(async () => {
        console.log("get all payment requestss.");
        const service = new UserDataService();
        const data = await service.getAllPaymentRequests();
        let array = [];
        data.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            if (!obj.requestStatus) {
                array.push(obj);
            }
            console.log("req >>> ", doc.data());
        });
        setPaymentReq(array);
        getCurrentPayments();
    }, []);

    const getCurrentPayments = async () => {
        const service = new UserDataService();
        const data = await service.getAllPaymentDetails();
        data.forEach((doc) => {
            console.log(doc.data());
            setBankNo(doc.data().bankAccountNo);
            setIfsc(doc.data().ifscCode);
            setHolder(doc.data().accountHolder);
            setBankName(doc.data().bankName);
            setUpi(doc.data().upi);
            setPaymentDetailId(doc.id)
        })
    }

    const updatePayment = async () => {


        const storageRef = ref(storage, `/files/${singleImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, singleImage);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                console.log("snapshot >>>> ", snapshot)
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    console.log("url >>>> ", url);
                    let obj = {
                        accountHolder: holder,
                        bankAccountNo: bankNo,
                        bankName: bankName,
                        ifscCode: ifsc,
                        upi: upi,
                        qrImage: url
                    }

                    console.log("details >>>>> ", obj, paymentDetailId);
                    const service = new UserDataService();
                    const data = await service.updatePaymentDetaila(paymentDetailId, obj);

                    console.log("update >>>> ", data);
                    alert("Payment details updated!")
                });
            }
        );

    }

    const handleImage = (e) => {
        e.preventDefault();
        let file;
        if (e.target.files && e.target.files.length > 0) {
            file = e.target.files[0];
            console.log(file);
            setSingleImage(file);
        }
    }

    let details = navigator.userAgent;

    let regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    return (

        <div className='row'>
            {/* <div onClick={() => { sideBarState == "open" ? setSideBarState("close") : setSideBarState("open") }} className={sideBarState == "open" ? 'col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2' : 'col-xl-1 col-lg-1 col-md-1 col-sm-2 col-2'}>
            <SideBar />
        </div>

        <div className={sideBarState == "open" ? 'col-xl-10 col-lg-10 col-md-10 col-sm-10 col-10' : 'col-xl-11 col-lg-11 col-md-11 col-sm-10 col-10'}> */}


            <div id='payInfo' className="active" style={{ backgroundColor: 'black' }}>
                <Helmet pageTitle="PaymentReq" />
                {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}
                <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">
                    <div className="wrapper plr--70 plr_sm--30 plr_md--30">
                        <ServiceOne payment={paymentReq} />
                    </div>
                </div>
            </div>

        </div>
        // </div>
    )
}

export default PaymentReq;