import {Routes, Route, Navigate} from 'react-router-dom'; // Import Navigate
import Unauthorized from './client/Unauthorized';
import RequireAuth from "./RequireAuth";
import PersistLogin from "./public/PersistLogin";
import ClientLayout from './client/ClientLayout';
import NewLogin from './public/NewLogin';
import {adminPaths, publicPaths} from '../util/frontend';
import LayoutAdmin from './admin/LayoutAdmin';
import Dashboard from './admin/Dashboard';
import {AnimatePresence} from 'framer-motion';
import ReceiverAccountsListAdmin from "../features/receiverAccounts/ReceiverAccountsListAdmin";
import ReceiverAccountDetails from "../features/receiverAccounts/ReceiverAccountDetails";
import ReceiverAccountsByClientList from "../features/receiverAccounts/ReceiverAccountsByClientList";
import AddReceiverAccount from "../features/receiverAccounts/AddReceiverAccount";
import WechatAccountsByClientList from "../features/wechatAccounts/WechatAccountsByClientList";
import WechatAccountsListAdmin from "../features/wechatAccounts/WechatAccountsListAdmin";
import AddWechatAccount from "../features/wechatAccounts/AddWechatAccount";
import WechatAccountDetails from "../features/wechatAccounts/WechatAccountDetails";
import ApplyForTransfer from "../features/transferRequests/ApplyForTransfer";
import TransferRequestsListAdmin from "../features/transferRequests/TransferRequestsListAdmin";
import TransferRequestsByClientList from "../features/transferRequests/TransferRequestsByClientList";
import TransferRequestDetails from "../features/transferRequests/TransferRequestDetails";
import BankAccountsListAdmin from "../features/bankAccounts/BankAccountsListAdmin";
import BankAccountsByClientList from "../features/bankAccounts/BankAccountsByClientList";
import AddBankAccount from "../features/bankAccounts/AddBankAccount";
import BankAccountDetails from "../features/bankAccounts/BankAccountDetails";
import ApprovedTransfersListAdmin from "../features/approvedTransfers/ApprovedTransfersListAdmin";
import SettledTransfersListAdmin from "../features/settledTransfers/SettledTransfersListAdmin";
import TopUp from "../features/topUp/TopUp";
import TopUpInstructions from "../features/topUp/TopUpInstructions";

export const pageTransitionStyles = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0}
}

const AnimatedRoutes = () => {
    return (
        <AnimatePresence>
            <Routes>
                <Route element={<PersistLogin/>}>
                    {/* Redirect from index path to login */}
                    <Route path="/" element={<Navigate to={publicPaths.loginPath} replace/>}/>

                    {/* Public routes with intro design */}
                    <Route path={publicPaths.adminPath} element={<ClientLayout/>}>
                        {/* Public routes with client design */}
                        <Route path={publicPaths.loginPath} element={<NewLogin/>}/>
                        <Route path={publicPaths.unauthorizedPath} element={<Unauthorized/>}/>
                    </Route>

                    {/* Private admin routes */}
                    <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
                        <Route path={adminPaths.homePath} element={<LayoutAdmin/>}>
                            <Route index element={<Dashboard/>}/>
                            {/*Receiver Accounts*/}
                            <Route path={adminPaths.receiverAccountsPath} element={<ReceiverAccountsListAdmin/>}/>
                            <Route path={adminPaths.receiverAccountsByClientPath}
                                   element={<ReceiverAccountsByClientList/>}/>
                            <Route path={adminPaths.receiverAccountDetailsPath} element={<ReceiverAccountDetails/>}/>
                            <Route path={adminPaths.addReceiverAccountPath} element={<AddReceiverAccount/>}/>
                            {/*Wechat Accounts*/}
                            <Route path={adminPaths.wechatAccountsPath} element={<WechatAccountsListAdmin/>}/>
                            <Route path={adminPaths.wechatAccountsByClientPath}
                                   element={<WechatAccountsByClientList/>}/>
                            <Route path={adminPaths.wechatAccountDetailsPath} element={<WechatAccountDetails/>}/>
                            <Route path={adminPaths.addWechatAccountPath} element={<AddWechatAccount/>}/>
                            {/*Bank Accounts*/}
                            <Route path={adminPaths.bankAccountsPath} element={<BankAccountsListAdmin/>}/>
                            <Route path={adminPaths.bankAccountsByClientPath}
                                   element={<BankAccountsByClientList/>}/>
                            <Route path={adminPaths.bankAccountDetailsPath} element={<BankAccountDetails/>}/>
                            <Route path={adminPaths.addBankAccountPath} element={<AddBankAccount/>}/>
                            {/*Transfer Requests*/}
                            <Route path={adminPaths.transferRequestsPath} element={<TransferRequestsListAdmin/>}/>
                            <Route path={adminPaths.transferRequestsByClientPath}
                                   element={<TransferRequestsByClientList/>}/>
                            <Route path={adminPaths.transferRequestDetailsPath} element={<TransferRequestDetails/>}/>
                            <Route path={adminPaths.applyForTransferPath} element={<ApplyForTransfer/>}/>
                            <Route path={adminPaths.approvedTransfersPath} element={<ApprovedTransfersListAdmin/>}/>
                            <Route path={adminPaths.settledTransfersPath} element={<SettledTransfersListAdmin/>}/>
                            {/*Top up*/}
                            <Route path={adminPaths.topUpInstructionsPath} element={<TopUpInstructions/>} />
                            <Route path={adminPaths.topUpPath} element={<TopUp />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes;
