import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdOutlineRequestPage } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";
import { FaCcAmazonPay } from "react-icons/fa6";
import { MdOutlinePaid } from "react-icons/md";
import { adminPaths } from "./frontend";

export const loanLinks = [
    {
        path: adminPaths.requestLoanPath,
        text: "Enter new Loan",
        icon: <FaHandHoldingDollar/>
    },
    {
        path: adminPaths.loanRequestsPath,
        text: "Loan Requests",
        icon: <MdOutlineRequestPage/>
    },
    {
        path: adminPaths.currentLoansListPath,
        text: "Current Loans",
        icon: <GiTakeMyMoney/>
    },
    {
        path: adminPaths.settledLoansListPath,
        text: "Settled Loans",
        icon: <FaCheck/>
    }
];

export const paymentLinks = [
    {
        path: adminPaths.makePaymentPath,
        text: "Enter new Payment",
        icon: <FaCcAmazonPay/>
    },
    {
        path: adminPaths.paymentsListPath,
        text: "Recent payments",
        icon: <MdOutlinePaid/>
    },

];
