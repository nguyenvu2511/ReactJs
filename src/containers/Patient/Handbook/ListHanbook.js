import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListHanbook.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllHandbook } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { withRouter } from 'react-router';

class ListHanbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: [],
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : [],
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }

    render() {
        let { dataHandbooks } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="list-handbook-container">
                    <div className="title-handbook">
                        <h5> <h5><FormattedMessage id="patient.list.list-handbook" /></h5></h5>
                    </div>
                    <div className="all-handbook">
                        {dataHandbooks && dataHandbooks.length > 0 &&
                            dataHandbooks.map((item, index) => {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListHanbook));
