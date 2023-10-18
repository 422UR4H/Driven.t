import MuiButton from '@mui/material/Button';
import styled from 'styled-components';

export default function Button({ variant='contained', children, ...props }) {
  return (
    <StyledMuiButton variant={variant} {...props}>
      {children}
    </StyledMuiButton>
  );
}

const StyledMuiButton = styled(MuiButton)`
  margin-top: 8px !important;
  background-color: #E0E0E0 !important;
  color: #000 !important;
  box-shadow: rgba(149, 157, 165, 0.3) 0px 8px 24px !important;
`;
