import { useRef, useState } from "react";

const BanglaVoiceTextarea = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    // ব্রাউজারে SpeechRecognition আছে কি না চেক করো
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("দুঃখিত! আপনার ব্রাউজার ভয়েস টাইপিং সাপোর্ট করে না।");
      return;
    }

    // recognition তৈরি
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD"; // ✅ বাংলা ভাষা সেট করা
    recognition.continuous = true; // থামানো পর্যন্ত শুনবে
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      setText(finalText);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">🎤 বাংলায় ভয়েস টাইপ করুন</h2>

      <textarea
        className="w-full h-40 p-3 border rounded-lg"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="এখানে বাংলায় ভয়েসে লিখুন..."
      />

      <div className="mt-3 flex gap-2">
        {!isListening ? (
          <button
            onClick={startListening}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ▶️ ভয়েস চালু করুন
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            ⏹️ বন্ধ করুন
          </button>
        )}
      </div>
    </div>
  );
};

export default BanglaVoiceTextarea;
