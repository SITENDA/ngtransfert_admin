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
// import SettledLoans from '../features/loans/SettledLoans';
// import LoanRequestsList from '../features/loanRequests/LoanRequestsList';
// import LoanRequestDetails from '../features/loanRequests/LoanRequestDetails';
// import LoanDetailsAdmin from '../features/loans/LoanDetailsAdmin';
// import LoansListAdmin from '../features/loans/LoansListAdmin';
// import MakePayment from '../features/payments/MakePayment';
// import PaymentsListAdmin from '../features/payments/PaymentsListAdmin';
// import PaymentDetailsAdmin from '../features/payments/PaymentDetailsAdmin';
// import PaymentsListByLoanAdmin from '../features/payments/PaymentsListByLoanAdmin';
// import ClientDetails from '../features/users/ClientDetails';
// import MoreInputs from './MoreInputs';
//
// import RequestLoanAdmin from '../features/loans/RequestLoanAdmin';
// import RegisterAdmin from './public/RegisterAdmin';
// import ApproveLoanRequest from './ApproveLoanRequest';
// import ClientsList from '../features/users/ClientsList';
// import LoansListByClient from "../features/loans/LoansListByClient";
// import MakePaymentForLoan from "../features/payments/MakePaymentForLoan";
// import RequestLoanForClient from "../features/loans/RequestLoanForClient";
// import EditLoan from "../features/loans/EditLoan";

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

                    {/* Private client routes */}
                    <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
                        <Route path={adminPaths.homePath} element={<LayoutAdmin/>}>
                            <Route index element={<Dashboard/>}/>
                            {/*<Route path={adminPaths.loanRequestsPath} element={<LoanRequestsList/>}/>*/}
                            {/*<Route path={adminPaths.currentLoansListPath} element={<LoansListAdmin/>}/>*/}
                            {/*<Route path={adminPaths.settledLoansListPath} element={<SettledLoans/>}/>*/}
                            {/*<Route path={`${adminPaths.loansByClientPath}/:clientId`} element={<LoansListByClient/>}/>*/}
                            {/*<Route path={adminPaths.ClientsListPath} element={<ClientsList/>}/>*/}
                            {/*<Route path={`${adminPaths.clientDetailsPath}/:clientId`} element={<ClientDetails/>}/>*/}
                            {/*<Route path={adminPaths.requestLoanPath} element={<RequestLoanAdmin/>}/>*/}
                            {/*<Route path={adminPaths.requestLoanForClientPath} element={<RequestLoanForClient/>}/>*/}
                            {/*<Route path={adminPaths.makePaymentPath} element={<MakePayment/>}/>*/}
                            {/*<Route path={adminPaths.makePaymentForLoanPath} element={<MakePaymentForLoan/>}/>*/}
                            {/*<Route path={adminPaths.moreInputsPath} element={<MoreInputs/>}/>*/}
                            {/*<Route path={adminPaths.registerPath} element={<RegisterAdmin/>}/>*/}
                            {/*<Route path={adminPaths.paymentsListPath} element={<PaymentsListAdmin/>}/>*/}
                            {/*<Route path={adminPaths.paymentsByLoanPath} element={<PaymentsListByLoanAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.loanDetailsPath}/:loanId`} element={<LoanDetailsAdmin/>}/>*/}
                            {/*<Route path={`${adminPaths.editLoanPath}/:loanId`} element={<EditLoan/>}/>*/}
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

export default AnimatedRoutes;
