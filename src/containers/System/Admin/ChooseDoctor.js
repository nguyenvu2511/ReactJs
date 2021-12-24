import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ChooseDoctor.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { toast } from "react-toastify";
import * as actions from '../../../store/actions';
import moment from 'moment';
import { CommonUtils } from "../../../utils";
import { getAllSpecialty, getAllDetailSpecialtyById, getProfileDoctorById } from '../../../services/userService';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES, USER_ROLE } from '../../../utils';
class ChooseDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            listSpecialty: [],
            selectedSpecialty: '',
            selectedDoctor: '',
        }
    }

    async componentDidMount() {

        let res = await getAllSpecialty();
        let dataSelectSpecialty = this.buildDataInputSelect(res.data, 'SPECIALTY');
        console.log('dataSelectSpecialty', dataSelectSpecialty)
        this.setState({
            listSpecialty: dataSelectSpecialty,

        })
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedSpecialty !== this.state.selectedSpecialty) {

        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props

        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map(async (item, index) => {
                    let res = await getProfileDoctorById(item.doctorId)
                    console.log('check data', res)
                    let labelVi = `${res.data.lastName} ${res.data.firstName}`;
                    let labelEn = `${res.data.firstName} ${res.data.lastName}`;
                    let object = {};
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = res.data.id;
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY' || type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object)
                })
            }


        }
        return result
    }
    handleChangeSelect = async (item) => {
        await this.setState({
            selectedSpecialty: item,
            selectedDoctor: ''
        })
        let res = await getAllDetailSpecialtyById({
            id: this.state.selectedSpecialty.value,
            location: 'ALL'
        });
        if (res && res.errCode === 0) {

            let dataSelect = this.buildDataInputSelect(res.data.doctorSpecialty, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })

        }
        console.log('listDoctors', this.state.listDoctors)


    }
    handleChangeSelectDoctor = async (item) => {
        await this.setState({
            selectedDoctor: item
        })

    }
    handleConfirm = async () => {
        this.props.handleConfirm(this.state);
    }

    render() {
        // toggle={}
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Chọn bác sỹ cho bệnh nhân</h5>

                    <button type="button" className="close" aria-label="Close" onClick={closeRemedyModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                            <Select
                                placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                                value={this.state.selectedSpecialty}
                                onChange={(item) => this.handleChangeSelect(item)}
                                options={this.state.listSpecialty}
                                name="selectedSpecialty"
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                            <Select
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelectDoctor}
                                options={this.state.listDoctors}

                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleConfirm()}>Xác nhận</Button>{' '}
                    <Button color="secondary" onClick={closeRemedyModal}>Hủy</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDoctor);
