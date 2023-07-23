import React, { Component } from "react";
import { FiCast, FiLayers, FiUsers, FiMonitor } from "react-icons/fi";

const ServiceList = [
    {
        icon: <FiCast />,
        title: 'Lords Exchange',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiLayers />,
        title: 'Parker Exchange',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiUsers />,
        title: 'Lotus',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiMonitor />,
        title: 'Sky Exchange',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiUsers />,
        title: 'King',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
    {
        icon: <FiMonitor />,
        title: 'Big Bull',
        description: 'I throw myself down among the tall grass by the stream as I lie close to the earth.'
    },
]


class ServiceThree extends Component {
    render() {
        const { column } = this.props;
        const ServiceContent = ServiceList.slice(0, this.props.item);

        let details = navigator.userAgent;

        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        return (
            <React.Fragment>
                <div className={`row ${!isMobileDevice ? 'ml-5' : ''}`}>
                    {ServiceContent.map((val, i) => (
                        <div className={`${column}`} key={i}>
                            <a style={{ cursor: 'pointer' }}>
                                <div style={{width: 300, height: 200, boxShadow: '0 0 9px #1C74CB', backgroundImage: 'linear-gradient(#022c43,#18b0c8)'}} className="service service__style--2 text-center">
                                    <div className={`${(isMobileDevice && i != 1) ? 'mt-4': ''}`}>
                                        <img style={{height: i == 0 ? 60 : i == 3 ? 90 : i == 5 ? 80 : ''}} src={`/assets/images/icons/i${i + 1}.png`} />
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}
export default ServiceThree;
