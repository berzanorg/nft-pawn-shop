export type NftPawnShop = {
    "version": "0.1.0",
    "name": "nft_pawn_shop",
    "instructions": [
        {
            "name": "getDemoAssets",
            "accounts": [
                {
                    "name": "pawnShopUser",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "placeOrder",
            "accounts": [
                {
                    "name": "borrower",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "duration",
                    "type": "u64"
                },
                {
                    "name": "borrowAmount",
                    "type": "u16"
                },
                {
                    "name": "debtAmount",
                    "type": "u16"
                }
            ]
        },
        {
            "name": "cancelOrder",
            "accounts": [
                {
                    "name": "borrower",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "orderIndex",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "executeOrder",
            "accounts": [
                {
                    "name": "lender",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "borrower",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "orderIndex",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "payDebt",
            "accounts": [
                {
                    "name": "lender",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "borrower",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "debtIndex",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "seize",
            "accounts": [
                {
                    "name": "lender",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "borrower",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "debtIndex",
                    "type": "u32"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "pawnShopUser",
            "docs": [
                "It represents an account that uses NFT Pawn Shop."
            ],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "docs": [
                            "Owner of this PDA."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "demoTokens",
                        "docs": [
                            "Amount of demo tokens this user owns."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "demoNfts",
                        "docs": [
                            "Amount of demo NFTs this user owns."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "orders",
                        "docs": [
                            "Orders this user gave."
                        ],
                        "type": {
                            "vec": {
                                "defined": "Order"
                            }
                        }
                    },
                    {
                        "name": "debts",
                        "docs": [
                            "Debts this user have."
                        ],
                        "type": {
                            "vec": {
                                "defined": "Debt"
                            }
                        }
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "Order",
            "docs": [
                "An `Order` is stored inside the account giving the order.",
                "",
                "It represents a request to borrow money."
            ],
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Some",
                        "fields": [
                            {
                                "name": "borrow_amount",
                                "docs": [
                                    "Amount of demo tokens to be borrowed."
                                ],
                                "type": "u16"
                            },
                            {
                                "name": "debt_amount",
                                "docs": [
                                    "Amount of debt to be repaid."
                                ],
                                "type": "u16"
                            },
                            {
                                "name": "duration",
                                "docs": [
                                    "Duration of the debt."
                                ],
                                "type": "u64"
                            }
                        ]
                    },
                    {
                        "name": "None"
                    }
                ]
            }
        },
        {
            "name": "Debt",
            "docs": [
                "A `Debt` is stored inside the debtor's account.",
                "",
                "It represents a debt that may or may not be paid."
            ],
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Some",
                        "fields": [
                            {
                                "name": "amount",
                                "docs": [
                                    "Amount of debt to be repaid."
                                ],
                                "type": "u16"
                            },
                            {
                                "name": "lender_pda",
                                "docs": [
                                    "PDA of the lender."
                                ],
                                "type": "publicKey"
                            },
                            {
                                "name": "deadline",
                                "docs": [
                                    "Debt payment deadline as timestamp."
                                ],
                                "type": "i64"
                            }
                        ]
                    },
                    {
                        "name": "None"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "DebtPaymentDeadlineIsOver",
            "msg": "Debt payment deadline is over."
        },
        {
            "code": 6001,
            "name": "DebtPaymentDeadlineIsValid",
            "msg": "Debt payment deadline is not over."
        },
        {
            "code": 6002,
            "name": "InsufficientDemoTokens",
            "msg": "You do not have enough demo tokens."
        },
        {
            "code": 6003,
            "name": "NoDemoNFT",
            "msg": "You have no demo NFT."
        },
        {
            "code": 6004,
            "name": "NoDebtFound",
            "msg": "No debt found at specified index."
        },
        {
            "code": 6005,
            "name": "NoOrderFound",
            "msg": "No order found at specified index."
        },
        {
            "code": 6006,
            "name": "WrongLender",
            "msg": "Specifed lender is not the expected lender."
        },
        {
            "code": 6007,
            "name": "UnauthorizedAccess",
            "msg": "You do not have access to complete this operation."
        }
    ]
};
