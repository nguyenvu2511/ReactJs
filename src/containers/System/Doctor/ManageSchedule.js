import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions"
import { LANGUAGES, dateFormat, USER_ROLE } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor, getScheduleDoctorByDate, deleteScheduleByDate } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            allAvalableTime: [],
            isOpenSelect: false
        }
    }

    componentDidMount() {
        let { userInfo } = this.props;

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                this.props.fetchAllDoctors();
                this.setState({
                    isOpenSelect: true
                })
            }
            if (role === USER_ROLE.DOCTOR) {
                this.setState({
                    isOpenSelect: false
                })
            }
        }


        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect,

            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }


        // if(prevProps.language !== this.props.language){
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption }, async () => {
            await this.getDataSchedule()
        });
    }
    getDataSchedule = async () => {
        let { userInfo } = this.props;

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                let FormatedDate = new Date(this.state.currentDate).getTime();
                let res = await getScheduleDoctorByDate(this.state.selectedDoctor.value, FormatedDate);
                if (res && res.errCode === 0) {
                    this.setState({
                        allAvalableTime: res.data
                    })
                }
            }
            if (role === USER_ROLE.DOCTOR) {
                let FormatedDate = new Date(this.state.currentDate).getTime();
                let res = await getScheduleDoctorByDate(userInfo.id, FormatedDate);
                if (res && res.errCode === 0) {
                    this.setState({
                        allAvalableTime: res.data
                    })
                }
            }
        }


    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataSchedule()
        });
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;

        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })

            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error("Ch??a ch???n ng??y ho???c sai ?????nh d???ng ng??y!");
            return;
        }
        let { userInfo } = this.props;

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                if (selectedDoctor && _.isEmpty(selectedDoctor)) {
                    toast.error("Ch??a ch???n b??c s??!");
                    return;
                }
                let formatedDate = new Date(currentDate).getTime();

                if (rangeTime && rangeTime.length > 0) {
                    let selectedTime = rangeTime.filter(item => item.isSelected === true);
                    if (selectedTime && selectedTime.length > 0) {
                        selectedTime.map(schedule => {
                            let object = {};
                            object.doctorId = selectedDoctor.value;
                            object.date = formatedDate;
                            object.timeType = schedule.keyMap;
                            result.push(object)
                        })

                    } else {
                        toast.error("Ch??a ch???n th???i gian!")
                    }
                }

                let res = await saveBulkScheduleDoctor({
                    arrSchedule: result,
                    doctorId: selectedDoctor.value,
                    formatedDate: formatedDate
                })
                if (res && res.errCode === 0) {
                    toast.success("L??u th??nh c??ng!");
                    await this.getDataSchedule();
                } else {
                    toast.error("Kh??ng th??? l??u l???ch h???n !");
                }
            }
            if (role === USER_ROLE.DOCTOR) {
                let formatedDate = new Date(currentDate).getTime();

                if (rangeTime && rangeTime.length > 0) {
                    let selectedTime = rangeTime.filter(item => item.isSelected === true);
                    if (selectedTime && selectedTime.length > 0) {
                        selectedTime.map(schedule => {
                            let object = {};
                            object.doctorId = userInfo.id;
                            object.date = formatedDate;
                            object.timeType = schedule.keyMap;
                            result.push(object)
                        })

                    } else {
                        toast.error("Ch??a ch???n th???i gian!")
                    }
                }

                let res = await saveBulkScheduleDoctor({
                    arrSchedule: result,
                    doctorId: userInfo.id,
                    formatedDate: formatedDate
                })
                if (res && res.errCode === 0) {
                    toast.success("L??u th??nh c??ng!");
                    await this.getDataSchedule();
                } else {
                    toast.error("Kh??ng th??? l??u l???ch h???n !");
                }
            }
        }
    }
    handleBtnDelete = async (item) => {
        let data = {
            doctorId: item.doctorId,
            timeType: item.timeType,
            date: item.date
        }
        let res = await deleteScheduleByDate(data)
        if (res && res.errCode === 0) {
            await this.getDataSchedule()
            toast.success('X??a l???ch h???n th??nh c??ng!')

        }
        else {
            toast.error('X??a l???ch h???n th???t b???i !')
        }
    }

    render() {
        let { rangeTime, allAvalableTime, isOpenSelect } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        {isOpenSelect && isOpenSelect === true ?
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            :
                            <div></div>
                        }

                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true
                                                ? "btn btn-schedule active" : "btn btn-schedule"}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                    {allAvalableTime && allAvalableTime.length > 0 ?
                        <>
                            <div className="s-title">Danh s??ch k??? ho???ch kh??m b???nh</div>
                            <div className="manage-schedule">
                                <table id="table-mp">
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Th???i gian</th>
                                            <th>H??nh ?????ng</th>

                                        </tr>
                                        {
                                            allAvalableTime.map((item, index) => {
                                                let time = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>{time}</td>
                                                        <td>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => this.handleBtnDelete(item)}
                                                            >
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>

                                                        </td>
                                                    </tr>)
                                            })

                                        }

                                    </tbody>
                                </table>
                            </div>
                        </>
                        :
                        <div></div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
