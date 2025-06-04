export default function TestComp() {
  const handleClick = () => {
    console.log("clicked!");
  };
  return (
    <div data-testid="testcomp" onClick={handleClick}>
      TestComp
    </div>
  );
}
