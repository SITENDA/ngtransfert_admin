import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const EmailInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: 'email', value: event.target.value }));
    };

  return (
    <InputField
    label="Email"
    id="email"
    type="email"
    name="email"
    ref={ref}
    required
    onChange={handleChange}
    validation={{
        isValid: valids.validEmail,
        message: <>Enter a valid email address here.</>
    }}
    ariaDescribedBy="emailnote"
    placeholder="Enter email"
/>
  )
});

export default EmailInput