import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, useGetAllUsersQuery } from '../../features/users/usersSlice';
import { selectCurrentUser, setObjectItem } from '../../features/auth/authSlice';
import { forwardRef } from 'react';

const UserSelector = forwardRef(({ onSelectUser, params}, ref) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const orderedUsers = useSelector(selectAllUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [options, setOptions] = useState([]);
  // Fetch all users from the backend
  const { isSuccess } = useGetAllUsersQuery();
  const {key, innerKey, nextRef } = params

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
  }, [orderedUsers, currentUser])

  const handleUserChange = (selectedOption) => {
    const selectedUserDetails = orderedUsers.find((user) => user.userId === selectedOption.value);
    console.log("key", key)
    console.log("innerKey", innerKey)
    console.log("userId", selectedUserDetails.userId )
    dispatch(setObjectItem({ key: key, innerKey: innerKey, value: selectedUserDetails.userId }));
    setSelectedUser(selectedOption);
    onSelectUser(selectedUserDetails);
    nextRef?.current.focus()
  }

  return (
    <div className="mb-3">
      <label htmlFor="userSelector" className="form-label">
        Select User
      </label>
      <Select
        id="userSelector"
        ref={ref}
        options={options}
        value={selectedUser}
        onChange={handleUserChange}
        isSearchable
        placeholder="Search for a user..."
      />
    </div>
  );
});

export default UserSelector;