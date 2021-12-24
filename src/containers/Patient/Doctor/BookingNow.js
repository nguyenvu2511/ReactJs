import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingNow.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getAllCodeService } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingNowModal from './Modal/BookingNowModal';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class BookingNow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allVailableTime: [],
            date: '',
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        let res = await getAllCodeService("TIME");
        this.setState({
            allDays: allDays,
            date: allDays[0].value,
            allVailableTime: res.data

        })


    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays = (language) => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }

            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }

        return allDays;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            })
        }

    }
    handleOnChangeSelect = async (event) => {
        let date = event.target.value;
        let res = await getAllCodeService("TIME");
        this.setState({
            allVailableTime: res.data,
            date: date
        })
    }
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        })
    }

    render() {
        let { allDays, allVailableTime, isOpenModalBooking, dataScheduleTimeModal, date } = this.state;
        let { language } = this.props;
        console.log('allVailableTime', allVailableTime, dataScheduleTimeModal)
        return (
            <>
                <HomeHeader />
                <div className="booking-container">
                    <div className='title2'>ĐẶT LỊCH NGAY</div>
                    <div className="all-schedule">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0 && allDays.map((item, index) => {
                                return (
                                    <option
                                        value={item.value}
                                        key={index}
                                    >
                                        {item.label}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt" />
                            <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                            <i />
                        </div>
                        <div className="time-content">
                            {allVailableTime && allVailableTime.length > 0 ?
                                <>
                                    <div className="time-content-btns">
                                        {allVailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI ?
                                                item.valueVi : item.valueEn;
                                            return (
                                                <button
                                                    key={index}
                                                    className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })
                                        }
                                    </div>

                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                                :
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <BookingNowModal
                    isOpenModal={isOpenModalBooking}
                    closeModal={this.closeBookingModal}
                    dataScheduleTime={dataScheduleTimeModal}
                    date={date}
                />
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingNow);
