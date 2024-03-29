import React, { useEffect, useMemo, useState } from 'react';
import HeaderThree from '../component/header/HeaderThree';
import UserDataService from '../services/userService';
import DataTable from 'react-data-table-component'
import styled from 'styled-components';


function UserList() {

    const [users, setUsers] = useState([]);
    const [filterText, setFilterText] = useState("");


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

    const FilterComponent = ({ filterText, onFilter }) => (
        <>
            <input
                id="search"
                type="text"
                style={{width: '100%'}}
                placeholder="Search by name or email"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                autoFocus
            />
            
            <select onChange={onFilter} className='mt-3' style={{width: '100%'}}>
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
            <HeaderThree homeLink="/" logo="symbol-dark" color="color-black" />

            <div style={{ marginLeft: 60, marginRight: 60, marginTop: 100, borderColor: 'black' }}>

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
            </div>

        </>
    )
}

export default UserList;