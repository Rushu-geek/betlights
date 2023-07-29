import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import Carousel from './Carousel';

const ManageTheme = () => {

    useEffect(() => {
        
    }, [])


    return (
        <div>
            <Helmet pageTitle="Admin" />
            <h1>Manage Theme</h1>
            <Carousel />
        </div>
    )


}

export default ManageTheme