import { ChangeEvent } from "react";

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  listId,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "number";
  listId?: string;
}) {
  return (
    <div>
      <label className="fieldLabel" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        list={listId}
      />
    </div>
  );
}
