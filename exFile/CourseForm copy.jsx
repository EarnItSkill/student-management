import { BookOpen, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../client/src/context/useAppContext";

const CourseForm = ({ course, onClose, onSuccess }) => {
  const { addCourse, updateCourse } = useAppContext();
  const isEdit = !!course;

  const getDefaultValues = () => {
    if (course) {
      return {
        title: course.title,
        description: course.description,
        duration: course.duration,
        fee: course.fee,
        image: course.image,
        topic: course.topic || [],
        quesAns: course.quesAns || [],
        homeWork: course.homeWork || [],
        someWord: course.someWord || [],
      };
    }
    return {
      title: "",
      description: "",
      duration: "",
      fee: "",
      image: "",
      topic: [],
      quesAns: [],
      homeWork: [],
      someWord: [],
    };
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(),
  });

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "topic",
  });

  const {
    fields: quesAnsFields,
    append: appendQuesAns,
    remove: removeQuesAns,
  } = useFieldArray({
    control,
    name: "quesAns",
  });

  const {
    fields: homeWorkFields,
    append: appendHomeWork,
    remove: removeHomeWork,
  } = useFieldArray({
    control,
    name: "homeWork",
  });

  const {
    fields: someWordFields,
    append: appendSomeWord,
    remove: removeSomeWord,
  } = useFieldArray({
    control,
    name: "someWord",
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [course, reset]);

  const onSubmit = async (data) => {
    try {
      const courseData = {
        ...data,
        fee: parseFloat(data.fee),
        topic: data.topic,
        quesAns: data.quesAns.map((qa, index) => ({ ...qa, id: index + 1 })),
        homeWork: data.homeWork.map((hw, index) => ({ ...hw, id: index + 1 })),
        someWord: data.someWord,
      };

      if (isEdit) {
        updateCourse(course._id, courseData);
      } else {
        addCourse(courseData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-base-100 z-10 pb-4 border-b">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Course" : "Add New Course"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4">Basic Information</h4>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Course Title *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., এডভান্সড অফিস কোর্স"
                  className={`input input-bordered ${
                    errors.title ? "input-error" : ""
                  }`}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Description *
                  </span>
                </label>
                <textarea
                  placeholder="Course description..."
                  className={`textarea textarea-bordered h-20 ${
                    errors.description ? "textarea-error" : ""
                  }`}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Duration *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ৩ মাস"
                    className={`input input-bordered ${
                      errors.duration ? "input-error" : ""
                    }`}
                    {...register("duration", {
                      required: "Duration is required",
                    })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Fee (৳) *</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 8000"
                    className={`input input-bordered ${
                      errors.fee ? "input-error" : ""
                    }`}
                    {...register("fee", {
                      required: "Fee is required",
                      min: { value: 0, message: "Fee must be positive" },
                    })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Image URL *
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className={`input input-bordered ${
                      errors.image ? "input-error" : ""
                    }`}
                    {...register("image", {
                      required: "Image URL is required",
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Topics (Simple String Array) */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">Topics (বিষয়সমূহ)</h4>
                <button
                  type="button"
                  onClick={() => appendTopic("")}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </div>

              <div className="space-y-2">
                {topicFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Topic ${index + 1}`}
                      className="input input-bordered flex-1"
                      {...register(`topic.${index}`, { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="btn btn-error btn-square"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {topicFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No topics added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Questions & Answers */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">
                  Questions & Answers (প্রশ্ন ও উত্তর)
                </h4>
                <button
                  type="button"
                  onClick={() => appendQuesAns({ question: "", answer: "" })}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Q&A
                </button>
              </div>

              <div className="space-y-3">
                {quesAnsFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">
                          Q&A {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuesAns(index)}
                          className="btn btn-error btn-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Question"
                          className="input input-sm input-bordered w-full"
                          {...register(`quesAns.${index}.question`, {
                            required: true,
                          })}
                        />
                        <input
                          type="text"
                          placeholder="Answer"
                          className="input input-sm input-bordered w-full"
                          {...register(`quesAns.${index}.answer`, {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {quesAnsFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No Q&A added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Homework (No Deadline) */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">Homework (হোমওয়ার্ক)</h4>
                <button
                  type="button"
                  onClick={() => appendHomeWork({ title: "", task: "" })}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Homework
                </button>
              </div>

              <div className="space-y-3">
                {homeWorkFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">
                          Homework {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHomeWork(index)}
                          className="btn btn-error btn-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Homework title"
                          className="input input-sm input-bordered"
                          {...register(`homeWork.${index}.title`, {
                            required: true,
                          })}
                        />
                        <input
                          type="text"
                          placeholder="Task"
                          className="input input-sm input-bordered"
                          {...register(`homeWork.${index}.task`, {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {homeWorkFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No homework added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Important Words (Simple String Array) */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">
                  Important Words (গুরুত্বপূর্ণ শব্দ)
                </h4>
                <button
                  type="button"
                  onClick={() => appendSomeWord("")}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Word
                </button>
              </div>

              <div className="space-y-2">
                {someWordFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Word ${index + 1}`}
                      className="input input-bordered flex-1"
                      {...register(`someWord.${index}`, { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => removeSomeWord(index)}
                      className="btn btn-error btn-square"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {someWordFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No words added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action sticky bottom-0 bg-base-100 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? "Update" : "Save"} Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
