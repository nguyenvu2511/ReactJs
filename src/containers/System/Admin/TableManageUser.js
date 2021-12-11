import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';

class TableUseManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: []

        }
    }

    async componentDidMount() {
        await this.props.getAllUser()

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                arrUsers: this.props.listUsers,

            })
        }

    }
    handleDeleteUser = (user) => {
        this.props.deleteUser(user.id)
    }
    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }
    render() {
        let arrUsers = this.state.arrUsers;
        console.log()
        let { language } = this.props
        return (

            <table id="TableUseManage">
                <tbody>
                    <tr>
                        <th><FormattedMessage id="manage-user.email" /></th>
                        {language === LANGUAGES.VI ? <th><FormattedMessage id="manage-user.last-name" /></th> : <th><FormattedMessage id="manage-user.first-name" /></th>}
                        {language === LANGUAGES.VI ? <th><FormattedMessage id="manage-user.first-name" /></th> : <th><FormattedMessage id="manage-user.last-name" /></th>}

                        <th><FormattedMessage id="manage-user.gender" /></th>
                        <th><FormattedMessage id="manage-user.phone" /></th>
                        <th><FormattedMessage id="manage-user.address" /></th>
                        <th><FormattedMessage id="manage-user.role" /></th>
                        <th><FormattedMessage id="manage-user.img" /></th>
                        <th><FormattedMessage id="manage-user.action" /></th>

                    </tr>
                    {arrUsers && arrUsers.length > 0}
                    {arrUsers.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.email}</td>
                                {language === LANGUAGES.VI ? <td>{item.lastName}</td> : <td>{item.firstName}</td>}
                                {language === LANGUAGES.VI ? <td>{item.firstName}</td> : <td>{item.lastName}</td>}
                                <td>{language === LANGUAGES.VI ? item.genderData.valueVi : item.genderData.valueEn}</td>
                                <td>{item.phonenumber}</td>
                                <td>{item.address}</td>
                                <td>{language === LANGUAGES.VI ? item.roleData.valueVi : item.roleData.valueEn}</td>
                                <td className={"img"} style={{ backgroundImage: `url(${item.image ? new Buffer(item.image, 'base_64').toString('binary') : ''})` }}></td>
                                <td>  <button className="btn-edit" onClick={() => { this.handleEditUser(item) }}><i className="fas fa-edit"></i></button>
                                    <button className="btn-delete" onClick={() => { this.handleDeleteUser(item) }}><i className="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        )
                    })

                    }
                </tbody>
            </table>

        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUser: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (id) => dispatch(actions.deleteAUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableUseManage);
