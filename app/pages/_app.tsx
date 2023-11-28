import { Bottombar } from '@/components/Bottombar'
import { Navbar } from '@/components/Navbar'
import { NFTsProvider } from '@/contexts/NFTsProvider'
import { PawnShopProvider } from '@/contexts/PawnShopProvider'
import { PopupProvider } from '@/contexts/PopupProvider'
import '@/styles/globals.css'
import '@/styles/wallet-adapter.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'

const endpoint = 'https://devnet.helius-rpc.com/?api-key=db25ae76-7277-45ce-b21a-5be1a61f2f04'

export default function App({ Component, pageProps }: AppProps) {

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                        <NFTsProvider>
                    <PawnShopProvider>
                            <PopupProvider>
                                <Navbar />
                                <Component {...pageProps} />
                                <Bottombar />
                            </PopupProvider>
                    </PawnShopProvider>
                        </NFTsProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )

}
