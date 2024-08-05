import { selectCurrentFocus, selectCurrentInputs, selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';
import MyPhoneInput from './MyPhoneInput';
import { regex } from '../../util/regex';

const PhoneNumberInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const inputs = useSelector(selectCurrentInputs)
    const focus  = useSelector(selectCurrentFocus)
    const dispatch = useDispatch();

    const handleChange = (value) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: "phoneNumber", value: value }));
        const result = regex.PHONE_NUMBER_REGEX.test(value)
        dispatch(setObjectItem({ key: 'registrationValids', innerKey: "validPhoneNumber", value: result }));
    }

  return (
    <MyPhoneInput
        inputs={inputs}
        valids={valids}
        handlePhoneNumberChange={handleChange}
        focus={focus}
    />
  )
});

export default PhoneNumberInput