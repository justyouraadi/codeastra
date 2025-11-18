import { Input } from "../ui/input";

export default function InputAtom({ className = "", ...props }) {
  return <Input className={`${className}`} {...props} />;
}
