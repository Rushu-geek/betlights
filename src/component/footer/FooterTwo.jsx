import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { collection } from 'firebase/firestore';
import UserDataService from '../../services/userService';
import db from "../../firebase";


const FooterTwo = (props) => {

    const [show18, setShow18] = useState(false);
    const [showRest, setShowRest] = useState(false);
    const [logoImage, setLogoImage] = useState("");
    const [socialLinks, setSocialLinks] = useState([]);
    const [color1, setColor1] = useState("");
    const [color2, setColor2] = useState("");
    const [color3, setColor3] = useState("");

    const handleClose = () => {
        setShow18(false);
    }

    const handleCloseRest = () => {
        setShowRest(false);
    }

    const getLogo = async () => {
        const logoRef = collection(db, 'logo');
        const dbService = new UserDataService();

        const data = await dbService.getAllData(logoRef);
        let tmpArray = [];

        data.forEach((doc) => {
            let obj = doc.data();

            obj.id = doc.id;
            tmpArray.push(obj);
        });
        if (tmpArray?.length == 1) {
            console.log(tmpArray[0]?.url);
            setLogoImage(tmpArray[0]?.url)
        }
    }

    const getSocialLinks = async () => {
        try {
            // alert("in footer" + props.phone)
            const socialLinks = collection(db, 'social');
            const dbService = new UserDataService();
            const data = await dbService.getAllData(socialLinks);
            let tmpArray = [];
            data.forEach((doc) => {
                let obj = doc.data();
                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(props.phone);
            const SocialShare = [
                { Social: <FaFacebookF />, link: tmpArray[0].social.fb },
                { Social: <FaLinkedinIn />, link: tmpArray[0].social.lin },
                { Social: <FaInstagram />, link: tmpArray[0].social.insta },
                { Social: <FaWhatsapp />, link: `https://api.whatsapp.com/send?phone=${props.phone}&text=Hi I want to get ID!` }
            ];
            setSocialLinks(SocialShare)
        } catch (err) {
            console.log(err);

        }
    }

    const getColors = async () => {
        try {
            // alert("in footer" + props.phone)
            const colorsRef = collection(db, 'colors');
            const dbService = new UserDataService();
            const data = await dbService.getAllData(colorsRef);
            let tmpArray = [];
            data.forEach((doc) => {
                let obj = doc.data();
                obj.id = doc.id;
                tmpArray.push(obj);
            });

            console.log("Colors >>> ", tmpArray);

            setColor1(tmpArray[0]?.color1);
            setColor2(tmpArray[0]?.color2);
            setColor3(tmpArray[0]?.color3);

        } catch (err) {
            console.log(err);

        }
    }

    useEffect(() => {
        getLogo();
        getSocialLinks();
        getColors();
    }, [props.phone])

    return (
        <div style={{ backgroundImage: `linear-gradient(${color2},${color1})` }} className="footer-style-2 ptb--30">

            <Modal centered show={show18} onHide={() => handleClose()}>
                <ModalHeader className="text-center" closeLabel="close" style={{ backgroundColor: 'white', borderBottomColor: 'black', alignContent: 'center', justifyContent: 'center' }} closeButton>
                    {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">ghg</Modal.Title>} */}
                    <div className="text-center">
                        <p>It is illegal for anybody under the age of 18 to gamble.

                            Our site has strict policies and verification measures to prevent access to minors.

                            We encourage parents consider the use of internet use protection tools. You may find the following links useful.</p>
                    </div>
                </ModalHeader>

            </Modal>

            <Modal centered show={showRest} onHide={() => handleCloseRest()}>
                <ModalHeader className="text-center" closeLabel="close" style={{ backgroundColor: 'white', borderBottomColor: 'black', alignContent: 'center', justifyContent: 'center' }} closeButton>
                    {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">ghg</Modal.Title>} */}
                    <div className="text-center">
                        <p>Access to this site is restricted in certain geographical territories. Customers residing in the listed territories are prohibited from accessing the site and its services.

                            The restricted territories are:

                            Afghanistan, Algeria, Australia, Bosnia and Herzegovina, Bulgaria, Canada, China (People's Republic of), Cuba, Cyprus, Denmark, Ethiopia, France (and French territories), Germany, Gibraltar, Iran (Islamic Republic of), Iraq, Ireland, Italy, Korea (Democratic People's Republic of), Lao (People's Democratic Republic of), Macau, Malta, Myanmar, Netherlands, New Zealand, Poland, Portugal, Puerto Rico, Qatar, Romania, Singapore, Slovakia, South Africa, Spain, Sudan, Syrian Arab Republic, Taiwan, Turkey, Uganda, United Kingdom, United States (and U.S. Territories), Yemen.</p>
                    </div>
                </ModalHeader>

            </Modal>

            <div className="wrapper plr--50 plr_sm--20">
                <div className="row align-items-center justify-content-between">
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="inner">
                            <div className="logo text-center text-sm-left mb_sm--20">
                                <a href="/home-one">

                                    <img height={140} src={logoImage} alt="Logo images" />                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="inner text-center">
                            <ul className="social-share rn-lg-size d-flex justify-content-center liststyle">
                                {socialLinks.map((val, i) => (
                                    <li key={i}><a style={{ color: color3, borderColor: color3 }} href={`${val.link}`} target='_blank'>{val.Social}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="inner text-center mt-3">
                            <p onClick={() => setShow18(true)} style={{ cursor: 'pointer', color: color3, fontSize: 18 }} className="social-share rn-lg-size d-flex justify-content-center liststyle">
                                <img height={30} width={30} src="/assets/images/icons/plus18.webp"></img> --Underage gambling is an offence--
                            </p>
                            <p onClick={() => setShowRest(true)} style={{ cursor: 'pointer', color: color3, fontSize: 18 }} className="social-share rn-lg-size d-flex justify-content-center liststyle">
                                <img height={30} width={30} src="/assets/images/icons/restricted.webp"></img> --Restricted territories--
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                        <div className="inner text-lg-right text-center mt_md--20 mt_sm--20">
                            <div className="text">
                                <p style={{ color: color3 }}>Copyright © 2022 Vicky Club. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FooterTwo;