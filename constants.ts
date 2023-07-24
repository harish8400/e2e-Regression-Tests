//enums
export const enum CASE_TYPE {
    MODIFY_BENEFICIARIES = "Beneficiary - Modify",
    MANUAL_INVESTMENT_SWITCH = "Investment Switch - Manual",
    REMOVE_TAGS = "Tags - Remove",
    INSURANCE_MODIFY_COVER = "Insurance - Add/Modify members cover records",
    INSURANCE_BATCH_COMMENCEMENT = "Insurance - Batch members commencement",
    PENSION_UPDATE_PAYMENT_DETAILS = "Pension - Update Payment Details"
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
    PENSION_UPDATE_PAYMENT_DETAILS = "updatePensionPaymentDetails"
}

export const enum CASE_NOTE {
    NEW_MEMBER_BENEFICIARY_LETTER_PAYLOAD_SENT = "Process step completed with note: New Member Beneficiary letter payload sent.",
    INVESTMENT_CHANGE_LETTER_PAYLOAD_SENT = "Process step completed with note: Investment change letter payload sent.",
    PENSION_PAYMENT_CORRESPONDENCE_SENT = "Process step completed with note: Pension payment correspondence sent.",
    UPDATE_SENT = "Process step completed with note: Update Sent"
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

export const enum MOL_DOCUMENT_TYPE {
    ALL = "All",
    BENEFICIARIES = "Beneficiaries",
    INSURANCE = "Insurance",
    INVESTMENTS = "Investments"
}

//consts
export const FUND_IDS = {
    MERCY: {
        FUND_ID: "15fa2659-f1bb-552c-b50f-627531e6bc56",
        PRODUCT_ID:
        {
            ACCUMULATION: "7ca21238-2031-59c7-b334-0d24f72eb6a0",
            RETIREMENT: "6583c561-2bfd-57f2-8648-abb1e33fd3c2",
            TTR: "37583907-459d-5158-9b69-16cb9b619abb"
        }
    },
    VANGUARD: {
        FUND_ID: "c9d996a5-a7b8-5686-970f-1efb4a3720cb",
        PRODUCT_ID:
        {
            ACCUMULATION: "f4e4bf41-1351-52e5-8cbd-39105264d3e1"
        }
    }
}

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
        }
    }
}