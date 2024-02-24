import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { FaWhatsapp, FaWhatsappSquare } from "react-icons/fa";
import { FiCast, FiLayers, FiUsers, FiMonitor } from "react-icons/fi";
import image from '../../../public/assets/images/pattern-1.png'
import UserDataService from "../../services/userService";
import storage from "../../firebaseStorage";

class ServiceTwo extends Component {

    constructor(props) {
        super()
        this.state = {
            show: false,
            selectedIdName: "",
            selectedIdUrl: "",
            userName: "",
            amount: "",
            showPaymentModal: false,
            bankNo: "",
            ifsc: "",
            bankHolder: "",
            bankName: "",
            upi: "",
            qrImage: "",
            userNameFlag: false,
            phone1: ""
        }
        console.log(props);
    }

    async componentDidMount() {
        const service = new UserDataService();
        const data = await service.getAllPaymentDetails();
        data.forEach((doc) => {
            console.log(doc.data());
            this.setState({
                bankNo: doc.data().bankAccountNo,
                ifsc: doc.data().ifscCode,
                bankHolder: doc.data().accountHolder,
                bankName: doc.data().bankName,
                upi: doc.data().upi,
                qrImage: doc.data().qrImage,
                phone1: doc.data().phone1
            })
        })
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleClosePaymentModal() {
        this.setState({ showPaymentModal: false })
    }

    onCreateId(idName, userName, websiteUrl) {
        this.setState({ show: true, selectedIdName: idName, userName: userName, amount: "", userNameFlag: userName ? true : false, selectedIdUrl: websiteUrl})
    }

    sendIdDetails() {
        console.log(this.state);
        this.setState({ show: false, showPaymentModal: true })
    }

    async sendDetailsToWhatsapp() {
        console.log(this.state);
        window.open(`https://api.whatsapp.com/send?phone=${this.state.phone1}&text=Website: ${this.state.selectedIdName} User Name: ${this.state.userName} Amount: ${this.state.amount}`, "_blank");
        const paymentReq = {
            requestStatus: false,
            userName: this.state.userName,
            websiteId: this.state.selectedIdName,
            websiteUrl: this.state.selectedIdUrl,
            number: JSON.parse(localStorage.getItem('currentUser')).number,
            userId: JSON.parse(localStorage.getItem('currentUser')).userId
        }
        const service = new UserDataService()
        const request = await service.addPaymentReq(paymentReq);
        console.log("request >>> ", request);
        this.setState({ message: { display: true, msg: "Please wait we will verify your details and get back to you. You can whatsapp us at +916378934211", type: 'success' } })
    }

    render() {

        const pStyle = {
            fontSize: 15,
        }

        let details = navigator.userAgent;

        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-12 col-12 mt_md--50">
                        {this.props?.myIds && <div className="row service-one-wrapper">
                            {this.props?.myIds?.map((val, i) => (
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={i}>
                                    <a>
                                        <div style={{ backgroundColor: '#18b0c8', backgroundImage: `linear-gradient(${this.props.color2},${this.props.color1})` }} className="service mb-4 service__style--2">
                                            <div className="icon">
                                                <img src={`${val.websiteUrl}`} />                                             </div>
                                            <div className="content">
                                                <h3 style={{ color: 'white' }} className="title">{val.websiteId}</h3>
                                                <p style={{ color: 'white' }}>{val.userName}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>}
                        {this.props?.allIds && <div className="row service-one-wrapper">
                            {this.props?.allIds?.map((val, i) => (
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={i}>
                                    <a>
                                        <div style={{ height: 320, backgroundImage: `linear-gradient(${this.props.color2},${this.props.color1})` }} className="service mb-4 service__style--27">
                                            <div style={{height: 140}} className={`${i != 1 ? 'mb-3' : ''} text-center`}>
                                                <img style={{ height: 100}} src={val.url} />
                                            </div>
                                            <div className="content text-center">
                                                <h3 style={{ color: 'white', height: val.name == 'SkyExch' ? 40 : 0 }} className="title">{val.name}</h3>
                                                {val.userName && <p style={{ color: 'white' }}>UserName: {val.userName}</p>}
                                                {isMobileDevice && <button style={{ lineHeight: 3, color: this.props.color1, borderRadius: 6, borderColor: '#fff', color: 'white' }} onClick={() => this.onCreateId(val.websiteId, val.userName, val.url)} type="button" className={`${i != 1 ? 'mt-4' : 'mt-4'}`}>
                                                    {!val.userName && <span style={{ lineHeight: 0 }}>CREATE ID AND DEPOSIT MONEY</span>}
                                                    {val.userName && <span>Deposit money</span>}
                                                </button>}

                                                {!isMobileDevice && <button style={{color: this.props.color3, borderColor: this.props.color3, bottom: 0}}  onClick={() => this.onCreateId(val.name, val.userName, val.url)} type="button" className={`rn-btn ${i != 1 ? 'mt-4' : 'mt-4'}`}>
                                                    {!val.userName && <span style={{ lineHeight: 0 }}>Create ID and deposit money</span>}
                                                    {val.userName && <span>Deposit money</span>}
                                                </button>}
                                            </div>

                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>}
                    </div>
                </div>

                <Modal centered show={this.state.show} onHide={() => this.handleClose()}>
                    <Modal.Header style={{ height: 60 }} closeButton>
                        <Modal.Title className="text-center">Add details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '' }}>

                        <div className="rn-form-group">
                            <input
                                value={this.state.userName}
                                onChange={(e) => this.setState({ userName: e.target.value })}
                                style={{ borderRadius: 10 }}
                                className="mb-4"
                                disabled={this.state.userNameFlag}
                                type="text"
                                name="email"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="rn-form-group">
                            <input
                                value={this.state.amount}
                                onChange={(e) => this.setState({ amount: e.target.value })}
                                style={{ borderRadius: 10 }}
                                type="number"
                                name="amount"
                                placeholder="Deposit Amount"
                                required
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '', borderTopColor: '', alignContent: 'center', justifyContent: 'center' }}>
                        <button onClick={() => this.sendIdDetails()} type="button" className="rn-btn">
                            <span>Send</span>
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={this.state.showPaymentModal} onHide={() => this.handleClosePaymentModal()}>
                    <Modal.Header style={{ height: 60 }} closeButton>
                        <Modal.Title className="text-center">{this.state.selectedIdName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ lineHeight: 1.5 }}>

                        <small>Note: You can transfer money by scanning QR or UPI or Bank Transfer. </small>
                        <small>After payment you can send screenshot on our whatsapp number</small>
                        <hr />
                        <div className="row mb-0">
                            <div className="col-12">
                                <h5 className="mb-1">Selected Details</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <p className="mb-0" style={pStyle}>Username : <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.userName}</span></p>
                                <p className="mb-0" style={pStyle}>&nbsp;&nbsp;Amount &nbsp;&nbsp;: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.amount}</span></p>
                            </div>

                        </div>
                        <hr />
                        <div className="row mb-0">
                            <div className="col-12">
                                <h5 className="mb-1 mt-2">Payment Details</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 text-center">
                                <p className="mb-0" style={pStyle}> <span style={{ fontWeight: 500 }}>Scan QR to do payment</span> </p>
                                <img height={150} width={150} src={this.state.qrImage} />
                                <p className="mb-0" style={pStyle}>OR</p>
                                <p className="mb-0" style={pStyle}>UPI: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.upi}</span></p>
                            </div>
                            <div className="col-6">
                                <p className="mb-0" style={pStyle}>A/C No: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.bankNo}</span></p>
                                <p className="mb-0" style={pStyle}>IFSC: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.ifsc}</span></p>
                                <p className="mb-0" style={pStyle}>Name: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.bankHolder}</span></p>
                                <p className="mb-0" style={pStyle}>Bank Name: <span style={{ fontWeight: 500, color: this.props.color2 }}>{this.state.bankName}</span></p>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-6">
                                <p className="mb-0" style={pStyle}><b>Bank Account Number</b>: 123456789</p>
                                <p className="mb-0" style={pStyle}><b>IFSC Code</b>: HNBGF456</p>
                            </div>
                            <div className="col-6">
                                <p className="mb-0" style={pStyle}><b>Account holder</b>: Client Name</p>
                                <p className="mb-0" style={pStyle}><b>Bank Name</b>: HDFC Bank</p>
                            </div>
                        </div> */}

                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '', borderTopColor: '', alignContent: 'center', justifyContent: 'center' }}>
                        {!isMobileDevice && <button onClick={() => this.sendDetailsToWhatsapp()} type="button" className="rn-btn">
                            <FaWhatsapp size={20} />  <span className="mt-1">Send Payment Screenshot to Whatsapp</span>
                        </button>}

                        {isMobileDevice && <button style={{ lineHeight: 3, color: '#18b0c8', borderRadius: 6, borderColor: '#18b0c8' }} onClick={() => this.sendDetailsToWhatsapp()} type="button" className="">
                            <FaWhatsapp size={20} />  <span className="mt-1">Send Payment Screenshot to Whatsapp</span>
                        </button>}
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ServiceTwo;
