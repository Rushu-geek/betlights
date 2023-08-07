import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ServiceList from "../../elements/service/ServiceTwo";
import UserDataService from '../../services/userService';
import db from "../../firebase";
import { collection } from 'firebase/firestore';


class TabStyleThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1: 0,
            tab2: 0,
            tab3: 0,
            tab4: 0,
            isOpen: false,
            myIds: [],
            allIds: [],
            activeDefault: 1,
            color1: '',
            color2: '',
            color3: '',
            allSites: []
        };
    }

    async componentDidMount() {
        this.getColors();
        this.showSitesImages();
        const userService = new UserDataService();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const myIds = await userService.queryUserIds(user.userId);
        let idArray = [];
        myIds.forEach((doc) => {
            idArray.push(doc.data())
        });
        console.log();
        const allIds = await userService.getAllWebsites();
        let allIdArray = [];
        allIds.forEach((doc) => {
            allIdArray.push(doc.data());
        })

        allIdArray.forEach((id, index) => {
            idArray.forEach((myId) => {
                // console.log("myId", myId);
                // console.log("allId", id);
                console.log(myId.websiteId == id.websiteId);
                if (myId.websiteId == id.websiteId) {
                    allIdArray[index].userName = myId.userName
                }
            })
        })


        // console.log("myId >>> ", idArray);
        console.log("allId >>> ", allIdArray);

        const param = window.location.href.split('/')[3];
        if (param == 'dashboard?1')
            console.log("param >>>", param == 'dashboard?1')
        this.setState({ myIds: idArray, allIds: allIdArray, activeDefault: param == 'dashboard?1' ? 1 : 0 })
        console.log("this.state.myIds >> ", this.state.allIds);
    }

    getColors = async () => {
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
            this.setState({ color3: tmpArray[0]?.color3 })


        } catch (err) {
            console.log(err);

        }
    }

    showSitesImages = async () => {
        try {
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
            this.setState({ allSites: tmpArray });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { column } = this.props;
        const { tab1, tab2, tab3, tab4, isOpen } = this.state;
        const param = window.location.href.split('/')[3];

        let details = navigator.userAgent;

        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        console.log(isMobileDevice);
        return (
            <div>
                <Tabs defaultIndex={param == 'dashboard?1' ? 1 : 0}>

                    <div className="row text-center mt-5">
                        <div className="col-lg-12">
                            <div className="tablist-inner">
                                <TabList style={{ backgroundImage: `linear-gradient(${this.state.color2},${this.state.color1})` }} className="pv-tab-button text-center mt--0">
                                    <Tab><span style={{ color: 'white' }}>Get ID</span></Tab>
                                    <Tab><span style={{ color: 'white' }}>My ID</span></Tab>
                                    {/* <Tab><span>Logo Design</span></Tab>
                                    <Tab><span>Mobile App</span></Tab> */}
                                </TabList>
                            </div>
                        </div>
                    </div>

                    <TabPanel className="row row--35">
                        <div className="container">
                            <div className="row creative-service">
                                <div className="col-lg-12">
                                    <ServiceList color1={this.state.color1} color2={this.state.color2} color3={this.state.color3} allIds={this.state.allSites} item="6" column="col-lg-4 col-md-6 col-sm-6 col-12 text-left" />
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel className="row row--35">
                        <div className="container">
                            <div className="row creative-service">
                                <div className="col-lg-12">
                                    <ServiceList color1={this.state.color1} color2={this.state.color2} myIds={this.state.myIds} item="6" column="col-lg-4 col-md-6 col-sm-6 col-12 text-left" />
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* <TabPanel className="row row--35">
                        {TabThree.map((value, index) => (
                            <div className={`${column}`} key={index}>
                                {isOpen && (
                                    <Lightbox
                                        mainSrc={TabThree[tab3].bigImage}
                                        nextSrc={TabThree[(tab3 + 1) % TabThree.length]}
                                        prevSrc={TabThree[(tab3 + TabThree.length - 1) % TabThree.length]}
                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                        onMovePrevRequest={() =>
                                            this.setState({
                                                tab3: (tab3 + TabThree.length - 1) % TabThree.length,
                                            })
                                        }
                                        onMoveNextRequest={() =>
                                            this.setState({
                                                tab3: (tab3 + 1) % TabThree.length,
                                            })
                                        }
                                        imageLoadErrorMessage='Image Loading ...'
                                        enableZoom={false}
                                    />
                                )}
                                <div className="item-portfolio-static">
                                    <div onClick={() => this.setState({ isOpen: true, tab3: index })}>
                                        <div className="portfolio-static">
                                            <div className="thumbnail-inner">
                                                <div className="thumbnail">
                                                    <a href="#portfolio-details">
                                                        <img src={`/assets/images/portfolio/dp-portfolio-${value.image}.jpg`} alt="Portfolio Images" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="content">
                                                <div className="inner">
                                                    <p>{value.category}</p>
                                                    <h4><a href="#portfolio-details">{value.title}</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TabPanel>

                    <TabPanel className="row row--35">
                        {TabFour.map((value, index) => (
                            <div className={`${column}`} key={index}>
                                {isOpen && (
                                    <Lightbox
                                        mainSrc={TabFour[tab4].bigImage}
                                        nextSrc={TabFour[(tab4 + 1) % TabFour.length]}
                                        prevSrc={TabFour[(tab4 + TabFour.length - 1) % TabFour.length]}
                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                        onMovePrevRequest={() =>
                                            this.setState({
                                                tab4: (tab4 + TabFour.length - 1) % TabFour.length,
                                            })
                                        }
                                        onMoveNextRequest={() =>
                                            this.setState({
                                                tab4: (tab4 + 1) % TabFour.length,
                                            })
                                        }
                                        imageLoadErrorMessage='Image Loading ...'
                                        enableZoom={false}
                                    />
                                )}
                                <div className="item-portfolio-static">
                                    <div onClick={() => this.setState({ isOpen: true, tab4: index })}>
                                        <div className="portfolio-static">
                                            <div className="thumbnail-inner">
                                                <div className="thumbnail">
                                                    <a href="#portfolio-details">
                                                        <img src={`/assets/images/portfolio/dp-portfolio-${value.image}.jpg`} alt="Portfolio Images" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="content">
                                                <div className="inner">
                                                    <p>{value.category}</p>
                                                    <h4><a href="#portfolio-details">{value.title}</a></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TabPanel> */}



                </Tabs>
            </div>
        )
    }
}


export default TabStyleThree
