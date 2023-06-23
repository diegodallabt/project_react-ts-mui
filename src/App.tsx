import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useUI } from "./UIProvider";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import { Search } from "@mui/icons-material";
import { makeStyles } from '@material-ui/styles';

interface Game {
  id: number;
  thumbnail: string;
  title: string;
}

const useStyles = makeStyles({
  textfield: {
    "& label.Mui-focused": {
      color: '#A0AAB4',
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: '#B2BAC2',
    },
    "& .MuiInput-underline:hover": {
      borderBottomColor: '#B2BAC2',
    },
    "& .MuiOutlinedInput-root": {
      '& fieldset': {
        borderColor: '#E0E3E7',
      },
      "&:hover fieldset": {
        borderColor: '#B2BAC2',
      },
      "&.Mui-focused fieldset": {
        borderColor: '#6F7E8C',
      },
    },
  },

  searchIcon: {
    color: "#fff",
    margin: "0.5px 1px"
  },

  card: {
    maxWidth: "350px", 
    padding: "10px", 
    borderRadius: "8px", 
    margin: "10px auto",
  },

  textfield_content: {
    display: 'flex',
    alignItems: 'flex-end'
  },

  textfield_container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: "20px 0px"
  },
  
  title: {
    textAlign: "center",
  },

  content: {
    width: "61%",
    margin: "0 auto",
    padding: "30px 0" 
  },

  error_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh" 
  },

  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  }
});


const queryClient = new QueryClient();

const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await axios.get(
      "https://games-test-api-81e9fb0d564a.herokuapp.com/api/data",
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
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useQuery<Game[], AxiosError>(
    "games",
    fetchGames,
    {
      onError: (error) => {
        if (error.response) {
          if (error.code === "ECONNABORTED") {
            defineToast({
              open: true,
              message: "O servidor demorou para responder, tente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }
          if (error.response.status >= 500 && error.response.status <= 509) {
            defineToast({
              open: true,
              message: "O servidor falhou em responder, tente recarregar a página.",
              title: "Erro",
              severity: "error",
            });
          } else {
            defineToast({
              open: true,
              message: "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }
        }
      },
    }
  );

  const filteredData = data?.filter((game) =>
    game.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return (
      <div className={style.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.error_container}>
        <Alert severity="error">Algo de errado aconteceu.</Alert>
      </div>
    );
  }

  return (
    <div>

      <div className={style.content}>
        
        <div className={style.textfield_container}>
          <div className={style.textfield_content}>
              <Search sx={{ color: '#FFFFFF', mr: 1, my: 0.5 }} />
              <TextField id="search-textfield" value={searchTerm} onChange={handleSearchChange} label="Buscar por jogo" variant="standard" className={style.textfield}
                InputProps={{
                  style: {
                    padding: "0px 5px 0px 10px", 
                    color: "#fff",
                    borderBottom: "1px solid #9e9e9e",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#fff",
                  },
                }}
              />
          </div>
        </div>

        <Grid container spacing={2}>
          {filteredData?.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card className={style.card}>
                <CardMedia component="img" height="200" image={game.thumbnail} alt={game.title} />
                <CardContent>
                  <Typography gutterBottom component="div" className={style.title}>
                    {game.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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