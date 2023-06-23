import { makeStyles } from '@material-ui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface RadioOptionProps {
    option: string;
}

const useStyles = makeStyles({
    colorWhite: {
        color: "#fff",
        "&.MuiTypography-root": {
          fontFamily:'Lato'
        },
    }
});

const RadioOption: React.FC<RadioOptionProps> = ({ option }) => {
    const style = useStyles();
    return <FormControlLabel key={option} value={option} classes={{ label: style.colorWhite }} control={<Radio sx={{color: "#fff", '&.Mui-checked': { color: "#ccc"}}}/>} label={option}/>;
};

export default RadioOption;