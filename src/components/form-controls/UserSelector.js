import React, { useState, useEffect, forwardRef } from 'react';
import { Autocomplete, TextField, Box, createTheme, ThemeProvider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, useGetAllUsersQuery } from '../../features/users/usersSlice';
import { selectCurrentUser, setObjectItem } from '../../features/auth/authSlice';
import { selectIsDarkTheme } from '../../features/auth/authSlice';
import { darkColor, lightColor } from "../../util/initials";

const UserSelector = forwardRef(({ onSelectUser, params }, ref) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const orderedUsers = useSelector(selectAllUsers);
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const [options, setOptions] = useState([]);

  // Fetch all users from the backend
  useGetAllUsersQuery();
  const { key, innerKey, nextRef } = params;

  useEffect(() => {
    if (orderedUsers) {
      // Prepare options for the Select component
      const optionsData = orderedUsers.map((user) => ({
        value: user.userId,
        label: user.userId === currentUser?.userId
          ? `Me - the CEO (${user.email})`
          : `${user.fullName} (${user.email})`,
      }));
      setOptions(optionsData);
    }
  }, [orderedUsers, currentUser]);

  const handleChange = (event, value) => {
    const selectedUserDetails = orderedUsers.find((user) => user.userId === value?.value);
    dispatch(setObjectItem({ key: key, innerKey: innerKey, value: selectedUserDetails?.userId }));
    onSelectUser(selectedUserDetails);
    nextRef?.current.focus();
  };

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
      background: {
        default: isDarkTheme ? darkColor : lightColor,
        paper: isDarkTheme ? darkColor : lightColor,
      },
      text: {
        primary: isDarkTheme ? lightColor : darkColor,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: 3 }}>
        <label htmlFor="userSelector" className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
          Select User
        </label>
        <Autocomplete
          defaultValue={{
            value: currentUser?.userId,
            label: `${currentUser?.fullName} (${currentUser?.email})`
          }}
          options={options}
          getOptionLabel={(option) => option.label}
          style={{ width: '90%' }}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search for a user..."
              variant="outlined"
              ref={ref}
              id="userSelector"
              sx={{ backgroundColor: isDarkTheme ? darkColor : lightColor, color: isDarkTheme ? lightColor : darkColor }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Box>
    </ThemeProvider>
  );
});

export default UserSelector;
