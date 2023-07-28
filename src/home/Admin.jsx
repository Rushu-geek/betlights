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


function Admin() {

    const [paymentReq, setPaymentReq] = useState([]);
    const [bankNo, setBankNo] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [holder, setHolder] = useState("");
    const [bankName, setBankName] = useState("");
    const [upi, setUpi] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
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
            array.push(obj);
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
            setPhone1(doc.data().phone1);
            setPhone2(doc.data().phone2);
            setPaymentDetailId(doc.id)
        })
    }

    const updatePayment = async () => {

        console.log(singleImage);

        if (singleImage) {
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
                            qrImage: url,
                            phone1: phone1,
                            phone2: phone2
                        }

                        console.log("details >>>>> ", obj, paymentDetailId);
                        const service = new UserDataService();
                        const data = await service.updatePaymentDetaila(paymentDetailId, obj);

                        console.log("update >>>> ", data);
                        alert("Payment details updated!")
                    });
                }
            );

        } else {
            let obj = {
                accountHolder: holder,
                bankAccountNo: bankNo,
                bankName: bankName,
                ifscCode: ifsc,
                upi: upi,
                phone1: phone1,
                phone2: phone2
            }

            console.log("details >>>>> ", obj, paymentDetailId);
            const service = new UserDataService();
            const data = await service.updatePaymentDetaila(paymentDetailId, obj);

            console.log("update >>>> ", data);
            alert("Payment details updated!")

        }

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
            </div> */}

            {/* <div className={sideBarState == "open" ? 'col-xl-10 col-lg-10 col-md-10 col-sm-10 col-10' : 'col-xl-11 col-lg-11 col-md-11 col-sm-10 col-10'}> */}


                <div id='payInfo' className="active" style={{ backgroundColor: 'black' }}>
                    <Helmet pageTitle="Admin" />
                    <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />
                    <div style={{ marginTop: isMobileDevice ? 60 : '' }} className="designer-portfolio-area ptb--120 bg_color--1">
                        <div className="wrapper plr--70 plr_sm--30 plr_md--30">
                            {/* <ServiceOne payment={paymentReq} /> */}
                            <h2>Update Payment Details</h2>

                            <div style={{ overflow: "scroll", overflowX: "hidden", height: "50vh" }} className="row">
                                <div className={`${isMobileDevice ? 'col-12' : 'col-6'}`}>
                                    <label>Bank Account Number</label>
                                    <input value={bankNo} onChange={(e) => setBankNo(e.target.value)} />
                                    <label>IFSC Code</label>
                                    <input value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                                    <label>Bank Account Holder Name</label>
                                    <input value={holder} onChange={(e) => setHolder(e.target.value)} />
                                    <label>Bank Name</label>
                                    <input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                                    <label>UPI ID</label>
                                    <input value={upi} onChange={(e) => setUpi(e.target.value)} />

                                    <label>QR code</label>
                                    <input type='file' name='png' onChange={handleImage} />

                                    <label>Phone No 1</label>
                                    <input value={phone1} onChange={(e) => setPhone1(e.target.value)} />

                                    <label>Phone No 2</label>
                                    <input value={phone2} onChange={(e) => setPhone2(e.target.value)} />

                                    <Button className='mt-3' variant="outline-dark" onClick={() => updatePayment()} >
                                        Save
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            {/* </div> */}
        </div>
    )
}

export default Admin;