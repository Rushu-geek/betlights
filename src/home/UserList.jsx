import React, { useEffect, useMemo, useState } from 'react';
import HeaderThree from '../component/header/HeaderThree';
import UserDataService from '../services/userService';
import DataTable from 'react-data-table-component'
import styled from 'styled-components';
import SideBar from '../component/admin/SideBar';
import { CSVLink } from "react-csv";


function UserList() {

    const [users, setUsers] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [sideBarState, setSideBarState] = useState("open");


    useEffect(async () => {
        const service = new UserDataService();
        const data = await service.getAllUsers();
        let array = [];
        data.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            array.push(obj);
        });
        console.log(array);
        setUsers(array)
    }, []);


    const columns = [
        {
            name: 'Name',
            selector: row => row.fullName || 'NA',
        },
        {
            name: 'Number',
            selector: row => row.number || 'NA',
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Website',
            selector: row => row.websiteId || 'NA',
        },
        {
            name: 'User Name',
            selector: row => row.userName || 'NA',
        },
    ];



    const TextField = styled.input`
    height: 40px;
    width: 500px;
    border-radius: 3px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #e5e5e5;
    padding: 0 32px 0 16px;
    float: left;
    &:hover {
      cursor: pointer;
    }
   `;

    const filteredItems = users.filter(
        item => item?.fullName?.toLowerCase().includes(filterText?.toLowerCase()) ||
            item?.email?.toLowerCase().includes(filterText?.toLowerCase()) ||
            item?.websiteId?.toLowerCase().includes(filterText?.toLowerCase())
    );


    console.log(filteredItems)

    const csvData = [
        ["Name", "Number", "Email", "Website", "User Name"],
        ...filteredItems.map(({ fullName, number, email, website, userName }) => [
            fullName,
            number,
            email,
            website,
            userName,
        ]),
    ];


    const FilterComponent = ({ filterText, onFilter }) => (
        <>
            <input
                id="search"
                type="text"
                style={{ width: '100%' }}
                placeholder="Search by name or email"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                autoFocus
            />

            <select onChange={onFilter} className='mt-3' style={{ width: '100%' }}>
                <option>Filter By Website</option>
                <option value={'LordsExch'}>LordsExch</option>
                <option value={'ParkerExch'}>ParkerExch</option>
                <option value={'Lotus'}>Lotus</option>
                <option value={'SkyExch'}>SkyExch</option>
                <option value={'King'}>King</option>
                <option value={'BigBull'}>BigBull</option>
            </select>
        </>
    );

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} />
        );
    }, [filterText]);

    const customStyles = {
        pagination: {
            style: {
                color: 'black',
                fontSize: '20px',
            },
        },
    };

    return (
        <>

            <div className='row'>
                {/* <div onClick={() => { sideBarState == "open" ? setSideBarState("close") : setSideBarState("open") }} className={sideBarState == "open" ? 'col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2' : 'col-xl-1 col-lg-1 col-md-1 col-sm-2 col-2'}>
                    <SideBar />
                </div>

                <div className={sideBarState == "open" ? 'col-xl-10 col-lg-10 col-md-10 col-sm-10 col-10' : 'col-xl-11 col-lg-11 col-md-11 col-sm-10 col-10'}>

                    <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" /> */}

                <div style={{ marginLeft: 60, marginRight: 60, marginTop: 0, borderColor: 'black' }}>

                    <h1>User List</h1>

                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        striped={true}
                        fixedHeaderScrollHeight="400px"
                        subHeader
                        subHeaderAlign='left'
                        subHeaderComponent={subHeaderComponentMemo}
                        customStyles={customStyles}
                    />

                    <button className='mt-2 btn btn-secondary'>
                        <CSVLink className="downloadbtn" filename="my-file.csv" data={csvData}>
                            <span style={{ color: 'white' }}>
                                Export to CSV
                            </span>
                        </CSVLink>
                    </button>
                </div>



            </div>
            {/* </div> */}
        </>
    )
}

export default UserList;