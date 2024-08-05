import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Unauthorized from './client/Unauthorized';
import RequireAuth from "./RequireAuth";
import PersistLogin from "./public/PersistLogin";
// import SettledLoans from './SettledLoans';
// import LoanRequestsList from '../features/loanRequests/LoanRequestsList';
// import LoanRequestDetails from '../features/loanRequests/LoanRequestDetails';
import {AnimatePresence} from 'framer-motion';
// import LoanDetailsAdmin from '../features/loans/LoanDetailsAdmin';
// import LoansListAdmin from '../features/loans/LoansListAdmin';
// import MakePayment from '../features/payments/MakePayment';
// import PaymentsListAdmin from '../features/payments/PaymentsListAdmin';
// import PaymentDetailsAdmin from '../features/payments/PaymentDetailsAdmin';
// import PaymentsListByLoanAdmin from '../features/payments/PaymentsListByLoanAdmin';
import ClientDetails from '../features/users/ClientDetails';
import ClientLayout from './client/ClientLayout';
import NewLogin from './public/NewLogin';
import {adminPaths, publicPaths} from '../util/frontend';
import LayoutAdmin from './admin/LayoutAdmin';
import Dashboard from './Dashboard';
// import RequestLoanAdmin from '../features/loans/RequestLoanAdmin';
import RegisterAdmin from './admin/RegisterAdmin';
// import ApproveLoanRequest from './ApproveLoanRequest';
import ClientsList from '../features/users/ClientsList';
// import LoansListByClient from "../features/loans/LoansListByClient";

export const pageTransitionStyles = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0}
}

const AnimatedRoutes = () => {
    return (
        <AnimatePresence>
            <Routes>
                {/* Public routes with intro design*/}
                <Route path={publicPaths.adminPath} element={<ClientLayout/>}>
                    {/* Public routes with client design */}
                    <Route path={publicPaths.loginPath} element={<NewLogin/>}/>
                    <Route path={publicPaths.unauthorizedPath} element={<Unauthorized/>}/>
                </Route>
                <Route element={<PersistLogin/>}>
                    {/* Private client routes*/}
                    <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
                        <Route path={adminPaths.homePath} element={<LayoutAdmin/>}>
                            <Route index element={<Dashboard/>}/>
                            {/*<Route path={adminPaths.loanRequestsPath} element={<LoanRequestsList/>}/>*/}
                            {/*<Route path={adminPaths.currentLoansListPath} element={<LoansListAdmin/>}/>*/}
                            {/*<Route path={adminPaths.settledLoansListPath} element={<SettledLoans/>}/>*/}
                            {/*<Route path={`${adminPaths.loansByClientPath}/:clientId`} element={<LoansListByClient/>}/>*/}
                            <Route path={adminPaths.ClientsListPath} element={<ClientsList/>}/>
                            <Route path={`${adminPaths.clientDetailsPath}/:clientId`} element={<ClientDetails/>}/>
                            {/*<Route path={adminPaths.requestLoanPath} element={<RequestLoanAdmin/>}/>*/}
                            {/*<Route path={adminPaths.makePaymentPath} element={<MakePayment/>}/>*/}
                            <Route path={adminPaths.registerPath} element={<RegisterAdmin/>}/>
                            {/*<Route path={adminPaths.paymentsListPath} element={<PaymentsListAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.paymentsByLoanPath}/:loanId`}*/}
                            {/*       element={<PaymentsListByLoanAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.loanDetailsPath}/:loanId`} element={<LoanDetailsAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.paymentDetailsPath}/:paymentId`}*/}
                            {/*       element={<PaymentDetailsAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.loanRequestDetailsPath}/:loanRequestId`}*/}
                            {/*       element={<LoanRequestDetails/>}/>*/}
                            {/*<Route path={`${adminPaths.approveLoanRequestPath}/:loanRequestId`}*/}
                            {/*       element={<ApproveLoanRequest/>}/>*/}
                        </Route>

                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes
