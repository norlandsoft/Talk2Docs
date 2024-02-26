const More = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="18" cy="12" r="1.5" transform="rotate(90 18 12)" fill={props.color}/>
      <circle cx="12" cy="12" r="1.5" transform="rotate(90 12 12)" fill={props.color}/>
      <circle cx="6" cy="12" r="1.5" transform="rotate(90 6 12)" fill={props.color}/>
    </g>
  </svg>
)

export default More;