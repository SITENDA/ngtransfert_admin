import { adminPaths } from "./frontend";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";

export const receiverAccountLinks = [
    {
        path: adminPaths.receiverAccountsPath,
        text: "Receiver Accounts",
        icon: <MdOutlineAttachMoney/>
    }
];


export const sendingRecordLinks = [
    {
        path: adminPaths.transferRequestsPath,
        text: "Transfer requests",
        icon: <FaMoneyBillTrendUp/>
    },
    {
        path: adminPaths.approvedTransfersPath,
        text: "Approved transfers",
        icon: <FcMoneyTransfer/>
    },
    {
        path: adminPaths.settledTransfersPath,
        text: "Settled transfers",
        icon: <FcMoneyTransfer/>
    }
];