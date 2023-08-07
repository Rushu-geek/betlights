import React, { useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Admin from '../../home/Admin';
import { NavLink } from 'react-router-dom';
import { collection } from 'firebase/firestore';
import UserDataService from '../../services/userService';
import db from "../../firebase";
import UserList from '../../home/UserList';
import PaymentReq from '../../home/PaymentReq';
import AdminPassword from '../../home/AdminPassword';
import ManageTheme from './ManageTheme';
import AvailableSites from './AvailableSites';
import Offers from './Offers';

const SideBar = () => {
    const [logo, setLogo] = useState("");
    const { collapseSidebar } = useProSidebar();
    const [activeTab, setactiveTab] = useState("admin");
    const [color1, setColor1] = useState("#18b0c8");
    const [color2, setColor2] = useState("#022c43");

    const getLogo = async () => {
        try {
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
                setLogo(tmpArray[0]?.url);
            }
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

        } catch (err) {
            console.log(err);

        }
    }

    const onLogout = () => {
        localStorage.clear();
        // this.setState({ isLoggedIn: false })
        window.location.replace('/')
    }

    useEffect(() => {
        getLogo();
        getColors();
    }, [])

    let sidebarColor = `linear-gradient(#ffffff,${color1})`


    return (
        <div id="app" style={({ height: "100%" }, { display: "flex" })}>

            <Sidebar collapsed={false} backgroundColor={sidebarColor} style={{ height: "100vh", backgroundImage: `linear-gradient(${color1},${color2})` }}>
                <Menu>
                    <MenuItem
                        // icon={< />}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={{ textAlign: "center" }}
                    >
                        {" "}
                        <img height={100} className='mt-5' src={logo} alt="Digital Agency" />
                    </MenuItem>

                    <MenuItem className='mt-5' onClick={() => { setactiveTab("admin") }} icon={<HomeOutlinedIcon />}>
                        PAYMENT INFO
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("users") }} icon={<PeopleOutlinedIcon />}>
                        USERLIST
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("request") }} icon={<ContactsOutlinedIcon />}>
                        APPROVE REQUEST
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("sites") }} icon={<ContactsOutlinedIcon />}>
                        AVAILABLE SITES
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("offers") }} icon={<ReceiptOutlinedIcon />}>
                        OFFERS
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("password") }} icon={<ReceiptOutlinedIcon />}>
                        CHANGE PASSWORD
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("manageTheme") }} icon={<HelpOutlineOutlinedIcon />}>
                        MANAGE THEME
                    </MenuItem>
                    <MenuItem>
                        {/* <button onClick={() => onLogout()} type="button" className="rn-btn mt-3"> */}
                            <span onClick={() => onLogout()} >LOGOUT</span>
                        {/* </button> */}
                    </MenuItem>
                </Menu>
            </Sidebar>
            <main>

                {activeTab == "admin" && (
                    <Admin />
                )}
                {activeTab == "users" && (
                    <UserList />
                )}
                {activeTab == "request" && (
                    <PaymentReq />
                )}
                {activeTab == "sites" && (
                    <AvailableSites />
                )}
                {activeTab == "password" && (
                    <AdminPassword />
                )}
                {activeTab == "manageTheme" && (
                    <ManageTheme />
                )}
                {activeTab == "offers" && (
                    <Offers />
                )}
            </main>

        </div>
    );
}

export default SideBar