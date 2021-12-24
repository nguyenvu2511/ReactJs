import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import ManagePatientDone from '../containers/System/Doctor/ManagePatientDone';
import { USER_ROLE } from "../utils";
import ManageDoctor from '../containers/System/Admin/ManageDoctor';

class Doctor extends Component {
    render() {
        const { isLoggedIn, userInfo } = this.props;
        let role = userInfo.roleId;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        {role === USER_ROLE.DOCTOR &&
                            <Switch>
                                <Route path="/doctor/manage-info" component={ManageDoctor} />
                                <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                                <Route path="/doctor/manage-patient" component={ManagePatient} />
                                <Route path="/doctor/manage-patient-done" component={ManagePatientDone} />
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
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
