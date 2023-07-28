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

const SideBar = () => {
    const [logo, setLogo] = useState("");
    const { collapseSidebar } = useProSidebar();
    const [activeTab, setactiveTab] = useState("admin");


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

    useEffect(() => {
        getLogo();
    }, [])



    return (
        <div id="app" style={({ height: "100%" }, { display: "flex" })}>

            <Sidebar backgroundColor="#18B0C8" style={{ height: "100vh" }}>
                <Menu>
                    <MenuItem
                        icon={<MenuOutlinedIcon />}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={{ textAlign: "center" }}
                    >
                        {" "}
                        <img height={100} className='mt-1' src={logo} alt="Digital Agency" />
                    </MenuItem>

                    <MenuItem onClick={() => { setactiveTab("admin") }} icon={<HomeOutlinedIcon />}>
                        PAYMENT INFO
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("users") }} icon={<PeopleOutlinedIcon />}>
                        USERLIST
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("request") }} icon={<ContactsOutlinedIcon />}>
                        APPROVE REQUEST
                    </MenuItem>
                    <MenuItem onClick={() => { setactiveTab("password") }} icon={<ReceiptOutlinedIcon />}>
                        CHANGE PASSWORD
                    </MenuItem>
                    <MenuItem icon={<HelpOutlineOutlinedIcon />}>
                        MANAGE THEME
                    </MenuItem>
                    {/* <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
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
                {activeTab == "password" && (
                    <AdminPassword />
                )}
            </main>

        </div>
    );
}

export default SideBar