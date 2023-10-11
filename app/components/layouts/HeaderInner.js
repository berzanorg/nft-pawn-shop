import Link from 'next/link';
import Logo from '../common/Logo';
import { useEffect } from 'react';
import ConnectWallet from './ConnectWallet';
import MobileMenu from './MobileMenu';

const HeaderInner = ({headerSetting = {}}) => {      
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });           
    /* Method that will fix header after a specific scrollable */
           const isSticky = (e) => {
                const header = document.querySelector('.uni-header-navbar');
                const scrollTop = window.scrollY;
                scrollTop >= 250 ? header.classList.add('uk-sticky-fixed') : header.classList.remove('uk-sticky-fixed');
            };
    return (
        <>       
   
        <MobileMenu/>
        <ConnectWallet/> 
            <header className="uni-header">
                <div className="uni-header-navbar" data-uk-sticky="top: 70; show-on-up: false; animation: uk-animation-slide-top" >
                    <div className="uk-container">
                        <nav className="uk-navbar uk-navbar-container uk-navbar-transparent">
                            <div className="uk-navbar-top">
                                <div className="uk-navbar-left">
                                    <Link href="/" className="uk-logo uk-navbar-item uk-h4 uk-h3@m uk-margin-remove">                                          
                                        <Logo />                                           
                                    </Link>
                                </div>
                                <div className="uk-navbar-right uk-flex-1 uk-flex-right">
                                    <ul className="uk-navbar-nav dark:uk-text-gray-10 uk-visible@m" data-uk-scrollspy-nav="closest: li; scroll: true; offset: 80" data-uk-navbar-bound>
                                        <li><a href="#uni_minting">Minting</a></li>
                                        <li><a href="#uni_about">About</a></li>
                                        <li><a href="#uni_collection">Collection</a></li>
                                        <li><a href="#uni_roadmap">Roadmap</a></li>
                                        <li><a href="#uni_team">Team</a></li>
                                    </ul>
                                    <div className="uk-navbar-item">
                                        <ul className="uk-subnav uk-subnav-small uk-visible@m">
                                            <li>
                                                <Link href="#"><i className="uk-icon unicon-logo-twitter"></i></Link>
                                            </li>
                                            <li>
                                                <Link href="#"><i className="uk-icon unicon-logo-discord"></i></Link>
                                            </li>
                                        </ul>                                       
                                        <a href="#uni_connect_wallet" className="uk-button uk-button-medium@m uk-button-default uk-button-outline uk-margin-left uk-visible@l" data-uk-toggle="">
                                            <span>Connect wallet</span>
                                        </a>
                                    </div>

                                    <div className="uk-navbar-item uk-hidden@m">
                                        <a href="#uni_connect_wallet" className="uk-button uk-button-medium@m uk-button-icon uk-hidden@m uk-margin-small-right" data-uk-toggle="">
                                            <i className="uk-icon unicon-wallet"></i>
                                        </a>
                                        <a href="#uni_mobile_menu" data-uk-toggle="">
                                            <i className="uk-icon uk-icon-medium unicon-menu"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};
export default HeaderInner;