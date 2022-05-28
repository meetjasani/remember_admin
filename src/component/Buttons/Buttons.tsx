import React from "react";
import { Button } from "react-bootstrap";


interface Props {
  ButtonStyle: string;
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type: string
}

const Buttons: React.FC<Props> = ({
  children,
  onClick,
  ButtonStyle,
  disabled,
  type
}) => {
  return (
    <Button
      disabled={disabled || false}
      onClick={onClick}
      type={type}
      className={ButtonStyle}
    >
      {children}
    </Button>
  );
}

export default Buttons;