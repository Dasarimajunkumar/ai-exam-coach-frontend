
export default function QuestionCard({ question }) {
  const { text, choices } = question || {};
  return (
    <div className="mt-4 p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-800">Question</h2>
      <p className="mt-2 text-gray-700">{text}</p>
      <div className="mt-4 grid gap-3">
        {choices && choices.length > 0 ? choices.map((c,i)=>(
          <div key={i} className="p-3 border rounded hover:bg-indigo-50">{String.fromCharCode(65+i)}. {c}</div>
        )) : <div className="text-sm text-gray-500">No choices provided.</div>}
      </div>
    </div>
  )
}
