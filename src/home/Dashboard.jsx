import React from 'react';
import { Helmet } from 'react-helmet';
import HeaderThree from '../component/header/HeaderThree';
import TabThree from "../elements/tab/TabThree";

function Dashboard() {  
    return (
        <div id='getId' className="active">
            <Helmet pageTitle="Dashboard" />
            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />

            <div className="designer-portfolio-area ptb--120 bg_color--1">
                <div className="wrapper plr--70 plr_sm--30 plr_md--30">
                    <TabThree column="col-lg-4 col-md-6 col-sm-6 col-12" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;