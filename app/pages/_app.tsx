import { Bottombar } from '@/components/Bottombar'
import { Navbar } from '@/components/Navbar'
import { PopupRequestDemoAssets } from '@/components/PopupRequestDemoAssets'
import { DappProvider } from '@/contexts/DappProvider'
import { PopupProvider } from '@/contexts/PopupProvider'
import '@/styles/globals.css'
import '@/styles/wallet-adapter.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'

export default function App({ Component, pageProps }: AppProps) {

    const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Devnet), [])

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
                    <DappProvider>
                        <PopupProvider>
                            <Navbar />
                            <PopupRequestDemoAssets />
                            <Component {...pageProps} />
                            <Bottombar />
                        </PopupProvider>
                    </DappProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )

}
