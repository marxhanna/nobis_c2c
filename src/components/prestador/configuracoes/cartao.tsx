import React, { useEffect, useState } from 'react';
import phone from '../../assets/icons/phone.png';
import mail from '../../assets/icons/email.png';
import loc from '../../assets/icons/gps.png';
import html2canvas from 'html2canvas';
import logo from '../../assets/logos/logoCartao.png';
import baseUrl from '../../assets/schemas/baseUrl';

interface CartaoProps {
  showEmail: boolean;
  showAddress: boolean;
}

const Cartao: React.FC<CartaoProps> = ({ showEmail, showAddress }) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    fetch(baseUrl + '/users', options)
      .then(response => response.json())
      .then(response => setUserData(response))
      .catch(err => console.error(err));
  }, []);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const formatName = (fullName: string) => {
    const nameParts = fullName.split(' ').map(capitalize);
    const firstName = nameParts[0] || '';
    const otherNames = nameParts.slice(1).join(' ');

    return (
      <>
        <span style={{ color: '#ffab00' }}>{firstName}</span>{' '}
        <span style={{ color: '#ffffff' }}>{otherNames}</span>
      </>
    );
  };

  const getFirstName = (fullName: string) => {
    const nameParts = fullName.split(' ');
    return capitalize(nameParts[0]);
  };

  return (
    <>
      {userData && (
        <div className="cartao">
          <div className="cartaoLogo">
            <img src={logo} alt="Logo Nobis" />
          </div>

          <div className="cartaoImg">
            <img
              className="iconPesquisa"
              src={`${baseUrl}/download/${userData.user.avatar}`}
              alt="Avatar"
              crossOrigin="anonymous"
            />
          </div>

          <div className="cartaoIcons">
            <div><img src={phone} style={{ height: '15px' }} alt="Phone" /></div>
            <div><img src={mail} style={{ height: '15px' }} alt="Mail" /></div>
            <div><img src={loc} style={{ height: '15px' }} alt="Location" /></div>
          </div>
        
          <div className="cartaoDados">
            <h2>{formatName(userData.user.fullName)}</h2>
            <p>{userData.user.isClient === 0 ? userData.user.role : 'Cliente'}</p>

            <div className="botaoContato">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/prestador/${userData.user.uuid}`}
              >
                Entre em contato com {getFirstName(userData.user.fullName)}
              </a>
            </div>

            {showEmail && (
              <>
                <h3>E-mail:</h3>
                <p>{userData.user.email}</p>
              </>
            )}

            {showAddress && (
              <>
                <h3>Endereço:</h3>
                <p>
                  {userData.user.address}, {userData.user.number},{' '}
                  {userData.user.complement}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cartao;
