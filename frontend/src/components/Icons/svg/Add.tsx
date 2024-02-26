const Add = ({ size = 24, color = '#1C274C', thickness = 1.5 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12H19" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default Add;