import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListDoctor.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllDoctors } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            strSearch: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    async componentDidMount() {
        this.props.loadTopDoctors();

    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }
    handleOnchangeSearch = async (event) => {
        await this.setState({
            strSearch: event.target.value,
            arrDoctors: this.props.topDoctorsRedux,
        })

        let { arrDoctors, strSearch } = this.state;
        let newFilter = arrDoctors.filter((item) => {
            let name = ` ${item.lastName} ${item.firstName}`;
            return name.toLowerCase().includes(strSearch);
        });


        this.setState({
            arrDoctors: newFilter,

        })
    }
    render() {
        let { arrDoctors } = this.state;
        let { language } = this.props;
        console.log('arrDoctors', arrDoctors)
        return (
            <>
                <HomeHeader />
                <div className="list-doctor-container">
                    <div className="title-doctor">
                        <a><FormattedMessage id="patient.list.list-doctor" /></a>

                    </div>
                    {language === LANGUAGES.VI ?
                        <div className="search-doctor">
                            <i class="fas fa-search"></i><input type="search" value={this.state.strSearch} onChange={(event) => this.handleOnchangeSearch(event)} placeholder="Tìm kiếm bác sĩ"></input>
                        </div> :
                        <div className="search-doctor">
                            <i class="fas fa-search"></i><input type="search" value={this.state.strSearch} onChange={(event) => this.handleOnchangeSearch(event)} placeholder="Search doctor"></input>
                        </div>
                    }

                    <div className="all-doctor">
                        {arrDoctors && arrDoctors.length > 0
                            && arrDoctors.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                }
                                let nameVI = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                return (
                                    <>
                                        <ul>
                                            <li key={index}
                                                onClick={() => this.handleViewDetailDoctor(item)}>

                                                <div className="bg-image section-outstanding-doctor"
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                                <div>
                                                    <h3>{language === LANGUAGES.VI ? nameVI : nameEn}</h3>
                                                    <span className="specialty">{item.Doctor_Info.specialtyData.name}</span>
                                                </div>

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
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDoctor));
