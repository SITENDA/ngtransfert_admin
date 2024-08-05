import React, { useState, forwardRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { selectIsDarkTheme } from '../../features/auth/authSlice';
import { darkColor, lightColor } from '../../util/initials';

const InputField = forwardRef(({
  label, id, name, required,
  onChange, ariaDescribedBy, validation,
  placeholder, type, options, autoComplete,
  rows // Added rows for textarea
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const textStyle = {
    width: "90%",
  };

  const textareaStyle = {
    width: "90%",
    resize: "vertical",
  };

  const styleToUse = type === "textarea" ? textareaStyle : textStyle;
  const classNameToUse = type === "select" ? "" : type === "textarea" ? "form-control" : "form-control";

  const inputProps = {
    ref: ref,
    type: type,
    autoComplete: "on",
    "aria-invalid": !validation.isValid ? "true" : "false",
    "aria-describedby": ariaDescribedBy,
    className: classNameToUse,
    id: id,
    name: name,
    required: required,
    onChange: onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder: placeholder,
    options: options,
    style: styleToUse,
    rows: type === "textarea" ? rows : null // Set rows attribute for textarea only
  };

  let TextInput = <input {...inputProps} />;
  let SelectInput = <div><Select {...inputProps} /></div>;
  const InputToUse = type === "select" ? SelectInput : type === "textarea" ? <textarea {...inputProps} /> : TextInput;
  const isDarkTheme = useSelector(selectIsDarkTheme);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label" style={{ color: isDarkTheme ? lightColor : darkColor}}>
        {label}
        <span className={validation.isValid ? "valid" : "hide"}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={validation.isValid || !ref?.current?.value ? "hide" : "invalid"}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>

      {/* Render the input control */}
      {InputToUse}

      {/* Render validation message */}
      <p id={ariaDescribedBy} className={isFocused && ref?.current?.value && !validation.isValid ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle} />
        {validation.message}
      </p>
    </div>
  );
});

export default InputField;

