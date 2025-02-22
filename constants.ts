//enums
export const enum CASE_TYPE {
    MODIFY_BENEFICIARIES = "Beneficiary - Modify",
    MANUAL_INVESTMENT_SWITCH = "Investment Switch - Manual",
    REMOVE_TAGS = "Tags - Remove",
    INSURANCE_MODIFY_COVER = "Insurance - Add/Modify members cover records",
    INSURANCE_BATCH_COMMENCEMENT = "Insurance - Batch members commencement",
    PENSION_UPDATE_PAYMENT_DETAILS = "Pension - Update Payment Details",
    MEMBER_CREATE_CONTRIBUTION = "Member - Create Contribution",
    ROLLOVER_IN_CREATE = "Rollover In - Create"
}

export const enum CASE_STATUS {
    PENDING = 1,
    IN_PROGRESS = 2,
    COMPLETE = 3,
    IN_REVIEW = 4,
    ON_HOLD = 5,
    DELETE = 6
}

export const enum CASE_OUTCOME {
    PENDING = 1,
    ERROR = 2,
    SUCCESS = 3
};

export const enum CASE_CONFIG_REFERENCE {
    MODIFY_BENEFICIARIES = "modifyBeneficiaries",
    MANUAL_INVESTMENT_SWITCH = "manualInvestmentChange",
    REMOVE_MEMBER_CATEGORY = "removeMemberCategory",
    PROCESS_MEMBER_INSURANCE = "processMemberInsurance",
    INSURANCE_BATCH_COMMENCEMENT = "insuranceBatchCommencement",
    PENSION_UPDATE_PAYMENT_DETAILS = "updatePensionPaymentDetails",
    MEMBER_CONTRIBUTION = "memberContribution",
    MANUAL_ROLLIN = "manualRollin"
}


export const enum CASE_NOTE {
    UNAUTHORISED = "\"Unauthorised\"",
    ADDED_BENEFICIARIES_FOR_THE_MEMBER = "Added beneficiaries for the member.",
    NEW_MEMBER_BENEFICIARY_LETTER_PAYLOAD_SENT = "Process step completed with note: New Member Beneficiary letter payload sent.",
    INVESTMENT_CHANGE_LETTER_PAYLOAD_SENT = "Process step completed with note: Investment change letter payload sent.",
    MEMBER_PROFILE_TYPE_SWITCH_INITIATED = "Process step completed with note: Member profile type switch initiated.",
    PENSION_PAYMENT_CORRESPONDENCE_SENT = "Process step completed with note: Pension payment correspondence sent.",
    UPDATE_SENT = "Process step completed with note: Update Sent",
    UPDATED_MEMBER = "Updated member.",
    INCREMENT_PENSION_SCHEDULE_DID_NOT_MEET_CONDITIONS = "Process step **Increment Member Pension Schedule** did not meet conditions."
}

export const enum INVESTMENT_CHANGE_TYPE {
    CURRENT_BALANCE,
    FUTURE_INVESTMENTS
}

export const enum LINK_TYPE {
    INSURANCE_OPT_IN = "IOI"
}

export const enum PAYMENT_FREQUENCY {
    MONTHLY = "Monthly",
    ANNUALLY = "Annually",
}

export const enum CONTRIBUTION_TYPE {
    SUPER_GUARANTEE = "SGC",
    PERSONAL = "MNC"
}

export const enum MOL_DOCUMENT_TYPE {
    ALL = "All",
    BENEFICIARIES = "Beneficiaries",
    INSURANCE = "Insurance",
    INVESTMENTS = "Investments"
}

export const enum MOL_TRANSACTION_TYPE {
    ANY = "Any",
    CONTRIBUTION = "Contribution",
    ROLL_IN = "Roll In"
}

export const enum AUTH_USER_FILENAME {
    MOL_HFM = "mol_hfm_user.json",
    MOL_VG = "mol_vg_user.json"
}

//consts
export const FUND_IDS = {
    MERCY: {
        FUND_ID: "15fa2659-f1bb-552c-b50f-627531e6bc56",
        PRODUCT_ID: {
            ACCUMULATION: "7ca21238-2031-59c7-b334-0d24f72eb6a0",
            RETIREMENT: "6583c561-2bfd-57f2-8648-abb1e33fd3c2",
            TTR: "37583907-459d-5158-9b69-16cb9b619abb"
        }
    },
    VANGUARD: {
        FUND_ID: "c9d996a5-a7b8-5686-970f-1efb4a3720cb",
        PRODUCT_ID: {
            ACCUMULATION: "f4e4bf41-1351-52e5-8cbd-39105264d3e1",
            RETIREMENT: "52bc7ff5-0ad9-520f-bd45-308e03aedbcb",
            TTR: "85a3990c-c88b-5c24-a1e0-4299c5c5aebe"
        }
    },
    AE: {
        FUND_ID: "72438fe0-af05-55dc-ae71-1ff41be2d22f",
        PRODUCT_ID: {
            ACCUMULATION: "09f8ec82-d978-57b6-bec0-1b4eda31f6a8",
            RETIREMENT: "9b66758f-b878-5c15-b451-57aa0d07f93c",
            TTR: "3d7bc9b0-25a4-5cb0-a45f-003dc0800fc5"
        }
    }
};
export const INVESTMENT_OPTIONS = {
    MERCY: {
        ACCUMULATION: {
            BALANCED_GROWTH: {
                NAME: "Balanced Growth",
                ID: "HE46"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "HE53"
            },
            PROPERTY_AND_INFRASTRUCTURE: {
                NAME: "Property and Infrastructure",
                ID: "HE48"
            },
            DIVERSIFIED_BONDS: {
                NAME: "Diversified Bonds",
                ID: "HE56"
            }
        },
        RETIREMENT: {
            BALANCED_GROWTH: {
                NAME: "IS Balanced Growth",
                ID: "HE35"
            },
            AUSTRALIAN_SHARES: {
                NAME: "IS Australian Shares",
                ID: "HE42"
            },
            PROPERTY_AND_INFRASTRUCTURE: {
                NAME: "IS Property and Infrastructure",
                ID: "HE44"
            },
            DIVERSIFIED_BONDS: {
                NAME: "IS Diversified Bonds",
                ID: "HEDB"
            }
        },
        TTR: {
            BALANCED_GROWTH: {
                NAME: "Balanced Growth",
                ID: "HE46"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "HE53"
            },
            PROPERTY_AND_INFRASTRUCTURE: {
                NAME: "Property and Infrastructure",
                ID: "HE48"
            },
            DIVERSIFIED_BONDS: {
                NAME: "Diversified Bonds",
                ID: "HE56"
            }
        }
    },
    VANGUARD: {
        ACCUMULATION: {
            ETHICALLY_CONSCIOUS_GROWTH: {
                NAME: "Ethically Conscious Growth",
                ID: "SESGA"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "SCDA"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "SASIA"
            },
            CASH: {
                NAME: "Growth",
                ID: "Cash"
            }
        },
        TTR: {
            ETHICALLY_CONSCIOUS_GROWTH: {
                NAME: "Ethically Conscious Growth",
                ID: "SESGP"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "SCDP"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "SAFIP"
            },
            CASH: {
                NAME: "Growth",
                ID: "SGDA"
            }
        },
        RETIREMENT: {
            ETHICALLY_CONSCIOUS_GROWTH: {
                NAME: "Ethically Conscious Growth",
                ID: "SESGP"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "SCDP"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Fixed Interest",
                ID: "SAFIP"
            },
            CASH: {
                NAME: "Growth",
                ID: "SGDP"
            }
        },
    },
    AE: {
        ACCUMULATION: {
            DEFENSIVE: {
                NAME: "Defensive",
                ID: "AESDEF"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "AESCON"
            },
            BALANCED: {
                NAME: "Balanced",
                ID: "AESBAL"
            },
            GROWTH: {
                NAME: "Growth",
                ID: "AESGRW"
            },
            HIGH_GROWTH: {
                NAME: "High Growth",
                ID: "AESHGF"
            },
            INTERNATIONAL_SHARES: {
                NAME: "International Shares",
                ID: "AESINT"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "AESAUS"
            },
        },
        TTR: {
            DEFENSIVE: {
                NAME: "Defensive",
                ID: "AESDEF"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "AESCON"
            },
            BALANCED: {
                NAME: "Balanced",
                ID: "AESBAL"
            },
            GROWTH: {
                NAME: "Growth",
                ID: "AESGRW"
            },
            HIGH_GROWTH: {
                NAME: "High Growth",
                ID: "AESHGF"
            },
            INTERNATIONAL_SHARES: {
                NAME: "International Shares",
                ID: "AESINT"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "AESAUS"
            },
        },
        RETIREMENT: {
            DEFENSIVE: {
                NAME: "Defensive",
                ID: "AESDEF"
            },
            CONSERVATIVE: {
                NAME: "Conservative",
                ID: "AESCON"
            },
            BALANCED_PENSION: {
                NAME: "Balanced (pension)",
                ID: "AESBAL"
            },
            GROWTH: {
                NAME: "Growth",
                ID: "AESGRW"
            },
            INTERNATIONAL_SHARES: {
                NAME: "International Shares",
                ID: "AESINT"
            },
            AUSTRALIAN_SHARES: {
                NAME: "Australian Shares",
                ID: "AESAUS"
            },
        },
    }
}

export const enum FUND {
    HESTA = "HESTA for Mercy",
    VANGUARD = "Vanguard Super",
    AE = "Australian Ethical Super"
};