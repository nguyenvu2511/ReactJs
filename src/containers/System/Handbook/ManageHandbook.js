import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './ManageHandbook.scss';
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { createNewHandbook, getAllHandbook, deleteHandbook, editHandbook } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            dataHandbook: [],
            action: '',
        }
    }

    async componentDidMount() {
        await this.getAllHandbook()
    }
    getAllHandbook = async () => {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbook: res.data ? res.data : []
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

    handleSaveNewHandbook = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewHandbook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm cẩm nang thành công !');
                await this.getAllHandbook()
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
                await getAllHandbook();
            } else {
                toast.error('Thêm cẩm nang thất bại !');
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await editHandbook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Cập nhật cẩm nang thành công !');
                await this.getAllHandbook()
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE
                })
                await getAllHandbook();
            } else {
                toast.error('Cập nhật cẩm nang thất bại !');
            }
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
    handleBtnDelete = async (item) => {
        let data = {
            id: item.id
        }
        let res = await deleteHandbook(data)
        if (res && res.errCode === 0) {
            await this.getAllHandbook()
            toast.success('Xóa cẩm nang thành công!')

        }
        else {
            toast.error('Xóa cẩm nang thất bại !')
        }
    }
    render() {
        let { dataHandbook } = this.state
        return (
            <div className="manage-handbook-container">
                <div className="ms-title"><FormattedMessage id="admin.manage-handbook.title" /></div>

                <div className="add-new-handbook row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.namehandbook" /></label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.picturehandbook" /></label>
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
                    <div className="btn-handbook col-12">
                        <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                            onClick={() => this.handleSaveNewHandbook()}
                        >{this.state.action === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="admin.manage-handbook.savehandbook" />
                            :
                            <FormattedMessage id="admin.manage-handbook.addhandbook" />
                            }</button>
                    </div>
                </div>


                <div className="all-handbook">
                    {dataHandbook && dataHandbook.length > 0 ?
                        <>
                            <div className="c-title">Danh sách cẩm nang</div>
                            <div className="manage-handbook">
                                <table id="table-mp">
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên </th>
                                            <th>Hình ảnh</th>
                                            <th>Hành động</th>

                                        </tr>
                                        {
                                            dataHandbook.map((item, index) => {

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
