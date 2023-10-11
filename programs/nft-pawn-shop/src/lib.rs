use anchor_lang::prelude::*;

mod errors;
use errors::CustomError;

declare_id!("57zehjVnRxbydc814CBWQcuL3iw8J9zm1RPAEUbvKrRG");

#[program]
pub mod nft_pawn_shop {
    use super::*;

    pub fn give_demo_assets(ctx: Context<GiveDemoAssets>) -> Result<()> {
        let user = &mut ctx.accounts.pawn_shop_user;

        user.demo_nfts += 1;
        user.demo_tokens += 100;

        Ok(())
    }

    pub fn place_order(
        ctx: Context<PlaceOrder>,
        duration: u64,
        borrow_amount: u16,
        debt_amount: u16,
    ) -> Result<()> {
        let signer_pubkey = ctx.accounts.signer.key();
        let user_borrower = &mut ctx.accounts.borrower;

        require!(
            signer_pubkey == user_borrower.key(),
            CustomError::UnauthorizedAccess
        );

        require!(user_borrower.demo_nfts > 0, CustomError::NoDemoNFT);

        let order = Order::Some {
            duration,
            borrow_amount,
            debt_amount,
        };

        user_borrower.orders.push(order);

        Ok(())
    }

    pub fn cancel_order(ctx: Context<CancelOrder>, order_index: u32) -> Result<()> {
        let signer_pubkey = ctx.accounts.signer.key();
        let user_borrower = &mut ctx.accounts.borrower;

        require!(
            signer_pubkey == user_borrower.key(),
            CustomError::UnauthorizedAccess
        );

        let order = user_borrower
            .orders
            .get_mut(order_index as usize)
            .ok_or(CustomError::NoOrderFound)?;

        *order = Order::None;

        user_borrower.demo_nfts += 1;

        Ok(())
    }

    pub fn execute_order(ctx: Context<ExecuteOrder>, order_index: u32) -> Result<()> {
        let signer_pubkey = ctx.accounts.signer.key();
        let user_borrower = &mut ctx.accounts.borrower;
        let user_lender = &mut ctx.accounts.lender;

        require!(
            signer_pubkey == user_lender.key(),
            CustomError::UnauthorizedAccess
        );

        let (borrow_amount, debt_amount, duration) =
            match user_borrower.orders.get(order_index as usize) {
                Some(Order::Some {
                    borrow_amount,
                    debt_amount,
                    duration,
                }) => (
                    borrow_amount.to_owned(),
                    debt_amount.to_owned(),
                    duration.to_owned(),
                ),
                _ => return err!(CustomError::NoOrderFound),
            };

        require!(
            user_lender.demo_tokens >= borrow_amount,
            CustomError::InsufficientDemoTokens
        );

        user_lender.demo_tokens -= borrow_amount;
        user_borrower.demo_tokens += borrow_amount;

        let debt = Debt::Some {
            amount: debt_amount,
            lender_pubkey: user_lender.key(),
            deadline: Clock::get()?.unix_timestamp + (duration as i64),
        };

        user_borrower.debts.push(debt);

        let order = user_borrower
            .orders
            .get_mut(order_index as usize)
            .ok_or(CustomError::NoOrderFound)?;

        *order = Order::None;

        Ok(())
    }

    pub fn pay_debt(ctx: Context<PayDebt>, debt_index: u32) -> Result<()> {
        let signer_pubkey = ctx.accounts.signer.key();
        let user_borrower = &mut ctx.accounts.borrower;
        let user_lender = &mut ctx.accounts.lender;

        require!(
            signer_pubkey == user_borrower.key(),
            CustomError::UnauthorizedAccess
        );

        let (amount, deadline, lender_pubkey) = match user_borrower.debts.get(debt_index as usize) {
            Some(Debt::Some {
                amount,
                deadline,
                lender_pubkey,
            }) => (
                amount.to_owned(),
                deadline.to_owned(),
                lender_pubkey.to_owned(),
            ),
            _ => return err!(CustomError::NoOrderFound),
        };

        require!(
            user_borrower.demo_tokens >= amount,
            CustomError::InsufficientDemoTokens
        );

        require!(
            deadline > Clock::get()?.unix_timestamp,
            CustomError::DebtPaymentDeadlineIsOver
        );

        require!(lender_pubkey == user_lender.key(), CustomError::WrongLender);

        user_borrower.demo_tokens -= amount;
        user_lender.demo_tokens += amount;

        let debt = user_borrower
            .debts
            .get_mut(debt_index as usize)
            .ok_or(CustomError::NoDebtFound)?;

        *debt = Debt::None;

        user_borrower.demo_nfts += 1;

        Ok(())
    }

    pub fn seize(ctx: Context<Seize>, debt_index: u32) -> Result<()> {
        let signer_pubkey = ctx.accounts.signer.key();
        let user_borrower = &mut ctx.accounts.borrower;
        let user_lender = &mut ctx.accounts.lender;

        require!(
            signer_pubkey == user_lender.key(),
            CustomError::UnauthorizedAccess
        );

        let (_, deadline, lender_pubkey) = match user_borrower.debts.get(debt_index as usize) {
            Some(Debt::Some {
                amount,
                deadline,
                lender_pubkey,
            }) => (
                amount.to_owned(),
                deadline.to_owned(),
                lender_pubkey.to_owned(),
            ),
            _ => return err!(CustomError::NoOrderFound),
        };

        require!(
            deadline < Clock::get()?.unix_timestamp,
            CustomError::DebtPaymentDeadlineIsValid
        );

        require!(lender_pubkey == user_lender.key(), CustomError::WrongLender);

        let debt = user_borrower
            .debts
            .get_mut(debt_index as usize)
            .ok_or(CustomError::NoDebtFound)?;

        *debt = Debt::None;

        user_lender.demo_nfts += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Seize<'info> {
    #[account(mut)]
    pub lender: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub borrower: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct PayDebt<'info> {
    #[account(mut)]
    pub lender: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub borrower: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteOrder<'info> {
    #[account(mut)]
    pub lender: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub borrower: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub borrower: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct PlaceOrder<'info> {
    #[account(mut)]
    pub borrower: Account<'info, PawnShopUser>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct GiveDemoAssets<'info> {
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
    /// Amount of demo tokens this user owns.
    demo_tokens: u16,
    /// Amount of demo NFTs this user owns.
    demo_nfts: u16,
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
pub enum Order {
    Some {
        /// Amount of demo tokens to be borrowed.
        borrow_amount: u16,
        /// Amount of debt to be repaid.
        debt_amount: u16,
        /// Duration of the debt.
        duration: u64,
    },
    None,
}

/// A `Debt` is stored inside the debtor's account.
///
/// It represents a debt that may or may not be paid.
#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub enum Debt {
    Some {
        /// Amount of debt to be repaid.
        amount: u16,
        /// Address of the lender.
        lender_pubkey: Pubkey,
        /// Debt payment deadline as timestamp.
        deadline: i64,
    },
    None,
}
