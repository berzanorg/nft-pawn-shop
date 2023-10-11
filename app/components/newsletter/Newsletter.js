const Newsletter = () => {
    return(
        <div id="uni_newsletter" className="uni-newsletter uk-section uk-section-xlarge@m uk-panel">
            <div className="uk-container">
                <div className="uk-panel uk-flex-center uk-text-center uk-card uk-card-medium uk-card-xlarge@m uk-card-border uk-overflow-hidden uk-box-shadow-xsmall uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                    <img className="uk-position-top-right uk-visible@m" width="24" src="images/objects/x.png" alt="Object" style={{top: "16%", right: "24%"}} />
                    <img className="uk-position-top-left uk-visible@m" width="16" src="images/objects/circle-01.png" alt="Object" style={{top: "16%", left: "8%"}} />
                    <img className="uk-position-bottom-right uk-visible@m" width="44" src="images/objects/ethereum-02.png" alt="Object" style={{bottom: "16%", right: "8%"}} />
                    <img className="uk-position-bottom-left uk-visible@m" width="32" src="images/objects/dcoin.png" alt="Object" style={{bottom: "24%", left: "16%"}} />
                    <div className="uk-panel uk-position-z-index">
                        <h1 className="uk-h3 uk-h1@m uk-margin-remove uk-font-display uk-text-uppercase">Never miss <span className="uk-text-gradient">a drop!</span></h1>
                        <p className="uk-text-large@m uk-margin-small-top">Subscribe to our super-rare and exclusive drops & collectibles.</p>
                        <div className="uk-grid-2xsmall uk-grid uk-child-width-auto@m uk-flex-middle uk-flex-center uk-margin-small-top uk-margin-medium-top@m" data-uk-grid="">
                            <div>
                                <input type="email" name="email" autoComplete="off" className="uk-input uk-form-medium uk-form-large@m uk-width-large@m" placeholder="Your email.." />
                            </div>
                            <div>
                                <button type="button" className="uk-button uk-button-medium uk-button-large@m uk-button-gradient uk-width-1-1">Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Newsletter;