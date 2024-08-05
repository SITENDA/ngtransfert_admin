import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsDarkTheme, setObjectItem} from '../../features/auth/authSlice';
import {darkColor, lightColor} from "../../util/initials";

function MyPhoneInput({ inputs, valids, handlePhoneNumberChange, setFocus, focus }) {

  const dispatch = useDispatch();
  const isDarkTheme = useSelector(selectIsDarkTheme);

  return (
    <div className="mb-3">
      <label htmlFor="phoneNumber" className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
        Phone Number
        <span className={valids.validPhoneNumber ? "valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={valids.validPhoneNumber || !inputs.phoneNumber ? "hide" : "invalid"}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>
      <PhoneInput
        id="phoneNumber"
        name="phoneNumber"
        className="mt-2"
        country={'ae'}
        value={inputs.phoneNumber}
        onChange={handlePhoneNumberChange}
        inputProps={{
          required: true
        }}
        style={{maxWidth: '100%'}}
        aria-invalid={valids.validPhoneNumber ? "false" : "true"}
        aria-describedby='phonenote'
        onFocus={() =>
          dispatch(setObjectItem({ key: 'registrationFocus', innerKey: "phoneNumberFocus", value: true }))
        }
        onBlur={() =>
          dispatch(setObjectItem({ key: 'registrationFocus', innerKey: "phoneNumberFocus", value: false }))
        }
      />
      <p id='phonenote' className={focus.phoneNumberFocus && !valids.validPhoneNumber ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faCircle} />
        Valid phone numbers are between 10 to 13 digits.<br />
      </p>
    </div>
  );
}

export default MyPhoneInput;
