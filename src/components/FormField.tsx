import { Label } from "./ui";

interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<Props> = ({ label, error, children }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
