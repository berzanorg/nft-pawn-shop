import Image from 'next/image'

const HomeOneMinting = () =>{
    return(
        <>
            <div id="uni_minting" className="uni-minting uk-section uk-section-xlarge@m uk-panel">
                <div className="uk-container uk-container-small">
                    <header className="uk-grid-xsmall uk-flex-center uk-flex-middle uk-grid" data-uk-grid data-sal="zoom-in"
  data-sal-delay="200"  data-sal-easing="ease-out-bounce" >
                        <div className="uk-panel uk-text-center">
                            <h2 className="uk-h3 uk-h1@m">How to mint</h2>
                        </div>
                    </header>
                    <div className="uk-panel uk-margin-medium-top uk-margin-2xlarge-top@m" data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 300;" >
                        <Image className="uk-position-top-left uk-text-secondary" 
                            width={16} 
                            height={17} 
                            src="/images/objects/circle-01.png" 
                            alt="Object" style={{top: "-16%", left: "8%"}} 
                        />
                        <img className="uk-position-bottom-right uk-text-primary" width="24" src="images/objects/circle-02.png" alt="Object" style={{bottom: "16%", right: "-8%"}} />
                        <img className="uk-position-bottom-left uk-text-muted" width="28" src="images/objects/x.png" alt="Object" style={{bottom: "16%", left: "-8%" }} />
                        <div className="uk-grid uk-child-width-1-2@s uk-grid-match" data-anime="targets: > *; opacity:[0, 1]; translateY:[24, 0]; onview: -250; delay: anime.stagger(100);">
                            <div>
                                <div className="uk-panel uk-card uk-card-small uk-padding-large-horizontal uk-radius-medium uk-radius-large@m uk-box-shadow-xsmall dark:uk-background-white-5">
                                    <div className="uk-grid uk-grid-medium@m">
                                        <div className="uk-width-1-3 uk-width-1-4@m">
                                            <img src="images/icon-01.png" alt="Icon" />
                                        </div>
                                        <div className="uk-panel uk-width-expand">
                                            <h3 className="uk-h5 uk-h4@m">Connect your wallet</h3>
                                            <p>Use Trust Wallet, Metamask or any wallet to connect to the app.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="uk-panel uk-card uk-card-small uk-padding-large-horizontal uk-radius-medium uk-radius-large@m uk-box-shadow-xsmall dark:uk-background-white-5">
                                    <div className="uk-grid uk-grid-medium@m">
                                        <div className="uk-width-1-3 uk-width-1-4@m">
                                            <img src="images/icon-02.png" alt="Icon" />
                                            <div hidden className="uk-card uk-card-xsmall uk-radius-medium uk-background-gradient uk-flex-middle uk-flex-center uk-margin-medium-bottom@m">
                                                <i className="uk-icon-medium uk-icon-medium@m unicon-select-window"></i>
                                            </div>
                                        </div>
                                        <div className="uk-panel uk-width-expand">
                                            <h3 className="uk-h5 uk-h4@m">Select your quantity</h3>
                                            <p>Upload your NFTs and set a title, description and price.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-grid-margin uk-first-column">
                                <div className="uk-panel uk-card uk-card-small uk-padding-large-horizontal uk-radius-medium uk-radius-large@m uk-box-shadow-xsmall dark:uk-background-white-5">
                                    <div className="uk-grid uk-grid-medium@m">
                                        <div className="uk-width-1-3 uk-width-1-4@m">
                                            <img src="images/icon-03.png" alt="Icon" />
                                            <div hidden className="uk-card uk-card-xsmall uk-radius-medium uk-background-gradient uk-flex-middle uk-flex-center uk-margin-medium-bottom@m">
                                                <i className="uk-icon-medium uk-icon-medium@m unicon-select-window"></i>
                                            </div>
                                        </div>
                                        <div className="uk-panel uk-width-expand">
                                            <h3 className="uk-h5 uk-h4@m">Confirm transaction</h3>
                                            <p>Earn ETH and BIT for all your NFTs that you sell on our marketplace.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-grid-margin uk-first-column">
                                <div className="uk-panel uk-card uk-card-small uk-padding-large-horizontal uk-radius-medium uk-radius-large@m uk-box-shadow-xsmall dark:uk-background-white-5">
                                    <div className="uk-grid uk-grid-medium@m">
                                        <div className="uk-width-1-3 uk-width-1-4@m">
                                            <img src="images/icon-04.png" alt="Icon" />
                                            <div hidden className="uk-card uk-card-xsmall uk-radius-medium uk-background-gradient uk-flex-middle uk-flex-center uk-margin-medium-bottom@m">
                                                <i className="uk-icon-medium uk-icon-medium@m unicon-select-window"></i>
                                            </div>
                                        </div>
                                        <div className="uk-panel uk-width-expand">
                                            <h3 className="uk-h5 uk-h4@m">Receive your NFTs</h3>
                                            <p>Latin professor at Hampden-Sydney College in Virginia.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default HomeOneMinting;