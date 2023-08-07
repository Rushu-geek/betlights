import React, { Component } from "react";
import UserDataService from "../../services/userService";

const ServiceList = [
    {
        icon: '01',
        title: 'Business Stratagy',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered.'
    },
    {
        icon: '02',
        title: 'Website Development',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered.'
    },
    {
        icon: '03',
        title: 'Marketing & Reporting',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered.'
    },
]

class ServiceOne extends Component {

    constructor(props) {
        super(props);
    }

    async approveReq (item) {
        console.log(item)
        item.requestStatus = true;
        console.log("approve req >>> ", item);
        if (item.websiteId == "LordsExch") {
            item.image = '/assets/images/icons/i1.png'
        }

        if (item.websiteId == "ParkerExch") {
            item.image = '/assets/images/icons/i2.png'
        }

        if (item.websiteId == "LotusBook247") {
            item.image = '/assets/images/icons/i3.png'
        }

        if (item.websiteId == "SkyExch") {
            item.image = '/assets/images/icons/i4.png'
        }

        if (item.websiteId == "King") {
            item.image = '/assets/images/icons/i5.png'
        }

        if (item.websiteId == "BigBull") {
            item.image = '/assets/images/icons/i6.png'
        }

        const service = new UserDataService();
        const updateData = await service.updatePaymentReq(item.id, item);
        console.log("updated >>> ", updateData);
        let userData = {
            userName: item.userName,
            websiteId: item.websiteId
        }
        const updateUser = await service.updateUser(item.userId, userData);
        alert("Payment req approved");
        window.location.reload();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    {this.props.payment.map((val, i) => (
                        <div className="col-lg-12 col-md-6 col-sm-6 col-12" key={i}>
                            <div style={{ backgroundColor: 'black', borderRadius: 20, height: 280 }} className="mb-3 service text-center service__style--1">
                                {/* <div className="icon">
                                    <img src={`/assets/images/icons/icon-${val.icon}.png`} alt="Digital Agency"/>
                                </div> */}
                                <div className="content">
                                    <h4 style={{color: 'white'}} className="title">Username: {val.userName}</h4>
                                    <p style={{color: 'white'}}>Website: {val.websiteId}</p>
                                    <p style={{color: 'white'}}>Phone: {val.number}</p>
                                    <p style={{color: 'white'}}>Status: {val.requestStatus ? 'approved' : 'not approved'}</p>
                                    {!val.requestStatus && <button className="btn-primary" onClick={() => this.approveReq(val)}>Approve Request</button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}
export default ServiceOne;