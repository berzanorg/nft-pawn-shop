FROM node:bookworm-slim

# update list of available packages
RUN apt update 

# install dependencies
RUN apt install -y \
    curl \
    git \
    build-essential

# install Rust language
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# install Solana tools
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.17.1/install)"

# install Anchor CLI
RUN /root/.cargo/bin/cargo install --git https://github.com/coral-xyz/anchor --tag v0.28.0 anchor-cli --locked