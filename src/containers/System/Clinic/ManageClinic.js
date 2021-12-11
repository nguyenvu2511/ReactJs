import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './ManageClinic.scss';
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { createNewClinic, getAllClinic, deleteClinicById, editClinic } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            dataClinic: [],
            action: '',
        }
    }

    async componentDidMount() {
        await this.getAllClinic()
    }
    getAllClinic = async () => {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : [],
                action: CRUD_ACTIONS.CREATE,
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleSaveClinic = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {

            let res = await createNewClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm phòng khám thành công !');
                await this.getAllClinic()
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
            } else {
                toast.error('Thêm phòng khám thất bại !');
                console.log("check res: ", res);
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {

            let res = await editClinic(this.state);
            console.log('check', this.state)
            if (res && res.errCode === 0) {
                toast.success('Cập nhật phòng khám thành công !');
                await this.getAllClinic()
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
            } else {
                toast.error('Cập nhật phòng khám thất bại !');
            }
        }
    }
    handleBtnDelete = async (item) => {
        let data = {
            id: item.id
        }
        let res = await deleteClinicById(data)
        if (res && res.errCode === 0) {
            await this.getAllClinic()
            toast.success('Xóa phòng khám thành công!')

        }
        else {
            toast.error('Xóa phòng khám thất bại !')
        }
    }

    handleBtnEdit = async (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            address: item.address,
            imageBase64: item.image,
            descriptionHTML: item.descriptionHTML,
            descriptionMarkdown: item.descriptionMarkdown,
            action: CRUD_ACTIONS.EDIT,
        })
    }
    render() {
        let { dataClinic } = this.state
        return (
            <div className="manage-clinic-container">
                <div className="ms-title">
                    <FormattedMessage id="admin.manage-clinic.title" />
                </div>

                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-clinic.nameclinic" /></label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-clinic.pictureclinic" /></label>
                        <input className="form-control-file" type="file"
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-clinic.addressclinic" /></label>
                        <input className="form-control" type="text" value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: '200px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="btn-clinic col-12">
                        <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                            onClick={() => this.handleSaveClinic()}
                        >{this.state.action === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="admin.manage-clinic.save" />
                            :
                            <FormattedMessage id="admin.manage-clinic.add" />
                            }</button>
                    </div>
                </div>

                <div className="all-clinic">
                    {dataClinic && dataClinic.length > 0 ?
                        <>
                            <div className="c-title">Danh sách phòng khám bệnh</div>
                            <div className="manage-clinic">
                                <table id="table-mp">
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên </th>
                                            <th>Địa chỉ</th>
                                            <th>Hình ảnh </th>
                                            <th>Hành động</th>

                                        </tr>
                                        {
                                            dataClinic.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>{item.name}</td>
                                                        <td>{item.address}</td>
                                                        <td className={"img"} style={{ backgroundImage: `url(${item.image})` }}></td>
                                                        <td>
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => this.handleBtnEdit(item)}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
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
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
