export default function InputCodeBox({ label = "Enter Code", value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <label className="text-gray-300 text-sm">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional or retrieved"
        className="w-full p-3 rounded-xl bg-[#38175A] text-white outline-none border border-[#6e46a3] focus:border-[#D6B9FC] transition"
      />
    </div>
  );
}
