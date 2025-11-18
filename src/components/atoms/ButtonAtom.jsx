import { Button } from "../ui/button";

export default function ButtonAtom({ children, className = "", ...props }) {
  return (
    <Button className={`${className}`} {...props}>
      {children}
    </Button>
  );
}
