import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectMoreInputsValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const PassportNumberInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectMoreInputsValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'moreInputs', innerKey: 'passportNumber', value: event.target.value }));
    };

  return (
    <InputField
        label="Passport number"
        id="passportNumber"
        type="text"
        name="passportNumber"
         ref={ref}
        required
        onChange={handleChange}
        validation={{
            isValid: valids.validPassportNumber,
            message: <>Enter you passport number, acceptable length is between 6 to 12 characters. <br /></>
        }}
        ariaDescribedBy="passportNumbernote"
        placeholder="Enter your passport number here..."
    />
  )
});

export default PassportNumberInput