import { PopupRequestDemoAssets } from "@/components/PopupRequestDemoAssets";
import { Main } from "@/components/Main";
import { NFTCard } from "@/components/NFTCard";
import { useDapp } from "@/contexts/DappProvider";

export default function Home() {

  const { orders } = useDapp()

  return (
    <Main>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold md:text-4xl">Listed NFTs</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
          {orders?.map((order) => <NFTCard key={`o${order.account}${order.index}`} order={order} />)}
        </div>
      </div>
    </Main>
  )
}
