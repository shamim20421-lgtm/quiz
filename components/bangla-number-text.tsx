const banglaNumberPattern = /(৳?[\u09E6-\u09EF]+(?:[–-][\u09E6-\u09EF]+)?%?)/g;
const banglaNumberOnlyPattern = /^৳?[\u09E6-\u09EF]+(?:[–-][\u09E6-\u09EF]+)?%?$/;

export function BanglaNumberText({ text }: { text: string }) {
  const parts = text.split(banglaNumberPattern);

  return (
    <>
      {parts.map((part, index) =>
        banglaNumberOnlyPattern.test(part) ? (
          <span key={`${part}-${index}`} className="bangla-number">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
