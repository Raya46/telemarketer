const colors = {
  background: "#1C162C",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
};

export default function TutorialsPage() {
  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: colors.background }}
    >
      <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
        Tutorials
      </h1>
      <p style={{ color: colors.secondaryText }}>
        Learn how to use the platform.
      </p>
    </div>
  );
}