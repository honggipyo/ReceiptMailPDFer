import styled from 'styled-components';

const ButtonStyle = styled.button`
  width: 500px;
  height: 60px;
  padding: 10px;
  margin-bottom: 20px;
  background: ${props => (props.disabled ? '#d3d3d3' : '#ff9900')};

  color: white;
  border: none;
  border-radius: 10px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    opacity: 0.2;
  }
`;

const TextStyle = styled.div`
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0em;
`;

export function OrangeButton({
  text,
  disabled = false,
  onClick,
}: {
  text: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonStyle disabled={disabled} onClick={() => onClick()}>
      <TextStyle>{text}</TextStyle>
    </ButtonStyle>
  );
}
