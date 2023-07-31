import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink } from 'react-router-dom';

import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiX, FiMenu } from "react-icons/fi";
import Scrollspy from 'react-scrollspy'
import Modal from 'react-bootstrap/Modal';
import { Alert, Button } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import userService from "../../services/userService";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { sendEmail } from "../../email";
import axios from 'axios';
import { collection } from 'firebase/firestore';
import UserDataService from '../../services/userService';
import db from "../../firebase";


class HeaderThree extends Component {
    constructor(props) {
        super(props);
        this.menuTrigger = this.menuTrigger.bind(this);
        this.CLoseMenuTrigger = this.CLoseMenuTrigger.bind(this);
        this.stickyHeader = this.stickyHeader.bind(this);

        //  this.subMetuTrigger = this.subMetuTrigger.bind(this);
        window.addEventListener('load', function () {
            // console.log('All assets are loaded');
        })
        this.state = {
            show: false,
            showLogin: false,
            showOtp: false,
            showFwp: false,
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            number: "",
            message: { display: false, msg: "", type: "" },
            isLoggedIn: false,
            isAdmin: false,
            confirmObj: "",
            otp: "",
            phone1: "",
            phone2: "",
            logoImage: "",
            color1: "#18b0c8",
            color2: "#022c43"
        }
    }


    async componentDidMount() {


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

                this.setState({ color1: tmpArray[0]?.color1 })
                this.setState({ color2: tmpArray[0]?.color2 })

            } catch (err) {
                console.log(err);

            }
        }
        getColors();


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
                this.setState({ logoImage: tmpArray[0]?.url })
            }
        }

        getlogo()
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let admin = JSON.parse(localStorage.getItem('isAdmin'));
        // console.log('currentUser', window.location);
        currentUser ? this.setState({ isLoggedIn: true }) : this.setState({ isLoggedIn: false });
        admin ? this.setState({ isAdmin: true }) : this.setState({ isAdmin: false });
        const service = new userService();
        const data = await service.getAllPaymentRequests();
        // console.log("data >.> ", data);
        data.forEach((doc) => {
            // console.log(doc.data());
        })
        const data2 = await service.getAllPaymentDetails();

        data2.forEach((doc) => {
            // console.log(doc.data());
            this.setState({ phone1: doc.data().phone1, phone2: doc.data().phone2 })
        })
    }

    stickyHeader() { }

    resetState() {
        this.setState({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            number: "",
            message: { display: false, msg: "", type: "" },
        })
    }


    menuTrigger() {
        document.querySelector('.header-wrapper').classList.toggle('menu-open')
    }

    CLoseMenuTrigger() {
        document.querySelector('.header-wrapper').classList.remove('menu-open')
    }

    handleShow() {
        this.resetState();
        this.setState({ show: true })
    }

    handleShowLogin() {
        this.resetState();
        this.setState({ showLogin: true })
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleCloseLogin() {
        this.setState({ showLogin: false })
    }

    handleCloseFwp() {
        this.setState({ showFwp: false })
    }

    handleCloseOtp() {
        this.setState({ showOtp: false })
    }

    async onRegister(e) {
        e.preventDefault();
        if (this.state.password != this.state.confirmPassword) {
            return this.setState({ message: { display: true, msg: "Password & Confirm Password Should Be Equal!", type: 'danger' } })
        }
        try {
            const userData = {
                fullName: this.state.fullName,
                email: this.state.email.toLowerCase(),
                password: this.state.password,
                number: this.state.number
            }
            const service = new userService()

            const checkUser = service.queryUser(userData.email);

            if ((await checkUser).size > 0) {
                return this.setState({ message: { display: true, msg: "User already exist", type: 'danger' } })
            }

            const checkUserPhone = service.queryUserByPhone(userData.number);

            if ((await checkUserPhone).size > 0) {
                return this.setState({ message: { display: true, msg: "User already exist", type: 'danger' } })
            }

            // console.log(userData);

            const response = await this.setRecaptchaVerifier(userData.number);
            // console.log("response >>>> ", response);

            this.setState({ confirmObj: response, showOtp: true, show: false })
            // const service = new userService()

        } catch (e) {
            console.log(e);
        }
    }

    async onLogin(e) {
        e.preventDefault();
        this.setState({ message: { display: false, msg: "", type: '' } })
        const loginData = {
            number: this.state.number,
            password: this.state.password
        }
        const service = new userService();

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
                        this.setState({ message: { display: true, msg: "Invalid password", type: 'danger' } })
                        return;
                    }

                    localStorage.setItem('currentUser', JSON.stringify({
                        userId: doc.id,
                        email: doc.data().email,
                        fullName: doc.data().fullName,
                        password: doc.data().password,
                        number: doc.data().number,
                    }))
                    this.setState({ isLoggedIn: true, showLogin: false });
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
            if (!this.state.message.display)
                this.setState({ message: { display: true, msg: "User Doesn't Exist!", type: 'danger' } });
        } catch (e) {
            console.log(e);
        }

    }

    onLogout() {
        localStorage.clear();
        this.setState({ isLoggedIn: false })
        window.location.replace('/')
    }

    getIdNow() {
        // console.log("get id now");
        window.location.replace('/dashboard')
    }

    myIds() {
        window.location.replace('/dashboard?1')
    }

    setRecaptchaVerifier(number) {
        const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, number, recaptchaVerifier);
    }

    async verifyOtp(e) {
        e.preventDefault();
        try {
            await this.state.confirmObj.confirm(this.state.otp);
            const userData = {
                fullName: this.state.fullName,
                email: this.state.email,
                password: this.state.password,
                number: this.state.number
            }
            const service = new userService()
            const user = await service.addUser(userData);
            // console.log(user);
            this.setState({ message: { display: true, msg: "User created successfully!", type: 'success' } });
            setTimeout(() => {
                this.setState({ showOtp: false, showLogin: true, message: { display: false, msg: "", type: '' } });
            }, 1000);
        } catch (e) {
            console.log(e);
        }

    }

    async sendFwpEmail(e) {
        e.preventDefault();
        // console.log(this.state.email);

        const service = new userService();

        const userData = await service.queryUser(this.state.email);

        // console.log(userData);

        userData.forEach((doc) => {
            // console.log(doc.data());

            let data = {
                to: doc.data().email,
                subject: 'Reset Password Instructions',
                text: `Your Passoword is ${doc.data().password}`,
                from: 'betlightsweb@gmail.com'
            }

            axios.post('https://highschoolbabysitters.com/api/parent/sendmail', data)
                .then((data) => {
                    // console.log(data);
                    this.setState({ message: { display: true, msg: "Password sent to your email", type: 'success' } });
                })
                .catch((e) => console.log(e))
        })

    }

    render() {
        var elements = document.querySelectorAll('.has-droupdown > a');
        for (var i in elements) {
            if (elements.hasOwnProperty(i)) {
                elements[i].onclick = function () {
                    this.parentElement.querySelector('.submenu').classList.toggle("active");
                    this.classList.toggle("open");
                }
            }
        }
        const { logo, color = 'default-color' } = this.props;


        // /assets/images/logo/betNew.png
        let logoUrl = <img height={100} src={this.state.logoImage} alt="Digital Agency" />;

        let details = navigator.userAgent;

        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        const inputStyle = {
            color: '#000000',
            borderRadius: 0,
            borderColor: this.state.color1,
            backgroundColor: 'white',
        }

        const inputStyleNo = {
            color: '#000000',
            borderRadius: 0,
            borderColor: this.state.color1,
            backgroundColor: 'white',
        }

        const SocialShare = [
            // { Social: <FaFacebookF />, link: 'https://www.facebook.com/' },
            // { Social: <FaLinkedinIn />, link: 'https://www.linkedin.com/' },
            // { Social: <FaTwitter />, link: 'https://twitter.com/' },
            {
                Social: <FaWhatsapp size={`${isMobileDevice ? 35 : 40}`} fill="white" />, link: `https://api.whatsapp.com/send?phone=${this.state.phone2}&text=Hi I want to get ID!.`
            },
            { Social: <FaInstagram size={`${isMobileDevice ? 35 : 40}`} fill="white" />, link: 'https://www.instagram.com/betlights365?igshid=MzRlODBiNWFlZA==' }
        ]

        const dynamicScreensData = [{ title: 'Carousel', link: "/admin/carousel" }, { title: 'Offers', link: "/admin/offers" }, { title: 'Available Sites', link: "/admin/sites" }, { title: 'Video', link: "/admin/video" }, { title: 'Testimonials', link: "/admin/testimonials" }, { title: 'Counts', link: "/admin/counts" }, { title: 'Social Media', link: "/admin/carousel" }]

        return (
            <>
                {!isMobileDevice && <header style={{
                    backgroundColor: window.location.pathname != '/' ? this.state.color1 : this.state.color1,
                    top: -50, height: 140, backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                    borderBottom: '3px solid #42c2e2',
                    position: 'fixed',
                }} className={`header-area header-style-two header--fixed ${color}`}>

                    {/* {isMobileDevice && <a style={{ marginLeft: -80 }} href={this.props.homeLink}>
                    {logoUrl}
                </a>} */}

                    <div className="row">
                        <div className="col-3">
                            <div className="mt-5 mb-2">
                                <div style={{ padding: 0, margin: 0 }} className="">
                                    {!isMobileDevice && <a href={this.props.homeLink}>
                                        {logoUrl}
                                    </a>}
                                </div>

                            </div>
                        </div>
                        <div style={{ top: 50, left: -80 }} className="col-9">
                            <div className="header-wrapper">

                                {isMobileDevice && <div className="header-right" style={{ backgroundColor: 'ActiveCaption' }}>
                                    <div className="humberger-menu d-lg-none">
                                        <span onClick={this.menuTrigger} className="menutrigger text-white"><FiMenu color={this.state.color1} /></span>
                                    </div>
                                    {/* End Humberger Menu  */}
                                    <div className="close-menu d-block d-lg-none">
                                        <span onClick={this.CLoseMenuTrigger} className="closeTrigger"><FiX color={this.state.color1} /></span>
                                    </div>
                                </div>}

                                <nav className="mainmenunav d-lg-block ml--50">

                                    <Scrollspy className="mainmenu" items={['home', 'service', 'deal', 'support', 'payInfo', 'getId', 'myId']} currentClassName="is-current" offset={-200}>
                                        {!this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/#home">HOME</a></li>}
                                        {!this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/#service">SITES AVAILABLE</a></li>}
                                        {!this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/#deal">SERVICE</a></li>}
                                        {!this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/#support">SUPPORT</a></li>}
                                        {this.state.isLoggedIn && !this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/dashboard">GET ID</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/admin">PAYMENT INFO</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/admin/users">USERLIST</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/admin/req">APPROVE REQUEST</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }} href="/admin/password">CHANGE PASSWORD</a></li>}


                                        {this.state.isLoggedIn && this.state.isAdmin && <li>

                                            <div style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'white', fontWeight: 'bold' }}>

                                                <Dropdown>
                                                    <Dropdown.Toggle variant="transparent">
                                                        <span style={{ color: "white" }}>  Site Settings </span>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        {
                                                            dynamicScreensData.map((elem) => {
                                                                return (
                                                                    <>
                                                                        <Dropdown.Item>

                                                                            <NavLink to={elem.link}>
                                                                                {elem.title}
                                                                            </NavLink>
                                                                        </Dropdown.Item>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </li>}




                                        {this.state.isLoggedIn && isMobileDevice && <div className="header-btn">
                                            <button onClick={() => this.onLogout()} type="button" className="rn-btn mt-3">
                                                <span>LOGOUT</span>
                                            </button>
                                        </div>}

                                        {!this.state.isLoggedIn && isMobileDevice && <div className="header-btn mt-3">
                                            <button onClick={() => this.handleShowLogin()} type="button" className="rn-btn">
                                                <span>LOGIN</span>
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button onClick={() => this.handleShow()} type="button" className="rn-btn">
                                                <span>REGISTER</span>
                                            </button>
                                        </div>}

                                    </Scrollspy>

                                </nav>

                                <Modal centered show={this.state.show} onHide={() => this.handleClose()}>
                                    <ModalHeader className="text-center" closeLabel="close" style={{ alignContent: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`, borderBottomColor: this.state.color1 }} closeButton>
                                        {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">ghg</Modal.Title>} */}
                                        <div className="text-center" style={{ paddingLeft: !isMobileDevice ? 120 : 70, backgroundColor: '' }}>
                                            <img style={{ justifyContent: "center", alignItems: "center" }} height={130} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </ModalHeader>
                                    <form onSubmit={(e) => this.onRegister(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.fullName}
                                                    onChange={(e) => this.setState({ fullName: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="fullname"
                                                    placeholder="Full Name"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.password}
                                                    onChange={(e) => this.setState({ password: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.confirmPassword}
                                                    className="mb-4"
                                                    onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                                                    style={inputStyle}
                                                    type="password"
                                                    name="Confirm Password"
                                                    placeholder="Confirm Password"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <PhoneInput
                                                    defaultCountry="IN"
                                                    value={this.state.number}
                                                    onChange={phone => this.setState({ number: phone })}
                                                    style={inputStyle}
                                                    type="text"
                                                    name="Number"
                                                    placeholder="Mobile Number"
                                                    required
                                                />
                                            </div>
                                            <div id="recaptcha-container" />
                                            <p className="mt-3" style={{ color: 'black' }}>Already Have an Account? <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ show: false, showLogin: true })}>Login</a></p>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Register</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showLogin} onHide={() => this.handleCloseLogin()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>} */}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 120 }} height={130} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.onLogin(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group" style={inputStyleNo}>
                                                <PhoneInput
                                                    defaultCountry="IN"
                                                    value={this.state.number}
                                                    onChange={phone => this.setState({ number: phone })}
                                                    style={inputStyleNo}
                                                    type="text"
                                                    name="Number"
                                                    placeholder="Mobile Number"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group mt-3">
                                                <input
                                                    value={this.state.password}
                                                    onChange={(e) => this.setState({ password: e.target.value })}
                                                    style={inputStyle}
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>
                                            <p className="mt-3" style={{ color: 'black' }}>Don't Have an Account? <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ show: true, showLogin: false })}>Register</a> </p>
                                            <p className="mt-3" style={{ color: 'white' }}> <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ showFwp: true, showLogin: false })}>Forgot Password</a> </p>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Login</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showOtp} onHide={() => this.handleCloseOtp()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 0 }} height={150} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.verifyOtp(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.otp}
                                                    onChange={(e) => this.setState({ otp: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="otp"
                                                    placeholder="OTP"
                                                />
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Verify Otp</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showFwp} onHide={() => this.handleCloseFwp()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 0 }} height={150} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.sendFwpEmail(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="otp"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Send password to registered email</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                {!isMobileDevice && <div className="header-right">
                                    {this.state.isLoggedIn && !this.state.isAdmin && <Button variant="outline-dark" style={{
                                        // boxShadow: '0 0 20px 1px #ee076e',
                                        color: '#fff',
                                        marginRight: 50
                                    }} onClick={() => this.myIds()} >
                                        My IDs
                                    </Button>}
                                    {this.state.isLoggedIn && !this.state.isAdmin && <Button variant="outline-dark" style={{
                                        // boxShadow: '0 0 20px 1px #ee076e',
                                        color: '#fff'
                                    }} onClick={() => this.getIdNow()} >
                                        Get Your ID Now!
                                    </Button>}
                                    {!this.state.isAdmin && <div className="social-share-inner ml-5">
                                        <ul className="social-share social-style--2 color-black d-flex justify-content-start liststyle">
                                            {SocialShare.map((val, i) => (
                                                <li onClick={() => {
                                                    window.open(`${val.link}`, "_blank");
                                                }} key={i}><a className="mr-3" style={{ color: '#ffffff', cursor: 'pointer', opacity: 1 }} target='_blank'>{val.Social}</a></li>
                                            ))}
                                        </ul>
                                    </div>}
                                    {!this.state.isLoggedIn && <div className="header-btn">
                                        <button style={{ borderColor: 'white', color: 'white' }} onClick={() => this.handleShowLogin()} type="button" className="rn-btn">
                                            <span>Login</span>
                                        </button>
                                        &nbsp;&nbsp;&nbsp;
                                        <button style={{ borderColor: 'white', color: 'white' }} onClick={() => this.handleShow()} type="button" className="rn-btn">
                                            <span>Register</span>
                                        </button>
                                    </div>}
                                    {this.state.isLoggedIn && <div className="header-btn">
                                        <button style={{ borderColor: 'white', color: 'white' }} onClick={() => this.onLogout()} type="button" className="rn-btn">
                                            <span>Logout</span>
                                        </button>
                                    </div>}

                                    {/* Start Humberger Menu  */}
                                    <div className="humberger-menu d-block d-lg-none pl--20">
                                        <span onClick={this.menuTrigger} className="menutrigger text-white"><FiMenu /></span>
                                    </div>
                                    {/* End Humberger Menu  */}
                                    <div className="close-menu d-block d-lg-none">
                                        <span onClick={this.CLoseMenuTrigger} className="closeTrigger"><FiX /></span>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>



                </header>}


                {isMobileDevice && <header style={{
                    backgroundColor: window.location.pathname != '/' ? this.state.color1 : this.state.color1,
                    top: -10, height: 100, backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                    borderBottom: '4px solid #42c2e2',
                    position: 'fixed',
                }} className={`header-area header-style-two header--fixed ${color}`}>

                    <div className="row">
                        <div className="col-6">
                            {isMobileDevice && <a style={{ marginLeft: -30 }} href={this.props.homeLink}>
                                {logoUrl}

                            </a>}

                        </div>

                        <div className="col-6">

                            <div className="header-wrapper">



                                {isMobileDevice && <div className="header-right">

                                    {!this.state.isAdmin && <div className="">
                                        {SocialShare.map((val, i) => (
                                            <a className="mr-3" onClick={() => {
                                                window.open(`${val.link}`, "_blank");
                                            }} style={{ color: '#ffffff', cursor: 'pointer', opacity: 1 }}>{val.Social}</a>
                                        ))}
                                    </div>}


                                    <div className="humberger-menu d-lg-none">
                                        <span onClick={this.menuTrigger} className="menutrigger text-white"><FiMenu color={this.state.color1} /></span>
                                    </div>
                                    {/* End Humberger Menu  */}
                                    <div className="close-menu d-block d-lg-none">
                                        <span onClick={this.CLoseMenuTrigger} className="closeTrigger"><FiX color={this.state.color1} /></span>
                                    </div>
                                </div>}

                                <nav className="mainmenunav d-lg-block ml--50">

                                    <Scrollspy className="mainmenu" items={['home', 'service', 'deal', 'support', 'payInfo', 'getId', 'myId']} currentClassName="is-current" offset={-200}>
                                        {!this.state.isAdmin && <li><a onClick={this.CLoseMenuTrigger} style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/#home">HOME</a></li>}
                                        {!this.state.isAdmin && <li><a onClick={this.CLoseMenuTrigger} style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/#service">SITES AVAILABLE</a></li>}
                                        {!this.state.isAdmin && <li><a onClick={this.CLoseMenuTrigger} style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/#deal">SERVICE</a></li>}
                                        {!this.state.isAdmin && <li><a onClick={this.CLoseMenuTrigger} style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/#support">SUPPORT</a></li>}
                                        {this.state.isLoggedIn && !this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/dashboard">GET ID</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/admin">PAYMENT INFO</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/admin/users">USERLIST</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/admin/req">APPROVE REQUEST</a></li>}
                                        {this.state.isLoggedIn && this.state.isAdmin && <li><a style={{ color: (window.location.pathname != '/' && isMobileDevice) ? 'black' : 'black', fontWeight: 'bold' }} href="/admin/password">CHANGE PASSWORD</a></li>}

                                        {this.state.isLoggedIn && isMobileDevice && <div className="header-btn">
                                            <button onClick={() => this.onLogout()} type="button" className="rn-btn mt-3">
                                                <span>LOGOUT</span>
                                            </button>
                                        </div>}

                                        {!this.state.isLoggedIn && isMobileDevice && <div className="header-btn mt-3">
                                            <button onClick={() => this.handleShowLogin()} type="button" className="rn-btn">
                                                <span>LOGIN</span>
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button onClick={() => this.handleShow()} type="button" className="rn-btn">
                                                <span>REGISTER</span>
                                            </button>
                                        </div>}

                                    </Scrollspy>

                                </nav>

                                <Modal centered show={this.state.show} onHide={() => this.handleClose()}>
                                    <ModalHeader className="text-center" closeLabel="close" style={{ alignContent: 'center', justifyContent: 'center', backgroundImage:     `linear-gradient(${this.state.color2},${this.state.color1})`, borderBottomColor: this.state.color1 }} closeButton>
                                        {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">ghg</Modal.Title>} */}
                                        <div className="text-center" style={{ paddingLeft: !isMobileDevice ? 120 : 70, backgroundColor: '' }}>
                                            <img style={{ justifyContent: "center", alignItems: "center" }} height={130} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </ModalHeader>
                                    <form onSubmit={(e) => this.onRegister(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.fullName}
                                                    onChange={(e) => this.setState({ fullName: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="fullname"
                                                    placeholder="Full Name"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.password}
                                                    onChange={(e) => this.setState({ password: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.confirmPassword}
                                                    className="mb-4"
                                                    onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                                                    style={inputStyle}
                                                    type="password"
                                                    name="Confirm Password"
                                                    placeholder="Confirm Password"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group">
                                                <PhoneInput
                                                    defaultCountry="IN"
                                                    value={this.state.number}
                                                    onChange={phone => this.setState({ number: phone })}
                                                    style={inputStyle}
                                                    type="text"
                                                    name="Number"
                                                    placeholder="Mobile Number"
                                                    required
                                                />
                                            </div>
                                            <div id="recaptcha-container" />
                                            <p className="mt-3" style={{ color: 'black' }}>Already Have an Account? <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ show: false, showLogin: true })}>Login</a></p>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Register</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showLogin} onHide={() => this.handleCloseLogin()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {/* {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>} */}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 120 }} height={130} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.onLogin(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group" style={inputStyleNo}>
                                                <PhoneInput
                                                    defaultCountry="IN"
                                                    value={this.state.number}
                                                    onChange={phone => this.setState({ number: phone })}
                                                    style={inputStyleNo}
                                                    type="text"
                                                    name="Number"
                                                    placeholder="Mobile Number"
                                                    required
                                                />
                                            </div>
                                            <div className="rn-form-group mt-3">
                                                <input
                                                    value={this.state.password}
                                                    onChange={(e) => this.setState({ password: e.target.value })}
                                                    style={inputStyle}
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>
                                            <p className="mt-3" style={{ color: 'black' }}>Don't Have an Account? <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ show: true, showLogin: false })}>Register</a> </p>
                                            <p className="mt-3" style={{ color: 'white' }}> <a style={{ color: '#fff', cursor: 'pointer' }} onClick={() => this.setState({ showFwp: true, showLogin: false })}>Forgot Password</a> </p>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Login</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showOtp} onHide={() => this.handleCloseOtp()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 0 }} height={150} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.verifyOtp(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.otp}
                                                    onChange={(e) => this.setState({ otp: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="otp"
                                                    placeholder="OTP"
                                                />
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Verify Otp</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>

                                <Modal centered show={this.state.showFwp} onHide={() => this.handleCloseFwp()}>
                                    <Modal.Header style={{
                                        backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})`,
                                        borderBottomColor: this.state.color1,
                                        alignContent: 'center',
                                        justifyContent: 'center'
                                    }} closeButton>
                                        {!isMobileDevice && <Modal.Title style={{ color: 'transparent' }} className="text-center">Login hvvh</Modal.Title>}
                                        <div className="text-center ml-7">
                                            <img style={{ justifyContent: "center", alignItems: "center", marginLeft: isMobileDevice ? 60 : 0 }} height={150} width={'auto'} src={this.state.logoImage} alt="Digital Agency" />
                                        </div>
                                    </Modal.Header>
                                    <form onSubmit={(e) => this.sendFwpEmail(e)}>
                                        <Modal.Body style={{ backgroundColor: this.state.color1, top: 0 }}>
                                            {this.state.message.display && <Alert variant={this.state.message.type}>
                                                {this.state.message.msg}
                                            </Alert>}
                                            <div className="rn-form-group">
                                                <input
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    style={inputStyle}
                                                    className="mb-4"
                                                    type="text"
                                                    name="otp"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer style={{ backgroundColor: this.state.color1, borderTopColor: this.state.color1, alignContent: 'center', justifyContent: 'center' }}>
                                            <button style={{ color: 'white', borderColor: 'white' }} type="submit" className="rn-btn">
                                                <span>Send password to registered email</span>
                                            </button>
                                        </Modal.Footer>
                                    </form>
                                </Modal>
                            </div>
                        </div>
                    </div>


                </header>}
            </>
        )
    }

}
export default HeaderThree;