import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListSpecialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { withRouter } from 'react-router';

class ListSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="list-specialty-container">
                    <div className="title-specialty">
                        <h5><FormattedMessage id="patient.list.list-specialty" /></h5>
                    </div>
                    <div className="all-specialty">
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListSpecialty));
