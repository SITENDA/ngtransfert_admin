import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectMoreInputsValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const NationalIdInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectMoreInputsValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'moreInputs', innerKey: 'nationalId', value: event.target.value }));
    };

  return (
    <InputField
        label="National Id"
        id="nationalId"
        type="number"
        name="nationalId"
         ref={ref}
        required
        onChange={handleChange}
        validation={{
            isValid: valids.validNationalId,
            message: <>Enter you national id, acceptable length is between 5 to 20 characters. <br /></>
        }}
        ariaDescribedBy="nationalIdnote"
        placeholder="Enter your national id here..."
    />
  )
});

export default NationalIdInput