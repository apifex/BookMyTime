import styled from 'styled-components'

interface IDayStyled {
    top: number;
    left: number;
}

export const DayStyled: React.FunctionComponent<IDayStyled> = styled.div<{top: number, left: number}>`
    position: absolute;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    background-color: #A8DADC;
    width: 150px;
    padding: 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid; 
    border-color: #457B9D;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    `
