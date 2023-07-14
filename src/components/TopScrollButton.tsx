import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TopScrollButtonProps {
    onclick: () => void;
}

const TopScrollButton: React.FC<TopScrollButtonProps> = ({ onclick }) => {
    return <button
    style={{position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: '#2E2E2E',
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onClick={onclick}>
        <KeyboardArrowUpIcon style={{ color: '#fff' }} />
    </button>;
};

export default TopScrollButton;