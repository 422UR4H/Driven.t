import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/Auth';

import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Link from '../../components/Link';
import { Row, Title, Label } from '../../components/Auth';

import EventInfoContext from '../../contexts/EventInfoContext';
import UserContext from '../../contexts/UserContext';


import useSignIn from '../../hooks/api/useSignIn';
import { getGithubAccessToken, getGithubUserInfo, signUpWithGithub } from '../../services/github';
import { scrambleEmail } from '../../utils/passwordGenerator';
import { BsGithub } from 'react-icons/bs';
import GithubButton from '../../components/Form/GithubButton';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loadingSignIn, signIn } = useSignIn();

  const { eventInfo } = useContext(EventInfoContext);
  const { setUserData } = useContext(UserContext);

  const navigate = useNavigate();
  function adminLogin(){
    if(window.prompt('Digite a senha de admin') === import.meta.env.VITE_ADMIN_PASSWORD){
      localStorage.setItem('admin', true);
      navigate('/admin');
    }
  }
  useEffect(() => {
    (async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const githubPermissionAcessCode = urlParams.get('code');
      let githubEmail = '';
      let generatedPassword = '';
      if (githubPermissionAcessCode) {

        setEmail('');
        setPassword('');
        try {
          const acessTokenData = await getGithubAccessToken(githubPermissionAcessCode);
          if (acessTokenData.data.error) {
            window.open('/sign-in', '_self')
            navigate('/sign-in');
          }
          const userInfo = await getGithubUserInfo(acessTokenData.data.access_token);
          githubEmail = userInfo.data[0].email;
          generatedPassword = scrambleEmail(userInfo.data[1].email, import.meta.env.VITE_PASSWORD_GENERATOR_SECRET);
          setEmail(githubEmail);
          setPassword(generatedPassword);
          const userData = await signIn(githubEmail, generatedPassword);
          setUserData(userData);
          toast('Login realizado com sucesso!');
          navigate('/dashboard');

        } catch (err) {
          console.log("Could not login or get github user info, trying to sign up and login..");
          try {
            if (err.response.status === 401) {
              await signUpWithGithub(githubEmail, generatedPassword);
              const userLoginData = await signIn(githubEmail, generatedPassword);
              setUserData(userLoginData);
              toast('Login realizado com sucesso!');
              navigate('/dashboard');
            }
          } catch (error) {
            console.log("Erro ao logar com o github");
          }
        }
      }
    })();
  }, []);


  async function submit(event) {
    event.preventDefault();
    try {
      const userData = await signIn(email, password);
      setUserData(userData);
      toast('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast('Não foi possível fazer o login!');
    }
  }
  async function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`);
  }

  return (
    <AuthLayout background={(eventInfo?.backgroundImageUrl || "background: linear-gradient(90deg, #FF4791 0.17%, #FFD77F 99.83%)")}>
      <Row>
       {eventInfo && eventInfo.backgroundImageUrl && <img src={eventInfo?.logoImageUrl} alt="Event Logo" width="60px" />}
        <Title>{(eventInfo?.title || "Error, no event found!")}</Title>
      </Row>
      <Row>
        <Label>Entrar</Label>
        <form onSubmit={submit}>
          <Input label="E-mail" type="text" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Senha" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" color="primary" fullWidth disabled={loadingSignIn}>Entrar</Button>
          <GithubButton type="button" disabled={loadingSignIn} onClick={() => loginWithGithub()}><BsGithub />Entrar com Github</GithubButton>
          <GithubButton type="button" disabled={loadingSignIn} onClick={() => adminLogin()}><MdAdminPanelSettings />Sou admin</GithubButton>
        </form>
       
      </Row>
      <Row>
        <Link to="/enroll">Não possui login? Inscreva-se</Link>
      </Row>
    </AuthLayout>
  );
}
