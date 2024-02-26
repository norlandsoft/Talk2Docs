interface WorkPageProps {
  height: number;
  width: number;
}

const WorkPage: React.FC<WorkPageProps> = (props: WorkPageProps) => {

  const {
    height,
    width,
  } = props;

  return (
    <div style={{width, height}}>
    </div>
  );
}

export default WorkPage;