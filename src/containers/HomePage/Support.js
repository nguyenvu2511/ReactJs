import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from './HomeHeader';
import { LANGUAGES } from '../../utils';
import HomeFooter from './HomeFooter';
import './Support.scss';
require('dotenv').config();
class Support extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    initFacebookSDK() {
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        let { language } = this.props;
        let locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US'
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: 1,  // parse social plugins on this page
                version: 'v12.0' // use version 2.1
            });
        };
        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = `//connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    async componentDidMount() {
        this.initFacebookSDK();

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.initFacebookSDK();
        }
    }


    render() {
        return (
            <>
                <HomeHeader />
                <div className="container">
                    <div className="support-body row">
                        <div className="info col-6">
                            <h3><strong>LIÊN HỆ VỚI CHÚNG TÔI</strong></h3>
                            <ul>
                                <li>Nguyễn Thanh Trọng</li>
                                <li>Võ Nguyễn Anh Tuấn</li>
                                <li>Nguyễn Tiến Vũ</li>
                                <div className='sp'>
                                    <i className="fas fa-envelope"></i> <span>trongeddy48@gmail.com || votuan221@gmail.com || nguyentienvu.2511@gmail.com</span>
                                    <br />
                                    <i className="fas fa-map-marker-alt"></i>  <span>Phường 25, Bình Thạnh, Thành phố Hồ Chí Minh</span>
                                </div>



                            </ul>


                        </div>
                        <div className="fb-page col-6" data-href="https://www.facebook.com/profile.php?id=100075489367618" data-tabs="timeline" data-width="400" data-height="70" data-small-header="false" data-adapt-container-width="false" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/profile.php?id=100075489367618" className="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/profile.php?id=100075489367618">GoodCare</a></blockquote></div>
                        <div className="col-6">
                            <iframe className="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1251208107665!2d106.71229765031123!3d10.801727892266626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528a459cb43ab%3A0x6c3d29d370b52a7e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVFAuSENNIC0gSFVURUNI!5e0!3m2!1svi!2s!4v1639751510403!5m2!1svi!2s" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>


                <HomeFooter />
            </>

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

export default connect(mapStateToProps, mapDispatchToProps)(Support);
