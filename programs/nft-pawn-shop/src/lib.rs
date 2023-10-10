use anchor_lang::prelude::*;

declare_id!("57zehjVnRxbydc814CBWQcuL3iw8J9zm1RPAEUbvKrRG");

#[program]
pub mod nft_pawn_shop {
    use super::*;

    pub fn initialize_demo_nft_counter(_ctx: Context<InitializeDemoNFTCounter>) -> Result<()> {
        Ok(())
    }

    pub fn send_demo_nft(ctx: Context<SendDemoNFT>) -> Result<()> {
        let demo_nft_counter = &mut ctx.accounts.demo_nft_counter;

        let first_demo_nft = demo_nft_counter.count;
        let second_demo_nft = demo_nft_counter.count + 1;

        demo_nft_counter.count += 2;

        ctx.accounts.pawn_shop_user.demo_nfts.push(first_demo_nft);
        ctx.accounts.pawn_shop_user.demo_nfts.push(second_demo_nft);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDemoNFTCounter<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + DemoNFTCounter::INIT_SPACE,
        seeds = [b"demo_nft_counter", signer.key().as_ref()],
        bump
    )]
    pub demo_nft_counter: Account<'info, DemoNFTCounter>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendDemoNFT<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + PawnShopUser::INIT_SPACE,
        seeds = [b"pawn_shop_user", signer.key().as_ref()],
        bump
    )]
    pub pawn_shop_user: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub demo_nft_counter: Account<'info, DemoNFTCounter>,
}

/// It represents the demo nft counter which is needed to keep track of demo NFTs given.
#[account]
#[derive(InitSpace)]
pub struct DemoNFTCounter {
    count: u16,
}

/// It represents an account that uses NFT Pawn Shop.
#[account]
#[derive(InitSpace)]
pub struct PawnShopUser {
    /// Demo NFTs this user owns.
    #[max_len(32)]
    demo_nfts: Vec<u16>,
    /// Orders this user gave.
    #[max_len(32)]
    orders: Vec<Order>,
    /// Debts this user have.
    #[max_len(32)]
    debts: Vec<Debt>,
}

/// An `Order` is stored inside the account giving the order.
///
/// It represents a request to borrow money.
#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Order {
    /// Demo NFT to be pawned.
    nft: u16,
    /// The duration of the debt.
    duration: u32,
    /// The amount to be borrowed.
    borrow_amount: u64,
    /// The amount of debt to be repaid.
    debt_amount: u64,
}

/// A `Debt` is stored inside the debtor's account.
///
/// It represents a debt that may or may not be paid.
#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Debt {
    /// Demo NFT which is pawned.
    nft: u16,
    /// Debt payment deadline.
    deadline: u32,
    /// The amount of debt to be repaid.
    amount: u64,
    /// The address of the lender.
    lender: Pubkey,
}
