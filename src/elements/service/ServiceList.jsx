import React, { Component } from "react";
import { FiCast, FiLayers, FiUsers, FiMonitor } from "react-icons/fi";
import { collection } from 'firebase/firestore';
import db from "../../firebase";
import UserDataService from '../../services/userService';

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

    constructor(props) {
        super(props);

        this.state = {
            sites: [],
            color1: "",
            color2: ""
        }

    }


    async componentDidMount() {

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

                this.setState({ color1: tmpArray[0]?.color1 })
                this.setState({ color2: tmpArray[0]?.color2 })

            } catch (err) {
                console.log(err);

            }
        }
        getColors();


        const getSites = async () => {
            const sitesRef = collection(db, 'sites');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(sitesRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray);
            this.setState({ sites: tmpArray });
        }
        getSites();
    }


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
                {/* <div className={`row ${!isMobileDevice ? 'ml-5' : ''}`}> */}
                <div className="row text-center">

                    {this.state.sites?.map((val, i) => (
                        <div className="col-lg-4 col-md-4 col-sm-12 col-12" key={i}>
                            <a style={{ cursor: 'pointer' }}>
                                <div style={{ width: 300, height: 200, boxShadow: '0 0 9px #1C74CB', backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})` }} className="service service__style--2 text-center">
                                    <div className="">
                                        <img style={{ height: i == 0 ? 60 : i == 3 ? 90 : i == 5 ? 80 : '' }} src={val?.url} />
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
