/*
 * @Author: Squall Sha
 * @Date: 2019-11-14 11:00:00
 */
import React from 'react';
import { Link } from '@reach/router';
import logoSVG from '../../images/logo.png';

const Logo = ({ to }) => {
  return (
    <Link
      key={to}
      to={to}
      className="logo"
    >
      <img src={logoSVG} alt="logo" />
    </Link>
  );
};

export default Logo;
