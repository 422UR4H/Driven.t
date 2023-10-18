import styled from 'styled-components';
import Typography from '@mui/material/Typography';

export default function Typo({ variant='h1', children, ...props }) {
  return (
    <StyledMuiTypography {...props } variant={variant} >
      {children}
    </StyledMuiTypography>
  );
}

const StyledMuiTypography = styled(Typography)`
  margin: 8px !important;
`;
