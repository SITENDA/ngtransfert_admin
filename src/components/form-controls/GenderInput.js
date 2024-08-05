import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';
import { regex } from '../../util/regex';

const GenderInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (value) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: "gender", value: value }));
        const result = regex.GENDER_REGEX.test(value)
        dispatch(setObjectItem({ key: 'registrationValids', innerKey: "validGender", value: result }));
    };

  return (
    <InputField
            label="Gender"
            id="gender"
            type="select"
            name="gender"
            ref={ref}
            required
            onChange={handleChange}
            validation={{
                isValid: valids.validGender,
                message: <>Enter your gender (Male, Female, Other).</>
            }}
            ariaDescribedBy="gendernote"
            placeholder="Select gender"
            options={[
                {
                    value: 'Male',
                    label: 'Male',
                },
                {
                    value: 'Female',
                    label: 'Female',
                },
                {
                    value: 'Other',
                    label: 'Prefer not to say',
                }
            ]}
        />
  )
});

export default GenderInput