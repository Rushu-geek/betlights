import React, { useEffect, useState } from 'react';
import ScrollToTop from 'react-scroll-up';
import { FiCast, FiChevronUp, FiLayers, FiUsers } from "react-icons/fi";
import Helmet from "../component/common/Helmet";
import HeaderThree from "../component/header/HeaderThree";
import FooterTwo from "../component/footer/FooterTwo";
import ServiceList from "../elements/service/ServiceList";
import BlogContent from "../elements/blog/BlogContent";
import { Parallax } from 'react-parallax';
import Particles from 'react-tsparticles';
import CounterOne from '../elements/counters/CounterOne';
import UserDataService from '../services/userService';
import BrandOne from "../elements/BrandTwo";
import Slider from 'react-slick';
import { slideSlick } from '../page-demo/script';
import ModalVideo from 'react-modal-video';
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import { collection } from 'firebase/firestore';
import db from "../firebase";
import { Alert, Modal } from 'react-bootstrap';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const image1 = "/assets/images/bg/8.png";
const image2 = "/assets/images/bg/7.png";
const image3 = "/assets/images/bg/pm.png";

const ServiceListOne = [
    {
        icon: <FiCast />,
        title: 'Deposit Money',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiLayers />,
        title: 'Send Us Payment Screenshot',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiUsers />,
        title: 'Get Your ID',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
]

const PostList = BlogContent.slice(0, 3);

const PortfolioLanding = () => {

    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [carouselImages, setCarouselImages] = useState();
    let [siteVideo, setVideo] = useState()
    let [siteOffers, setOffers] = useState()
    // const [mobileCarouselImages, setMobileCarouselImages] = useState();
    const [webCarouselImages, setWebCarouselImages] = useState();
    const [instaLink, setInstaLink] = useState("");
    const [teleGramLink, setTelegramLink] = useState("");
    const [color1, setColor1] = useState("");
    const [color2, setColor2] = useState("");
    const [color3, setColor3] = useState("");

    const [showLogin, setShowLogin] = useState(false);

    const [message, setMessage] = useState({ display: false, msg: "", type: "" });

    const [logoImage, setLogoImage] = useState("");

    const [number, setNumber] = useState("");

    const [password, setPassword] = useState("");

    const getVideo = async () => {
        const videoRef = collection(db, 'video');
        const dbService = new UserDataService();

        const data = await dbService.getAllData(videoRef);
        let tmpArray = [];

        data.forEach((doc) => {
            let obj = doc.data();

            obj.id = doc.id;
            tmpArray.push(obj);
        });
        if (tmpArray?.length == 1) {
            console.log(tmpArray[0]?.url);
            setVideo(tmpArray[0]?.url);
        }
    }

    const getOffers = async () => {
        const offersRef = collection(db, 'offers');
        const dbService = new UserDataService();

        const data = await dbService.getAllData(offersRef);
        let tmpArray = [];

        data.forEach((doc) => {
            let obj = doc.data();

            obj.id = doc.id;
            tmpArray.push(obj);
        });
        console.log(tmpArray);
        setOffers(tmpArray);
    }

    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    /* Using test() method to search regexp in details
    it returns boolean value*/
    let isMobileDevice = regexp.test(details);

    const getCarouselImages = async () => {
        const carouselRef = collection(db, 'carousel');
        const dbService = new UserDataService();

        const data = await dbService.getAllData(carouselRef);
        let tmpArray = [];

        data.forEach((doc) => {
            let obj = doc.data();

            obj.id = doc.id;
            tmpArray.push(obj);
        });
        console.log(tmpArray);
        tmpArray.sort((a, b) => { return a?.date - b?.date });
        setCarouselImages(tmpArray);

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

            console.log("socialArray >>> ", tmpArray);

            setInstaLink(tmpArray[0]?.social?.insta);
            setTelegramLink(tmpArray[0]?.social?.tele);

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

    const getlogo = async () => {
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
            setLogoImage(tmpArray[0]?.url);
        }
    }


    useEffect(async () => {
        const service = new UserDataService();
        const data = await service.getAllPaymentDetails();
        data.forEach((doc) => {
            console.log(doc.data());
            setPhone1(doc.data().phone1);
            setPhone2(doc.data().phone2);
        })
        getCarouselImages();
        getVideo();
        getOffers();
        getSocialLinks();
        getColors();
        getlogo();
    }, []);

    // useEffect(() => {
    //     const webImages = carouselImages;
    //     // const mobileImages = carouselImages?.filter((image) => {
    //     //     return image.carouselType == 'mobile';
    //     // })
    //     console.log(webImages)
    //     setWebCarouselImages(carouselImages)
    //     // console.log(mobileImages)
    //     // setMobileCarouselImages(mobileImages)
    // }, [carouselImages])

    useEffect(() => {

        const styleElement = document.createElement('style');
        let styleSheet = null;
        document.head.appendChild(styleElement);
        styleSheet = styleElement.sheet;

        const keyframesStyle = `
        @keyframes color-change {
            from {
              background-color: ${color1};
            }
            to {
              background-color: ${color2};
            }
          }
      `;
        styleSheet.insertRule(keyframesStyle, styleSheet.cssRules.length);
    }, [color1, color2])

    const inputStyleNo = {
        color: "#000000",
        borderRadius: 0,
        borderColor: color1,
        backgroundColor: 'white',
    }

    const inputStyle = {
        color: "#000000",
        borderRadius: 0,
        borderColor: color1,
        backgroundColor: 'white',
    }

    const handleCloseLogin = () => {
        setShowLogin(false)
    }

    const handleShowLogin = () => {
        setShowLogin(true)
    }

    const onLogin = async (e) => {
        e.preventDefault();
        setMessage({ message: { display: false, msg: "", type: '' } })
        const loginData = {
            number: number,
            password: password
        }
        const service = new UserDataService();

        try {
            let dbUser = {};
            // console.log(loginData);
            let user = await service.queryUserByPhone(loginData.number);

            console.log(user.size);
            user.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                if (doc.id) {
                    dbUser = {
                        userId: doc.id,
                        email: doc.data().email,
                        fullName: doc.data()?.fullName,
                        password: doc.data().password,
                        number: doc.data()?.number,
                    }

                    if (loginData.password != dbUser.password) {
                        setMessage({ display: true, msg: "Invalid password", type: 'danger' })
                        return;
                    }

                    localStorage.setItem('currentUser', JSON.stringify({
                        userId: doc.id,
                        email: doc.data().email,
                        fullName: doc.data().fullName,
                        password: doc.data().password,
                        number: doc.data().number,
                    }))
                    setShowLogin(false)
                    if (dbUser.email == "admin@betlights.com") {
                        window.location.replace('/admin/');
                        localStorage.setItem('isAdmin', 'true');
                        return
                    }
                    window.location.replace('/dashboard')
                    // console.log("navigation");
                }
            });
            // console.log(">>>>>>", dbUser)
            if (!message.display)
                setMessage({ display: true, msg: "User Doesn't Exist!", type: 'danger' })

        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div className="active-light">
            <Helmet pageTitle="SVEXCH" />

            <HeaderThree phone={phone1} homeLink="/" logo="symbol-dark" color="color-black" />
            {/* Start Slider Area   */}

            <div id='home' className="slider-wrapper bg_color--5">
                {<div style={{ top: -60 }} className="slider-activation">
                    <Slider {...slideSlick}>
                        {carouselImages?.map((value, index) => (
                            // <div style={{ opacity: 1 }} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image ${value.bgImage}`} key={index}>
                            //     <div className="container">
                            //         <div className="row">
                            //             <div className="col-lg-12">
                            //                 <div className={``}>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </div>
                            // </div>
                            <>
                                <>
                                    <div key={`${index}`} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image`}>
                                        <img style={{ opacity: 1 }}
                                            src={value?.url} alt={`${index}`} />
                                    </div>
                                </>
                            </>
                        ))}
                    </Slider>
                </div>}

                {/* {isMobileDevice && <div style={{ top: -60 }} className="slider-activation">
                    <Slider {...slideSlick}>
                        {mobileCarouselImages?.map((value, index) => (
                            // <div style={{ opacity: 1 }} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image ${value.bgImage}`} key={index}>
                            //     <div className="container">
                            //         <div className="row">
                            //             <div className="col-lg-12">
                            //                 <div className={``}>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </div>
                            // </div>

                            <>
                                {value?.carouselType == 'mobile' && <>
                                    <div key={`${index}`} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image`}>
                                        <img style={{ opacity: 1 }}
                                            src={value?.url} alt={`${index}`} />
                                    </div>
                                </>}
                            </>

                        ))}
                    </Slider>
                </div>} */}

            </div>

            <div className="rn-featured-service-area bg_color--5">
                {/* <div className="container mt-5"> */}
                <div className="row text-center p-5">

                    <div className="container-fluid">


                        {siteOffers?.length > 0 && <div>

                            {siteOffers?.map((offer, index) => {
                                return (<>
                                    <img className='p-1 col-xl-6 col-md-6 col-lg-6 col-sm-12 col-12' src={offer?.url} alt="offer image" />
                                </>)
                            })}
                        </div>}

                        {/* <img onClick={() => {
                            window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi! I want to get a free ID for 222`, "_blank");
                        }} src='/assets/images/featured/1.png' style={{ cursor: 'pointer' }}/> */}
                    </div>

                    {/* {!isMobileDevice && <div className="col-6">
                        <img src='/assets/images/featured/2.png'/>
                    </div>} */}

                    {/* {isMobileDevice && <div className="col-12">
                        <img onClick={() => {
                            window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi! I want to get a free ID for 222`, "_blank");
                        }} src='/assets/images/featured/1.png' style={{ cursor: 'pointer' }} />
                    </div>}

                    {isMobileDevice && <div className="col-12 mt-3">
                        <img src='/assets/images/featured/2.png' />
                    </div>} */}

                </div>
                <div className="row" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{
                        backgroundColor: { color1 },
                        height: 90,
                        boxShadow: `0 0 20px 1px ${color1}`,
                        color: { color1 },
                        animation: `color-change 1s infinite`,
                    }} type="button" className="rj-btn mt-3 changeColor" onClick={() => {
                        window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                    }} >
                        <span style={{ fontWeight: 'bold', fontSize: 31 }}>Get ID</span>
                    </button>
                </div>
                {/* </div> */}
            </div>

            {/* <div className="slider-activation slider-creative-agency with-particles" id="home">
                <div className="bg_image bg_image--3">
                    <div className="slide slide-style-2 slider-paralax d-flex align-items-center justify-content-center">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="section-title text-center service-style--3 mb--30 mb_sm--0">
                                        <h2 style={{ color: '#18b0c8' }} className="title">Dealing Terms</h2>
                                        <p style={{ color: '#18b0c8' }}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row service-one-wrapper">
                                {ServiceListTwo.map((val, i) => (
                                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-3" key={i}>
                                        <a className="text-center">
                                            <div className="service service__style--27">
                                                <div className="icon">
                                                    {val.icon}
                                                </div>
                                                <div className="content">
                                                    <h3 className="title">{val.title}</h3>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}


            {/* End Slider Area   */}

            {/* Start Service Area  */}
            <div id="service" className="fix">
                <div className="service-area creative-service-wrapper ptb--120 bg_color--5" >
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center service-style--3 mb--30 mb_sm--0">
                                    <h2 style={{ color: color1 }} className="title">AVAILABLE SITES ON OUR PLATFORM</h2>
                                    <p style={{ color: color1 }}>Play on the leading websites and get unlimited rewards.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row creative-service">
                            <div className="col-lg-12">
                                <ServiceList color1={color1} item="9" column="col-lg-4 col-md-6 col-sm-6 col-12 text-left" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Service Area  */}

            <div id='deal' style={{ position: 'relative', }}>
                <div id='video-container' style={{ zIndex: -1 }}>

                    <video autoPlay loop muted style={{ width: '100%', height: '50%' }} src={siteVideo}>
                        {!isMobileDevice && <source id='mp4' src={siteVideo} type='video/mp4' />}

                        {isMobileDevice && <source id='mp4' src='/assets/images/preview/BET.mp4' type='video/mp4' />}
                    </video>
                </div>
            </div>

            {/* <div className="rn-blog-area pt--120 pb--80 bg_color--1">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-12">
                            <div className="section-title service-style--3 text-center">
                                <h2 style={{ color: color1 }} className="title">OUR TESTIMONIALS</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row mt--60">
                        {PostList.map((value, i) => (
                            <div onClick={() => {
                                if (i == 2) {
                                    setIsOpen(true);
                                } else {
                                    window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                                }
                            }} style={{ cursor: 'pointer' }} className="col-lg-4 col-md-6 col-sm-6 col-12" key={i}>
                                <div className="blog blog-style--1">
                                    <div className="thumbnail">
                                        <a>
                                            {i != 2 && <img className="w-100" src={`/assets/images/blog/blog-${value.images}.jpeg`} alt="Blog Images" />}
                                            {i == 2 && <img style={{ height: 530 }} className="w-100" src={`/assets/images/blog/blog-03.png`} alt="Blog Images" />}
                                        </a>
                                    </div>
                                    <div className="content">
                                        <a className="rn-btn text-white mb-5 mt-3" onClick={() => {
                                            window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                                        }} style={{ cursor: 'pointer', borderColor: 'white' }}>Read More</a>
                                        <div className="blog-btn">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <ModalVideo channel='youtube' isOpen={isOpen} videoId='Rftd_fwWO08' onClose={() => setIsOpen(false)} />

                    </div>
                </div>
            </div> */}

            {/* Start Brand Area  */}
            <div className="rn-brand-area pb--60 bg_color--1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <BrandOne showLogin={handleShowLogin} color1={color1} color2={color2} branstyle="branstyle--2" />
                        </div>
                    </div>
                </div>
            </div>
            {/* End Brand Area  */}

            <Modal centered show={showLogin} onHide={() => handleCloseLogin()}>
                <Modal.Header style={{
                    backgroundImage: `linear-gradient(${color2},${color1})`,
                    borderBottomColor: color1,
                    alignContent: 'center',
                    justifyContent: 'center'
                }} closeButton>
                    <div className="text-center ml-7">
                        <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 120 }} height={130} width={'auto'} src={logoImage} alt="Digital Agency" />
                    </div>
                </Modal.Header>
                <form onSubmit={(e) => onLogin(e)}>
                    <Modal.Body style={{ backgroundColor: color1, top: 0 }}>
                        {message.display && <Alert variant={message.type}>
                            {message.msg}
                        </Alert>}
                        <div className="rn-form-group" style={inputStyleNo}>
                            <PhoneInput
                                defaultCountry="IN"
                                value={number}
                                onChange={phone => setNumber(phone)}
                                style={inputStyleNo}
                                type="text"
                                name="Number"
                                placeholder="Mobile Number"
                                required
                            />
                        </div>
                        <div className="rn-form-group mt-3">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                        {/* <p className="mt-3" style={{ color: color3 }}>Don't Have an Account? <a style={{ color: color3, cursor: 'pointer' }} onClick={() => this.setState({ show: true, showLogin: false })}>Register</a> </p> */}
                        {/* <p className="mt-3" style={{ color: color3 }}> <a style={{ color: color3, cursor: 'pointer' }} onClick={() => this.setState({ showFwp: true, showLogin: false })}>Forgot Password</a> </p> */}
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: color1, borderTopColor: color1, alignContent: 'center', justifyContent: 'center' }}>
                        <button style={{ color: color3, borderColor: color3 }} type="submit" className="rn-btn">
                            <span>Login</span>
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>




            <Parallax className="rn-paralax-portfolio" bgImage={isMobileDevice ? image3 : image1} strength={200} >
                <div id="support" className="portfolio-area ptb--120" data-black-overlay="1">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="">

                                    {isMobileDevice && <a className='mb-3' style={{
                                        color: '#fff',
                                        lineHeight: 1.5,
                                        fontSize: 36,
                                        fontWeight: 'bold'
                                    }}>• Fastest ⚡ withdraw <br />• 100 % SAFE NO LEGAL DOCUMENTATION <br /> • 24/7 HELP LINE IN 20 LANGUAGES
                                    </a>}

                                    {!isMobileDevice && <h2 style={{
                                        color: '#fff',
                                        // textShadow: '#1C74CB 0 0 6px'
                                    }}>• Fastest ⚡ withdraw <br />• 100 % SAFE NO LEGAL DOCUMENTATION <br /> • 24/7 HELP LINE IN 20 LANGUAGES
                                    </h2>}

                                </div>
                                <br />
                                <br />
                                <div className="section-title service-style--2 mb--30 mb_sm--0">
                                    <button style={{
                                        backgroundColor: color1,
                                        color: 'white',
                                        width: 330
                                    }} type="button" className="rj-btn" onClick={() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                                    }} >
                                        <span style={{ fontWeight: 'bold', textShadow: '0 0 1px #000, 0 0 1px #000', fontSize: 21 }}>{phone1}</span>
                                    </button>
                                    <button style={{
                                        backgroundColor: color1,
                                        color: 'white',
                                        width: 330
                                    }} type="button" className={`rj-btn ${!isMobileDevice ? 'ml-3' : 'mt-3'}`} onClick={() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${phone2}&text=Hi I want to get ID!`, "_blank");
                                    }}>
                                        <span style={{ fontWeight: 'bold', textShadow: '0 0 1px #000, 0 0 1px #000', fontSize: 21 }}>{phone2}</span>
                                    </button>
                                    <br />
                                    <br />
                                    <br />
                                    <h3 style={{
                                        color: '#fff',
                                        textShadow: `${color1} 0 0 20px`,
                                        lineHeight: 1.5
                                    }}>We Deal Directly On WhatsApp</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Parallax >

            <div className="counterup-area ptb--120 bg_color--5">
                <div className="container">
                    <CounterOne color1={color1} color2={color2} />
                </div>
            </div>


            {/* <Parallax className="rn-paralax-portfolio" bgImage={isMobileDevice ? image3 : image2} strength={500} >
                <div id='support' className="portfolio-area ptb--120" data-black-overlay="1">
                    <div className="container">
                        <div className="row">

                            <div className="col-lg-9"
                                style={{ textAlign: 'left' }}>

                                <div className="section-title service-style--2 mb--30 mb_sm--0">
                                    <h1 style={{
                                        color: '#fff',
                                        // textShadow: '#18b0c8 0 0 6px'
                                    }}>Customer Support
                                    </h1>
                                    <h3 style={{
                                        color: '#fff',
                                        // textShadow: '#18b0c8 0 0 3px',
                                        lineHeight: 1.2
                                    }}>Get in touch with BetLights customer care <br /> for any Queries, Emergencies, Feedbacks or <br /> Complaints. We are here to help 24/7 <br /> with our online services.
                                    </h3>
                                </div>
                                <br />
                                <div className="section-title service-style--2 mb--30 mb_sm--0">
                                    <br />
                                    <br />
                                    <h3 style={{
                                        color: '#fff',
                                        // textShadow: '#ee076e 0 0 30px'
                                    }}>Customer Care No. For WhatsApp & Calling</h3>
                                    <br />
                                    <button style={{
                                        backgroundColor: '#18b0c8'
                                    }} type="button" className="rj-btn" onClick={() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                                    }} >
                                        <span style={{ fontWeight: 'bold', textShadow: '0 0 1px #000, 0 0 1px #000', fontSize: 21 }}>+916378934211</span>
                                    </button>

                                </div>
                            </div>
                            <div className="col-lg-3">

                            </div>
                        </div>
                    </div>
                </div>
            </Parallax > */}



            <div className="slider-activation slider-creative-agency with-particles" id="home">
                <Particles className="particle"
                    options={{
                        style: {
                            position: "absolute"
                        },
                        fpsLimit: 100,
                        interactivity: {
                            detectsOn: "canvas",
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                bubble: {
                                    distance: 100,
                                    duration: 2,
                                    opacity: 0.8,
                                    size: 10,
                                    color: color1,
                                },
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 100,
                                    duration: 0.4,
                                    color: color1,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: color1,
                            },
                            links: {
                                color: color1,
                                distance: 150,
                                enable: true,
                                opacity: 0.6,
                                width: 1,
                            },
                            collisions: {
                                enable: true,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outMode: "bounce",
                                random: false,
                                speed: 6,
                                straight: false,

                            },
                            number: {
                                density: {
                                    enable: true,
                                    value_area: 2000,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                random: true,
                                value: 5,
                            },
                        },
                        detectRetina: true,
                    }}
                />
                <div className="bg_image bg_image--3">
                    {/* {SlideList.map((value, index) => ( */}
                    <div className="slide slide-style-2 slider-paralax d-flex align-items-center justify-content-center">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="section-title text-center service-style--3 mb_sm--0">
                                        <h2 style={{ color: color1 }} className="title">How It Works</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row service-one-wrapper">
                                {ServiceListOne.map((val, i) => (
                                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-3" key={i}>
                                        <a className="text-center">
                                            <div className="service service__style--27">
                                                <div style={{ color: color1 }} className="icon">
                                                    {val.icon}
                                                </div>
                                                <div className="content">
                                                    <h3 style={{ color: color2 }} className="title">{val.title}</h3>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                    {/*  ))} */}
                </div>
            </div>

            <div className="row mb--30">
                {!isMobileDevice && <div className="col-12">

                    <div className="text-center">
                        <button onClick={() => {
                            window.open(`${teleGramLink}`, "_blank");
                        }} className='changeColor btn mr-5' id="myButton" style={{ height: 90, width: 600, fontWeight: 'bold', fontSize: 25, backgroundColor: { color1 }, animation: `color-change 1s infinite`, }}>JOIN US ON TELEGRAM <FaTelegram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>

                        <button onClick={() => {
                            window.open(`${instaLink}`, "_blank");
                        }} className='changeColor btn' id="myButton" style={{ height: 90, width: 600, fontWeight: 'bold', fontSize: 25, animation: `color-change 1s infinite`, backgroundColor: { color1 }, }}>JOIN US ON INSTAGRAM <FaInstagram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                    </div>

                </div>}

                {isMobileDevice && <div className="col-12 text-center">
                    <button onClick={() => {
                        window.open(`${teleGramLink}`, "_blank");
                    }} className='changeColor btn' id="myButton" style={{ height: 90, width: isMobileDevice ? 300 : 600, fontWeight: 'bold', fontSize: 25, animation: `color-change 1s infinite`, }}>JOIN US ON TELEGRAM <FaTelegram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                </div>}

                {isMobileDevice && <div className="col-12 text-center mt-3">
                    <button onClick={() => {
                        window.open(`${instaLink}`, "_blank");
                    }} className='changeColor btn' id="myButton" style={{ height: 90, width: isMobileDevice ? 300 : 600, fontWeight: 'bold', fontSize: 25, animation: `color-change 1s infinite`, }}>JOIN US ON INSTAGRAM <FaInstagram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                </div>}
            </div>
            {/* {alert(phone2)} */}
            <FooterTwo phone={phone2} />
            {/* Start Back To Top */}
            <div className="backto-top">
                <ScrollToTop showUnder={160}>
                    <FiChevronUp />
                </ScrollToTop>
            </div>
            {/* End Back To Top */}

        </div >
    )
}

export default PortfolioLanding;
