const Newsletter4 = () =>{
    return(
        <div id="uni_newsletter" className="uni-newsletter uk-section uk-section-xlarge@m uk-panel" data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 100;">
                <div className="uk-container">
                    <div className="uk-panel uk-flex-center uk-text-center uk-card uk-card-medium uk-card-xlarge@m uk-card-border uk-radius-medium uk-radius-xlarge@m uk-overflow-hidden">
                        <img className="uk-position-top-right" width="24" src="images/objects/x.png" alt="Object" style={{top: "16%", right: "16%"}} />
                        <img className="uk-position-top-left" width="16" src="images/objects/circle-01.png" alt="Object" style={{top: "16%", left: "8%"}} />
                        <img className="uk-position-bottom-right" width="44" src="images/objects/ethereum-02.png" alt="Object" style={{bottom: "16%", right: "8%"}} />
                        <img className="uk-position-bottom-left" width="32" src="images/objects/dcoin.png" alt="Object" style={{bottom: "24%", left: "16%"}} />
                        <div className="uk-panel uk-position-z-index" data-anime="targets: > *; opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: anime.stagger(100);">
                            <h2 className="uk-h4 uk-h1@m uk-margin-remove">Never <span className="uk-text-gradient">miss a drop!</span></h2>
                            <p className="uk-text-small uk-text-large@m uk-margin-small-top">Subscribe to our super-rare and exclusive drops & collectibles.</p>
                            <div className="uk-grid-2xsmall uk-grid uk-child-width-auto@m uk-flex-middle uk-flex-center uk-margin-top uk-margin-medium-top@m" data-uk-grid="">
                                <div>
                                    <input type="email" name="email" autocomplete="off" className="uk-input uk-form-medium@m uk-width-medium@m" placeholder="Your email.." />
                                </div>
                                <div>
                                    <button type="button" className="uk-button uk-button-medium@m uk-button-gradient uk-width-1-1">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Newsletter4