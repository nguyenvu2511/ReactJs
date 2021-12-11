import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';
import logo from '../../assets/logogc-ft.png';
import logogit from '../../assets/github.png';
import logoface from '../../assets/facebook.png';
import logomail from '../../assets/gmail-logo.png';

class HomeFooter extends Component {

    render() {
        return (
            <footer>
                    <div className="footer">
                        <div className="footer-content">
                            <div className="logo">
                                <img src={logo} />
                            </div>
                            <div className="about">
                                <h3>Thành viên thực hiện</h3>
                                <ul>
                                    <li>
                                        <p>Nguyễn Thanh Trọng</p>
                                    </li>
                                    <li>
                                        <p>Nguyễn Tiến Vũ</p>
                                    </li>
                                    <li>
                                        <p>Võ Nguyễn Anh Tuấn</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="listCourse">
                                <a target="_blank" href="https://github.com/trongeddy48">
                                    <img src={logogit}/>
                                </a>
                                <a target="_blank" href="https://www.facebook.com/profile.php?id=100075489367618">
                                    <img src={logoface}/>
                                </a>
                                <a target="_blank" href="trongeddy48@gmail.com">
                                    <img src={logomail}/>
                                </a>
                            </div>
                        </div>
                        <div className="descripsion">
                            <p><b style={{color: '#71807a'}}>GoodCare</b> được tạo ra với mục đích học tập và phục vụ cho đồ án chuyên ngành. Mọi cá nhân, tổ chức trong GoodCare đều là giả định. Mọi sự trùng hợp xảy ra có thể là ngẫu nhiên.</p>
                            <p><b style={{color: '#71807a'}}>GoodCare</b> Xin chân thành cảm ơn ❤️</p>
                        </div>
                    </div>
            </footer>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
