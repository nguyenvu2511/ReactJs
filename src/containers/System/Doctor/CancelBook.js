import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './CancelBook.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { toast } from "react-toastify";
import moment from 'moment';
import { CommonUtils } from "../../../utils";

class CancelBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
           email: ''
        }
    }

    async componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.dataModal !== this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleChangeEmailCb = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleSendCancelBook = () => {
        this.props.sendCancelBook(this.state);
    }
    
    render() {
        // toggle={}
        let { isOpenModal, closeCancelModal, dataModal, sendCancelBook } = this.props;
        
        return (
            <Modal 
                isOpen={isOpenModal}  
                className={'booking-modal-container'}
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Hủy lịch hẹn khám bệnh</h5>
                    <button type="button" className="close" aria-label="Close" onClick={closeCancelModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Email bệnh nhân</label>
                            <input className="form-control" type="email" value={this.state.email} 
                                onChange={(event) => this.handleChangeEmailCb(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendCancelBook()}>Đồng ý hủy lịch hẹn này</Button>{' '}
                    <Button color="secondary" onClick={closeCancelModal}>Thoát</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelBook);
