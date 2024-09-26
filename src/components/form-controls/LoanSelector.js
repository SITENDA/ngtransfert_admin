import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoansByClientIdQuery, selectAllIndividualLoans, selectAllLoans } from '../../features/loans/loanSlice';
import { selectCurrentUser, selectMakePaymentsInputs, setObjectItem } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import TimeAgo from '../TimeAgo';

const LoanSelector = forwardRef(({ params }, ref) => {
  const { onSelectLoan, setLoan, clientId, nextRef } = params
  const dispatch = useDispatch();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [options, setOptions] = useState([]);
  const makePaymentInputs = useSelector(selectMakePaymentsInputs)
  const { data, isSuccess } = useGetLoansByClientIdQuery(makePaymentInputs.clientId);
  let orderedLoans = []
  // Fetch all users from the backend

  useEffect ( () => {
    if (isSuccess) {
      if (data?.entities) {
        // Fetch loans based on the new clientId
        const values = Object.values(data?.entities)
        if (values.length > 0 && orderedLoans[0] !== values[0]) {
          const optionsData = values.map((loan) => ({
            moreData: loan,
            value: loan.loanId,
            label: <>{`AED ${loan.principal}`} {<>&nbsp;&nbsp;</>} <TimeAgo timestamp={loan.approvalDate} /><>&nbsp;&nbsp;</>
            </>
          }));
          if (options)
          setOptions(optionsData);
        }
  
      }
    }
  
  }, [data])

  
  const handleChange = (selectedOption) => {
    console.log("The loans : ", orderedLoans)
    dispatch(setObjectItem({ key: 'makePaymentInputs', innerKey: 'loanId', value: selectedOption.value }));
    setSelectedLoan(selectedOption);
    setLoan(selectedOption.moreData);
    nextRef?.current.focus()
  }


  return (
    <div className="mb-3">
      <label htmlFor="loanSelector" className="form-label">
        Select Loan
      </label>
      <Select
        id="loanSelector"
        ref={ref}
        options={options}
        onChange={handleChange}
        isSearchable
        placeholder="Search for a loan..."
      />
    </div>
  );
});
export default LoanSelector