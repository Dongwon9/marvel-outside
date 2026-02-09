import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  height = 400,
}: MarkdownEditorProps) {
  return (
    <div className="w-full max-w-none" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview="live"
      />
    </div>
  );
}
