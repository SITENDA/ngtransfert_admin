import {useState, forwardRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {useSelector} from 'react-redux';
import {selectIsDarkTheme} from '../../features/auth/authSlice';
import {darkColor, lightColor} from '../../util/initials';
import {Select, MenuItem, FormControl, InputLabel} from '@mui/material'; // Import MUI components
import '../../assets/css/register.css';


const InputField = forwardRef(({
                                   label, id, name, required,
                                   handleChange, handleFocus, handleBlur, isFocused, value, ariaDescribedBy, validation,
                                   placeholder, type, options, autoComplete,
                                   maxAmount,  //Maximum amount in case of the Amount input
                                   rows // Added rows for textarea
                               }, ref) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    const textStyle = {
        width: "90%",
        backgroundColor: 'transparent',
        color: isDarkTheme ? lightColor : darkColor,
        '::placeholder': { // Placeholder style
            color: isDarkTheme ? lightColor : darkColor, // Use same color or lighter shade for better contrast
            opacity: 0.7, // Optional: adjust opacity to make it less prominent
        }
    };

    const textareaStyle = {
        width: "90%",
        resize: "vertical",
        backgroundColor: 'transparent',
        color: isDarkTheme ? lightColor : darkColor,
        '::placeholder': { // Placeholder style
            color: isDarkTheme ? lightColor : darkColor,
            opacity: 0.7,
        }
    };

    const selectStyle = {
        width: "90%",
        backgroundColor: 'transparent',
        color: isDarkTheme ? lightColor : darkColor,
        '::placeholder': {
            color: isDarkTheme ? lightColor : darkColor,
            opacity: 0.7,
        }
    };

    const styleToUse = type === "textarea" ? textareaStyle : type === "select" ? selectStyle : textStyle;
    const classNameToUse = type === "select" ? "" : type === "textarea" ? "form-control" : "form-control";
    const [showValidation, setShowValidation] = useState(false);

    const onChange = (e) => {
        setShowValidation(true);
        handleChange(e);
    };
    const onFocus = (e) => {
        handleFocus(e);
    };
    const onBlur = (e) => {
        handleBlur(e);
    };

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
        onChange,
        onFocus,
        onBlur,
        placeholder: placeholder,
        value: value ? value : '',
        options: options,
        style: styleToUse,
        rows: type === "textarea" ? rows : null // Set rows attribute for textarea only
    };

    let TextInput = <input {...inputProps} />;

    // Use MUI Select for select input types
    let SelectInput = (
        <FormControl fullWidth>
            <InputLabel style={{color: isDarkTheme ? lightColor : darkColor}}>{label}</InputLabel>
            <Select
                value={value || ""}
                variant="outlined"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                style={selectStyle}
                renderValue={(selectedValue) => {
                    console.log("Render Value called with:", selectedValue);
                    const selectedOption = options?.find(option => option.value === selectedValue);
                    return selectedOption ? selectedOption.label : ""; // Return the label or an empty string if none is selected
                }}
                inputProps={{
                    'aria-describedby': ariaDescribedBy,
                    'aria-invalid': !validation.isValid ? "true" : "false",
                }}
            >
                {options?.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>


        </FormControl>
    );

    const InputToUse = type === "select" ? SelectInput : type === "textarea" ?
        <textarea {...inputProps} /> : TextInput;

    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
                {label}
                <span className={validation.isValid && showValidation ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validation.isValid || !showValidation || !ref?.current?.value ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>

            {/* Render the input control */}
            {InputToUse}

            {/* Render validation message */}
            <p id={ariaDescribedBy}
               className={isFocused && ref?.current?.value && (!validation.isValid && showValidation) ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                {validation.message}
            </p>
        </div>
    );
});

export default InputField;