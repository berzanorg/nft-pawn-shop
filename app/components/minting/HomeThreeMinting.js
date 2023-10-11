const HomeThreeMinting = () => {
    return(
        <div id="uni_minting" className="uni-minting uk-section uk-section-xlarge@m uk-panel">
                <div className="uk-container">
                    <div className="uk-panel uk-margin-medium-top uk-margin-2xlarge-top@m">
                        <img className="uk-position-top-left uk-text-secondary" width="16" src="images/objects/circle-01.png" alt="Object" style={{top: "-16%", left: "8%"}} />
                        <img className="uk-position-bottom-right uk-text-primary" width="24" src="images/objects/circle-02.png" alt="Object" style={{bottom: "16%", right: "-8%"}} />
                        <img className="uk-position-bottom-left uk-text-muted" width="28" src="images/objects/x.png" alt="Object" style={{bottom: "16%", left: "-8%"}} />
                        <div className="uk-grid-medium uk-grid-2xlarge@m uk-flex-middle uk-grid" data-uk-grid="">
                            <div className="uk-panel uk-width-2-5@m">
                                <header className="uk-panel uk-text-center uk-text-left@m">
                                    <h2 className="uk-h3 uk-h1@m uk-font-display uk-text-uppercase">Let's start <span className="uk-text-gradient">minting!</span></h2>
                                    <img className="uk-width-2xsmall uk-margin@m uk-visible@m" src="images/divider-01.svg" alt="Divider" />
                                    <p className="uk-text-xlarge@m">Use Trust Wallet, Metamask or any wallet to connect to the app.</p>
                                </header>
                            </div>
                            <div className="uk-panel uk-width-expand@m">
                                <div className="uk-grid-small uk-grid@m uk-child-width-1-2@m uk-width-2xlarge uk-grid" data-uk-grid="masonry: true;" data-anime="targets: > * > *; opacity:[0, 1]; translateY:[24, 0]; onview: -250; delay: anime.stagger(100);">
                                    <div>
                                        <div className="uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-height-large@m uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                                            <div className="uk-grid uk-grid-small@m uk-flex-column uk-flex-top" data-uk-grid>
                                                <div className="uk-width-auto">
                                                    <div className="uk-card uk-card-xsmall uk-background-gradient uk-flex-middle uk-flex-center uk-radius-medium">
                                                        <i className="uk-icon-small uk-icon-medium@m uk-text-white unicon-wallet"></i>
                                                    </div>
                                                </div>
                                                <div className="uk-width-expand@m">
                                                    <div className="content uk-panel">
                                                        <h3 className="title uk-h5 uk-font-display uk-text-uppercase uk-margin-remove">Connect wallet</h3>
                                                        <p className="description uk-text-muted dark:uk-text-gray-40">Use Trust Wallet, Metamask or any wallet to connect to the app.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-height-large@m uk-radius-medium uk-radius-large@m uk-margin-large-top@m dark:uk-background-white-5">
                                            <div className="uk-grid uk-grid-small@m uk-flex-column uk-flex-top" data-uk-grid>
                                                <div className="uk-width-auto">
                                                    <div className="uk-card uk-card-xsmall uk-background-gradient uk-flex-middle uk-flex-center uk-radius-medium">
                                                        <i className="uk-icon-small uk-icon-medium@m uk-text-white unicon-receipt"></i>
                                                    </div>
                                                </div>
                                                <div className="uk-width-expand@m">
                                                    <div className="content uk-panel">
                                                        <h3 className="title uk-h5 uk-font-display uk-text-uppercase uk-margin-remove">Buy your NFT</h3>
                                                        <p className="description uk-text-muted dark:uk-text-gray-40">Upload your NFTs and set a title, description and price.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-height-large@m uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                                            <div className="uk-grid uk-grid-small@m uk-flex-column uk-flex-top" data-uk-grid>
                                                <div className="uk-width-auto">
                                                    <div className="uk-card uk-card-xsmall uk-background-gradient uk-flex-middle uk-flex-center uk-radius-medium">
                                                        <i className="uk-icon-small uk-icon-medium@m uk-text-white unicon-text-annotation-toggle"></i>
                                                    </div>
                                                </div>
                                                <div className="uk-width-expand@m">
                                                    <div className="content uk-panel">
                                                        <h3 className="title uk-h5 uk-font-display uk-text-uppercase uk-margin-remove">Create artwork</h3>
                                                        <p className="description uk-text-muted dark:uk-text-gray-40">Upload your NFTs and set a title, description and price.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-height-large@m uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                                            <div className="uk-grid uk-grid-small@m uk-flex-column uk-flex-top" data-uk-grid>
                                                <div className="uk-width-auto">
                                                    <div className="uk-card uk-card-xsmall uk-background-gradient uk-flex-middle uk-flex-center uk-radius-medium">
                                                        <i className="uk-icon-small uk-icon-medium@m uk-text-white unicon-piggy-bank"></i>
                                                    </div>
                                                </div>
                                                <div className="uk-width-expand@m">
                                                    <div className="content uk-panel">
                                                        <h3 className="title uk-h5 uk-font-display uk-text-uppercase uk-margin-remove">List them for sale</h3>
                                                        <p className="description uk-text-muted dark:uk-text-gray-40">Earn ETH and BIT for all your NFTs that you sell on our marketplace.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default HomeThreeMinting