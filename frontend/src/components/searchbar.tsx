import { Button, Input } from "./ui";

export default function SearchBar() {
  return (
    <div className="flex w-full gap-2">
      <Input
        type="text"
        placeholder="게시글, 사용자 검색..."
        className="flex-1"
      />
      <Button variant="primary" size="md" className="whitespace-nowrap">
        검색
      </Button>
    </div>
  );
}
