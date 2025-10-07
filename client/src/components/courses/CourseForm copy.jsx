import { BookOpen, GraduationCap, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

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
        classes: course.classes || [],
      };
    }
    return {
      title: "",
      description: "",
      duration: "",
      fee: "",
      image: "",
      classes: [],
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
    fields: classFields,
    append: appendClass,
    remove: removeClass,
  } = useFieldArray({
    control,
    name: "classes",
  });

  useEffect(() => {
    reset(getDefaultValues());
  }, [course, reset]);

  const onSubmit = async (data) => {
    try {
      const courseData = {
        ...data,
        fee: parseFloat(data.fee),
        classes: data.classes.map((classItem, classIndex) => ({
          id: classIndex + 1,
          topic: classItem.topic || [],
          quesAns: (classItem.quesAns || []).map((qa, index) => ({
            ...qa,
            id: index + 1,
          })),
          homeWork: (classItem.homeWork || []).map((hw, index) => ({
            ...hw,
            id: index + 1,
          })),
          someWord: classItem.someWord || [],
        })),
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

  const addNewClass = () => {
    appendClass({
      topic: [],
      quesAns: [],
      homeWork: [],
      someWord: [],
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
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

          {/* Classes Section */}
          <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border-2 border-primary/20">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Classes (ক্লাসসমূহ)
                </h4>
                <button
                  type="button"
                  onClick={addNewClass}
                  className="btn btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Class
                </button>
              </div>

              <div className="space-y-6">
                {classFields.map((classField, classIndex) => (
                  <ClassSection
                    key={classField.id}
                    classIndex={classIndex}
                    register={register}
                    control={control}
                    removeClass={removeClass}
                  />
                ))}

                {classFields.length === 0 && (
                  <div className="text-center py-8 bg-base-100 rounded-lg">
                    <p className="text-gray-500">No classes added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click "Add Class" to create your first class
                    </p>
                  </div>
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

// Separate Component for Each Class
const ClassSection = ({ classIndex, register, control, removeClass }) => {
  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.topic`,
  });

  const {
    fields: quesAnsFields,
    append: appendQuesAns,
    remove: removeQuesAns,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.quesAns`,
  });

  const {
    fields: homeWorkFields,
    append: appendHomeWork,
    remove: removeHomeWork,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.homeWork`,
  });

  const {
    fields: someWordFields,
    append: appendSomeWord,
    remove: removeSomeWord,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.someWord`,
  });

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-primary/30">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h5 className="font-bold text-lg flex items-center gap-2">
            <div className="badge badge-primary badge-lg">
              Class {classIndex + 1}
            </div>
            <span>ক্লাস {classIndex + 1}</span>
          </h5>
          <button
            type="button"
            onClick={() => removeClass(classIndex)}
            className="btn btn-error btn-sm gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove Class
          </button>
        </div>

        <div className="space-y-4">
          {/* Topics */}
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title font-semibold">
              Topics (বিষয়সমূহ) - {topicFields.length} items
            </div>
            <div className="collapse-content">
              <div className="space-y-2 mt-2">
                {topicFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Topic ${index + 1}`}
                      className="input input-sm input-bordered flex-1"
                      {...register(`classes.${classIndex}.topic.${index}`, {
                        required: true,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="btn btn-error btn-sm btn-square"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendTopic("")}
                  className="btn btn-sm btn-outline btn-primary w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </div>
            </div>
          </div>

          {/* Questions & Answers */}
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              Questions & Answers - {quesAnsFields.length} items
            </div>
            <div className="collapse-content">
              <div className="space-y-2 mt-2">
                {quesAnsFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">
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
                          {...register(
                            `classes.${classIndex}.quesAns.${index}.question`,
                            { required: true }
                          )}
                        />
                        <input
                          type="text"
                          placeholder="Answer"
                          className="input input-sm input-bordered w-full"
                          {...register(
                            `classes.${classIndex}.quesAns.${index}.answer`,
                            { required: true }
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendQuesAns({ question: "", answer: "" })}
                  className="btn btn-sm btn-outline btn-primary w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Q&A
                </button>
              </div>
            </div>
          </div>

          {/* Homework */}
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              Homework - {homeWorkFields.length} items
            </div>
            <div className="collapse-content">
              <div className="space-y-2 mt-2">
                {homeWorkFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-sm">
                    <div className="card-body p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">
                          HW {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHomeWork(index)}
                          className="btn btn-error btn-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          className="input input-sm input-bordered"
                          {...register(
                            `classes.${classIndex}.homeWork.${index}.title`,
                            { required: true }
                          )}
                        />
                        <input
                          type="text"
                          placeholder="Task"
                          className="input input-sm input-bordered"
                          {...register(
                            `classes.${classIndex}.homeWork.${index}.task`,
                            { required: true }
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendHomeWork({ title: "", task: "" })}
                  className="btn btn-sm btn-outline btn-primary w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Homework
                </button>
              </div>
            </div>
          </div>

          {/* Important Words */}
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              Important Words - {someWordFields.length} items
            </div>
            <div className="collapse-content">
              <div className="space-y-2 mt-2">
                {someWordFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Word ${index + 1}`}
                      className="input input-sm input-bordered flex-1"
                      {...register(`classes.${classIndex}.someWord.${index}`, {
                        required: true,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removeSomeWord(index)}
                      className="btn btn-error btn-sm btn-square"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendSomeWord("")}
                  className="btn btn-sm btn-outline btn-primary w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Word
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
