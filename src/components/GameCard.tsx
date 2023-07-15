import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@material-ui/styles';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from "@mui/material/IconButton";
import { auth } from '../services/firebaseConfig';
import { useUI } from "./UIProvider";
import { useState, useEffect } from "react";
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface GameCardProps {
    id: number;
    title: string;
    image: string;
    genre: string;
}

const useStyles = makeStyles({
    card: {
        maxWidth: "350px",  
        margin: "2px auto",
    },

    titleCenter: {
        textAlign: "center",
    },
});

const GameCard: React.FC<GameCardProps> = ({ id, title, image, genre }) => {
    const style = useStyles();
    const { defineToast } = useUI();
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const user = auth.currentUser;
    const [isSaved, setIsSaved] = useState(false);
    const firestore = getFirestore();

    useEffect(() => {
        const checkIfGameIsSaved = async () => {
          if (user) {
            const userRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userRef);
      
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const savedGames = userData?.savedGames || [];
              setIsSaved(savedGames.includes(id));

              const userRatings = userData?.ratings || {};
              setUserRating(userRatings[id] || 0);
            }
          }
        };
      
        checkIfGameIsSaved();

        return () => {
            setUserRating(0);
            setIsSaved(false);
          };
      }, [user, firestore, id]);

    const handleFavorite = async () => {
        if (user) {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
      
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const savedGames = userData?.savedGames || [];
      
            if (savedGames.includes(id)) {
              const updatedSavedGames = savedGames.filter((gameId: number) => gameId !== id);
              await updateDoc(userRef, { savedGames: updatedSavedGames });
              setIsSaved(false);
            } else {
              const updatedSavedGames = [...savedGames, id];
              await updateDoc(userRef, { savedGames: updatedSavedGames });
              setIsSaved(true);
            }
          } else {
            await setDoc(userRef, { savedGames: [id] });
            setIsSaved(true);
          }
        } else {
          defineToast({
            open: true,
            message: 'Você está desconectado, faça login para favoritar jogos.',
            title: 'Erro',
            severity: 'error',
          });
        }
      };

      const handleRating = async (ratingValue: number) => {
        if (user) {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
    
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRatings = userData?.ratings || {};
    
            const updatedUserRatings = { ...userRatings, [id]: ratingValue };
    
            await updateDoc(userRef, {
              ratings: updatedUserRatings,
            });
    
            setUserRating(ratingValue);
          } else {
            await setDoc(userRef, {
              ratings: { [id]: ratingValue },
            });
    
            setUserRating(ratingValue);
          }
        } else {
          defineToast({
            open: true,
            message: 'Você está desconectado, faça login para avaliar jogos.',
            title: 'Erro',
            severity: 'error',
          });
        }
      };


    return <Card className={style.card} sx={{backgroundColor: "#1C1C1C", color: "#fff", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.4)", transition: 'background-color 0.6s', '&:hover': { backgroundColor: ' #2E2E2E'},}}>
        <CardMedia component="img" image={image} alt={title} />
            <CardContent>
                <Typography gutterBottom component="div" sx={{fontFamily:'Lato', fontWeight: 'bold', padding: 0, margin: 0}} className={style.titleCenter}>
                    {title}
                </Typography>
                <Typography sx={{fontFamily:'Lato', color: '#5F5E5D', padding: 0}} className={style.titleCenter}>
                    {genre}
                </Typography>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 5, marginBottom: '-6px'}}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <IconButton onClick={() => handleRating(index)} onMouseEnter={() => setRating(index)} onMouseLeave={() => setRating(0)} key={id + index} sx={{margin: '-5px'}}>
                                <StarIcon key={index} sx={{ color: index <= userRating || index <= rating ? '#FFC107' : '#9E9E9E', fontSize: '18px',  }} />
                            </IconButton>
                        ))}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton key={id} onClick={handleFavorite}>
                            <FavoriteIcon sx={{ color: isSaved ? '#FF0000' : '#9E9E9E', fontSize: '18px', marginRight: '4px', '&:hover': { color: '#FF0000'} }} />
                        </IconButton>
                    </Typography>
                </div>
            </CardContent>
    </Card>;
};

export default GameCard;