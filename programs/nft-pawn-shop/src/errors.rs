use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("You don't have enough SOL balance.")]
    NotEnoughBalance,
    #[msg("Debt payment deadline is done.")]
    DebtDeadlineIsDone,
    #[msg("Debt payment deadline is not done.")]
    DebtDeadlineIsNotDone,
    #[msg("Order is already executed.")]
    OrderIsAlreadyExecuted,
    #[msg("Order is not executed yet.")]
    OrderIsNotExecutedYet,
    #[msg("Order is done.")]
    OrderIsDone,
}
