import { Metaplex } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";



interface NFTs {
    nfts: Array<NFT>
    fetchNFTs(): Promise<void>
}

export interface NFT {
    name: string
    imageUri: string
    mint: string
}

const Context = createContext<NFTs>({} as NFTs)

export const useNFTs = () => useContext(Context)

export const NFTsProvider = ({ children }: { children: React.ReactNode }) => {
    const [nfts, setNFTs] = useState<Array<NFT>>([])
    const { connection } = useConnection()
    const { publicKey } = useWallet()

    const fetchNFTs = useCallback(async () => {
        if (!publicKey) return

        const metaplex = new Metaplex(connection)
        const allNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey })

        const nftPromises = allNfts.slice(0, 10).map(nft => async () => {
            const res = await fetch(nft.uri)
            const jsonMetadata = await res.json() as { image: string }

            return {
                mint: (nft as any).mintAddress,
                imageUri: jsonMetadata.image,
                name: nft.name,
            } satisfies NFT
        })

        const userNFTs: Array<NFT> = await Promise.all(nftPromises.map(promise => promise()))

        setNFTs(userNFTs)
    }, [connection, publicKey])

    useEffect(() => {
        fetchNFTs()
    }, [fetchNFTs])

    return (
        <Context.Provider value={{nfts, fetchNFTs}}>
            {children}
        </Context.Provider>
    )
}