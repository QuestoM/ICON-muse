interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface QuestionStepProps {
  questions: Question[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
}

export default function QuestionStep({ questions, answers, onAnswer }: QuestionStepProps) {
  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-4">
          <h3 className="font-medium text-lg">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(question.id, option.value)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  answers[question.id] === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 