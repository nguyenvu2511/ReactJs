import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import _ from 'lodash';
import * as actions from "../../../../store/actions";
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
           fullName: '',
           phonenumber: '',
           email: '',
           address: '',
           reason: '',
           birthday: '',
           selectedGender: '',
           doctorId: '',
           genders: '',
           timeType: '',
           isShowLoading: false
        }
    }

    async componentDidMount() {
        this.props.getGenders();

    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if(data && data.length > 0){
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(this.props.genders !== prevProps.genders){
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }

        if(this.props.dataScheduleTime !== prevProps.dataScheduleTime){
            if(this.props.dataScheduleTime && !_.isEmpty(this.props.dataScheduleTime)) {
                let doctorId = this.props.dataScheduleTime.doctorId;
                let timeType = this.props.dataScheduleTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = {...this.state};
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        });
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)){
            let time = language === LANGUAGES.VI ? 
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ? 
                    moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                    moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            
            return `${time} - ${this.capitalizeFirstLetter(date)}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)){
            let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            :
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return ''
    }

    handleConfirmBooking = async() => {
        //validate
        this.setState({
            isShowLoading: true
        })
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataScheduleTime);
        let doctorName = this.buildDoctorName(this.props.dataScheduleTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phonenumber: this.state.phonenumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataScheduleTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        this.setState({
            isShowLoading: false
        })

        if(res && res.errCode === 0){
            toast.success('Đặt lịch thành công !')
            this.props.closeModal();
        }else {
            toast.error('Đặt lịch thất bại !')
        }
    }
    
    render() {
        // toggle={}
        let { isOpenModal, closeModal, dataScheduleTime } = this.props;
        let doctorId = '';
        if(dataScheduleTime && !_.isEmpty(dataScheduleTime)){
            doctorId = dataScheduleTime.doctorId;
        }
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Vui lòng chờ trong giây lát...'
            >
                <Modal 
                    isOpen={isOpenModal}  
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left">
                                <FormattedMessage id="patient.booking-modal.title" />
                            </span>
                            <span 
                                className="right"
                                onClick={closeModal}
                            ><i className="fas fa-times"></i></span>
                        </div>
                        <div className="booking-modal-body">
                            {/* {JSON.stringify(dataScheduleTime)} */}
                            <div className="doctor-info">
                                <ProfileDoctor 
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataScheduleTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.fullname" />
                                    </label>
                                    <input className="form-control" 
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.phonenumber" />
                                    </label>
                                    <input className="form-control" 
                                        value={this.state.phonenumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phonenumber')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.email" />
                                    </label>
                                    <input className="form-control" 
                                        type="email"
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.address" />
                                    </label>
                                    <input className="form-control" 
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.reason" />
                                    </label>
                                    <input className="form-control" 
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.birthday" />
                                    </label>
                                    <DatePicker 
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.birthday}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.gender" />
                                    </label>
                                    <Select 
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="booking-modal-footer">
                            <button className="btn-booking-confirm"
                                    onClick={() => this.handleConfirmBooking()}
                            ><FormattedMessage id="patient.booking-modal.confirm" /></button>
                            <button className="btn-booking-cancel"
                                    onClick={closeModal}
                            ><FormattedMessage id="patient.booking-modal.cancel" /></button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
