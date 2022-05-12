import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledButton = styled(ButtonBase)`
  position: relative;
  box-sizing: border-box;
  padding: 0 2.5rem;
  border: 0;
  background: #fff;
  color: black;
  line-height: 2.5rem;
  font-size: 1.2rem;
  transition: opacity 0.2s;
  cursor: pointer;

  span {
    position: relative;
    display: block;
  }
`;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function Button({ text, ...props }: Props) {
  return (
    <StyledButton {...props}>
      <span data-text={text}>{text}</span>
    </StyledButton>
  );
}
