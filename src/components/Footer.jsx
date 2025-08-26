import React from 'react'

const footer = () => {
  return (
    <div classname="site-wrap" id="home-section">
    <div classname="site-mobile-menu site-navbar-target">
      <div classname="site-mobile-menu-header">
        <div classname="site-mobile-menu-close mt-3">
          <span classname="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div classname="site-mobile-menu-body"></div>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <h2 className="footer-heading mb-4">About Us</h2>
              <p>
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts.{" "}
              </p>
              <ul className="list-unstyled social">
                <li>
                  <a href="#">
                    <span className="icon-facebook" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon-instagram" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon-twitter" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon-linkedin" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-8 ml-auto">
              <div className="row">
                <div className="col-lg-3">
                  <h2 className="footer-heading mb-4">Quick Links</h2>
                  <ul className="list-unstyled">
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Testimonials</a>
                    </li>
                    <li>
                      <a href="#">Terms of Service</a>
                    </li>
                    <li>
                      <a href="#">Privacy</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                  </ul>
                </div>
             
              </div>
            </div>
          </div>
          <div className="row pt-5 mt-5 text-center">
            <div className="col-md-12">
              <div className="border-top pt-5">
                <p>
                  {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                  Copyright © All rights reserved | This template is made with{" "}
                  <i className="icon-heart text-danger" aria-hidden="true" /> by{" "}
                  <a href="https://colorlib.com" target="_blank">
                    Colorlib
                  </a>
                  {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
  )  
}

export default footer