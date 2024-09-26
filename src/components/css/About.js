import React, { useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import Layout from './Layout';
import { useDispatch } from 'react-redux';
import { setItem } from '../features/auth/authSlice';

const About = () => {
  const dispatch = useDispatch();
    useEffect( () => {
    dispatch(setItem({ key: 'title', value: "About Us" }));
  },[dispatch])

  return (
    <Layout>
      <section id="about" className="page-section" style={{ background: '#F5F5F5' }}>
        {/* Use the desired background color, e.g., near-white or cream */}
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-dark mt-0">Empowering Your Financial Goals</h2>
              {/* Use text-dark to ensure the text is readable on the light background */}
              <hr className="divider divider-light" />
              <p className="text-muted mb-4">
                At Novic Financial Services, we're dedicated to providing you with comprehensive loan solutions that are tailored to your unique financial needs. Our expert team is committed to supporting you in achieving your financial aspirations with flexible terms and swift processing. Unlock the potential to reach your dreams today. Tell us about yourself, have your account opened, and let's get in touch right away.
              </p>
              <HashLink to="/register" className="btn btn-dark btn-xl">
                Start Your Journey
              </HashLink>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
