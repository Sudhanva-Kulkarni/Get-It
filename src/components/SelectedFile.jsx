export default function SelectedFile({ file, description, onChange }) {
  return (
    <div className="bg-white text-black p-4 rounded-md shadow-sm">
      <p className="font-semibold">{file.name}</p>

      <textarea
        value={description}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add description..."
        className="w-full border border-gray-300 p-2 text-sm rounded-md mt-2"
      />
    </div>
  );
}
