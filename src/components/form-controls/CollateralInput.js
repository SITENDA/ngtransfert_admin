import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectLoanRequestValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const CollateralInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectLoanRequestValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'loanRequestInputs', innerKey: 'collateral', value: event.target.value }));
    };

  return (
    <InputField
        label="Collateral"
        id="collateral"
        type="text"
        name="collateral"
         ref={ref}
        required
        onChange={handleChange}
        validation={{
            isValid: valids.validCollateral,
            message: <>Enter your collateral here It is the item you pledge for the repayment of this loan.<br />
                </>
        }}
        ariaDescribedBy="collateralnote"
        placeholder="Enter collateral here"
    />
  )
});
export default CollateralInput