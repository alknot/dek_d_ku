import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Question = {
  id: number;
  question: string;
  type: string; // "text" | "choice" | "checkbox" | "date"
  options: string[];
  required: string; // กำหนดว่าคำถามต้องตอบหรือไม่
  selectedDate?: Date; // สำหรับ Date Picker
};

interface QuestionFormSectionProps {
  questions: Question[];
  addQuestion: () => void;
  deleteQuestion: (id: number) => void;
  updateQuestion: (id: number, field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  prevStep: () => void;
}

const QuestionFormSection: React.FC<QuestionFormSectionProps> = ({
  questions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  handleSubmit,
  prevStep,
}) => {
  return (
    <div className="flex justify-center items-top min-h-screen bg-white ">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">
          ตัวอย่างคำถามเพื่อสมัครเข้าโครงการ
        </h2>
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Question {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter your question"
                value={q.question}
                onChange={(e) =>
                  updateQuestion(q.id, "question", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={q.type}
                onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Text</option>
                <option value="choice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date Picker</option>
              </select>
              {q.type === "choice" || q.type === "checkbox" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  {q.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[idx] = e.target.value;
                          updateQuestion(q.id, "options", newOptions);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = q.options.filter((_, i) => i !== idx);
                          updateQuestion(q.id, "options", newOptions);
                        }}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuestion(q.id, "options", [...q.options, ""])
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Add Option
                  </button>
                </div>
              ) : null}
              {q.type === "date" && (
                <div className="relative max-w-sm">
                  <DatePicker
                    selected={q.selectedDate}
                    onChange={(date) =>
                      updateQuestion(q.id, "selectedDate", date)
                    }
                    placeholderText="Select a date"
                    dateFormat="dd/MM/yyyy"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                           block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              )}
             <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={q.required === 'true'}
                  onChange={(e) =>
                    updateQuestion(q.id, "required", e.target.checked ? 'true' : 'false')
                  }
                />
                <label className="text-sm text-gray-700">Required</label>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormSection;