use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("You don't have enough SOL balance.")]
    NotEnoughBalance,
}
