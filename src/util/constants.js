import { IoLogoWechat } from "react-icons/io5";
import { adminPaths } from "./frontend";
import { IoLogoAlipay } from "react-icons/io5";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

import { BsBank } from "react-icons/bs";

export const receiverAccountLinks = [
    {
        path: adminPaths.wechatAccountsPath,
        text: "WeChat Accounts",
        icon: <IoLogoWechat/>
    },
    {
        path: adminPaths.receiverAccountsPath,
        text: "Receiver Accounts",
        icon: <IoLogoAlipay/>
    },
    {
        path: adminPaths.bankAccountsPath,
        text: "Bank Accounts",
        icon: <BsBank/>
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