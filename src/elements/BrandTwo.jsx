import React, { Component } from "react";

class BrandTwo extends Component {
    render() {

        let details = navigator.userAgent;

        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-3 col-md-3 mt-5" style={{ backgroundColor: '' }}>
                        <h2 style={{ color: '#18b0c8' }} className="title">PAYMENT OPTIONS</h2>
                    </div>

                    {!isMobileDevice && <div className="col-9 col-md-9" style={{ backgroundColor: '' }}>
                        <ul className="brand-style-2">
                            <li>
                                <img style={{ maxHeight: 220, maxWidth: 300 }} src="/assets/images/brand/gpay.webp" alt="Logo Images" />
                            </li>
                            <li>
                                <img src="/assets/images/brand/neft.png" alt="Logo Images" />
                            </li>
                            <li>
                                <img src="/assets/images/brand/btc.png" alt="Logo Images" />
                            </li>
                            <li>
                                <img style={{ maxHeight: 220, maxWidth: 200 }} src="/assets/images/brand/phpay.png" alt="Logo Images" />
                            </li>
                        </ul>
                    </div>}
                </div>
                {isMobileDevice && <div className="row">
                    <ul className="brand-style-2">
                        <li>
                            <img style={{ maxHeight: 220, maxWidth: 300 }} src="/assets/images/brand/gpay.webp" alt="Logo Images" />
                        </li>
                        <li>
                            <img src="/assets/images/brand/neft.png" alt="Logo Images" />
                        </li>
                        <li>
                            <img src="/assets/images/brand/btc.png" alt="Logo Images" />
                        </li>
                        <li>
                            <img style={{ maxHeight: 220, maxWidth: 200 }} src="/assets/images/brand/phpay.png" alt="Logo Images" />
                        </li>
                    </ul>
                </div>}
            </React.Fragment>
        )
    }
}
export default BrandTwo;