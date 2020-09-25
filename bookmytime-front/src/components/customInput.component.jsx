import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    margin: 5px;
    padding: 10px
    `

const StyledInput = styled.input`
  border:0;
  border-bottom:1px solid #555;  
  background:transparent;
  width:100%;
  padding:8px 0 5px 0;
  font-size:16px;
  color:#1D3557;
    &:focus {
        border:none;	
        outline:none;
        border-bottom:1px solid #e74c3c;
    }
`

const StyledLabel = styled.label`
        position:absolute;
	    top: 0px;
	    left:10px;
    	font-size:16px;
	    color:#1D3557;	
        pointer-event:none;
	    transition: all 0.5s ease-in-out;
        ${StyledInput}:focus ~ & {
        top: -12px;
        }
        ${StyledInput}:valid ~ & {
        top: -12px;
        }
`


const CustomInput = ({label, ...other}) => (
    <Wrapper>
        <StyledInput {...other}/>
        <StyledLabel {...other}>{label}</StyledLabel>
    </Wrapper>
)

export default CustomInput