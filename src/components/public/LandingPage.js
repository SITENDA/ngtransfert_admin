import React from 'react'
import { useNavigate } from 'react-router-dom';
import WelcomeButton from '../WelcomeButton';

const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <div className="col-lg-8">
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <h4 className="text-white font-weight-normal mb-3">
              Empowering Your Financial Freedom
            </h4>
            <p className="text-white-75 mb-5  mt-5 paragraph-background" style={{fontSize: '1.2rem'}}>
              At Novic Financial Services, we provide tailored loan solutions to help you achieve your financial goals.
            </p>
          </div>
          <div className="carousel-item">
            <h4 className="text-white font-weight-normal mb-3">
              Trusted Loans Monitoring Services
            </h4>
            <p className="text-white-75 mb-5 mt-5 paragraph-background"  style={{fontSize: '1.2rem'}}>
              At Novic Financial Services, we provide tailored loan solutions to help you achieve your financial goals.
            </p>
          </div>
          <div className="carousel-item">
            <h4 className="text-white font-weight-normal mb-3">
              Keeping You Updated
            </h4>
            <p className="text-white-75 mb-5  mt-5 paragraph-background"  style={{fontSize: '1.2rem'}}>
              At Novic Financial Services, we provide tailored loan solutions to help you achieve your financial goals.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {/* <Button id='apply-btn' type='primary' onClick={() => navigate('/about')}>
          Apply for a Loan
        </Button> */}
        <WelcomeButton text="Apply for a Loan" onClick={navigate('/about')}/>
      </div>
    </div>
  )
}

export default LandingPage