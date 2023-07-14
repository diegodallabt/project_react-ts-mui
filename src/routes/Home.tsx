import CircularProgress from "@mui/material/CircularProgress";

import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useUI } from "../components/UIProvider";
import { makeStyles } from '@material-ui/styles';
import { FormControl, InputLabel, MenuItem, RadioGroup, Select, createTheme, ThemeProvider } from "@mui/material";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import RadioOption from "../components/RadioOption";
import AlertBox from "../components/AlertBox";
import { Box, Typography, Toolbar,  AppBar, IconButton, Hidden, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SelectChangeEvent }  from '@mui/material';
import TextHeader from "../components/TextHeader";
import TopScrollButton from "../components/TopScrollButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {  useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signOut } from "firebase/auth";

interface Game {
  id: number;
  thumbnail: string;
  title: string;
  genre: string;
}

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: '1px',
          borderColor: '#fff',
          '&:hover': {
            borderColor: '#fff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#fff',
          height: '25px',
          ':hover': {
            borderColor: '#fff',
          },
        },
        icon: {
          color: '#ffffff',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
          fontFamily: 'Lato',
          fontSize: '14px',
          fontWeight: 'bold',
          lineHeight: '13px',
          letterSpacing: '0.25px',
          "&.Mui-focused": {
            "lineHeight": "19px",
            "color": "#fff"
          }
        },
        
      },
    }
  },
});

const useStyles = makeStyles({
  containerAlign: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: "20px 0px"
  },

  content: {
    width: "50%",
    margin: "0 auto",
    padding: "30px 0",

    '@media (max-width: 600px)': {
      width: "61%",
    },
  },

  centralize: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
});


const queryClient = new QueryClient();

const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await axios.get(
      "https://" + process.env.REACT_APP_API_URL,
      {
        headers: {
           "dev-email-address": "ddb.thedoldi@gmail.com",
        },
        timeout: 5000,
      }
    );

    return response.data as Promise<Game[]>;
  } catch (error) {
    throw error;
  }
};

const GamesList = () => {
  const { defineToast } = useUI();
  const style = useStyles();
  const [showButton, setShowButton] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  

  const { data, isLoading, isError } = useQuery<Game[], AxiosError>(
    "games",
    fetchGames,
    {
      retry: false,
      onError: (error) => {
        if (error.response) {
          if (error.response.status === 500 || error.response.status === 502 || error.response.status === 503 || error.response.status === 504 || error.response.status === 507 || error.response.status === 508 || error.response.status === 509) {
            defineToast({
              open: true,
              message: "O servidor falhou em responder, tente recarregar a página.",
              title: "Erro",
              severity: "error",
            });
          }else {
            defineToast({
              open: true,
              message: "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }
        }
        if(error.response === undefined) {
          if (error.code === "ECONNABORTED") {
            defineToast({
              open: true,
              message: "O servidor demorou para responder, tente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }else {
            defineToast({
              open: true,
              message: "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      
      },
    }
  );

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const redirectToAuth = () => {
    navigate('/auth');
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGenre(event.target.value);
  };

  const handleGenreChangeMobile = (event: SelectChangeEvent<string>) => {
    setSelectedGenre(event.target.value);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const genres = Array.from(new Set(data?.map((game) => game.genre)));

  const filteredData = data?.filter(
    (game) =>
      game.title.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      (selectedGenre === "" || game.genre === selectedGenre)
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      defineToast({
        open: true,
        message: "Você foi desconectado com sucesso.",
        title: "Sucesso",
        severity: "success",
      });

    }).catch((error) => {
      // An error happened.
    })
  }

  if (user !== null) {
    user.providerData.forEach((profile) => {
      console.log("  Email: " + profile.email);
    });
  }

  if (isLoading) {
    return (
      <div className={style.centralize}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.centralize}>
        <AlertBox msg="Não foi possível obter os dados, um erro foi detectado." type="error"/>
      </div>
    );
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#2E2E2E' }}>
            <Toolbar>
                <Hidden smUp>
                    <Box sx={{ display: 'flex', alignItems: 'center',  width: '100%' }}>
                      <IconButton onClick={handleDrawerToggle} color="inherit">
                          <MenuIcon />
                      </IconButton>
                      <Box sx={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <img src={process.env.PUBLIC_URL + '/favicon.png'} alt="Logo" style={{ width: '40px', height: '40px' }} />
                      </Box>
                      {user?
                        <IconButton onClick={handleLogout}>
                          <ExitToAppIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                        :
                        <IconButton onClick={redirectToAuth}>
                          <AccountCircleIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                      }
                            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
                                <Box sx={{ width: '320px', backgroundColor: '#2E2E2E', minHeight: '100vh'}}>
                                    
                                    <Box sx={{ padding: '20px' }}>
                                    <Typography variant="h6" component="div">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF',fontFamily: 'Lato' }}>
                                                GAME COLLECTION
                                            </Typography>
                                        </Box>
                                    </Typography>
                                        
                                    </Box>
                                </Box>
                            </Drawer>
                        </Box>
                    </Hidden>
                    
                <Hidden smDown>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <Typography variant="h6" component="div">
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '100px', '@media (max-width: 930px)': { marginLeft: "0px",}}}>
                            <img src={process.env.PUBLIC_URL + '/favicon.png'} alt="Logo" style={{ width: '40px', height: '40px', marginTop: '-5px', marginRight: '5px' }} />
                            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF',fontFamily: 'Lato' }}>GAME COLLECTION</Typography>
                        </Box>
                    </Typography>

                    {/* LOGIN NA APPBAR */}
                    <Box sx={{display:'flex', flexDirection: 'column', marginTop: '15px', marginBottom: '10px', marginRight: '100px', '@media (max-width: 930px)': { marginRight: '0px'}}}>
                      <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        {user?
                        <IconButton onClick={handleLogout}>
                          <ExitToAppIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                        :
                        <IconButton onClick={redirectToAuth}>
                          <AccountCircleIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                        }
                        {/* <InputBase placeholder='E-mail' sx={{padding: '2px 10px 2px 10px', color: '#CCCCCC', width: '170px', borderRadius: '3px', marginRight: '10px', backgroundColor: '#3F3F3F'}} />
                        <InputBase placeholder='Senha' type="password" sx={{padding: '2px 10px 2px 10px', color: '#CCCCCC', borderRadius: '5px', marginRight: '10px', width: '170px', backgroundColor: '#3F3F3F'}}/> */}
                        {/* <Button variant="contained" sx={{ backgroundColor: '#202020', color: '#ffffff', paddingX: '20px', '&:hover':{backgroundColor: '#1F3275'}}}>Acessar conta</Button> */}
                        {/* <IconButton><PersonAddIcon sx={{color: "#fff"}}/></IconButton> */}

                      </Box>
                    {/* FIM LOGIN NA APPBAR */}
                      
                    </Box>
                    
                </Box>
                </Hidden>
            </Toolbar>
        </AppBar>
      
      {/* HEADER */}
      <div className={style.content}>
        <TextHeader txtTitle="Uma coleção de jogos sempre atualizada para você" txtSubtitle={user?  "Gerencie sua coleção e aproveite seus jogos favoritos!": "Crie já sua conta, assim você pode avaliar e salvar seus jogos favoritos"}/>
        <div className={style.containerAlign}>
          <SearchBar searchTerm={searchTerm} onchange={handleSearchChange} msg="Buscar por jogo"/>
        </div>

        {/* FILTRO DE GÊNERO COM RADIO BUTTON */}
        <Hidden smDown>
          <RadioGroup name="genre" row value={selectedGenre} onChange={handleGenreChange} className={style.containerAlign}>
            {Array.from(genres).map((genre) => (<RadioOption key={genre} option={genre} label={genre}/>))}
            <RadioOption key="all" option="" label="Todos"/>
          </RadioGroup> 
        </Hidden>
        {/* FIM DO FILTRO DE GÊNERO COM RADIO BUTTON */}

        {/* FILTRO DE GÊNERO COM SELECT */}
        <Hidden smUp>
        <ThemeProvider theme={theme}>
          <FormControl sx={{width: '75%', marginLeft: '30px'}}>
            <InputLabel>Gênero</InputLabel>
            <Select value={selectedGenre} onChange={handleGenreChangeMobile} size="small" label="Gênero" sx={{color: '#CCCCCC', fontFamily: 'Lato', borderColor: '#fff', marginBottom: '20px'}}>
              <MenuItem key="all" value="">
                <em>Nenhum</em>
              </MenuItem>
              {Array.from(genres).map((genre) => (<MenuItem key={genre} value={genre}>{genre}</MenuItem>))}
            </Select>
          </FormControl>
        </ThemeProvider>
        </Hidden>
        {/* FIM DO FILTRO DE GÊNERO COM SELECT */}
      {/* FIM DO HEADER */}

      {/* INICIO DO GRID DE CARDS*/}
      {filteredData && filteredData.length > 0 ? (
        <div style={{borderTop: "1px solid #2E2E2E"}}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 30, marginBottom: 20}}>
            <div style={{border: '0.5px solid #ffffff', padding: "10px", borderRadius: "3px"}}>
            <Typography sx={{color: '#ffffff', fontFamily: 'Lato', fontWeight: 'light'}}>
              {filteredData && filteredData.length > 1? filteredData.length.toString() + " jogos encontrados":filteredData.length === 1? filteredData.length.toString() + " jogo encontrado":""}
            </Typography>
            </div>
            
          </div>
          <Grid container spacing={2}>
            {
              filteredData?.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game.id}>
                  <GameCard title={game.title} image={game.thumbnail} genre={game.genre}/>
                </Grid>
              ))
            }
          </Grid>
        </div>): (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh'}}>
            <AlertBox msg="Nenhum item encontrado para essa busca." type="info" />
          </Box>
        )}
      </div>
      {/* FIM DO GRID DE CARDS */}
      
      {showButton && (<TopScrollButton onclick={handleScrollToTop} />)}
    </div>
  );
};

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ backgroundColor: "#202020", minHeight: "100vh"}}>
        <GamesList />
      </div>
    </QueryClientProvider>
  );
};

export default Home;