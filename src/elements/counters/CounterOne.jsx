import { collection } from "firebase/firestore";
import React, { Component, Fragment } from "react";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import UserDataService from "../../services/userService";
import db from "../../firebase";



class CounterOne extends Component {

    constructor(props) {
        super(props);

        this.state = {
            countsData: [],
        }
    }

    async componentDidMount() {


        const getCounts = async () => {
            const countRef = collection(db, 'counter');
            const dbService = new UserDataService();

            const data = await dbService.getAllData(countRef);
            let tmpArray = [];

            data.forEach((doc) => {
                let obj = doc.data();

                obj.id = doc.id;
                tmpArray.push(obj);
            });
            console.log(tmpArray[0]?.counters);
            this.setState({ countsData: tmpArray[0]?.counters })
        }
        getCounts()
    }


    state = {
        didViewCountUp: false
    };
    onVisibilityChange = isVisible => {
        if (isVisible) {
            this.setState({ didViewCountUp: true });
        }
    }
    render() {
        let Data = [
            {
                countNum: 250,
                countTitle: 'Games',
            },
            {
                countNum: 15000,
                countTitle: 'Active Players',
            },
            {
                countNum: 5,
                countTitle: 'Awarded most successful gaming platform',
            },
        ];

        return (
            <Fragment>
                <div className="row">
                    {this.state.countsData?.map((value, index) => (
                        <div className="counterup_style--1 col-lg-4 col-md-4 col-sm-6 col-12" key={index}>
                            <h5 style={{color: this.props.color2}} className="counter">
                                <VisibilitySensor onChange={this.onVisibilityChange} offset={{ top: 10 }} delayedCall>
                                    <CountUp end={this.state.didViewCountUp ? value?.count : 0} />
                                </VisibilitySensor>
                            </h5>
                            <p style={{ color: this.props.color1 }} className="description">{value?.name}</p>
                        </div>
                    ))}
                </div>
            </Fragment>
        )
    }
}
export default CounterOne;