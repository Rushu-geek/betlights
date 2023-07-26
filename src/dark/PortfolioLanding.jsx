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

const image1 = "/assets/images/bg/8.png";
const image2 = "/assets/images/bg/7.png";
const image3 = "/assets/images/bg/pm.png";

const SlideList = [
    {
        textPosition: 'text-right',
        bgImage: 'bg_image--33',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-right',
        bgImage: 'bg_image--36',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-left',
        bgImage: 'bg_image--34',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-left',
        bgImage: 'bg_image--35',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--37',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--38',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--39',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },

]

const SlideListMob = [
    {
        textPosition: 'text-right',
        bgImage: 'bg_image--37',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-right',
        bgImage: 'bg_image--38',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-left',
        bgImage: 'bg_image--39',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    {
        textPosition: 'text-left',
        bgImage: 'bg_image--40',
        category: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: ''
    },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--37',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--38',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },
    // {
    //     textPosition: 'text-left',
    //     bgImage: 'bg_image--39',
    //     category: '',
    //     title: '',
    //     description: '',
    //     buttonText: '',
    //     buttonLink: ''
    // },

]

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

const ServiceListTwo = [
    {
        icon: <FiCast />,
        title: 'Min deposit 500',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiLayers />,
        title: 'Withdrawal in 15 min',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiUsers />,
        title: '24/7 365 days support',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
]

const starndardService = [
    {
        image: '01',
        title: 'Free ID for 555',
        description: 'I throw myself down among the tall grass by the stream',
    },
    {
        image: '02',
        title: 'Fastest withdraw in betting history',
        description: 'I throw myself down among the tall grass by the stream',
    }

]

const PostList = BlogContent.slice(0, 3);

const PortfolioLanding = () => {

    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [carouselImages, setCarouselImages] = useState();
    let [siteVideo, setVideo] = useState()

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
        setCarouselImages(tmpArray);

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
    }, []);

    return (
        <div className="active-light">
            <Helmet pageTitle="Betlights" />

            <HeaderThree phone={phone1} homeLink="/" logo="symbol-dark" color="color-black" />
            {/* Start Slider Area   */}

            <div id='home' className="slider-wrapper">
                {!isMobileDevice && <div style={{ top: 80 }} className="slider-activation">
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
                                {value?.carouselType == 'web' && <>
                                    <div key={`${index}`} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image`}>
                                        <img style={{ opacity: 1 }}
                                            src={value?.url} alt={`${index}`} />
                                    </div>
                                </>}
                            </>
                        ))}
                    </Slider>
                </div>}

                {isMobileDevice && <div style={{ top: 80 }} className="slider-activation">
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
                                {value?.carouselType == 'mobile' && <>
                                    <div key={`${index}`} className={`slide slide-style-2 slider-box-content without-overlay align-items-center bg_image`}>
                                        <img style={{ opacity: 1 }}
                                            src={value?.url} alt={`${index}`} />
                                    </div>
                                </>}
                            </>

                        ))}
                    </Slider>
                </div>}

            </div>

            <div className="rn-featured-service-area pt--140 bg_color--5">
                {/* <div className="container mt-5"> */}
                <div className="row text-center p-5">

                    {!isMobileDevice && <div className="col-6">
                        <img onClick={() => {
                            window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi! I want to get a free ID for 222`, "_blank");
                        }} src='/assets/images/featured/1.png' style={{ cursor: 'pointer' }}></img>
                    </div>}

                    {!isMobileDevice && <div className="col-6">
                        <img src='/assets/images/featured/2.png'></img>
                    </div>}

                    {isMobileDevice && <div className="col-12">
                        <img onClick={() => {
                            window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi! I want to get a free ID for 222`, "_blank");
                        }} src='/assets/images/featured/1.png' style={{ cursor: 'pointer' }}></img>
                    </div>}

                    {isMobileDevice && <div className="col-12 mt-3">
                        <img src='/assets/images/featured/2.png'></img>
                    </div>}

                </div>
                <div className="row" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{
                        backgroundColor: '#18b0c8',
                        height: 90,
                        boxShadow: '0 0 20px 1px #18b0c8'
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
                                    <h2 style={{ color: '#18b0c8' }} className="title">AVAILABLE SITES ON OUR PLATFORM</h2>
                                    <p style={{ color: '#18b0c8' }}>Play on the leading websites and get unlimited rewards.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row creative-service">
                            <div className="col-lg-12">
                                <ServiceList item="9" column="col-lg-4 col-md-6 col-sm-6 col-12 text-left" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Service Area  */}

            <div id='home1' style={{ position: 'relative', }}>
                <div id='video-container' style={{ zIndex: -1 }}>

                    <video autoPlay loop muted style={{ width: '100%', height: '50%' }} src={siteVideo}>
                        {!isMobileDevice && <source id='mp4' src={siteVideo} type='video/mp4' />}

                        {isMobileDevice && <source id='mp4' src='/assets/images/preview/BET.mp4' type='video/mp4' />}
                    </video>
                </div>
            </div>

            <div className="rn-blog-area pt--120 pb--80 bg_color--1">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-12">
                            <div className="section-title service-style--3 text-center">
                                <h2 style={{ color: '#18b0c8' }} className="title">OUR TESTIMONIALS</h2>
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
            </div>

            {/* Start Brand Area  */}
            <div className="rn-brand-area pb--60 bg_color--1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <BrandOne branstyle="branstyle--2" />
                        </div>
                    </div>
                </div>
            </div>
            {/* End Brand Area  */}




            <Parallax className="rn-paralax-portfolio" bgImage={isMobileDevice ? image3 : image1} strength={200} >
                <div id="deal" className="portfolio-area ptb--120" data-black-overlay="1">
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
                                        backgroundColor: '#18b0c8'
                                    }} type="button" className="rj-btn" onClick={() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=Hi I want to get ID!`, "_blank");
                                    }} >
                                        <span style={{ fontWeight: 'bold', textShadow: '0 0 1px #000, 0 0 1px #000', fontSize: 21 }}>+916378934211</span>
                                    </button>
                                    <button style={{
                                        backgroundColor: '#18b0c8'
                                    }} type="button" className={`rj-btn ${!isMobileDevice ? 'ml-3' : 'mt-3'}`} onClick={() => {
                                        window.open(`https://api.whatsapp.com/send?phone=${phone2}&text=Hi I want to get ID!`, "_blank");
                                    }}>
                                        <span style={{ fontWeight: 'bold', textShadow: '0 0 1px #000, 0 0 1px #000', fontSize: 21 }}>+447412202358</span>
                                    </button>
                                    <br />
                                    <br />
                                    <br />
                                    <h3 style={{
                                        color: '#fff',
                                        textShadow: '#18b0c8 0 0 20px',
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
                    <CounterOne />
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
                                    color: "#18b0c8",
                                },
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 100,
                                    duration: 0.4,
                                    color: "#18b0c8",
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#18b0c8",
                            },
                            links: {
                                color: "#18b0c8",
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
                                        <h2 style={{ color: '#18b0c8' }} className="title">How It Works</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row service-one-wrapper">
                                {ServiceListOne.map((val, i) => (
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
                    {/*  ))} */}
                </div>
            </div>

            <div className="row mb--30">
                {!isMobileDevice && <div className="col-12">

                    <div className="text-center">
                        <button className='changeColor btn mr-5' id="myButton" style={{ height: 90, width: 600, fontWeight: 'bold', fontSize: 25 }}>JOIN US ON TELEGRAM <FaTelegram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>

                        <button onClick={() => {
                            window.open(`https://www.instagram.com/betlights365?igshid=MzRlODBiNWFlZA==`, "_blank");
                        }} className='changeColor btn' id="myButton" style={{ height: 90, width: 600, fontWeight: 'bold', fontSize: 25 }}>JOIN US ON INSTAGRAM <FaInstagram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                    </div>

                </div>}

                {isMobileDevice && <div className="col-12 text-center">
                    <button className='changeColor btn' id="myButton" style={{ height: 90, width: isMobileDevice ? 300 : 600, fontWeight: 'bold', fontSize: 25 }}>JOIN US ON TELEGRAM <FaTelegram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                </div>}

                {isMobileDevice && <div className="col-12 text-center mt-3">
                    <button onClick={() => {
                        window.open(`https://www.instagram.com/betlights365?igshid=MzRlODBiNWFlZA==`, "_blank");
                    }} className='changeColor btn' id="myButton" style={{ height: 90, width: isMobileDevice ? 300 : 600, fontWeight: 'bold', fontSize: 25 }}>JOIN US ON INSTAGRAM <FaInstagram className='ml-2' size={`${isMobileDevice ? 35 : 40}`} fill="white" /></button>
                </div>}
            </div>

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
