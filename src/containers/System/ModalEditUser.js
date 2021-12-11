import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from "../../utils/emitter";
import _ from 'lodash';

class ModalEditUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)){
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hardcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phonenumber: user.phonenumber
            })
        }
        console.log('didmount edit modal: ', this.props.currentUser)
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChageInput = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        });
    }
    
    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address', 'phonenumber'];
        for(let i = 0; i < arrInput.length; i++){
            if(!this.state[arrInput[i]]){
                isValid = false;
                alert('Missing parameter: '+arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === true){
            //call api edit
            this.props.editUser(this.state);
        }
        
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={()=>{this.toggle()}} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>{this.toggle()}}>Chỉnh sửa nhanh</ModalHeader>
            <ModalBody>
                <div className="modal-user-body">
                    <div className="input-container">
                        <label>Email</label>
                        <input 
                        type="text" 
                        onChange={(event)=> {this.handleOnChageInput(event, "email")}}
                        value={this.state.email}
                        disabled
                        />
                    </div>
                    <div className="input-container">
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            onChange={(event)=> {this.handleOnChageInput(event, "password")}}
                            value={this.state.password}
                            disabled
                        />
                    </div>
                    <div className="input-container">
                        <label>Tên</label>
                        <input 
                            type="text" 
                            onChange={(event)=> {this.handleOnChageInput(event, "firstName")}}
                            value={this.state.firstName}
                        />
                    </div>
                    <div className="input-container">
                        <label>Họ</label>
                        <input 
                            type="text" 
                            onChange={(event)=> {this.handleOnChageInput(event, "lastName")}}
                            value={this.state.lastName}
                        />
                    </div>
                    <div className="input-container">
                        <label>Địa chỉ</label>
                        <input 
                            type="text" 
                            onChange={(event)=> {this.handleOnChageInput(event, "address")}}
                            value={this.state.address}
                        />
                    </div>
                    <div className="input-container">
                        <label>Số điện thoại</label>
                        <input 
                            type="text" 
                            onChange={(event)=> {this.handleOnChageInput(event, "phonenumber")}}
                            value={this.state.phonenumber}
                            disabled
                        />
                    </div>
                </div>
            </ModalBody>
                <ModalFooter>
                    <Button 
                    color="primary" 
                    className="px-3" 
                    onClick={()=>{this.handleSaveUser()}}
                    >Lưu thay đổi</Button>{' '}
                    <Button color="secondary" className="px-3" onClick={()=>{this.toggle()}}>Đóng</Button>
                </ModalFooter>
            </Modal>
      )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);




