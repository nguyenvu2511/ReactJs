import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';

import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, chooseDoctor, postSendCancelBooking } from '../../../services/userService';
import moment from 'moment';
import { reduce } from 'lodash';
import { LANGUAGES } from '../../../utils';

import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import ChooseDoctor from './ChooseDoctor';
import CancelBook from '../../System/Doctor/CancelBook';
class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isOpenCancelModal: false,
            dataCancelModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: 0,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient();
        });
    }

    handleBtnConfirm = async (item) => {
        let data = {
            id: item.id,
            email: item.patientData.email,
            timeBook: item.timeTypeDataPatient.valueVi,
            patientName: item.patientData.firstName,
        }
        console.log("data", data)
        await this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
        console.log('dataModal', this.state.dataModal)
    }

    handleBtnDelete = (item) => {
        let dataDelete = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        }
        this.setState({
            isOpenCancelModal: true,
            dataCancelModal: dataDelete
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    closeCancelModal = () => {
        this.setState({
            isOpenCancelModal: false,
            dataCancelModal: {}
        })
    }

    handleConfirm = async (data) => {
        let { dataModal, currentDate } = this.state;
        let { language } = this.props;
        console.log('data', data, dataModal)
        this.setState({
            isShowLoading: true
        })
        let date = language === LANGUAGES.VI ? moment.unix(currentDate / 1000).format("DD/MM/YYYY") : moment.unix(currentDate / 1000).format("MM/DD/YYYY");
        let time = `${dataModal.timeBook} - ${date}`
        let res = await chooseDoctor({
            id: dataModal.id,
            email: dataModal.email,
            doctorId: data.selectedDoctor.value,
            doctorName: data.selectedDoctor.label,
            specialty: data.selectedSpecialty.label,
            time: time,
            languge: this.props.language,
            patientName: dataModal.patientName
        });

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Chọn bác sỹ thành công !');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Chọn bác sỹ thất bại !')
        }

    }

    sendCancelBook = async (dataChildModalCancel) => {
        let { dataCancelModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await postSendCancelBooking({
            email: dataChildModalCancel.email,
            doctorId: dataCancelModal.doctorId,
            patientId: dataCancelModal.patientId,
            timeType: dataCancelModal.timeType,
            languge: this.props.language,
            patientName: dataCancelModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Hủy lịch hẹn thành công !');
            this.closeCancelModal();
            await this.getDataPatient();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Hủy lịch hẹn thất bại !');
            console.log("Error send cancel booking: ", res);
        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isOpenCancelModal, dataCancelModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text={'Vui lòng chờ giây lát...'}
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">
                            QUẢN LÝ BỆNH NHÂN KHÁM BỆNH
                        </div>
                        <div className="manage-patient-body row">
                            <div className="col-5 form-group">
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className="col-12 table-manage-patient">
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và Tên</th>
                                        <th>Giới tính</th>
                                        <th>Địa chỉ</th>
                                        <th>SĐT</th>
                                        <th>Email</th>
                                        <th>Triệu trứng</th>
                                        <th>Chức năng</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi
                                                :
                                                item.timeTypeDataPatient.valueEn
                                            let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi
                                                :
                                                item.patientData.genderData.valueEn
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{gender}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{item.patientData.phonenumber}</td>
                                                    <td>{item.patientData.email}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <button className="mp-btn-confirm"
                                                            onClick={() => this.handleBtnConfirm(item)}
                                                        >Chọn bác sỹ</button>
                                                        <button className="mp-btn-delete"
                                                            onClick={() => this.handleBtnDelete(item)}
                                                        >Hủy lịch hẹn này</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>Không có lịch khám cần xác nhận hoàn thành !</td>
                                        </tr>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                    <ChooseDoctor
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        handleConfirm={this.handleConfirm}
                    />
                    <CancelBook
                        isOpenModal={isOpenCancelModal}
                        dataModal={dataCancelModal}
                        closeCancelModal={this.closeCancelModal}
                        sendCancelBook={this.sendCancelBook}
                    />
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
