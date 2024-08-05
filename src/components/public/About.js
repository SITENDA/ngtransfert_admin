import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { clientPaths } from '../../util/frontend';
import WelcomeText from '../WelcomeText';
import WelcomeButton from '../WelcomeButton';

const About = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setItem({ key: 'title', value: "About Us" }));
  }, [dispatch])
  const handleClick = () => {
    navigate(clientPaths.loginPath)
  }

  return (
    <div className="col-lg-8 text-center">
      <h2 className="text-white font-weight-normal mb-3">Empowering Your Financial Goals</h2>
      <hr className="divider divider-light" />
      <WelcomeText text={"At Novic Financial Services, we're dedicated to providing you with comprehensive loan solutions that are tailored to your unique financial needs. Our expert team is committed to supporting you in achieving your financial aspirations with flexible terms and swift processing. Unlock the potential to reach your dreams today. Tell us about yourself, have your account opened, and let's get in touch right away."}/>
      <WelcomeButton onClick={handleClick} text={"Start Your Journey"}/>
    </div>
  );
};

export default About;
