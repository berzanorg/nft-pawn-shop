import Link from "next/link"

const ProcessOne = () =>{
    return(
        <div id="uni_process" className="uni-process uk-section uk-section-xlarge@m uk-panel">
            <div className="uk-container">
                <header className="uk-grid-xsmall uk-flex-center uk-flex-middle uk-grid" data-uk-grid data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 100;">
                    <div className="uk-panel uk-text-center">
                        <h2 className="uk-h3 uk-h1@m">How it <span className="uk-text-gradient">works!</span></h2>
                    </div>
                </header>
                <div className="uk-panel uk-margin-medium-top uk-margin-2xlarge-top@m">
                    <div className="uk-grid uk-grid-2xlarge uk-grid-3xlarge@m uk-child-width-1-1" data-uk-grid="">
                        <div>
                            <div className="uk-panel">
                                <div className="uk-grid uk-grid-3xlarge@m uk-flex-middle uk-child-width-1-2@m" data-uk-grid="">
                                    <div>
                                        <div className="uk-panel uk-image-middle uk-overflow-hidden uk-radius uk-radius-large@m" data-anime="opacity:[0, 1]; translateX:[-24, 0]; onview: -250; delay: 200;">
                                            <img src="images/features-07.png" alt="890 NFT Pawn Shop's Collective NFT" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uk-panel" data-anime="opacity:[0, 1]; translateX:[24, 0]; onview: -250; delay: 300;">
                                            <span className="uk-h6 uk-h5@m uk-text-gradient">01.</span>
                                            <h3 className="uk-h3 uk-h2@m">Setup and connect your wallet.</h3>
                                            <p className="uk-text-large@m uk-margin-medium-top@m">Use Trust Wallet, Metamask or any wallet to connect to the app.</p>
                                            <p className="uk-text-large@m">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam, temporibus.</p>
                                            <Link href="#" className="uk-button uk-button-link uk-button-large@m">
                                                <span>Learn more</span>
                                                <i className="uk-icon unicon-arrow-up-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="uk-panel">
                                <div className="uk-grid uk-grid-3xlarge@m uk-flex-middle uk-child-width-1-2@m" data-uk-grid="">
                                    <div>
                                        <div className="uk-panel uk-image-middle uk-overflow-hidden uk-radius uk-radius-large@m" data-anime="opacity:[0, 1]; translateX:[-24, 0]; onview: -250; delay: 200;">
                                            <img src="images/features-05.png" alt="890 NFT Pawn Shop's Collective NFT" />
                                        </div>
                                    </div>
                                    <div className="uk-flex-first@m">
                                        <div className="uk-panel" data-anime="opacity:[0, 1]; translateX:[24, 0]; onview: -250; delay: 300;">
                                            <span className="uk-h6 uk-h5@m uk-text-gradient">02.</span>
                                            <h3 className="uk-h3 uk-h2@m">Create your own digital artwork</h3>
                                            <p className="uk-text-large@m uk-margin-medium-top@m">Quality comes first. we took our time to plan out everything and build our production pipeline for a good quality artworks.</p>
                                            <p className="uk-text-large@m">Starting the production on the procedurally generated planets and the smart contract for minting.</p>
                                            <Link href="#" className="uk-button uk-button-link uk-button-large@m">
                                                <span>Learn more</span>
                                                <i className="uk-icon unicon-arrow-up-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="uk-panel">
                                <div className="uk-grid uk-grid-3xlarge@m uk-flex-middle uk-child-width-1-2@m" data-uk-grid="">
                                    <div>
                                        <div className="uk-panel uk-image-middle uk-overflow-hidden uk-radius uk-radius-large@m" data-anime="opacity:[0, 1]; translateX:[-24, 0]; onview: -250; delay: 200;">
                                            <img src="images/features-06.png" alt="Create your own NFT" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uk-panel" data-anime="opacity:[0, 1]; translateX:[24, 0]; onview: -250; delay: 300;">
                                            <span className="uk-h6 uk-h5@m uk-text-gradient">03.</span>
                                            <h3 className="uk-h3 uk-h2@m">
                                                Choose a platform <br />
                                                to sell your NFT
                                            </h3>
                                            <p className="uk-text-large@m uk-margin-medium-top@m">Earn ETH and BIT for all your NFTs that you sell on our marketplace.</p>
                                            <p className="uk-text-large@m">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae doloremque a officiis quasi autem!</p>
                                            <Link href="#" className="uk-button uk-button-link uk-button-large@m">
                                                <span>Learn more</span>
                                                <i className="uk-icon unicon-arrow-up-right"></i>
                                            </Link>
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
export default ProcessOne