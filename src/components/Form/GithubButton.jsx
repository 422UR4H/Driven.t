import styled from 'styled-components';

export default function GithubButton({ children, ...props }) {
    return (
        <StyledMuiButton  {...props}>
            {children}
        </StyledMuiButton>
    );
}

const StyledMuiButton = styled.button`
  margin-top: 8px !important;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #1976d2;
  height: 40px;
  border: 0;
  color: white;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    text-transform: uppercase;
    border-radius: 4px;
    transition: all 200ms ;
    &:hover{
        background-color: #115293;
    }
`;
