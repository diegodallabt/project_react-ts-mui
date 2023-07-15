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
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import "../css/cssEffect.css"; 

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
    const [ratingCount, setRatingCount] = useState(0);
    const [ratingSum, setRatingSum] = useState(0);
    const user = auth.currentUser;
    const [isFavorited, setIsFavorited] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const firestore = getFirestore();

    useEffect(() => {
      const firestore = getFirestore();
      const ratingsCollectionRef = collection(firestore, 'ratings');
      const ratingsRef = doc(ratingsCollectionRef, id.toString());

      const unsubscribe = onSnapshot(ratingsRef, (doc) => {
        if (doc.exists()) {
          const ratingsData = doc.data();
          const count = ratingsData?.ratingCount || 0;
          const sum = ratingsData?.ratingSum || 0;
          setRatingCount(count);
          setRatingSum(sum);
        }
      });

      return () => {
        unsubscribe(); 
      };
    }, [id]);

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
            setIsFavorited(true);
            const updatedSavedGames = [...savedGames, id];
            await updateDoc(userRef, { savedGames: updatedSavedGames });
            setIsSaved(true);
            setTimeout(() => {
              setIsFavorited(false);
            }, 1500); 
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
    
          const previousRating = userRatings[id] || 0;
          const ratingDifference = ratingValue - previousRating;
    
          const updatedUserRatings = { ...userRatings, [id]: ratingValue };
    
          await updateDoc(userRef, {
            ratings: updatedUserRatings,
          });
    
          setUserRating(ratingValue);
    
          const ratingsCollectionRef = collection(firestore, 'ratings');
          const ratingsRef = doc(ratingsCollectionRef, id.toString());
    
          await runTransaction(firestore, async (transaction) => {
            const ratingsDoc = await transaction.get(ratingsRef);
    
            if (ratingsDoc.exists()) {
              const ratingsData = ratingsDoc.data();
              const userIds = ratingsData?.userIds || [];
              const uniqueUserIds = new Set([...userIds, user.uid]);
              const ratingCount = uniqueUserIds.size;
              const ratingSum = ratingsData?.ratingSum || 0;
    
              transaction.update(ratingsRef, {
                userIds: Array.from(uniqueUserIds),
                ratingCount: ratingCount,
                ratingSum: ratingSum + ratingDifference,
              });
            } else {
              transaction.set(ratingsRef, {
                userIds: [user.uid],
                ratingCount: 1,
                ratingSum: ratingDifference,
              });
            }
          });
        } else {
          await setDoc(userRef, {
            ratings: { [id]: ratingValue },
          });
    
          setUserRating(ratingValue);
    
          const ratingsCollectionRef = collection(firestore, 'ratings');
          const ratingsRef = doc(ratingsCollectionRef, id.toString());
    
          await setDoc(ratingsRef, {
            userIds: [user.uid],
            ratingCount: 1,
            ratingSum: ratingValue,
          });
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
                      {[1, 2, 3, 4].map((index) => (
                          <IconButton onClick={() => handleRating(index)} onMouseEnter={() => setRating(index)} onMouseLeave={() => setRating(0)} key={id + index} sx={{margin: '-5px'}}>
                              <StarIcon key={index} sx={{ color: index <= userRating || index <= rating ? '#DFCA33' : '#9E9E9E', fontSize: '18px',  }} />
                          </IconButton>
                      ))}
                      <span style={{ fontSize: '14px', color: '#5F5E5D' }}>{ratingCount !== 0? (ratingSum/ratingCount).toFixed(1).toString(): ratingSum.toFixed(1)} ({ratingCount})</span>
                  </Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton key={id} onClick={handleFavorite} className={isFavorited? "heartBeating" : ""}>
                          <FavoriteIcon sx={{ color: isSaved ? '#F51F1F' : '#9E9E9E', fontSize: '18px', marginRight: '4px', '&:hover': { color: '#913737'} }} />
                      </IconButton>
                  </Typography>
                </div>
            </CardContent>
    </Card>;
};

export default GameCard;