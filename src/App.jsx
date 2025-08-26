import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import Contact from './components/contact';
import About from './components/about';
import Testimonials from './components/testimonials';
import Menu from './components/Menu';
import Login from './components/login';
import Register from './components/register';


import ForgetPass from './components/ForgetPass';
import Checkout from './components/client/Checkout';
import Reservation from './components/client/Reservation';
import MessagesCont from './components/client/MessagesCont';
import SuccessPayment from './components/client/SuccessPayment';
import CancelPayment from './components/client/CancelPayment';
import Condition from './components/client/Condition';
import ReservationSuccess from './components/client/ReservationSuccess';
import Vehicles from './components/vehicles';
const App = () => {
  return (
    <>
    <Router>
   
   
    
      <Routes>

      <Route path="/" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/menu' element={<Menu/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/testimonials' element={<Testimonials/>}/>


      <Route path="/forget" element ={<ForgetPass/>}/>
      <Route path="/checkout" element ={<Checkout/>}/>



      <Route path="/reservation" element ={<Reservation/>}/>

      <Route path="/messages" element ={<MessagesCont/>}/>

      <Route path="/SuccessPayment" element ={<SuccessPayment/>}/>

      <Route path="/CancelPayment" element ={<CancelPayment/>}/>
   
      <Route path="/conditions" element ={<Condition/>}/>
      <Route path="/reservationSuccess" element ={<ReservationSuccess/>}/>
      <Route path="/vehicules" element={<Vehicles/>} />
      </Routes>
 
    </Router>
    </>
  )
}

export default App
