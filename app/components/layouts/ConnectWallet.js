import Link from "next/link"

const ConnectWallet =() => {
    return(
        <div id="uni_connect_wallet" className="uk-modal-full uk-modal" data-uk-modal>
            <div className="uk-modal-dialog">
                <div className="uk-position-top uk-position-z-index-negative" data-uk-height-viewport="">
                    <div className="uk-position-cover uk-background-cover uk-opacity-10 dark:uk-hidden" style={{backgroundImage:'url("images/gradient-01.png")'}}></div>
                    <div className="uk-position-cover uk-background-cover uk-opacity-20 uk-hidden dark:uk-visible" style={{backgroundImage:'url("images/gradient-01.png")'}}></div>
                </div>
                <a className="uk-modal-close-full uk-close-large uk-position-small">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <line fill="none" stroke="#000" strokeWidth="1.4" x1="1" y1="1" x2="19" y2="19"></line>
                        <line fill="none" stroke="#000" strokeWidth="1.4" x1="19" y1="1" x2="1" y2="19"></line>
                    </svg>
                </a>
                <div className="uk-container">
                    <div className="uk-grid uk-flex-center uk-flex-middle uk-child-width-1-2@m uk-section">
                        <div>
                            <div className="uk-panel uk-text-center">
                                <h2 className="uk-h5 uk-h3@s uk-h2@l uk-margin-remove">Connect your wallet</h2>
                                <div className="uk-grid uk-grid-xsmall uk-grid-small@m uk-child-width-1-2@m uk-margin-medium-top uk-margin-large-top@m">
                                    <div>
                                        <div className="uk-panel uk-card uk-card-small uk-card-medium@m uk-card-border uk-radius-medium uk-radius-large@m uk-box-shadow-hover-small hover:uk-border-primary">
                                            <Link href="#metamask" className="uk-position-cover"></Link>
                                            <img src="images/icon-metamask.svg" alt="metamask" />
                                            <h4 className="uk-text-bold uk-h5@m uk-margin-small-top uk-margin-medium-top@m">Metamask</h4>
                                        </div>
                                    </div>
                                    <div className="gap-collect">
                                        <div className="uk-panel uk-card uk-card-small uk-card-medium@m uk-card-border uk-radius-medium uk-radius-large@m uk-box-shadow-hover-small hover:uk-border-primary">
                                            <Link href="#bitgo" className="uk-position-cover"></Link>
                                            <img src="images/icon-bitgo.svg" alt="bitgo" />
                                            <h4 className="uk-text-bold uk-h5@m uk-margin-small-top uk-margin-medium-top@m">BitGo</h4>
                                        </div>
                                    </div>
                                    <div className="uk-grid-margin uk-first-column">
                                        <div className="uk-panel uk-card uk-card-small uk-card-medium@m uk-card-border uk-radius-medium uk-radius-large@m uk-box-shadow-hover-small hover:uk-border-primary">
                                            <Link href="#trustwallet" className="uk-position-cover"></Link>
                                            <img src="images/icon-trustwallet.svg" alt="trustwallet" />
                                            <h4 className="uk-text-bold uk-h5@m uk-margin-small-top uk-margin-medium-top@m">Trust Wallet</h4>
                                        </div>
                                    </div>
                                    <div className="uk-grid-margin uk-first-column">
                                        <div className="uk-panel uk-card uk-card-small uk-card-medium@m uk-card-border uk-radius-medium uk-radius-large@m uk-box-shadow-hover-small hover:uk-border-primary">
                                            <Link href="#coinbase" className="uk-position-cover"></Link>
                                            <img src="images/icon-coinbase.svg" alt="coinbase" />
                                            <h4 className="uk-text-bold uk-h5@m uk-margin-small-top uk-margin-medium-top@m">Coinbase</h4>
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
export default ConnectWallet