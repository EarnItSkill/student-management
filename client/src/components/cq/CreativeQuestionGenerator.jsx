import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { numberToBangla } from "../../utils/numberToBangla";
import { parseSpecialToHTML } from "../../utils/parseSpecialToHTML";
import { parseSpecialToJSX } from "../../utils/parseSpecialToJSX";

export default function CreativeQuestionGenerator() {
  const { courses, cqQuestions } = useAppContext();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questionPaper, setQuestionPaper] = useState(null);

  // অধ্যায় পেতে ব্যবহৃত function
  const getChaptersForCourse = (course) => {
    const chapters = new Set();
    cqQuestions.forEach((q) => {
      if (q.courseId === course._id) {
        chapters.add(q.chapter);
      }
    });
    return Array.from(chapters).sort();
  };

  // জ্ঞানমূলক এবং অনুধাবনমূলক প্রশ্ন সংগ্রহ
  const getObjectiveQuestions = (course, usedIds = new Set()) => {
    const allQuestions = course.classes
      .flatMap((c) =>
        c.quesAns.map((q) => ({
          ...q,
          classId: c.id,
        }))
      )
      .filter((q) => !usedIds.has(q.id));

    return allQuestions;
  };

  // র্যান্ডম প্রশ্ন নির্বাচন
  const generateQuestionPaper = () => {
    if (!selectedCourse || !selectedChapter) return;

    // নির্বাচিত অধ্যায়ের সৃজনশীল প্রশ্ন পাওয়া
    const chapterQuestions = cqQuestions.filter(
      (q) => q.courseId === selectedCourse._id && q.chapter === selectedChapter
    );

    if (chapterQuestions.length === 0) {
      alert("এই অধ্যায়ে কোন প্রশ্ন নেই");
      return;
    }

    // র্যান্ডম ৮টি প্রশ্ন নির্বাচন (যদি কম থাকে তবে যা আছে)
    const selectedQuestions = [];
    const needed = Math.min(8, chapterQuestions.length);
    const randomIndices = new Set();

    while (randomIndices.size < needed) {
      randomIndices.add(Math.floor(Math.random() * chapterQuestions.length));
    }

    randomIndices.forEach((idx) => {
      selectedQuestions.push(chapterQuestions[idx]);
    });

    // সব উদ্দেশ্যমূলক প্রশ্ন পান
    let allObjectiveQuestions = getObjectiveQuestions(selectedCourse);
    const usedIds = new Set();

    // প্রশ্নপত্র তৈরি
    const paper = selectedQuestions.map((stimulus, idx) => {
      // সৃজনশীল প্রশ্ন থেকে c) d)
      const creativeQA = stimulus.questions;

      // র্যান্ডম ২টি অনব্যবহৃত প্রশ্ন নিয়ে a) b) বানানো
      const availableQuestions = allObjectiveQuestions.filter(
        (q) => !usedIds.has(q._id)
      );

      const selectedObjective = availableQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      selectedObjective.forEach((q) => usedIds.add(q.id));

      return {
        questionNo: idx + 1,
        stimulus: stimulus,
        cqQuestions: creativeQA,
        objectiveQuestions: selectedObjective,
      };
    });

    setQuestionPaper(paper);
  };

  const chapterName = (num) => {
    console.log(num);
    if (Number(num) === 3) {
      return "সংখ্যা পদ্ধতী এবং ডিজিটাল বর্তনী";
    }
    return;
  };

  // প্রিন্ট করার জন্য HTML তৈরি করুন
  const generatePrintHTML = () => {
    if (!questionPaper || !selectedCourse || !selectedChapter) return "";

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${selectedCourse.title} - অধ্যায় ${selectedChapter}</title>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Hind Siliguri', sans-serif;
          color: #000;
          background: #fff;
          padding: 20px;
          line-height: 1.6;
        }
        
        .container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 40px;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 20px;
          font-weight: 700;
        }
        
        .header h2 {
          font-size: 16px;
          font-weight: 700;
        }
        
        .header p {
          font-size: 14px;
          color: #333;
          margin: 5px 0;
        }
        
        .header span {
          font-weight: 700;
        }
        
        .question-block {
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        
        .question-number {
          font-size: 16px;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 10px;
        }
        
        .stimulus {
          margin-bottom: 15px;
          font-size: 13px;
          line-height: 1.6;
          font-weight: 700;
        }
        
        .stimulus img {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
        }
        
        .question-group {
          margin-bottom: 1px;
        }
        
        .question-item {
          font-size: 13px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          line-height: 1.5;
        }
        
        .marks {
          font-weight: 700;
          color: #666;
          margin-left: 10px;
          white-space: nowrap;
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          
          .container {
            padding: 20px;
            max-width: 100%;
          }
          
          .question-block {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>আর্ন আইটি স্কিল || Earn IT Skill</h1>
          <h2>${selectedCourse.title}</h2>
          <p> <span>অধ্যায় ${numberToBangla(
            selectedChapter
          )} </span> ${chapterName(selectedChapter)}</p>
          <p>মোট মার্কস: ৫০</p>
        </div>
  `;

    // প্রতিটি প্রশ্ন যোগ করা
    questionPaper.forEach((item, idx) => {
      htmlContent += `
      <div class="question-block">
        <div class="question-number">প্রশ্ন ${numberToBangla(
          item.questionNo
        )}: উদ্দীপক অনুযায়ী গ এবং ঘ এর উত্তর দাও।</div>

        <div class="stimulus">
    `;

      if (item.stimulus.stimulusType === "image") {
        htmlContent += `<img src="${item.stimulus.stimulusContent}" alt="Stimulus">`;
      } else {
        const formattedStimulus = parseSpecialToHTML(
          item.stimulus.stimulusContent
        );
        htmlContent += `<p>${formattedStimulus}</p>`;
      }

      htmlContent += `</div>`;

      // উদ্দেশ্যমূলক প্রশ্ন (ক, খ)
      htmlContent += `<div class="question-group">`;
      item.objectiveQuestions.forEach((q, qIdx) => {
        const subQ = ["ক", "খ"][qIdx];
        htmlContent += `
        <div class="question-item">
          <span><strong>${subQ})</strong> ${q.question}</span>
          <span class="marks">${numberToBangla(qIdx + 1)}</span>
        </div>
      `;
      });
      htmlContent += `</div>`;

      // সৃজনশীল প্রশ্ন (গ, ঘ)
      htmlContent += `<div class="question-group">`;
      item.cqQuestions.forEach((q, qIdx) => {
        const subQ = ["গ", "ঘ"][qIdx];
        htmlContent += `
        <div class="question-item">
          <span><strong>${subQ})</strong> ${q.question}</span>
          <span class="marks">${numberToBangla(q.marks)}</span>
        </div>
      `;
      });
      htmlContent += `</div>`;

      htmlContent += `</div>`;
    });

    htmlContent += `
      </div>
    </body>
    </html>
  `;

    return htmlContent;
  };

  // প্রিন্ট বাটন
  const printQuestionPaper = () => {
    if (!questionPaper || !selectedCourse || !selectedChapter) return;

    const printWindow = window.open("", "", "height=900,width=900");
    const htmlContent = generatePrintHTML();

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 50000);
  };

  // PDF ডাউনলোড
  const downloadPDF = async () => {
    if (!questionPaper || !selectedCourse || !selectedChapter) return;

    const pdf = new jsPDF();

    // 🔹 বাংলা ফন্ট লোড
    const fontData = await fetch(
      "../../../public/fonts/HindSiliguri-Regular.ttf"
    )
      .then((res) => res.arrayBuffer())
      .then((buf) =>
        btoa(
          new Uint8Array(buf).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )
      );

    // 🔹 jsPDF-তে ফন্ট যুক্ত করা
    pdf.addFileToVFS("HindSiliguri-Regular.ttf", fontData);
    pdf.addFont("HindSiliguri-Regular.ttf", "HindSiliguri", "normal");
    pdf.setFont("HindSiliguri");

    // 🔹 শিরোনাম
    pdf.setFontSize(16);
    pdf.text(selectedCourse.title, 105, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(`অধ্যায় ${selectedChapter}`, 105, 28, { align: "center" });
    pdf.text("মোট মার্কস: ৬৪", 105, 35, { align: "center" });

    let yPosition = 45;

    // 🔹 প্রতিটি প্রশ্ন
    questionPaper.forEach((item, idx) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // প্রশ্ন নম্বর
      pdf.setFontSize(12);
      pdf.setFont("HindSiliguri", "normal");
      pdf.text(`প্রশ্ন ${item.questionNo}`, 15, yPosition);
      yPosition += 8;

      // উদ্দীপক
      pdf.setFontSize(10);
      pdf.text("উদ্দীপক:", 15, yPosition);
      yPosition += 6;

      if (item.stimulus.stimulusType === "image") {
        pdf.text("[চিত্র অন্তর্ভুক্ত]", 20, yPosition);
        yPosition += 8;
      } else {
        const splitText = pdf.splitTextToSize(
          item.stimulus.stimulusContent,
          170
        );
        pdf.text(splitText, 20, yPosition);
        yPosition += splitText.length * 5 + 3;
      }

      // উদ্দেশ্যমূলক প্রশ্ন (a, b → ক, খ)
      const banglaLetters = ["ক", "খ", "গ", "ঘ"];
      item.objectiveQuestions.forEach((q, qIdx) => {
        const subQ = banglaLetters[qIdx] || "";
        const questionText = `${subQ}) ${q.question} [२]`;
        const splitText = pdf.splitTextToSize(questionText, 170);
        pdf.text(splitText, 20, yPosition);
        yPosition += splitText.length * 5 + 3;
      });

      // সৃজনশীল প্রশ্ন (c, d → গ, ঘ ...)
      item.cqQuestions.forEach((q, qIdx) => {
        const subQ = banglaLetters[qIdx + 2] || "";
        const questionText = `${subQ}) ${q.question} [${q.marks}]`;
        const splitText = pdf.splitTextToSize(questionText, 170);
        pdf.text(splitText, 20, yPosition);
        yPosition += splitText.length * 5 + 3;
      });

      yPosition += 5;
    });

    // 🔹 PDF ডাউনলোড
    pdf.save(
      `${selectedCourse.title.replace(
        /\s+/g,
        "_"
      )}_Chapter_${selectedChapter}.pdf`
    );
  };

  const chapters = selectedCourse ? getChaptersForCourse(selectedCourse) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
          সৃজনশীল প্রশ্নপত্র তৈরিকারী
        </h1>

        {!questionPaper ? (
          <>
            {/* কোর্স এবং অধ্যায় নির্বাচন */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
              {/* কোর্স নির্বাচন */}
              <div>
                <label className="block text-lg font-semibold text-blue-400 mb-3">
                  কোর্স নির্বাচন করুন
                </label>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <button
                      key={course._id}
                      onClick={() => {
                        setSelectedCourse(course);
                        setSelectedChapter(null);
                      }}
                      className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
                        selectedCourse?._id === course._id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      <p className="font-semibold">{course.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* অধ্যায় নির্বাচন */}
              {selectedCourse && (
                <div>
                  <label className="block text-lg font-semibold text-blue-400 mb-3">
                    অধ্যায় নির্বাচন করুন
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {chapters.length === 0 ? (
                      <p className="text-slate-400">এই কোর্সে কোন প্রশ্ন নেই</p>
                    ) : (
                      chapters.map((chapter) => (
                        <button
                          key={chapter}
                          onClick={() => setSelectedChapter(chapter)}
                          className={`px-4 py-3 rounded-lg transition-all font-semibold ${
                            selectedChapter === chapter
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          অধ্যায় {chapter}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* প্রশ্নপত্র তৈরি বাটন */}
              {selectedCourse && selectedChapter && (
                <button
                  onClick={generateQuestionPaper}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  প্রশ্নপত্র তৈরি করুন
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* প্রশ্নপত্র প্রদর্শন */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-8">
              {/* হেডার */}
              <div className="text-center border-b border-slate-600 pb-6">
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  {selectedCourse.title}
                </h2>
                <p className="text-slate-400">অধ্যায় {selectedChapter}</p>
                <p className="text-sm text-slate-500 mt-2">মোট মার্কস: ৬৪</p>
              </div>

              {/* প্রশ্ন */}
              {questionPaper.map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-6 border-b border-slate-600 pb-8"
                >
                  {/* প্রশ্ন নম্বর */}
                  <h3 className="text-xl font-bold text-blue-400">
                    প্রশ্ন {numberToBangla(item.questionNo)}: : উদ্দীপক অনুযায়ী
                    গ এবং ঘ এর উত্তর দাও।
                  </h3>

                  {/* উদ্দীপক */}
                  <>
                    {item.stimulus.stimulusType === "image" ? (
                      <img
                        src={item.stimulus.stimulusContent}
                        alt="Stimulus"
                        className="max-w-full h-auto rounded-lg mb-3"
                      />
                    ) : (
                      <p className="text-slate-200 leading-relaxed">
                        {parseSpecialToJSX(item.stimulus.stimulusContent)}
                      </p>
                    )}
                  </>

                  {/* a) b) - উদ্দেশ্যমূলক প্রশ্ন */}
                  <div className="space-y-4">
                    {item.objectiveQuestions.map((q, qIdx) => {
                      const subQuestion = ["ক", "খ"];
                      return (
                        <div key={qIdx}>
                          <p className="text-slate-200 font-semibold flex justify-between">
                            <span>
                              {subQuestion[qIdx]}){" "}
                              <span className="text-slate-300">
                                {parseSpecialToJSX(q.question)}
                              </span>{" "}
                            </span>
                            <span className="text-yellow-400">
                              {numberToBangla(qIdx + 1)}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* c) d) - সৃজনশীল প্রশ্ন */}
                  <div className="space-y-4">
                    {item.cqQuestions.map((q, qIdx) => {
                      const subQuestion = ["গ", "ঘ"];
                      return (
                        <div key={qIdx}>
                          <p className="text-slate-200 font-semibold flex justify-between">
                            <span>
                              {subQuestion[qIdx]}){" "}
                              <span className="text-slate-300">
                                {parseSpecialToJSX(q.question)}
                              </span>{" "}
                            </span>
                            <span className="text-yellow-400">
                              {numberToBangla(qIdx + 3)}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* বাটন */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setQuestionPaper(null);
                    setSelectedChapter(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  ফিরে যান
                </button>
                <button
                  onClick={printQuestionPaper}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                >
                  <Printer className="w-5 h-5" />
                  প্রিন্ট করুন
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  <Download className="w-5 h-5" />
                  PDF ডাউনলোড করুন
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
