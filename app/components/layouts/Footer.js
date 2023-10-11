import Link from 'next/link';
import Copyright from '../Copyright';
import ScrollUp from './ScrollUp';
import ThemeSwitcher from './ThemeSwitcher';

const Footer = ({footerSetting = {}}) => {

   return (
        <footer className="uni-footer uk-section uk-section-xlarge@m">
            <div className="uk-container">
                <div className="uk-panel">
                    <img className="uk-position-top-left" width="32" src="images/objects/ethereum-01.png" alt="object"  style={{top: "32%", left: "16%"}} />
                    <img className="uk-position-top-right" width="16" src="images/objects/x.png" alt="object" style={{top: "8%", right: "16%" }}/>
                    <img className="uk-position-bottom-right" width="16" src="images/objects/circle-01.png" alt="object" style={{bottom: "24%", right: "40%"}}/>
                    <img className="uk-position-bottom-left" width="24" src="images/objects/circle-03.png" alt="object" style={{bottom: "-8%", left: "30%"}} />
                    <div className="uk-grid uk-flex-center uk-text-center">
                        <div className="uk-width-large@m">
                            <div className="uk-panel">
                                <a href="landing-01.html" className="uk-logo">
                                    <img width="200" src="/images/nerko.svg" alt="NFT Pawn Shop" />
                                </a>
                                <p className="uk-text-xlarge@m uk-margin-medium-top@m">We make it easy to Discover, Invest and manage all your NFTs at one place.</p>
                                <ul className="uk-subnav uk-subnav-small uk-flex-center uk-text-gray-40 uk-margin-top uk-margin-medium-top@m">
                                    <li>
                                        <a href="https://twitter.com/unistudioco"><span className="uk-icon uk-icon-medium@m unicon-logo-twitter"></span></a>
                                    </li>
                                    <li>
                                        <a href="https://discord.com/unistudioco"><span className="uk-icon uk-icon-medium@m unicon-logo-discord"></span></a>
                                    </li>
                                    <li>
                                        <a href="https://instagram.com/unistudioco"><span className="uk-icon uk-icon-medium@m unicon-logo-instagram"></span></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="uk-margin-medium uk-margin-3xlarge-top@m" />
                    <div className="uk-panel uk-text-small">
                        <div className="uk-grid uk-child-width-auto@m uk-flex-center uk-flex-between@m uk-text-center uk-text-left@m">
                            <div>
                                <ul className="uk-subnav uk-subnav-small uk-text-muted uk-flex-center">
                                    <li><Link href="/blog">Blog</Link></li>
                                    <li><Link href="/privacy">Privacy policy</Link></li>
                                    <li><Link href="/terms">Terms of use</Link></li>
                                    <li className="uk-margin-small-left">
                                        <ScrollUp/>
                                    </li>
                                
                                </ul>
                            </div>
                            <div className="uk-flex-first@m uk-flex-center">
                                <Copyright/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <ThemeSwitcher/>
    </footer>
    
    );
};

export default Footer;
