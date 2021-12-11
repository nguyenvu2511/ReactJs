import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './ManageSpecialty.scss';
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { createNewSpecialty, getAllSpecialty, deleteSpecialty, editSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            dataSpecialty: [],
            action: '',
        }
    }

    async componentDidMount() {
        await this.getAllSpecialty()
    }
    getAllSpecialty = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
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

    handleSaveSpecialty = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm chuyên khoa thành công !');
                await this.getAllSpecialty()
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
            } else {
                toast.error('Thêm chuyên khoa thất bại !');

            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Cập nhật chuyên khoa thành công !');
                await this.getAllSpecialty()
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
            } else {
                toast.error('Cập nhật chuyên khoa thất bại !');

            }
        }
    }

    handleBtnDelete = async (item) => {
        let data = {
            id: item.id
        }
        let res = await deleteSpecialty(data)
        if (res && res.errCode === 0) {
            await this.getAllSpecialty()
            toast.success('Xóa chuyên khoa thành công!')

        }
        else {
            toast.error('Xóa chuyên khoa thất bại !')
        }
    }
    handleBtnEdit = async (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            imageBase64: item.image,
            descriptionHTML: item.descriptionHTML,
            descriptionMarkdown: item.descriptionMarkdown,
            action: CRUD_ACTIONS.EDIT,
        })
    }
    render() {
        let { dataSpecialty } = this.state
        return (

            <div className="manage-specialty-container">
                <div className="ms-title"><FormattedMessage id="admin.manage-specialty.title" /></div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.namespecialty" /></label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.picturespecialty" /></label>
                        <input className="form-control-file" type="file"
                            onChange={(event) => this.handleOnchangeImage(event)}
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
                    <div className="btn-specialty col-12">
                        <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                            onClick={() => this.handleSaveSpecialty()}
                        >{this.state.action === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="admin.manage-specialty.savespecialty" />
                            :
                            <FormattedMessage id="admin.manage-specialty.addspecialty" />
                            }</button>
                    </div>
                </div>
                <div className="all-specialty">
                    {dataSpecialty && dataSpecialty.length > 0 ?
                        <>
                            <div className="c-title">Danh sách chuyên khoa khám bệnh</div>
                            <div className="manage-specialty">
                                <table id="table-mp">
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên </th>
                                            <th>Hình ảnh</th>
                                            <th>Hành động</th>

                                        </tr>
                                        {
                                            dataSpecialty.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>{item.name}</td>
                                                        <td className={"image"} style={{ backgroundImage: `url(${item.image})` }}></td>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
