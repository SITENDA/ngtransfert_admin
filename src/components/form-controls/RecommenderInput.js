import React from 'react'

import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const RecommenderInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: 'recommender', value: event.target.value }));
    };

  return (
    <InputField
            label="Recommender"
            id="recommender"
            type="text"
            name="recommender"
            ref={ref}
            required
            onChange={handleChange}
            validation={{
                isValid: valids.validRecommender,
                message: <>Enter the name of the person or agent who told you about Novic</>
            }}
            ariaDescribedBy="recommendernote"
            placeholder="Enter recommender here"
        />
  )
});

export default RecommenderInput
