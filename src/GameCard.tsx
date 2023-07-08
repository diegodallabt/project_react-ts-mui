import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@material-ui/styles';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface GameCardProps {
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

const GameCard: React.FC<GameCardProps> = ({ title, image, genre }) => {
    const style = useStyles();
    return <Card className={style.card} sx={{backgroundColor: "#1C1C1C", color: "#fff", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.4)", transition: 'background-color 0.6s', '&:hover': { backgroundColor: ' #2E2E2E'},}}>
        <CardMedia component="img" image={image} alt={title} />
            <CardContent>
                <Typography gutterBottom component="div" sx={{fontFamily:'Lato', padding: 0, margin: 0}} className={style.titleCenter}>
                    {title}
                </Typography>
                <Typography sx={{fontFamily:'Lato', color: '#5F5E5D', padding: 0}} className={style.titleCenter}>
                    {genre}
                </Typography>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 5}}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <StarIcon key={index} sx={{ color: index <= 0 ? '#FFC107' : '#9E9E9E', fontSize: '18px' }} />
                        ))}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                        <FavoriteIcon sx={{ color: '#9E9E9E', fontSize: '18px', marginRight: '4px' }} />
                    </Typography>
                </div>
            </CardContent>
    </Card>;
};

export default GameCard;