import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectLoanRequestValids, setObjectItem } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

const ReasonForLoanInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectLoanRequestValids)
    const dispatch = useDispatch();
    const handleCollateralChange = (event) => {
        dispatch(setObjectItem({ key: 'loanRequestInputs', innerKey: 'reasonForLoan', value: event.target.value }));
    };

  return (
    <InputField
        label="Reason for Loan"
        id="reasonForLoan"
        type="textarea"
        name="reasonForLoan"
         ref={ref}
        required
        onChange={handleCollateralChange}
        validation={{
            isValid: valids.validReasonForLoan,
            message: <>Enter your reason as to why you'd like to have this loan.<br />
                </>
        }}
        ariaDescribedBy="reasonForLoannote"
        placeholder="Enter your reason here"
    />
  )
});

export default ReasonForLoanInput