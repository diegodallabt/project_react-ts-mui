import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useUI } from "../components/UIProvider";
import { makeStyles } from '@material-ui/styles';
import { FormControl, InputLabel, MenuItem, RadioGroup, Select, createTheme, ThemeProvider, Button } from "@mui/material";
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
import {  Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signOut } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Game {
  id: number;
  thumbnail: string;
  title: string;
  genre: string;
}

interface Rating {
  id: string;
  rate: number;
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
  const [isWorst, setIsWorst] = useState(false);
  const [favoriteGameIds, setFavoriteGameIds] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isFavoritesSelected, setIsFavoritesSelected] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const firestore = getFirestore();
  

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

  useEffect(() => {
    if(user){
      const docRef = doc(firestore, "users", user.uid);

      const unsubscribe = onSnapshot(docRef, (docSnap: { exists: () => any; data: () => any; }) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData && userData.savedGames) {
            setFavoriteGameIds(userData.savedGames);
          }
        }
      });
  
      return () => {
        unsubscribe();
      };
    }
    
  }, [firestore, user?.uid, user]);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (user) {
        try {
          const docRef = doc(firestore, "users", user.uid);
  
          const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData && userData.ratings) {
                const ratings = userData.ratings;

                const ratingsArray: Rating[] = Object.keys(ratings)
                  .map((gameId) => ({
                    id: gameId,
                    rate: ratings[gameId],
                  }))
                  .sort((a, b) => isWorst? a.rate - b.rate : b.rate - a.rate);
  
                setRatings(ratingsArray);
              }
            }
          });
  
          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.error("Erro ao buscar jogos avaliados:", error);
        }
      }
    };
  
    fetchUserGames();
  }, [firestore, user?.uid, isWorst, user]);

  

  const handleOrderClick = () => {
    setIsWorst(!isWorst);
  };

  const handleFavoritesClick = async () => {
    setIsFavoritesSelected(!isFavoritesSelected);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const redirectToAuth = () => {
    navigate('/project_react-ts-mui/auth');
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
      (selectedGenre === "" || game.genre === selectedGenre) &&
      ( !user || isFavoritesSelected || favoriteGameIds.includes(game.id))
  );

  const filteredAndOrderedData = filteredData?.sort((a, b) => {
    const ratingA = ratings.find((rating) => rating.id === a.id.toString());
    const ratingB = ratings.find((rating) => rating.id === b.id.toString());
  
    if (ratingA && ratingB) {
      return isWorst ? ratingA.rate - ratingB.rate : ratingB.rate - ratingA.rate;;
    } else if (ratingA) {
      return -1;
    } else if (ratingB) {
      return 1;
    } else {
      return 0;
    }
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    setIsFavoritesSelected(false);
    signOut(auth).then(() => {
      defineToast({
        open: true,
        message: "Você foi desconectado com sucesso.",
        title: "Sucesso",
        severity: "success",
      });

    }).catch((error) => {
      defineToast({
        open: true,
        message: "Ops, aconteceu algo de errado, tente novamente.",
        title: "Erro",
        severity: "error",
      });
    })
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
              {/* EXIBIÇÃO EM DISPOSITIVOS MENORES */}
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
                                            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF',fontFamily: 'Lato', fontWeight: 'bold' }}>
                                                GAME COLLECTION
                                            </Typography>
                                        </Box>
                                    </Typography>
                                    
                                    {user? (<div>
                                    <Typography sx={{ color: '#FFFFFF',fontFamily: 'Lato', fontWeight: 'light', lineHeight: '15px', marginTop: '15px'}}>
                                      Use o botão para navegar entre seus jogos favoritos e todos os jogos da lista.
                                    </Typography> 
                                    <Button fullWidth onClick={handleFavoritesClick}  sx={{marginTop: '20px', color: '#FFFFFF', backgroundColor: '#202020', fontFamily: 'Lato', fontWeight: 'bold', '&:hover':{backgroundColor: '#202020'}}}>{isFavoritesSelected? 'Meus favoritos': 'Todos os jogos'}</Button>
                                    </div>): (
                                    <Typography sx={{ color: '#FFFFFF',fontFamily: 'Lato', fontWeight: 'light', lineHeight: '15px'}}>
                                      Para usar todos os recursos disponíveis e desbloquear a sua coleção, <Link style={{textDecoration: 'none', color: '#FFFFFF', fontWeight: 'bold'}} to='/project_react-ts-mui/auth'>faça login</Link>.
                                    </Typography>
                                    )}
                                    </Box>
                                </Box>
                            </Drawer>
                        </Box>
                    </Hidden>
                  {/* FIM EXIBIÇÃO EM DISPOSITIVOS MENORES */}
                
                {/* EXIBIÇÃO EM DISPOSITIVOS MAIORES */}
                <Hidden smDown>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <Typography variant="h6" component="div">
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '100px', '@media (max-width: 930px)': { marginLeft: "0px",}}}>
                            <img src={process.env.PUBLIC_URL + '/favicon.png'} alt="Logo" style={{ width: '40px', height: '40px', marginTop: '-5px', marginRight: '5px' }} />
                            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF',fontFamily: 'Lato' }}>GAME COLLECTION</Typography>
                        </Box>
                    </Typography>

                    {/* ICONES DE LOGIN E LOGOUT NA APPBAR */}
                    <Box sx={{display:'flex', flexDirection: 'column', marginTop: '15px', marginBottom: '10px', marginRight: '100px', '@media (max-width: 930px)': { marginRight: '0px'}}}>
                      <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        {user?
                        <div>
                        <Button onClick={handleFavoritesClick}  sx={{color: '#FFFFFF',fontFamily: 'Lato', fontWeight: 'bold', '&:hover': {backgroundColor: 'transparent'}, marginRight: '15px'}}>{isFavoritesSelected? 'Meus favoritos': 'Voltar'}</Button>
                        <IconButton onClick={handleLogout}>
                          <ExitToAppIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                        </div>
                        :
                        <IconButton onClick={redirectToAuth}>
                          <AccountCircleIcon sx={{color: "#fff", fontSize: '32px'}}/>
                        </IconButton>
                        }

                      </Box>
                    {/* FIM LOGIN NA APPBAR */}
                      
                    </Box>
                    
                </Box>
                </Hidden>
                {/* FIM DA EXIBIÇÃO EM DISPOSITIVOS MAIORES */}
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
      {user? (<div style={{display: 'flex', justifyContent: 'end' }}>
      <Typography variant="body1" component="span" sx={{color: '#FFFFFF',fontFamily: 'Lato', fontWeight: 'light'}}>
        {isWorst ? "Piores avaliações" : "Melhores avaliações"}
      </Typography>
      {isWorst ? (
      <IconButton onClick={handleOrderClick}>
        <KeyboardArrowDownIcon sx={{color: "#fff", marginTop: '-7px'}}/>
      </IconButton>
      ) : (
      <IconButton onClick={handleOrderClick}>
        <KeyboardArrowUpIcon sx={{color: "#fff", marginTop: '-7px'}}/>
      </IconButton>) }
      </div>): ""}
      
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
              filteredAndOrderedData?.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game.id}>
                  <GameCard id={game.id} title={game.title} image={game.thumbnail} genre={game.genre} />
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