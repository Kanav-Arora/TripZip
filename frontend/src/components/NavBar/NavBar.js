import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';

import { loginAction, logoutAction } from '../../context/Auth/authAction'
import { AuthContext } from '../../context/Auth/authContext'
import { Hamburger, Cross } from '../../assets/ext-icon';

import Dropdown from './Dropdown';
import Modal from '../../components/Modal';
import SignUpModalContent from '../SignUpModalContent';
import LogInModalContent from '../LogInModalContent';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useContext(AuthContext);

  const isAuth = state.isAuthenticated;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLogInModal, setShowLogInModal] = useState(false);

  return (
    <nav className="absolute w-full top-0 bg-transparent py-4 flex justify-between items-center z-50 px-10 mobile:px-5">
      <div className="flex items-center text-white leading-3">
        <div className="hidden mobile:block pr-5 ">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <Cross />
            ) : (
              <Hamburger />
            )}
          </button>
        </div>
        Travel Buddy
      </div>

      {/* In mobile view: SideBar is open */}
      {isOpen && (
        <div className="hidden mobile:block absolute w-[200px] top-full bg-white py-2 shadow-xl rounded-lg">
          <div className="flex flex-col items-start space-y-4 pl-4">
            <Link to="/" className='text-black'>Home</Link>
            <Link to="/about" className='text-black'>About</Link>
            <Link to="#" className='text-black'>Upcoming Trips</Link>
            <button className="text-black">Login</button>
            <button className="text-white border px-2 py-2 bg-orange-accent rounded-md">Sign Up</button>
          </div>
        </div>
      )}

      <div className="mobile:hidden flex-grow flex justify-center space-x-6">
        <Link to="/" className='text-white'>Home</Link>
        <Link to="/about" className='text-white'>About</Link>
        <Link to="#" className='text-white'>Upcoming Trips</Link>
      </div>

      {
        isAuth === true
          ?
          <div className="mobile:hidden flex items-center space-x-2">
            <Dropdown name={state.name} />
          </div>
          :
          <div className="mobile:hidden flex items-center space-x-2">
            <button className="text-white bg-transparent pr-3 py-2" onClick={() => setShowLogInModal(true)}>Login</button>
            <Modal isVisible={showLogInModal} onClose={() => setShowLogInModal(false)}>
              <LogInModalContent />
            </Modal>
            <button className="bg-white text-black border rounded-full px-4 py-2" onClick={() => setShowSignUpModal(true)}>Sign Up</button>
            <Modal isVisible={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
              <SignUpModalContent />
            </Modal>
          </div>
      }
    </nav>
  )
}
