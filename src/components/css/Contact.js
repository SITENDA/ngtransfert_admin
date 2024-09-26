import React, { useState } from 'react';
import Layout from './Layout'; // Import your custom Layout component here
import { MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setItem } from '../features/auth/authSlice';

const Contact = () => {
    // State for form submission feedback messages
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const dispatch = useDispatch();
    dispatch(setItem({ key: 'title', value: "Let's Get In Touch!" }));
    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would handle the form submission.
        // If successful, setSubmitSuccess to true, and if an error occurs, setSubmitError to true.
    };

    return (
        <Layout> {/* Wrap the component with your custom Layout component */}
            <section id="contact" className="page-section">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-lg-8 col-xl-6 text-center">
                            <p className="text-muted mb-5">Ready to start your next project with us? Send us a messages and we will get back to you as soon as possible!</p>
                        </div>
                    </div>
                    <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
                        <div className="col-lg-6">
                            <form id="contactForm" onSubmit={handleSubmit}>
                                {/* Name input */}
                                <div className="form-floating mb-3">
                                    <input id="name" className="form-control" type="text" placeholder="Enter your name..." required />
                                    <label htmlFor="name">Full name</label>
                                </div>
                                {/* Email address input */}
                                <div className="form-floating mb-3">
                                    <input id="email" className="form-control" type="email" placeholder="name@example.com" required />
                                    <label htmlFor="email">Email address</label>
                                </div>
                                {/* Phone number input */}
                                <div className="form-floating mb-3">
                                    <input id="phone" className="form-control" type="tel" placeholder="(123) 456-7890" required />
                                    <label htmlFor="phone">Phone number</label>
                                </div>
                                {/* Message input */}
                                <div className="form-floating mb-3">
                                    <textarea id="message" className="form-control" placeholder="Enter your message here..." style={{ height: '10rem' }} required />
                                    <label htmlFor="message">Message</label>
                                </div>
                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button id="submitButton" className="btn btn-primary btn-xl" type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-lg-4 text-center mb-5 mb-lg-0">
                            <MailOutlined style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                            <div>mujjabi20@gmail.com</div>
                            <i className="bi-phone fs-2 mb-3 text-muted"></i>
                            <div>+971 (52) 285-9939</div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;
