use anchor_lang::prelude::*;

declare_id!("57zehjVnRxbydc814CBWQcuL3iw8J9zm1RPAEUbvKrRG");

#[program]
pub mod nft_pawn_shop {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
