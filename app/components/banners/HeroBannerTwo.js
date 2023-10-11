const HeroBannerOne = () => {
    return (        
        <>
            <div className="uni-hero uk-hero-2 uk-section uk-padding-remove uk-panel uk-overflow-hidden headerbanner2">
                <div className="uk-position-top"  data-uk-height-viewport="">
                    <div className="uk-position-cover uk-background-cover uk-opacity-20" style={{backgroundImage: 'url("images/collection-grid.png")'
    }} data-uk-img></div>
                </div>
                <div className="uk-position-top uk-position-z-index-negative uk-overflow-hidden uk-blend-overlay">
                    <img className="uk-position-top-left uk-position-fixed uk-blur-large" style={{left: "-4%", top: "-4%"}} width="500" src="images/gradient-circle.svg" alt="Circle" />
                    <img className="uk-position-bottom-right uk-position-fixed uk-blur-large" style={{right: "-4%", bottom: "-4%"}} width="500" src="images/gradient-circle.svg" alt="Circle" />
                </div>
                <div className="uk-container">
                    <div className="uk-section uk-flex-center uk-flex-middle" data-uk-height-viewport="">
                        <div className="uk-card uk-flex-center uk-text-center">
                            <div className="uk-panel uk-width-2xlarge@m uk-position-z-index">
                                <img className="uk-position-top-left" width="44" src="images/objects/ethereum-01.png" alt="object" style={{top: "-20%", left: "50%"}} />
                                <img className="uk-position-top-right" width="24" src="images/objects/x.png" alt="object" style={{top: "20%", right: "-20%"}} />
                                <img className="uk-position-left" width="16" src="images/objects/circle-01.png" alt="object" style={{top: "16%", left: "-16%"}} />
                                <img className="uk-position-bottom-left" width="44" src="images/objects/bitcoin-01.png" alt="object" style={{bottom: "-16%", left: "16%"}} />
                                <img className="uk-position-bottom-right" width="24" src="images/objects/circle-03.png" alt="object" style={{bottom: "-16%", right: "16%"}} />
                                <h2 className="uk-h2 uk-heading-d1@m">Landing Platform NFT Pawn Shop</h2>
                                <p className="uk-text-lead">Gain wealth by pawning your NFTs.</p>
                                <a href="#uni_collection" className="uk-button uk-button-medium uk-button-large@m uk-button-gradient uk-margin-medium-top">Launch App</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HeroBannerOne;