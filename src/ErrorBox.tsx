import { makeStyles } from '@material-ui/styles';
import Alert from '@mui/material/Alert';

interface ErrorBoxProps {
    msg: string;
}

const useStyles = makeStyles({
    error: {
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.7)",
        borderRadius: "7px",
    
        '@media (max-width: 600px)': {
          width: "80%",
        },
    }
});

const ErrorBox: React.FC<ErrorBoxProps> = ({ msg }) => {
    const style = useStyles();
    return <Alert severity="error" sx={{boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.7)", fontFamily:'Lato'}} className={style.error}>{msg}</Alert>;
};

export default ErrorBox;