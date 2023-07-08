import { makeStyles } from '@material-ui/styles';
import { Search } from '@mui/icons-material';
import TextField from '@mui/material/TextField';

interface SearchBarProps {
    searchTerm: string,
    onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    msg: string;
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

    textfieldContent: {
        display: 'flex',
        alignItems: 'flex-end',

        '@media (max-width: 600px)': {
          marginLeft: '10px',     
        },
    },
});

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onchange, msg }) => {
    const style = useStyles();
    return <div className={style.textfieldContent}>
        <Search sx={{ color: '#FFFFFF', mr: 1, my: 0.5, fontSize: 30}} />
        <TextField id="search-textfield" value={searchTerm} onChange={onchange} label={msg} variant="outlined" size="small" className={style.textfield}
        InputProps={{
            style: {
            width: '85%',
            color: "#fff",
              
            },
        }}
        InputLabelProps={{
            style: {
            color: "#fff",
            fontFamily:'Lato',
            },
        }}
        />
    </div>;
};

export default SearchBar;