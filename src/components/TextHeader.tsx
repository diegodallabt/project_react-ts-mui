import { makeStyles } from '@material-ui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

interface TextHeaderProps {
    txtTitle: string;
    txtSubtitle: string;
}

const useStyles = makeStyles({
    alignment: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: "20px 0px"
      },
});

const TextHeader: React.FC<TextHeaderProps> = ({ txtTitle, txtSubtitle}) => {
    const style = useStyles();
    return <div>
        <div className={style.alignment}>
            <Typography variant="h4" component="h1" sx={{color: '#CCCCCC', fontFamily: 'Lato', textAlign: 'center', '@media (max-width: 600px)': {fontSize: '26px'},}}>
              {txtTitle}
            </Typography>
          </div>
        <div className={style.alignment}>
            <Typography sx={{color: '#CCCCCC', fontFamily: 'Lato', fontWeight:  'light', textAlign: 'center', marginTop: '-15px', marginBottom: '20px', '@media (max-width: 600px)': {fontSize: '14px'}}}>
                {txtSubtitle}
            </Typography>
        </div>
    </div>
};

export default TextHeader;