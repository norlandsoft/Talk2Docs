const Document = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path
        d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
        stroke={props.color} strokeWidth={props.thickness}></path>
      <path d="M8 10H16" stroke={props.color} strokeWidth={props.thickness} strokeLinecap="round"></path>
      <path d="M8 14H13" stroke={props.color} strokeWidth={props.thickness} strokeLinecap="round"></path>
    </g>
  </svg>
)

export default Document;