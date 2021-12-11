import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './About.scss';
import moment from 'moment';
import { getDataCovid } from '../../../services/userService';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCovid: [],
        }
    }

    async componentDidMount() {
        let res = await getDataCovid();
        if(res && res.length > 0){
            res.map(item => {
                item.Date = moment(item.Date).format('DD/MM/YYYY');
                return item;
            })
        }
        this.setState({
            dataCovid: res
        })
    }
    
    render() {
        let { dataCovid } = this.state;
        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    <FormattedMessage id="homepage.datacovid" />
                </div>
                <div className="section-about-body">
                <table>
                    <thead>
                        <tr>
                            <th><FormattedMessage id="homepage.day" /></th>
                            <th><FormattedMessage id="homepage.confirm" /></th>
                            <th><FormattedMessage id="homepage.active" /></th>
                            <th><FormattedMessage id="homepage.death" /></th>
                            <th><FormattedMessage id="homepage.recover" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataCovid && dataCovid.length > 0 &&
                            dataCovid.map(item => {
                                return (
                                    <tr key={item.ID}>
                                        <td>{item.Date}</td>
                                        <td>{item.Confirmed}</td>
                                        <td>{item.Active}</td>
                                        <td>{item.Deaths}</td>
                                        <td>{item.Recovered}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                </div>
                {/* <div className="section-about-content">
                    <div className="content-left">
                        <iframe width="90%" height="400px" 
                        src="https://www.youtube.com/embed/OdJrtVx_Mjw" 
                        title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            Hãy lắng nghe, những câu chuyện nhỏ. Để thấy trái tim, ta biết yêu thương. Thời gian cứ trôi, tình người còn mãi. Quà tặng Cuộc sống.
                        </p>
                    </div>
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
