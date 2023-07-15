import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, IconButton, InputAdornment, InputBase, InputLabel, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import {  signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebaseConfig';
import { useUI } from '../components/UIProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Auth = () => {
    const { defineToast } = useUI();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSigninClick = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        redirectToHome();
        defineToast({
          open: true,
          message: "Você foi logado com sucesso.",
          title: "Sucesso",
          severity: "success",
        });
      })
      .catch((error) => {
        if(error.code === "auth/missing-password"  || error.code === "auth/invalid-email" )
          defineToast({
            open: true,
            message: "Login inválido,  preencha o e-mail ou a senha corretamente!",
            title: "Erro",
            severity: "error",
          });
        else if(error.code === "auth/user-not-found" || error.code === "auth/wrong-password")
          defineToast({
            open: true,
            message: "Login inválido, e-mail ou senha incorretos!",
            title: "Erro",
            severity: "error",
        });
        else
          defineToast({
            open: true,
            message: "Ocorreu um erro ao fazer login, tente novamente mais tarde!",
            title: "Erro",
            severity: "error",
        });

        console.log(error.message, error.code)
      }); 
    };

    const handleSignupClick = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        redirectToHome();
          defineToast({
            open: true,
            message: "Sua conta foi criada com sucesso.",
            title: "Sucesso",
            severity: "success",
          });
      })
      .catch((error) => {
        if(error.code === "auth/email-already-in-use")
          defineToast({
              open: true,
              message: "O e-mail que está tentando usar já está em uso. Tente novamente.",
              title: "Erro",
              severity: "error",
          });
        else if(error.code === "auth/invalid-email")
          defineToast({
              open: true,
              message: "Não foi possível criar uma conta com este e-mail. Tente novamente.",
              title: "Erro",
              severity: "error",
          });
        else if(error.code === "auth/weak-password")
          defineToast({
              open: true,
              message: "A senha deve ter pelo menos 6 caracteres.",
              title: "Erro",
              severity: "error",
          });
        else
          defineToast({
              open: true,
              message: "Ocorreu um erro ao criar sua conta, tente novamente mais tarde!",
              title: "Erro",
              severity: "error",
          });

        console.log(error.message, error.code)
      });
    } 

    const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleRegisterClick = () => {
        if(isRegistered)
            setIsRegistered(false);
        else
            setIsRegistered(true);
    };

    const redirectToHome = () => {
        navigate('/project_react-ts-mui/');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',background: 'linear-gradient(to top, rgba(10, 10, 10, 0.9), rgba(0, 0, 0, 0.9))' , minHeight: "100vh"}}>
            <motion.div initial={{ y: -1000 }}  animate={{ y: 0 }} transition={{ duration: 1 }}>
                <Box sx={{position: 'relative', boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.4)", fontFamily: 'Lato', padding: '50px 20px 50px 20px', maxWidth: '470px', backgroundColor: 'rgba(46,46,46,0.7)', textAlign: 'center', minWidth: '400px', marginRight: '20px', marginLeft: '20px', borderRadius: '10px', '@media (max-width: 600px)': { minWidth: '0px', padding: '19px' }}}>
                  <IconButton sx={{position: 'absolute', top: '10px', left: '10px', backgroundColor: 'transparent', color: '#000'}} onClick={redirectToHome}>
                    <ArrowBackIcon sx={{fontSize: '27px', color: '#FFFFFF'}} />
                  </IconButton>
                  <AccountCircleIcon sx={{fontSize: '60px', color: '#FFFFFF'}}></AccountCircleIcon>
                  <Typography variant='h5' sx={{fontWeight: 'bold', fontFamily: 'Lato', paddingX: '20px', paddingBottom: '2px', color: '#FFFFFF'}}>{isRegistered? 'Crie sua conta para continuar': 'Faça login para continuar'} </Typography>
                  <Typography sx={{ fontWeight: 'light', fontFamily: 'Lato', paddingBottom: '5px', color: '#FFFFFF'}}>{isRegistered? 'Faça parte da nossa comunidade agora mesmo.': 'Acesse sua conta e aproveite todos os recursos.'} </Typography>
                  <div style={{margin: '10px 20px 20px 20px'}}>
                    <InputLabel sx={{color: '#FFFFFF', fontWeight: 'light', fontFamily: 'Lato'}}>E-mail</InputLabel>
                    <InputBase fullWidth placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} sx={{padding: '2px 10px 2px 10px', color: '#2E2E2E', borderRadius: '5px', marginTop: '4px', marginBottom: '15px', backgroundColor: 'rgba(255,255,255, 0.7)'}}/> 
                    <InputLabel sx={{color: '#FFFFFF', fontWeight: 'light', fontFamily: 'Lato'}}>Senha</InputLabel>
                    <InputBase fullWidth placeholder='Senha' onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} sx={{padding: '2px 10px 2px 10px', color: '#2E2E2E', marginTop: '4px', marginBottom: '15px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255, 0.7)'}} endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }/> 
                    {isRegistered? '' : <Button variant="contained" fullWidth  onClick={handleSigninClick} sx={{ backgroundColor: 'rgba(58,58,58, 0.7)', color: '#ffffff', marginTop: '10px', marginBottom: '20px', '&:hover':{backgroundColor: 'rgba(70,70,70, 0.7)'}}}>Logar</Button>}
                    {isRegistered? <div><Button variant="contained" fullWidth onClick={handleSignupClick} sx={{ backgroundColor: 'rgba(58,58,58, 0.7)', color: '#ffffff',  marginTop: '10px', marginBottom: '20px', '&:hover':{backgroundColor: 'rgba(70,70,70, 0.7)'}}}>Cadastrar</Button> <Typography sx={{color: '#FFFFFF', marginTop: '10px', fontWeight: 'light', fontFamily: 'Lato'}}>Não possui uma conta? <span onClick={handleRegisterClick} style={{color: '#FFFFFF', cursor: 'pointer', fontWeight: 'bold'}}>Faça login</span></Typography></div>: <Typography sx={{color: '#FFFFFF', marginTop: '10px', fontWeight: 'light', fontFamily: 'Lato'}}>Não possui uma conta? <span onClick={handleRegisterClick} style={{color: '#FFFFFF', cursor: 'pointer', fontWeight: 'bold'}}>Registre-se</span></Typography>}
                  </div>
                </Box>
            </motion.div>
        </div>
    );
}

export default Auth;