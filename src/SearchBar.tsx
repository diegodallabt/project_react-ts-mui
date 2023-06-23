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
        alignItems: 'flex-end'
    },
});

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onchange, msg }) => {
    const style = useStyles();
    return <div className={style.textfieldContent}>
        <Search sx={{ color: '#FFFFFF', mr: 1, my: 0.5 }} />
        <TextField id="search-textfield" value={searchTerm} onChange={onchange} label={msg} variant="standard" className={style.textfield}
        InputProps={{
            style: {
            padding: "0px 5px 0px 10px", 
            color: "#fff",
            borderBottom: "1px solid #9e9e9e",
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