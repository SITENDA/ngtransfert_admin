import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, Modal } from 'antd';
import TimeAgo from '../TimeAgo';
import { useDispatch } from 'react-redux';
import { setItem } from '../../features/auth/authSlice';
import { useApproveLoanMutation } from '../../features/loans/loanSlice';
import TickAnimation from '../TickAnimation';
import { adminPaths } from '../../util/frontend';

const ApproveLoanRequest = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [approveLoan] = useApproveLoanMutation();
  const loanRequest = location?.state && location?.state?.loanRequest;
  const [updatedLoanRequest, setUpdatedLoanRequest] = useState();
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isDeclineModalVisible, setDeclineModalVisible] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // State variable for success animation

  const interest = Number(updatedLoanRequest?.interest) ? updatedLoanRequest.interest : null;
  const returnDate = updatedLoanRequest?.returnDate ? updatedLoanRequest.returnDate : 'Unset';

  useEffect(() => {
    dispatch(setItem({ key: 'title', value: "Approve Loan Request" }));
  }, [dispatch])

  const loanDetails = [
    { title: 'Client', detail: updatedLoanRequest.user.fullName },
    { title: 'Tel', detail: updatedLoanRequest.user.phoneNumber },
    { title: 'Request Date', detail: <TimeAgo timestamp={updatedLoanRequest.requestDate} /> },
    { title: 'Principal (AED)', detail: <Input type="number" value={updatedLoanRequest.principal} placeholder='Set principal here' onChange={(e) => setUpdatedLoanRequest({ ...updatedLoanRequest, principal: e.target.value })} /> },
    { title: 'Interest (%)', detail: <Input type="text" value={interest} placeholder='Set interest here' onChange={(e) => setUpdatedLoanRequest({ ...updatedLoanRequest, interest: e.target.value })} /> },
    { title: 'Collateral', detail: <Input type="text" value={updatedLoanRequest.collateral} placeholder='Set collateral here' onChange={(e) => setUpdatedLoanRequest({ ...updatedLoanRequest, collateral: e.target.value })} /> },
    { title: 'Return Date', detail: <Input type="date" value={returnDate} onChange={(e) => setUpdatedLoanRequest({ ...updatedLoanRequest, returnDate: e.target.value })} /> },
    { title: 'Reason for Loan', detail: updatedLoanRequest.reasonForLoan },
  ];

  const loanDetailsFilled = [
    loanDetails[0],
    loanDetails[1],
    { title: 'Request Date', detail: updatedLoanRequest.requestDate },
    { title: 'Principal (AED)', detail: updatedLoanRequest.principal },
    { title: 'Interest (%)', detail: interest },
    { title: 'Collateral', detail: updatedLoanRequest.collateral },
    loanDetails[7],
  ]

  const showApproveModal = async () => {
    setApproveModalVisible(true);
  };

  const handleApproveOk = async () => {
    console.log('Updated Loan Request:', updatedLoanRequest);
    const loanRequestToSubmit = {
      loanRequestId: updatedLoanRequest.loanRequestId,
      clientPhoneNumber: updatedLoanRequest.user.phoneNumber,
      clientId: updatedLoanRequest.user.userId,
      interest: interest,
      principal: updatedLoanRequest.principal,
      collateral: updatedLoanRequest.collateral,
      reasonForLoan: updatedLoanRequest.reasonForLoan,
      requestDate: updatedLoanRequest.requestDate,
      returnDate: returnDate
    }
    try {
      console.log("updatedLoanRequest is : ", loanRequestToSubmit);
      const response = await approveLoan(loanRequestToSubmit).unwrap();
      console.log("Response is : ", response)
      console.log("Status code : ", response?.statusCode)
      console.log("Message : ", response?.message)
      if (response.statusCode === 200 && response.message === "Loan approved") {
        console.log("About to show success animation");
        setShowSuccessAnimation(true);
        setTimeout(() => {
          navigate(adminPaths.loanRequestsPath);
        }, 2000);
        //reset();
      }

    } catch (error) {
      console.error("Error processing the loan:", error);

      // Show the error message to the user
      Modal.error({
        title: error.response?.data?.title || 'Error',
        content: error.response?.data?.detail || 'An error occurred while processing the loan.',
      });

    } finally {
      // Perform any cleanup or additional actions as needed
      setApproveModalVisible(false);
    };
  };

  const handleApproveCancel = () => {
    setApproveModalVisible(false);
  };

  const showDeclineModal = () => {
    setDeclineModalVisible(true);
  };

  const handleDeclineOk = () => {
    // Perform logic to send a delete request to the backend
    console.log('Decline Loan Request:', updatedLoanRequest);
    setDeclineModalVisible(false);
  };

  const handleDeclineCancel = () => {
    setDeclineModalVisible(false);
  };

  if (!loanRequest) {
    return <div className="text-center mt-5"><p>Loan Request not found!</p></div>;
  }
  return (
    <>
      <section className="container py-5">
        <div className="row justify-content-center">
          {!showSuccessAnimation && (
            <div className="col-lg-8">
            <ul className="list-group">
              {loanDetails.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>{item.title}:</strong> {item.detail}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button type="primary" onClick={showApproveModal}>
                Approve Loan
              </Button>
              <Button type="default" onClick={showDeclineModal} style={{ marginLeft: '10px' }}>
                Decline Loan
              </Button>
            </div>
          </div>
          )}
          {showSuccessAnimation && (
            <><TickAnimation successMessage="Loan approved successfully!" />
            </>
          )}

        </div>
      </section>

      {/* Approve Loan Modal */}
      <Modal
        title="Confirm Approve Loan"
        visible={isApproveModalVisible}
        onOk={handleApproveOk}
        onCancel={handleApproveCancel}
      >
        <p>Are you sure you want to approve the loan request?</p>
        <dl className="row">
          {loanDetailsFilled.map((item, index) => (
            <React.Fragment key={index}>
              <dt className="col-sm-4">{item.title}</dt>
              <dd className="col-sm-8">{item.detail}</dd>
            </React.Fragment>
          ))}
        </dl>

      </Modal>
      {/* Decline Loan Modal */}
      <Modal
        title="Confirm Decline Loan"
        open={isDeclineModalVisible}
        onOk={handleDeclineOk}
        onCancel={handleDeclineCancel}
      >
        <p>Are you sure you want to decline this loan request?</p>
      </Modal>
    </>
  );
};

export default ApproveLoanRequest;
