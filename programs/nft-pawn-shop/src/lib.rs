use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};


mod errors;
use errors::CustomError;

declare_id!("52sADXgNGPisU3pAtfHZhJ6j7s9j48rs4Pin4JMbF2W9");

#[program]
pub mod nft_pawn_shop {

    use anchor_lang::solana_program::{system_instruction, program::invoke_signed};

    use super::*;

    pub fn place_order(ctx: Context<PlaceOrder>, duration: i64, lend_amount: u64, debt_amount: u64) -> Result<()> {
        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.lender_nft_account.to_account_info(),
            to: ctx.accounts.order_pda_nft_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };

        let token_transfer_context = CpiContext::new(
            cpi_program,
            transfer,
        );

        token::transfer(token_transfer_context, 1)?;

        ctx.accounts.order.lender = ctx.accounts.signer.key();
        ctx.accounts.order.mint = ctx.accounts.mint.key();
        ctx.accounts.order.duration = duration;
        ctx.accounts.order.lend_amount = lend_amount;
        ctx.accounts.order.debt_amount = debt_amount;

        Ok(())
    }

    pub fn execute_order(ctx: Context<ExecuteOrder>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;

        require!(ctx.accounts.signer.lamports() > ctx.accounts.order.lend_amount,  CustomError::NotEnoughBalance);

        let seeds = &[
            //Reconstructing the seed
            b"order".as_ref(),
            &ctx.accounts.lender.key().to_bytes(),
            &ctx.accounts.mint.key().to_bytes(),
            &[ctx.bumps.order],
        ];

        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.order_pda_nft_account.to_account_info(),
            to: ctx.accounts.pawned_nft_pda_nft_account.to_account_info(),
            authority: ctx.accounts.order.to_account_info(),
        };

        let token_transfer_context = CpiContext::new_with_signer(
            cpi_program,
            transfer,
            signer,
        );

        token::transfer(token_transfer_context, 1)?;


        let lamports_transfer_instruction = system_instruction::transfer(ctx.accounts.signer.key, ctx.accounts.lender.key, ctx.accounts.order.lend_amount);
        invoke_signed(
            &lamports_transfer_instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                ctx.accounts.lender.clone(), 
                ctx.accounts.system_program.to_account_info()
            ], 
            &[]
        )?;
        
        ctx.accounts.pawned_nft.lender = ctx.accounts.lender.key();
        ctx.accounts.pawned_nft.pawn_broker = ctx.accounts.signer.key();
        ctx.accounts.pawned_nft.mint = ctx.accounts.mint.key();
        ctx.accounts.pawned_nft.deadline = current_time + ctx.accounts.order.duration;
        ctx.accounts.pawned_nft.debt_amount = ctx.accounts.order.debt_amount;

        Ok(())
    }

    pub fn pay_debt(ctx: Context<PayDebt>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;

        require!(current_time < ctx.accounts.pawned_nft.deadline, CustomError::DebtDeadlineIsDone);

        require!(ctx.accounts.signer.lamports() > ctx.accounts.pawned_nft.debt_amount,  CustomError::NotEnoughBalance);

        let seeds = &[
            //Reconstructing the seed
            b"pawned_nft".as_ref(),
            &ctx.accounts.pawn_broker.key().to_bytes(),
            &ctx.accounts.mint.key().to_bytes(),
            &[ctx.bumps.pawned_nft],
        ];

        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.pawned_nft_pda_nft_account.to_account_info(),
            to: ctx.accounts.lender_nft_account.to_account_info(),
            authority: ctx.accounts.pawned_nft.to_account_info(),
        };

        let token_transfer_context = CpiContext::new_with_signer(
            cpi_program,
            transfer,
            signer,
        );

        token::transfer(token_transfer_context, 1)?;


        let lamports_transfer_instruction = system_instruction::transfer(ctx.accounts.signer.key, ctx.accounts.pawn_broker.key, ctx.accounts.pawned_nft.debt_amount);
        
        invoke_signed(
            &lamports_transfer_instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                ctx.accounts.pawn_broker.clone(), 
                ctx.accounts.system_program.to_account_info()
            ], 
            &[]
        )?;

        Ok(())
    }

    pub fn seize_nft(ctx: Context<SeizeNFT>) -> Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;

        require!(current_time > ctx.accounts.pawned_nft.deadline, CustomError::DebtDeadlineIsNotDone);

        let seeds = &[
            //Reconstructing the seed
            b"pawned_nft".as_ref(),
            &ctx.accounts.signer.key().to_bytes(),
            &ctx.accounts.mint.key().to_bytes(),
            &[ctx.bumps.pawned_nft],
        ];

        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let transfer = Transfer {
            from: ctx.accounts.pawned_nft_pda_nft_account.to_account_info(),
            to: ctx.accounts.pawn_broker_nft_account.to_account_info(),
            authority: ctx.accounts.pawned_nft.to_account_info(),
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
        constraint = lender_nft_account.owner.key() == signer.key(),
        constraint = lender_nft_account.amount == 1 
    )]
    pub lender_nft_account: Account<'info, TokenAccount>,

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
        init_if_needed, 
        seeds=[b"pawned_nft", signer.key().as_ref(), mint.key().as_ref()],
        bump,
        payer = signer, 
        space = PawnedNFT::INIT_SPACE + 8,
    )]
    pub pawned_nft: Account<'info, PawnedNFT>,

    #[account(
        init_if_needed,
        payer = signer, 
        associated_token::mint = mint, 
        associated_token::authority = pawned_nft,
    )]
    pub pawned_nft_pda_nft_account: Account<'info, TokenAccount>,

    #[account(
        mut, 
        seeds=[b"order", lender.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = lender.key() == order.lender,
        close = lender
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
    pub lender: AccountInfo<'info>,

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
        seeds=[b"pawned_nft", pawn_broker.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = pawn_broker.key() == pawned_nft.pawn_broker,
        close = pawn_broker
    )]
    pub pawned_nft: Account<'info, PawnedNFT>,

    #[account(
        mut,
        constraint = pawned_nft_pda_nft_account.owner == pawned_nft.key(),
        constraint = pawned_nft_pda_nft_account.mint == mint.key(),
        constraint = pawned_nft_pda_nft_account.amount == 1, 
    )]
    pub pawned_nft_pda_nft_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = lender_nft_account.owner.key() == signer.key(),
    )]
    pub lender_nft_account: Account<'info, TokenAccount>,

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
        seeds=[b"pawned_nft", signer.key().as_ref(), mint.key().as_ref()],
        bump,
        constraint = signer.key() == pawned_nft.pawn_broker,
        close = signer
    )]
    pub pawned_nft: Account<'info, PawnedNFT>,

    #[account(
        mut,
        constraint = pawned_nft_pda_nft_account.owner == pawned_nft.key(),
        constraint = pawned_nft_pda_nft_account.mint == mint.key(),
        constraint = pawned_nft_pda_nft_account.amount == 1, 
    )]
    pub pawned_nft_pda_nft_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer, 
        associated_token::mint = mint, 
        associated_token::authority = signer,
    )]
    pub pawn_broker_nft_account: Account<'info, TokenAccount>,
    
    /// CHECK: It is just a user account.
    #[account(mut)]
    pub lender: AccountInfo<'info>,

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
    lender: Pubkey,
    mint: Pubkey,
    duration: i64,
    lend_amount: u64,
    debt_amount: u64,
}

#[derive(InitSpace)]
#[account]
pub struct PawnedNFT {
    lender: Pubkey,
    pawn_broker: Pubkey, 
    mint: Pubkey,
    deadline: i64,
    debt_amount: u64,
}
