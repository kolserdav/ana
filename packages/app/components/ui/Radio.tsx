function Radio({
  onClick,
  checked,
  onChange,
}: {
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return <input type="radio" checked={checked} onChange={onChange} onClick={onClick} />;
}

Radio.defaultProps = {
  onClick: undefined,
};

export default Radio;
