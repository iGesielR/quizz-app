export default function ProgressBar({
  current,
  total
}) {
  const percentage =
    (current / total) * 100;

  return (
    <div>
      <div
        style={{
          width: `${percentage}%`,
          height: "10px",
          background: "#4caf50"
        }}
      />
    </div>
  );
}