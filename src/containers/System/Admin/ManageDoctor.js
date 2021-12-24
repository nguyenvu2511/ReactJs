import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES, USER_ROLE } from '../../../utils';
import { getDetailInfoDoctor } from "../../../services/userService";
import _ from 'lodash';

const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            isOpenSelect: false,

            //save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            note: '',
            actions: ''

        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                this.props.fetchAllDoctor();
                this.setState({
                    isOpenSelect: true
                })
            }
            if (role === USER_ROLE.DOCTOR) {
                this.setState({
                    isOpenSelect: false
                })
                let { listPrice, listPayment, listProvince, listClinic, listSpecialty } = this.state;
                let res = await getDetailInfoDoctor(userInfo.id)
                if (res && res.errCode === 0 && res.data && res.data.Markdown) {
                    let markdown = res.data.Markdown;
                    let moreIf = res.data.Doctor_Info;
                    console.log('check', moreIf)
                    let note = '',
                        selectedPrice = '',
                        selectedPayment = '',
                        selectedProvince = '',
                        selectedSpecialty = '',
                        selectedClinic = ''
                    selectedSpecialty = '';
                    if (moreIf) {

                        note = moreIf.note;
                        selectedPrice = listPrice.find(item => {
                            return item && item.value === moreIf.priceId
                        })
                        selectedPayment = listPayment.find(item => {
                            return item && item.value === moreIf.paymentId
                        })
                        selectedProvince = listProvince.find(item => {
                            return item && item.value === moreIf.provinceId
                        })
                        selectedSpecialty = listSpecialty.find(item => {
                            return item && item.value === moreIf.specialtyId
                        })
                        selectedClinic = listClinic.find(item => {
                            return item && item.value === moreIf.clinicId
                        })
                    }
                    this.setState({

                        contentHTML: markdown.contentHTML,
                        contentMarkdown: markdown.contentMarkdown,
                        description: markdown.description,
                        note: note,
                        selectedPrice: selectedPrice,
                        selectedPayment: selectedPayment,
                        selectedProvince: selectedProvince,
                        selectedSpecialty: selectedSpecialty,
                        selectedClinic: selectedClinic,
                        actions: CRUD_ACTIONS.EDIT
                    })
                }
                else {
                    this.setState({
                        contentHTML: '',
                        contentMarkdown: '',
                        description: '',
                        note: '',
                        selectedPrice: '',
                        selectedPayment: '',
                        selectedProvince: '',
                        selectedClinic: '',
                        selectedSpecialty: '',
                        actions: CRUD_ACTIONS.CREATE
                    })
                }
            }
        }
        this.props.getRequiredDoctorInfo();


    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,

            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listClinic: dataSelectClinic,
                listSpecialty: dataSelectSpecialty,

            })

        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({

                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({

                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            })
        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }
    handleSaveContentMarkdown = () => {

        let { userInfo } = this.props;

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                let { actions } = this.state;
                if (actions === CRUD_ACTIONS.CREATE) {
                    this.props.saveDetailDoctor({
                        contentHTML: this.state.contentHTML,
                        contentMarkdown: this.state.contentMarkdown,
                        description: this.state.description,
                        doctorId: this.state.selectedDoctor.value,
                        selectedPrice: this.state.selectedPrice.value,
                        selectedPayment: this.state.selectedPayment.value,
                        selectedProvince: this.state.selectedProvince.value,
                        note: this.state.note,
                        selectedSpecialty: this.state.selectedSpecialty.value,
                        selectedClinic: this.state.selectedClinic.value,
                        actions: CRUD_ACTIONS.CREATE
                    })
                    this.setState({
                        actions: CRUD_ACTIONS.EDIT
                    })
                }
                if (actions === CRUD_ACTIONS.EDIT) {
                    this.props.saveDetailDoctor({
                        doctorId: this.state.selectedDoctor.value,
                        contentHTML: this.state.contentHTML,
                        contentMarkdown: this.state.contentMarkdown,
                        description: this.state.description,
                        selectedPrice: this.state.selectedPrice.value,
                        selectedPayment: this.state.selectedPayment.value,
                        selectedProvince: this.state.selectedProvince.value,
                        note: this.state.note,
                        selectedSpecialty: this.state.selectedSpecialty.value,
                        selectedClinic: this.state.selectedClinic.value,
                        actions: CRUD_ACTIONS.EDIT
                    })
                }
            }
            if (role === USER_ROLE.DOCTOR) {
                let { actions } = this.state;
                if (actions === CRUD_ACTIONS.CREATE) {
                    this.props.saveDetailDoctor({
                        contentHTML: this.state.contentHTML,
                        contentMarkdown: this.state.contentMarkdown,
                        description: this.state.description,
                        doctorId: userInfo.id,
                        selectedPrice: this.state.selectedPrice.value,
                        selectedPayment: this.state.selectedPayment.value,
                        selectedProvince: this.state.selectedProvince.value,
                        note: this.state.note,
                        selectedSpecialty: this.state.selectedSpecialty.value,
                        selectedClinic: this.state.selectedClinic.value,
                        actions: CRUD_ACTIONS.CREATE
                    })
                    this.setState({
                        actions: CRUD_ACTIONS.EDIT
                    })
                }
                if (actions === CRUD_ACTIONS.EDIT) {
                    this.props.saveDetailDoctor({
                        doctorId: userInfo.id,
                        contentHTML: this.state.contentHTML,
                        contentMarkdown: this.state.contentMarkdown,
                        description: this.state.description,
                        selectedPrice: this.state.selectedPrice.value,
                        selectedPayment: this.state.selectedPayment.value,
                        selectedProvince: this.state.selectedProvince.value,
                        note: this.state.note,
                        selectedSpecialty: this.state.selectedSpecialty.value,
                        selectedClinic: this.state.selectedClinic.value,
                        actions: CRUD_ACTIONS.EDIT
                    })
                }
            }
        }

    }
    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let { listPrice, listPayment, listProvince, listClinic, listSpecialty } = this.state;

        let res = await getDetailInfoDoctor(selectedDoctor.value)
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let moreIf = res.data.Doctor_Info;
            console.log('check', moreIf)
            let note = '',
                selectedPrice = '',
                selectedPayment = '',
                selectedProvince = '',
                selectedSpecialty = '',
                selectedClinic = ''
            selectedSpecialty = '';
            if (moreIf) {

                note = moreIf.note;
                selectedPrice = listPrice.find(item => {
                    return item && item.value === moreIf.priceId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === moreIf.paymentId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === moreIf.provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === moreIf.specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === moreIf.clinicId
                })
            }
            this.setState({

                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                actions: CRUD_ACTIONS.EDIT
            })
        }
        else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedClinic: '',
                selectedSpecialty: '',
                actions: CRUD_ACTIONS.CREATE
            })
        }






    };
    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption
        this.setState({
            ...stateCopy
        })
        console.log('check select', selectedOption, stateName)
    }
    handleChangeText = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
        console.log('st', event.target.value)
    }
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props

        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    let object = {};
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let labelVi = `${item.valueVi} VNĐ`;
                    let labelEn = `${item.valueEn} USD`;
                    let object = {};
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    let object = {};
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap;
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
    render() {

        let { isOpenSelect } = this.state
        let { language } = this.props
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="manage-doctor-info">
                    {isOpenSelect && isOpenSelect === true ?
                        <div className="content-left form-group">

                            <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                            <Select
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}

                            />
                        </div>
                        :
                        <div></div>
                    }

                    <div className="content-right">
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea
                            className="form-control "
                            onChange={(event) => this.handleChangeText(event, 'description')}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>

                </div>
                <div className="more-infor row">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPrice}
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPayment}
                            name="selectedPayment"
                        />

                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listProvince}
                            name="selectedProvince"

                        />
                    </div>

                </div>
                <div className="row">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                        <Select
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listSpecialty}
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                        <Select
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listClinic}
                            name="selectedClinic"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input className="form-control"

                            onChange={(event) => this.handleChangeText(event, 'note')}
                            value={this.state.note}
                        />

                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={this.state.actions === CRUD_ACTIONS.EDIT ? "save-content-doctor" : "create-content-doctor"}
                >
                    {this.state.actions === CRUD_ACTIONS.EDIT ? <span> <FormattedMessage id="admin.manage-doctor.save" /> </span> : <span> <FormattedMessage id="admin.manage-doctor.add" /> </span>}
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        userInfo: state.user.userInfo,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
