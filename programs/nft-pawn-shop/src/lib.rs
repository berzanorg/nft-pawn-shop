use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};


mod errors;
use errors::CustomError;

declare_id!("CaCpQaHiHgymut7cP9Jj7UkJXZh25fTdZftLeycWuGPV");

#[program]
pub mod nft_pawn_shop {

    use anchor_lang::solana_program::{system_instruction, program::invoke_signed};

    use super::*;

    pub fn place_order(ctx: Context<PlaceOrder>, duration: i64, borrow_amount: u64, debt_amount: u64) -> Result<()> {
        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.customer_nft_account.to_account_info(),
            to: ctx.accounts.order_pda_nft_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };

        let token_transfer_context = CpiContext::new(
            cpi_program,
            transfer,
        );

        token::transfer(token_transfer_context, 1)?;

        ctx.accounts.order.customer = ctx.accounts.signer.key();
        ctx.accounts.order.mint = ctx.accounts.mint.key();
        ctx.accounts.order.duration = duration;
        ctx.accounts.order.borrow_amount = borrow_amount;
        ctx.accounts.order.debt_amount = debt_amount;
        ctx.accounts.order.pawn_broker = None;
        ctx.accounts.order.deadline = None;

        Ok(())
    }

    pub fn execute_order(ctx: Context<ExecuteOrder>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;

        require!(ctx.accounts.order.pawn_broker.is_none(), CustomError::OrderIsAlreadyExecuted);
        require!(ctx.accounts.order.deadline.is_none(), CustomError::OrderIsAlreadyExecuted);

        require!(ctx.accounts.signer.lamports() > ctx.accounts.order.borrow_amount,  CustomError::NotEnoughBalance);

        let lamports_transfer_instruction = system_instruction::transfer(ctx.accounts.signer.key, ctx.accounts.customer.key, ctx.accounts.order.borrow_amount);
        invoke_signed(
            &lamports_transfer_instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                ctx.accounts.customer.clone(), 
                ctx.accounts.system_program.to_account_info()
            ], 
            &[]
        )?;
        
        ctx.accounts.order.pawn_broker = Some(ctx.accounts.signer.key());
        ctx.accounts.order.deadline = Some(current_time + ctx.accounts.order.duration);

        Ok(())
    }

    pub fn pay_debt(ctx: Context<PayDebt>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;

        require!(ctx.accounts.order.pawn_broker.is_some(), CustomError::OrderIsNotExecutedYet);
        require!(ctx.accounts.order.deadline.is_some(), CustomError::OrderIsNotExecutedYet);

        require!(current_time < ctx.accounts.order.deadline.unwrap(), CustomError::DebtDeadlineIsDone);

        require!(ctx.accounts.signer.lamports() > ctx.accounts.order.debt_amount,  CustomError::NotEnoughBalance);

        let lamports_transfer_instruction = system_instruction::transfer(
            ctx.accounts.signer.key,
            ctx.accounts.pawn_broker.key,
            ctx.accounts.order.debt_amount
        );
        
        invoke_signed(
            &lamports_transfer_instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                ctx.accounts.pawn_broker.clone(), 
                ctx.accounts.system_program.to_account_info()
            ], 
            &[]
        )?;

        let seeds = &[
            //Reconstructing the seed
            b"order".as_ref(),
            &ctx.accounts.signer.key().to_bytes(),
            &ctx.accounts.mint.key().to_bytes(),
            &[ctx.bumps.order],
        ];

        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.order_pda_nft_account.to_account_info(),
            to: ctx.accounts.customer_nft_account.to_account_info(),
            authority: ctx.accounts.order.to_account_info(),
        };

        let token_transfer_context = CpiContext::new_with_signer(
            cpi_program,
            transfer,
            signer,
        );

        token::transfer(token_transfer_context, 1)?;

        Ok(())
    }

    pub fn seize_nft(ctx: Context<SeizeNFT>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;
        
        require!(ctx.accounts.order.pawn_broker.is_some(), CustomError::OrderIsNotExecutedYet);
        require!(ctx.accounts.order.deadline.is_some(), CustomError::OrderIsNotExecutedYet);

        require!(current_time > ctx.accounts.order.deadline.unwrap(), CustomError::DebtDeadlineIsNotDone);

        let seeds = &[
            //Reconstructing the seed
            b"order".as_ref(),
            &ctx.accounts.customer.key().to_bytes(),
            &ctx.accounts.mint.key().to_bytes(),
            &[ctx.bumps.order],
        ];

        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.order_pda_nft_account.to_account_info(),
            to: ctx.accounts.pawn_broker_nft_account.to_account_info(),
            authority: ctx.accounts.order.to_account_info(),
        };

        let token_transfer_context = CpiContext::new_with_signer(
            cpi_program,
            transfer,
            signer,
        );

        token::transfer(token_transfer_context, 1)?;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct PlaceOrder<'info> {
    #[account(
        init_if_needed, 
        seeds=[b"order", signer.key().as_ref(), mint.key().as_ref()],
        bump,
        payer = signer, 
        space = Order::INIT_SPACE + 8,
    )]
    pub order: Account<'info, Order>,

    #[account(
        mut,
        constraint = customer_nft_account.owner.key() == signer.key(),
        constraint = customer_nft_account.amount == 1, 
        constraint = mint.key() == customer_nft_account.mint,
    )]
    pub customer_nft_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer, 
        associated_token::mint = mint, 
        associated_token::authority = order,
    )]
    pub order_pda_nft_account: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteOrder<'info> {
    #[account(
        mut, 
        seeds=[b"order", customer.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = customer.key() == order.customer,
        constraint = mint.key() == order.mint
    )]
    pub order: Account<'info, Order>,

    #[account(
        mut,
        constraint = order_pda_nft_account.owner == order.key(),
        constraint = order_pda_nft_account.mint == mint.key(),
        constraint = order_pda_nft_account.amount == 1, 
    )]
    pub order_pda_nft_account: Account<'info, TokenAccount>,

    /// CHECK: It is just a user account.
    #[account(mut)]
    pub customer: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayDebt<'info> {
    #[account(
        mut, 
        seeds=[b"order", signer.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = signer.key() == order.customer,
        constraint = mint.key() == order.mint,
        close = signer
    )]
    pub order: Account<'info, Order>,

    #[account(
        mut,
        constraint = order_pda_nft_account.owner == order.key(),
        constraint = order_pda_nft_account.mint == mint.key(),
        constraint = order_pda_nft_account.amount == 1, 
    )]
    pub order_pda_nft_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = customer_nft_account.owner.key() == signer.key(),
    )]
    pub customer_nft_account: Account<'info, TokenAccount>,

    /// CHECK: It is just a user account.
    #[account(mut)]
    pub pawn_broker: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct SeizeNFT<'info> {
    #[account(
        mut, 
        seeds=[b"order", customer.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = customer.key() == order.customer,
        close = customer
    )]
    pub order: Account<'info, Order>,

    #[account(
        mut,
        constraint = order_pda_nft_account.owner == order.key(),
        constraint = order_pda_nft_account.mint == mint.key(),
        constraint = order_pda_nft_account.amount == 1, 
    )]
    pub order_pda_nft_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer, 
        associated_token::mint = mint, 
        associated_token::authority = signer,
    )]
    pub pawn_broker_nft_account: Account<'info, TokenAccount>,
    
    /// CHECK: It is just a user account.
    #[account(mut)]
    pub customer: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(InitSpace)]
#[account]
pub struct Order {
    customer: Pubkey,
    mint: Pubkey,
    duration: i64,
    borrow_amount: u64,
    debt_amount: u64,
    pawn_broker: Option<Pubkey>, 
    deadline: Option<i64>,
}

