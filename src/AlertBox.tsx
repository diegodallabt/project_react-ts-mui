import { makeStyles } from '@material-ui/styles';
import Alert from '@mui/material/Alert';

interface AlertBoxProps {
    msg: string;
    type: string;
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

const AlertBox: React.FC<AlertBoxProps> = ({ msg, type}) => {
    const style = useStyles();
    return <Alert severity={type === 'error' || type === 'warning' || type === 'info' || type === 'success'? type : type='error'} sx={{boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.7)", fontFamily:'Lato'}} className={style.error}>{msg}</Alert>;
};

export default AlertBox;