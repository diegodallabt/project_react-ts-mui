import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useUI } from "./UIProvider";
import { makeStyles } from '@material-ui/styles';
import { Box, RadioGroup } from "@mui/material";
import GameCard from "./GameCard";
import SearchBar from "./SearchBar";
import RadioOption from "./RadioOption";
import AlertBox from "./AlertBox";

interface Game {
  id: number;
  thumbnail: string;
  title: string;
  genre: string;
}

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
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useQuery<Game[], AxiosError>(
    "games",
    fetchGames,
    {
      retry: false,
      onError: (error) => {
        if (error.response) {
          if (error.response.status >= 500 && error.response.status <= 509) {
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


  const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGenre(event.target.value);
  };

  const genres = Array.from(new Set(data?.map((game) => game.genre)));

  const filteredData = data?.filter(
    (game) =>
      game.title.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      (selectedGenre === "" || game.genre === selectedGenre)
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
      <div className={style.content}>
        <div className={style.containerAlign}>
          <SearchBar searchTerm={searchTerm} onchange={handleSearchChange} msg="Buscar por um jogo"/>
        </div>

        <RadioGroup name="genre" row value={selectedGenre} onChange={handleGenreChange} className={style.containerAlign}>
          {Array.from(genres).map((genre) => (<RadioOption key={genre} option={genre} label={genre}/>))}
          <RadioOption key="all" option="" label="Todos"/>
        </RadioGroup> 
      
      {filteredData && filteredData.length > 0 ? (
        <Grid container spacing={2}>
          {
            filteredData?.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <GameCard title={game.title} image={game.thumbnail} />
              </Grid>
            ))
          }
        </Grid>): (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh'}}>
            <AlertBox msg="Nenhum item encontrado para essa busca." type="info" />
          </Box>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ backgroundColor: "#202020", minHeight: "100vh"}}>
        <GamesList />
      </div>
    </QueryClientProvider>
  );
};

export default App;