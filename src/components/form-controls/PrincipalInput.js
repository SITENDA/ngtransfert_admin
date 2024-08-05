import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectLoanRequestValids, selectMakePaymentsValids, setObjectItem } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

const PrincipalInput = forwardRef(({ params }, ref) => {
    const valids = useSelector(selectLoanRequestValids)
    const validPayments = useSelector(selectMakePaymentsValids)

    const dispatch = useDispatch();
    const {id, name, label, changeHandler, validationMessage} = params

  return (
    <InputField
        label={label}
        id={id}
        type="number"
        name={name}
         ref={ref}
        required
        onChange={changeHandler}
        validation={{
            isValid: name === "principal" ? valids.validPrincipal : validPayments.validAmount,
            message: validationMessage
        }}
        ariaDescribedBy="principalnote"
        placeholder="Enter amount here"
    />
  )
});

export default PrincipalInput