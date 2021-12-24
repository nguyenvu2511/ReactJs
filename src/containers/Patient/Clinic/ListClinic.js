import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListClinic.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { withRouter } from 'react-router';

class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : [],
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`)
        }
    }

    render() {
        let { dataClinics } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="list-clinic-container">
                    <div className="title-clinic">
                        <a><FormattedMessage id="patient.list.list-clinic" /></a>
                    </div>
                    <div className="all-clinic">
                        {dataClinics && dataClinics.length > 0 &&
                            dataClinics.map((item, index) => {
                                return (
                                    <>
                                        <ul>
                                            <li key={index}
                                                onClick={() => this.handleViewDetailSpecialty(item)}>

                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                >
                                                </div>
                                                <h3>{item.name}</h3>

                                            </li>
                                        </ul>
                                    </>

                                )
                            })
                        }
                    </div>
                </div>
                <HomeFooter />
            </>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListClinic));
