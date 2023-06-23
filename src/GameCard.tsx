import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@material-ui/styles';

interface GameCardProps {
    title: string;
    image: string;
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

const GameCard: React.FC<GameCardProps> = ({ title, image }) => {
    const style = useStyles();
    return <Card className={style.card} sx={{backgroundColor: "#1C1C1C", color: "#fff", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.4)", transition: 'background-color 0.6s', '&:hover': { backgroundColor: ' #2E2E2E'},}}>
    <CardMedia component="img" image={image} alt={title} />
    <CardContent>
      <Typography gutterBottom component="div" sx={{fontFamily:'Lato'}} className={style.titleCenter}>
        {title}
      </Typography>
    </CardContent>
  </Card>;
};

export default GameCard;