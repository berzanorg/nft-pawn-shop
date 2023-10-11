use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Debt payment deadline is over.")]
    DebtPaymentDeadlineIsOver,

    #[msg("Debt payment deadline is not over.")]
    DebtPaymentDeadlineIsValid,

    #[msg("You do not have enough demo tokens.")]
    InsufficientDemoTokens,

    #[msg("You have no demo NFT.")]
    NoDemoNFT,

    #[msg("No debt found at specified index.")]
    NoDebtFound,

    #[msg("No order found at specified index.")]
    NoOrderFound,

    #[msg("Specifed lender is not the expected lender.")]
    WrongLender,

    #[msg("You do not have access to complete this operation.")]
    UnauthorizedAccess,
}
