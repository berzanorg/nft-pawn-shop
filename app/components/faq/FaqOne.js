import Link from "next/link";

const FaqOne = () => {
    return(
        <>
            <div id="uni_faq" className="uni-faq uk-section uk-section-large@m uk-panel uk-overflow-hidden uk-padding-2xlarge-bottom@m">
                <div className="uk-container">
                    <header className="uk-grid-xsmall uk-flex-center uk-flex-middle uk-text-center uk-child-width-auto@m uk-grid" data-uk-grid data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 100;">
                        <div className="uk-panel">
                            <h2 className="uk-h3 uk-h1@m">FAQ</h2>
                        </div>
                    </header>
                    <div className="uk-panel uk-margin-medium-top uk-margin-2xlarge-top@m">
                        <ul className="uk-card uk-card-small uk-card-large@m uk-radius uk-radius-large@m uk-width-2xlarge@m uk-margin-auto uk-box-shadow-xsmall dark:uk-background-white-5" data-uk-accordion="collapsible: false" data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 100;">
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">What is NFT Pawn Shop's NFT Collection?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
                                </div>
                            </li>
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">How we can buy and invest NFT?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
                                </div>
                            </li>
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">Why we should choose NFT Pawn Shop's NFT?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
                                </div>
                            </li>
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">Where we can buy and sell NFts?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
                                </div>
                            </li>
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">How secure is this token?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
                                </div>
                            </li>
                            <li>
                                <Link className="uk-accordion-title uk-h5@m" href="#">What is your contract address?</Link>
                                <div className="uk-accordion-content uk-padding-small-bottom">
                                    <p className="uk-text-small uk-text-large@m uk-text-muted">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FaqOne;