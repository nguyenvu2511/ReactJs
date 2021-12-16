import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import { USER_ROLE } from "../utils";

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        let role = userInfo.roleId;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        {role === USER_ROLE.ADMIN &&
                            <Switch>


                                <Route path="/system/manage-user" component={UserRedux} />
                                <Route path="/system/manage-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-schedule" component={ManageSchedule} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route path="/system/manage-handbook" component={ManageHandbook} />

                                <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                            </Switch>
                        }

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
