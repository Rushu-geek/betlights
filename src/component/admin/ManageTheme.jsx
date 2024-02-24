import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import Carousel from './Carousel';
import SocialMedia from './SocialMedia';
import Counts from './Counts';
import ThemeColor from './ThemeColor';
import Logo from './Logo';
import Video from './Video';
import HowItWorks from './HowItWorks';

const ManageTheme = () => {

    useEffect(() => {

    }, [])


    return (
        <div style={{ overflow: "scroll", overflowX: "hidden", height: "100vh" }}>
            <Helmet pageTitle="Admin" />
            <h2 className='text-center'>Manage Theme</h2>

            <div className='row mt-2'>
                <div className='ml-4 m-2 col-lg-6 col-xl-6 col-md-6 col-sm-6 col-12'>
                    <Carousel />
                </div>

                <div className='ml-4 m-2 col-lg-5 col-xl-5 col-md-5 col-sm-5 col-12'>

                    <ThemeColor />
                </div>
            </div>

            <hr />
            <div className='row mt-2'>
                <div className='ml-4 m-2 col-lg-5 col-xl-5 col-md-5 col-sm-5 col-12'>
                    <SocialMedia />
                </div>

                <div className='m-2 col-lg-6 col-xl-6 col-md-6 col-sm-6 col-12'>
                    <Counts />
                </div>
            </div>

            <hr />

            <div className="row mt-2">

                <div className='m-2 col-lg-5 col-xl-5 col-md-5 col-sm-5 col-12'>
                    <Logo />
                </div>

                <div className='m-2 col-lg-5 col-xl-5 col-md-5 col-sm-5 col-12'>
                    <Video />
                </div>

            </div>

            <div className="row mt-2">

                <div className='m-2 col-lg-5 col-xl-5 col-md-5 col-sm-5 col-12'>
                    <HowItWorks />
                </div>

            </div>

        </div>
    )


}

export default ManageTheme