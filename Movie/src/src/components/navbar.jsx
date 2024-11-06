import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #141517;
  width: 100%;
  min-height: 50px;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #F32F5F;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-left: auto; 
  margin-right: 40px;
`;

const Button = styled(Link)`
  margin-left: 15px;
  padding: 8px 12px;
  background-color: ${props => (props.login ? '#141517' : '#F32F5F')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none; // 링크 밑줄 제거하기
  display: inline-block;

  &:hover {
    background-color: rgba(243, 47, 95, 0.5);
  }
`;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      // 사용자 정보 API 호출
      axios.get('http://localhost:3000/auth/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          const email = response.data.email;
          // 이메일에서 @ 앞부분 추출
          const nickname = email.split('@')[0];
          setNickname(nickname);
        })
        .catch((error) => {
          console.error('사용자 정보 가져오기 실패:', error);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setNickname('');
  };

  return (
    <NavbarContainer>
      <LogoLink to="/">
        <Logo>YONGCHA</Logo>
      </LogoLink>
      <ButtonContainer>
        {isLoggedIn ? (
          <>
            <span style={{ color: 'white', marginRight: '15px' }}>
              {nickname}님
            </span>
            <Button to="/" onClick={handleLogout}>로그아웃</Button>
          </>
        ) : (
          <>
            <Button to="/login" login="true">로그인</Button>
            <Button to="/signup">회원가입</Button>
          </>
        )}
      </ButtonContainer>
    </NavbarContainer>
  );
};

export default Navbar;