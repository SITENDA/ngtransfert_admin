import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import {darkColor, lightColor} from "../../util/initials";

const ClickToUpload = ({email}) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return (
        <div style={{
            width: '100px',
            height: '100px',
            border: '1px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDarkTheme ? lightColor : darkColor
        }}>Click to upload</div>
    );
};

export default ClickToUpload;