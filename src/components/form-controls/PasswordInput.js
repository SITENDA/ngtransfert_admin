import React from 'react'

import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const PasswordInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: 'password', value: event.target.value }));
    };

  return (
    <InputField
            label="Password"
            id="password"
            type="password"
            name="password"
            ref={ref}
            required
            onChange={handleChange}
            validation={{
                isValid: valids.validPassword,
                message: <>Password Requirements: <br />
                    - 4 to 24 characters long <br />
                    - Contains at least one uppercase letter <br />
                    - Contains at least one lowercase letter <br />
                    - Contains at least one digit <br />
                    - Contains at least one special character <br />
                    (Allowed special characters:
                    <span aria-label="exclamation">!</span>
                    <span aria-label="at"> @</span>
                    <span aria-label="hash">#</span>
                    <span aria-label="dollar">$</span>
                    <span aria-label="percent">%</span>
                    <span aria-label="caret">^</span>
                    <span aria-label="ampersand">&amp;</span>
                    <span aria-label="asterisk">*</span>
                    <span aria-label="parenthesis">( )</span>
                    <span aria-label="hyphen">-</span>
                    <span aria-label="underscore">_</span>
                    <span aria-label="equal">=</span>
                    <span aria-label="plus">+</span>
                    <span aria-label="curly-braces">{ }</span>
                    <span aria-label="semicolon">;</span>
                    <span aria-label="colon">:</span>
                    <span aria-label="comma">,</span>
                    <span aria-label="less-than">&lt;</span>
                    <span aria-label="greater-than">&gt;</span>
                    <span aria-label="pipe">|</span>
                    <span aria-label="square-brackets">[ ]</span>
                    <span aria-label="slash">/</span>
                    <span aria-label="backslash">\</span>
                    <span aria-label="question-mark">?</span>)
                    <br /></>
            }}
            ariaDescribedBy="passwordnote"
            placeholder="Enter password"
        />
  )
});

export default PasswordInput