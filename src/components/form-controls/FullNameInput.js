import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const FullNameInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleFullNameChange = (event) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: 'fullName', value: event.target.value }));
    };

  return (
    <InputField
        label="Full Name"
        id="fullName"
        type="text"
        name="fullName"
         ref={ref}
        required
        onChange={handleFullNameChange}
        validation={{
            isValid: valids.validFullName,
            message: <>Atleast two or more names. <br />
                Each starts with a capital letter. <br />
                Letters, numbers, underscores, allowed.</>
        }}
        ariaDescribedBy="fullnamenote"
        placeholder="Enter full name"
    />
  )
});
export default FullNameInput