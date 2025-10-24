
import { useState } from 'react';
import QuestionCard from '../components/QuestionCard';

export default function Home() {
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('Algebra');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [explanation, setExplanation] = useState('');

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  async function generateQuestion() {
    setExplanation('');
    setLoading(true);
    setQuestion(null);
    try {
      const res = await fetch(`${backend}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, language })
      });
      const data = await res.json();
      if (data.ok && data.question) {
        setQuestion(data.question);
      } else {
        setQuestion({ text: 'No question returned', choices: [], answer_index: 0 });
      }
    } catch (err) {
      console.error(err);
      setQuestion({ text: 'Error generating question', choices: [], answer_index: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function getExplanation(hint=false) {
    if (!question) return;
    setExplanation('Loading...');
    try {
      const res = await fetch(`${backend}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText: question.text, language, hint })
      });
      const data = await res.json();
      if (data.ok && data.explanation) setExplanation(data.explanation);
      else setExplanation('No explanation returned.');
    } catch (err) {
      console.error(err);
      setExplanation('Error fetching explanation.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur rounded-xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-indigo-700">AI Exam Coach</h1>
          <div className="text-sm text-gray-600">Math • Physics • Chemistry</div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full p-2 border rounded">
                <option>Math</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="w-full p-2 border rounded">
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={generateQuestion} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition">
              {loading ? 'Generating...' : 'Generate Question'}
            </button>
            <button onClick={()=>getExplanation(true)} disabled={!question} className="px-4 py-2 bg-yellow-400 rounded">Hint</button>
            <button onClick={()=>getExplanation(false)} disabled={!question} className="px-4 py-2 bg-green-500 text-white rounded">Explain</button>
          </div>

          <section>
            {question ? <QuestionCard question={question} /> : <div className="text-gray-600">No question yet. Click generate to start.</div>}
            {explanation && <div className="mt-4 p-4 bg-gray-50 border rounded">{explanation}</div>}
          </section>
        </main>

        <footer className="mt-6 text-sm text-gray-500">Built for State Level Buildathon - AI × NxtWave</footer>
      </div>
    </div>
  );
}
