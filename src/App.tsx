import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useUI } from "./UIProvider";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

interface Game {
  id: number;
  thumbnail: string;
  title: string;
}

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
  const { data, isLoading, isError } = useQuery<Game[], AxiosError>(
    "games",
    fetchGames,
    {
      onError: (error) => {
        if(error.response){
          if(error.code === 'ECONNABORTED'){
            defineToast({
              open: true,
              message: "O servidor demorou para responder, tente mais tarde.",
              title: "Erro",
              severity: "error",
            });
          }
          if(error!.response.status >= 500 && error!.response.status <= 509){
            defineToast({
              open: true,
              message: "O servidor fahou em responder, tente recarregar a página.",
              title: "Erro",
              severity: "error",
            });
          }else{
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

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></div>;
  }

  if (isError) {
    return (
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="error">Algo de errado aconteceu.</Alert>
      </Box>
      
    );
  }

  return (
    <Box sx={{ width: '61%', margin: '0 auto', padding: '30px 0'}}>
      <Grid container spacing={2}>
        {data?.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card sx={{ maxWidth: "350px", padding: "5px", borderRadius: "8px", mx: "auto", my: "10px" }}>
              <CardMedia
                component="img"
                height="200"
                image={game.thumbnail}
                alt={game.title}
              />
              <CardContent>
                <Typography gutterBottom component="div" sx={{ textAlign: 'center' }}>
                  {game.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ backgroundColor: "#202020" }}>
        <GamesList />
      </div>
    </QueryClientProvider>
  );
};

export default App;