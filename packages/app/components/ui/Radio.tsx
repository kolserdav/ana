function Radio({
  onClick,
  checked,
}: {
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  checked: boolean;
}) {
  return <input type="radio" checked={checked} onClick={onClick} />;
}

export default Radio;
