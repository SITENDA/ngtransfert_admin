import InputField from './InputField'
import { forwardRef } from 'react';

const AlipayQrCodeInput = forwardRef(({changeHandler, validAlipayQrCode, value, isFocused, handleFocus, handleBlur}, ref) => {
  return (
    <InputField
        label="Alipay QR Code"
        id="alipayqrcode"
        type="text"
        name="alipayQrCode"
         ref={ref}
        required
        value={value}
        onChange={changeHandler}
        isFocused={isFocused}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        validation={{
            isValid: validAlipayQrCode,
            message: <>Image should be of an alipay qr code. <br /></>
        }}
        ariaDescribedBy="alipayqrcodenote"
        placeholder="Upload your Alipay QR Code"
    />
  )
});
export default AlipayQrCodeInput