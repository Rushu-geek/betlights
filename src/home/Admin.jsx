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

    const [bankNo2, setBankNo2] = useState("");
    const [ifsc2, setIfsc2] = useState("");
    const [holder2, setHolder2] = useState("");
    const [bankName2, setBankName2] = useState("");

    const [upi, setUpi] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [paymentDetailId, setPaymentDetailId] = useState("");

    const [singleImage, setSingleImage] = useState("");
    const [singleImage2, setSingleImage2] = useState("");

    const [sideBarState, setSideBarState] = useState("open");
    const [role, setRole] = useState("");

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
        let user = localStorage.getItem('currentUser');
        let role = JSON.parse(user).role;
        setRole(role);
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
            setBankNo2(doc.data().bankAccountNo2);
            setIfsc2(doc.data().ifscCode2);
            setHolder2(doc.data().accountHolder2);
            setBankName2(doc.data().bankName2);
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
                            accountHolder2: holder2,
                            bankAccountNo2: bankNo2,
                            bankName2: bankName2,
                            ifscCode2: ifsc2,
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

        }
        
        if (singleImage2) {
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
                            accountHolder2: holder2,
                            bankAccountNo2: bankNo2,
                            bankName2: bankName2,
                            ifscCode2: ifsc2,
                            upi: upi,
                            qrImage2: url,
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

        }

        if (!singleImage && !singleImage2) {
            let obj = {
                accountHolder: holder,
                bankAccountNo: bankNo,
                bankName: bankName,
                ifscCode: ifsc,
                accountHolder2: holder2,
                bankAccountNo2: bankNo2,
                bankName2: bankName2,
                ifscCode2: ifsc2,
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

    const handleImage2 = (e) => {
        e.preventDefault();
        let file;
        if (e.target.files && e.target.files.length > 0) {
            file = e.target.files[0];
            console.log(file);
            setSingleImage2(file);
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
                {/* <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}
                <div style={{}} className="designer-portfolio-area bg_color--1">
                    <div className="wrapper plr--70 plr_sm--30 plr_md--30">
                        {/* <ServiceOne payment={paymentReq} /> */}
                        <h2>Update Payment Details</h2>

                        <div style={{ overflow: "scroll", overflowX: "hidden", height: "87vh" }} className="row">
                            <div className={`${isMobileDevice ? 'col-12' : 'col-6'}`}>
                                {role == "sadmin" && <div>
                                    <h3>Bank 1</h3>
                                    <label>Bank Account Number</label>
                                    <input value={bankNo} onChange={(e) => setBankNo(e.target.value)} />
                                    <label>IFSC Code</label>
                                    <input value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                                    <label>Bank Account Holder Name</label>
                                    <input value={holder} onChange={(e) => setHolder(e.target.value)} />
                                    <label>Bank Name</label>
                                    <input value={bankName} onChange={(e) => setBankName(e.target.value)} />

                                    <h3 className='mt-3'>Bank 2</h3>
                                    <label>Bank Account Number</label>
                                    <input value={bankNo2} onChange={(e) => setBankNo2(e.target.value)} />
                                    <label>IFSC Code</label>
                                    <input value={ifsc2} onChange={(e) => setIfsc2(e.target.value)} />
                                    <label>Bank Account Holder Name</label>
                                    <input value={holder2} onChange={(e) => setHolder2(e.target.value)} />
                                    <label>Bank Name</label>
                                    <input value={bankName2} onChange={(e) => setBankName2(e.target.value)} />

                                    <label>UPI ID</label>
                                    <input value={upi} onChange={(e) => setUpi(e.target.value)} />

                                    <label>QR code 1</label>
                                    <input type='file' name='png' onChange={handleImage} />

                                    <label>QR code 2</label>
                                    <input type='file' name='png' onChange={handleImage2} />
                                </div>}
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