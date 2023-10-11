const Logo = () => {
    return (        
        <>
            <img className="uk-visible dark:uk-hidden w-36" src="/images/logo.png" alt="NFT Pawn Shop" loading="lazy" /> 
            <img className="uk-hidden dark:uk-visible w-36" src="/images/logo.png" alt="NFT Pawn Shop" loading="lazy" /> 
        </>
    )
}

export default Logo;
