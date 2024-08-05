import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';
import { regex } from '../../util/regex';

const TitleInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (value) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: "title", value: value }));
        const result = regex.TITLE_REGEX.test(value) && value !== "Select your preferred title"
        dispatch(setObjectItem({ key: 'registrationValids', innerKey: "validTitle", value: result }));
    };

  return (
    <InputField
            label="Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            id="title"
            type="select"
            name="title"
            ref={ref}
            required
            onChange={handleChange}
            validation={{
                isValid: valids.validTitle,
                message: <>Select your title (Mr., Ms., Mrs., Dr., etc.).</>
            }}
            ariaDescribedBy="titlenote"
            placeholder="Choose a title"
            options={[
                {
                    value: 'Mr.',
                    label: 'Mr.',
                },
                {
                    value: 'Ms.',
                    label: 'Ms.',
                },
                {
                    value: 'Mrs.',
                    label: 'Mrs.',
                },
                {
                    value: 'Dr.',
                    label: 'Doctor',
                },
                {
                    value: 'Teacher',
                    label: 'Tr.',
                },
                {
                    value: 'Engineer',
                    label: 'Eng.',
                }
            ]}
        />
  )
});

export default TitleInput