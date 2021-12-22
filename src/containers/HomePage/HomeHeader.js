import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logogc-ft.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { withRouter } from 'react-router';
import * as actions from '../../store/actions';
import { changeLanguageApp } from "../../store/actions";
import { getAllSpecialty, getAllClinic, getAllDoctors } from '../../services/userService';
import { Link } from 'react-router-dom';
class HomeHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowSearch: false,
            dataSpecialty: {},
            dataClinics: {},
            dataDoctors: {},
            strSearch: '',

        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }
    getAllData = async () => {
        let res = await getAllSpecialty();
        let res1 = await getAllClinic();
        if (res && res.errCode === 0 || res1 && res1.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
                dataClinics: res1.data ? res1.data : [],
                dataDoctors: this.props.topDoctorsRedux,
                isShowSearch: true
            })
        }

    }
    handleClickSearch = async () => {
        await this.getAllData();
    }

    handleUnClickSearch = async () => {
        this.setState({

            isShowSearch: false
        })
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }
    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`)
        }
    }
    handleClear = () => {
        this.setState({
            strSearch: ''
        })
    }
    handleOnchangeSearch = async (event) => {
        this.setState({
            strSearch: event.target.value
        })
        await this.getAllData();
        let { dataSpecialty, dataClinics, dataDoctors, strSearch } = this.state

        let newFilter = dataSpecialty.filter((item) => {
            return item.name.toLowerCase().includes(strSearch);
        });
        let newFilter2 = dataClinics.filter((item) => {
            return item.name.toLowerCase().includes(strSearch);
        });

        let newFilter3 = dataDoctors.filter((item) => {
            let name = ` ${item.lastName} ${item.firstName}`;
            return name.toLowerCase().includes(strSearch);
        });

        this.setState({
            dataSpecialty: newFilter,
            dataClinics: newFilter2,
            dataDoctors: newFilter3,
        })
    }

    render() {
        let { isShowSearch, dataSpecialty, dataClinics, dataDoctors } = this.state;
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className="home-header-container" >
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <img className="header-logo" src={logo} onClick={() => this.returnToHome()} />
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <Link to={`/list-specialty`}><b><FormattedMessage id="homeheader.speciality" /></b></Link>
                                <div className="subs-title"><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className="child-content">
                                <Link to={`/list-clinic`}><b>< FormattedMessage id="homeheader.healthfacility" /></b></Link>
                                <div className="subs-title"><FormattedMessage id="homeheader.selectroom" /></div>
                            </div>
                            <div className="child-content">
                                <Link to={`/list-doctor`}><b>< FormattedMessage id="homeheader.doctor" /></b></Link>
                                <div className="subs-title"><FormattedMessage id="homeheader.selectdoctor" /></div>
                            </div>
                            <div className="child-content">
                                <Link to={`/list-handbook`}><div><b><FormattedMessage id="homeheader.handbook" /></b></div></Link>
                                <div className="subs-title"><FormattedMessage id="homeheader.searchhanbook" /></div>
                            </div>
                        </div>
                        <div className="right-content">
                            <Link to={`/support`}><div className="support"><i className="fas fa-question-circle"></i><span> <FormattedMessage id="homeheader.support" /></span></div></Link>

                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className="home-header-banner" onClick={() => this.handleUnClickSearch()}>
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>
                            {language === LANGUAGES.VI ? <div className="search">
                                <i className="fas fa-search"></i>
                                <input type="text" value={this.state.strSearch} onClick={() => this.handleClickSearch()} onChange={(event) => this.handleOnchangeSearch(event)} placeholder="Tìm kiếm" />
                                {isShowSearch === true && <i className="far fa-times-circle" onClick={() => this.handleClear()}></i>}
                            </div>
                                : <div className="search">
                                    <i className="fas fa-search"></i>
                                    <input type="text" value={this.state.strSearch} onClick={() => this.handleClickSearch()} onChange={(event) => this.handleOnchangeSearch(event)} placeholder="Search" />
                                    {isShowSearch === true && <i className="far fa-times-circle" onClick={() => this.handleClear()}></i>}
                                </div>}

                            {isShowSearch === true &&
                                <>
                                    <div className="data-search">
                                        <div className="search-specialty">
                                            <h3>Chuyên khoa</h3>
                                            {dataSpecialty && dataSpecialty.length > 0 &&
                                                dataSpecialty.map((item, index) => {
                                                    return (
                                                        <>
                                                            <div className="timkiem-ketqua">
                                                                <a key={index}
                                                                    onClick={() => this.handleViewDetailSpecialty(item)} >

                                                                    <div
                                                                        className="bg-image"
                                                                        style={{ backgroundImage: `url(${item.image})` }}
                                                                    >
                                                                    </div>
                                                                    <a>{item.name}</a>
                                                                </a>
                                                            </div>

                                                        </>

                                                    )
                                                })
                                            }
                                        </div>

                                        <div className="search-specialty">
                                            <h3>Cơ sở y tế</h3>
                                            {dataClinics && dataClinics.length > 0 &&
                                                dataClinics.map((item, index) => {
                                                    return (
                                                        <>
                                                            <div className="timkiem-ketqua">
                                                                <a key={index}
                                                                    onClick={() => this.handleViewDetailClinic(item)} >

                                                                    <div
                                                                        className="bg-image"
                                                                        style={{ backgroundImage: `url(${item.image})` }}
                                                                    >
                                                                    </div>
                                                                    <a>{item.name}</a>
                                                                </a>
                                                            </div>

                                                        </>

                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="search-specialty">
                                            <h3>Bác sỹ</h3>
                                            {dataDoctors && dataDoctors.length > 0 &&
                                                dataDoctors.map((item, index) => {
                                                    let imageBase64 = '';
                                                    if (item.image) {
                                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                                    }
                                                    let nameVI = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                                    return (
                                                        <>
                                                            <div className="timkiem-ketqua">
                                                                <a key={index}
                                                                    onClick={() => this.handleViewDetailDoctor(item)} >

                                                                    <div
                                                                        className="bg-image"
                                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                                    >
                                                                    </div>
                                                                    <a>{language === LANGUAGES.VI ? nameVI : nameEn}</a>
                                                                </a>
                                                            </div>

                                                        </>

                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </>

                            }
                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="option-child">
                                    <div className="icon-child"><i className="far fa-hospital"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child1" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-procedures"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-flask"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-user-md"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
