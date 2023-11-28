# 🏪 NFT Pawn Shop 🏪  [live demo](https://solana-devs.github.io/nft-pawn-shop/)
### What Is NFT Pawn Shop?
It is a decentralized application & a standard for the entire Solana ecosystem.

> The prototype is first developed for a local Solana hackathon as a team. 
> <br>
>  But a production version is developed for [Backdrop](https://backdrop.so/)'s hackathon by me, [Berzan](https://x.com/BerzanXYZ).
> <br>
> I'd like to thank my team members for their support.

### Why Does It Exist?
It allows NFT owners to borrow money using their NFTs as collateral. <br>
It allows crypto holders to lend their crypto and earn interest. <br>
Any dapp and NFT marketplace can integrate it to provide the same services. 

![nft pawn shop logo](/.github/assets/logo.png)


### What Technologies Are Used?
⚓ We used [Anchor](https://www.anchor-lang.com/) framework to develop the smart contract. <br>
⚛️ We used [React](https://react.dev/) with [Next.js](https://nextjs.org/) to develop the web interface. <br>
🌬️ We used [TailwindCSS](https://tailwindcss.com/) to rapidly style the website without ever leaving HTML.

### Who Are The Team Members? 
Emre: A blockchain & AI developer for a very long time. <br>
Zeyn: The youngest in the team but the oldest in the meme game. <br>
Berzan: A developer and a proud crypto ecosystem member. <br>
Omer: A Rust developer working on various blockchains.  <br>


# 💻 Development 💻
>This repository consists of both the smart contract and the web interface. <br>
This project is initialized using [`anchor init`](https://www.anchor-lang.com/docs/hello-world) command. <br>
The web interface is located in [`app/`](/app/) folder.

### How To Setup The Environment?
[Node.js](https://nodejs.org/en/download), [Yarn](https://yarnpkg.com/), [Rust](https://www.rust-lang.org/), [Solana](https://docs.solana.com/cli/install-solana-cli-tools) and [Anchor](https://www.anchor-lang.com/docs/installation) are required.<br>
You can locally install them all, however we recommend you to use [Dev Containers](https://containers.dev/).<br>
It is the fastest way to setup a development environment. <br>
If you already have  [VS Code](https://code.visualstudio.com/) and [Docker](https://www.docker.com/) installed, [VS Code](https://code.visualstudio.com/) will warn you to open the project in a [Dev Container](https://containers.dev/).<br>
We also added some extensions to improve your development experience in the [Dev Container](https://containers.dev/).


### How To Start Developing?



1 - First you have to clone the repository.
```sh
git clone https://github.com/solana-devs/nft-pawn-shop.git
```
2 - Secondly set the working directory.
```sh
cd nft-pawn-shop/
```

### How To Develop The Smart Contract? (A Program In Solana's Jargon)  

You can build the program.
```sh
anchor build
```
You can also run the tests.
```sh
anchor test
```

### How To Deploy The Progam To Solana Devnet?
If you want to deploy the program, you have to replace the program ID. <br>
Get the address from the keypair.
```sh
solana address -k target/deploy/nft_pawn_shop-keypair.json 
```
After running this command copy the address it printed. <br>
Then replace the address in [`Anchor.toml`](/Anchor.toml) and [`programs/nft-pawn-shop/src/lib.rs`](/programs/nft-pawn-shop/src/lib.rs) files.

Change configuration to use devnet as default.
```sh
solana config set --url devnet
```

Request some worthless (but worthy for devs) SOL to deploy.
```sh
solana airdrop 4
```

Finally you can deploy the program to Solana Devnet.
```sh
anchor deploy
```

### How To Develop The Web Interface?
The web interface resides in [`app/`](/app/) folder. <br>
So you have to set the working directory as below.
```sh
cd app/
```  

It is a classical [Next.js](https://nextjs.org/) project. <br>
So you can be familiar with the commands.

Install dependencies.
```sh
npm install
```

Start the development server.
```sh
npm run dev
```

Make a production build.
```sh
npm run build
```


<br>

> ❤️ Made with love by **Omer**, **Berzan**, **Emre**, and **Zeyn**.