import Head from 'next/head';
import Header2 from '../components/layouts/Header2';
import HeroBannerTwo from '../components/banners/HeroBannerTwo';
import Divider from '../components/Divider';
import HomeTwoCta from '../components/cta/HomeTwoCta';
import HomeTwoNumber from '../components/number/HomeTwoNumber';
import HomeOneCollection from '../components/collection/HomeOneCollection';
import HomeTwoRoadMap from '../components/roadmap/HomeTwoRoadMap';
import TeamTwo from '../components/team/TeamTwo';
import FaqOne from '../components/faq/FaqOne';
import ChoseUs from '../components/choseus/ChoseUS';
import HomeTwoAbout from '../components/about/HomeTwoAbout';
import Footer2 from '../components/layouts/Footer2';
export default function Template() {
  return (
		
        <div className="wrap uk-overflow-hidden">
			<Head>
				<title>NFT Pawn Shop</title>
			</Head>
			<Header2/>
			<HeroBannerTwo/>
			<HomeOneCollection/>
			<Divider/>    
			<ChoseUs/>   
			<Divider/> 
			<HomeTwoAbout/>
			<Divider/> 
			<TeamTwo/>
			<Divider/> 
			<HomeTwoNumber/>
			<Divider/> 
			<HomeTwoRoadMap/>
			<Divider/> 
			<FaqOne/>
			<Divider/>
			<HomeTwoCta/>		
			<Footer2/>
		</div>     
        
  	);
}
