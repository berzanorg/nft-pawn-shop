import Footer from '../components/layouts/Footer';
import HeaderInner from '../components/layouts/HeaderInner';
export default function Template() {
  return (
    
        <>		
        <HeaderInner/>
            <div className="uni-error uk-section uk-section-large@m uk-panel uk-overflow-hidden uk-border-top">
                <div className="uk-container">
                    <div className="uk-width-2xlarge@m uk-margin-auto uk-text-center">
                        <img className="dark:uk-hidden" src="images/404-light.png" alt="Page not found!" />
                        <img className="uk-hidden dark:uk-visible" src="images/404-dark.png" alt="Page not found!" />
                    </div>
                </div>
            </div>
        <Footer/>
        </>
        
  	);
}
