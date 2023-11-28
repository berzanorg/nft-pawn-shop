export type NftPawnShop = {
  "version": "0.1.0",
  "name": "nft_pawn_shop",
  "instructions": [
    {
      "name": "placeOrder",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "args": [
        {
          "name": "duration",
          "type": "i64"
        },
        {
          "name": "borrowAmount",
          "type": "u64"
        },
        {
          "name": "debtAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeOrder",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "name": "payDebt",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pawnBroker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "name": "seizeNft",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pawnBrokerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
    }
  ],
  "accounts": [
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "borrowAmount",
            "type": "u64"
          },
          {
            "name": "debtAmount",
            "type": "u64"
          },
          {
            "name": "pawnBroker",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "deadline",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughBalance",
      "msg": "You don't have enough SOL balance."
    },
    {
      "code": 6001,
      "name": "DebtDeadlineIsDone",
      "msg": "Debt payment deadline is done."
    },
    {
      "code": 6002,
      "name": "DebtDeadlineIsNotDone",
      "msg": "Debt payment deadline is not done."
    },
    {
      "code": 6003,
      "name": "OrderIsAlreadyExecuted",
      "msg": "Order is already executed."
    },
    {
      "code": 6004,
      "name": "OrderIsNotExecutedYet",
      "msg": "Order is not executed yet."
    },
    {
      "code": 6005,
      "name": "OrderIsDone",
      "msg": "Order is done."
    }
  ]
};

export const IDL: NftPawnShop = {
  "version": "0.1.0",
  "name": "nft_pawn_shop",
  "instructions": [
    {
      "name": "placeOrder",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "args": [
        {
          "name": "duration",
          "type": "i64"
        },
        {
          "name": "borrowAmount",
          "type": "u64"
        },
        {
          "name": "debtAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeOrder",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "name": "payDebt",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pawnBroker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
      "name": "seizeNft",
      "accounts": [
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderPdaNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pawnBrokerNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
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
    }
  ],
  "accounts": [
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "borrowAmount",
            "type": "u64"
          },
          {
            "name": "debtAmount",
            "type": "u64"
          },
          {
            "name": "pawnBroker",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "deadline",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughBalance",
      "msg": "You don't have enough SOL balance."
    },
    {
      "code": 6001,
      "name": "DebtDeadlineIsDone",
      "msg": "Debt payment deadline is done."
    },
    {
      "code": 6002,
      "name": "DebtDeadlineIsNotDone",
      "msg": "Debt payment deadline is not done."
    },
    {
      "code": 6003,
      "name": "OrderIsAlreadyExecuted",
      "msg": "Order is already executed."
    },
    {
      "code": 6004,
      "name": "OrderIsNotExecutedYet",
      "msg": "Order is not executed yet."
    },
    {
      "code": 6005,
      "name": "OrderIsDone",
      "msg": "Order is done."
    }
  ]
};
