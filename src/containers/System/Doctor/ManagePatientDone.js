import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatientDone.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientDone } from '../../../services/userService';
import moment from 'moment';
import { reduce } from 'lodash';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import CancelBook from './CancelBook';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatientDone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPatient: [],

        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let res = await getAllPatientDone({
            doctorId: user.id
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


    render() {
        let { dataPatient } = this.state;
        let { language } = this.props;
        return (
            <>

                <div className="manage-patient-container">
                    <div className="m-p-title">
                        QUẢN LÝ BỆNH NHÂN ĐÃ KHÁM BỆNH
                    </div>
                    <div className="manage-patient-body row">
                        <div className="col-12 table-manage-patient">
                            <table style={{ width: '100%' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Thời gian</th>
                                    <th>Ngày khám</th>
                                    <th>Họ và Tên</th>
                                    <th>Giới tính</th>
                                    <th>Địa chỉ</th>
                                    <th>SĐT</th>
                                    <th>Email</th>
                                    <th>Triệu trứng</th>
                                </tr>
                                {dataPatient && dataPatient.length > 0 ?
                                    dataPatient.map((item, index) => {
                                        let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi
                                            :
                                            item.timeTypeDataPatient.valueEn
                                        let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi
                                            :
                                            item.patientData.genderData.valueEn
                                        let date = language === LANGUAGES.VI ? moment.unix(item.date / 1000).format("DD/MM/YYYY") : moment.unix(item.date / 1000).format("MM/DD/YYYY");


                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{time}</td>
                                                <td>{date}</td>
                                                <td>{item.patientData.firstName}</td>
                                                <td>{gender}</td>
                                                <td>{item.patientData.address}</td>
                                                <td>{item.patientData.phonenumber}</td>
                                                <td>{item.patientData.email}</td>
                                                <td>{item.reason}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>Không có bệnh nhân đã khám !</td>
                                    </tr>
                                }
                            </table>
                        </div>
                    </div>
                </div>


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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatientDone);
