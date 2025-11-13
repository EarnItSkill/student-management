import {
  BookOpen,
  GraduationCap,
  Maximize,
  Minimize,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../../context/useAppContext";

const CourseForm = ({ course, onClose, onSuccess }) => {
  const { addCourse, updateCourse } = useAppContext();
  const isEdit = !!course;
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getDefaultValues = () => {
    if (course) {
      return {
        title: course.title,
        description: course.description,
        duration: course.duration,
        fee: course.fee,
        image: course.image,
        instructorName: course.instructorName || "",
        instructorDesignation: course.instructorDesignation || "",
        instructorImage: course.instructorImage || "",
        classes: course.classes || [],
        videoUrl: course.videoUrl || "",
      };
    }
    return {
      title: "",
      description: "",
      duration: "",
      fee: "",
      image: "",
      instructorName: "",
      instructorDesignation: "",
      instructorImage: "",
      classes: [],
      videoUrl: "",
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

  // Random image generator function
  const getRandomCourseImage = () => {
    const randomImages = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    ];
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  const getRandomInstructorImage = () => {
    const randomImages = [
      "https://i.pravatar.cc/300?img=12",
      "https://i.pravatar.cc/300?img=13",
      "https://i.pravatar.cc/300?img=33",
      "https://i.pravatar.cc/300?img=60",
      "https://i.pravatar.cc/300?img=68",
    ];
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  useEffect(() => {
    reset(getDefaultValues());
  }, [course, reset]);

  const onSubmit = async (data) => {
    try {
      const courseData = {
        ...data,
        fee: parseFloat(data.fee),
        // যদি image না দেওয়া হয় তাহলে random image
        image: data.image || getRandomCourseImage(),
        instructorImage: data.instructorImage || getRandomInstructorImage(),
        classes: data.classes.map((classItem, classIndex) => ({
          id: classIndex + 1,
          topic: classItem.topic || [],
          videoUrl: classItem.videoUrl || "",
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
    setSelectedClassIndex(classFields.length);
  };

  const handleClassRemove = (index) => {
    removeClass(index);
    if (selectedClassIndex >= classFields.length - 1) {
      setSelectedClassIndex(Math.max(0, classFields.length - 2));
    }
  };

  return (
    <div className="modal modal-open">
      {/* <div className="modal-box max-w-7xl max-h-[98vh] overflow-y-auto p-0"> */}
      <div
        className={`modal-box overflow-y-auto p-0 transition-all duration-300 ${
          isFullScreen
            ? "w-screen h-screen max-w-none max-h-none rounded-none"
            : "max-w-7xl max-h-[98vh]"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 sticky top-0 bg-base-100 z-10 border-b">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {isEdit ? "Edit Course" : "Add New Course"}
          </h3>
          <div>
            <button
              className="btn btn-info mr-2"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"} basic
            </button>
            <button
              type="button"
              onClick={addNewClass}
              className="btn btn-primary gap-2 mr-3"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="btn btn-ghost btn-sm btn-circle mr-2"
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost bg-pink-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          {show && (
            <div className="card bg-base-200 shadow-xl border-2 border-primary/20">
              <div className="card-body">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Basic Information
                </h4>

                {/* Course Title & Description */}
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Course Title *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., এডভান্সড অফিস কোর্স"
                      className={`input input-bordered w-full ${
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
                      <span className="label-text font-semibold text-base">
                        Description *
                      </span>
                    </label>
                    <textarea
                      placeholder="Course এর বিস্তারিত বর্ণনা লিখুন..."
                      className={`textarea textarea-bordered w-full h-28 ${
                        errors.description ? "textarea-error" : ""
                      }`}
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                      })}
                    />
                    {errors.description && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.description.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="divider divider-start text-base font-bold mt-6">
                  Course Details
                </div>

                {/* Duration, Fee, Image in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Duration *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ৩ মাস"
                      className={`input input-bordered w-full ${
                        errors.duration ? "input-error" : ""
                      }`}
                      {...register("duration", {
                        required: "Duration is required",
                      })}
                    />
                    {errors.duration && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.duration.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Course Fee (৳) *
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 8000"
                      className={`input input-bordered w-full ${
                        errors.fee ? "input-error" : ""
                      }`}
                      {...register("fee", {
                        required: "Fee is required",
                        min: { value: 0, message: "Fee must be positive" },
                      })}
                    />
                    {errors.fee && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.fee.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Course Image URL
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://... (optional)"
                      className="input input-bordered w-full"
                      {...register("image")}
                    />
                    <label className="label">
                      <span className="label-text-alt text-gray-500">
                        Leave empty for random image
                      </span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider divider-start text-base font-bold mt-6">
                  Instructor Information
                </div>

                {/* Instructor Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Instructor Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Md. Abdul Karim"
                      className={`input input-bordered w-full ${
                        errors.instructorName ? "input-error" : ""
                      }`}
                      {...register("instructorName", {
                        required: "Instructor name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                    />
                    {errors.instructorName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.instructorName.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Designation *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Instructor"
                      className={`input input-bordered w-full ${
                        errors.instructorDesignation ? "input-error" : ""
                      }`}
                      {...register("instructorDesignation", {
                        required: "Designation is required",
                      })}
                    />
                    {errors.instructorDesignation && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.instructorDesignation.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Instructor Photo URL
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://... (optional)"
                      className="input input-bordered w-full"
                      {...register("instructorImage")}
                    />
                    <label className="label">
                      <span className="label-text-alt text-gray-500">
                        Leave empty for random avatar
                      </span>
                    </label>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="alert alert-info mt-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div>
                    <div className="text-sm">
                      <strong>Note:</strong> If you don't provide images, random
                      professional images will be automatically assigned.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classes Section with Right Sidebar */}
          {classFields.length > 0 ? (
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border-2 border-primary/20">
              <div className="card-body p-0">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
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
                </div>

                <div className="grid grid-cols-12 min-h-[500px]">
                  {/* Main Content Area (Left & Center) */}
                  <div className="col-span-8 p-6 border-r">
                    {classFields[selectedClassIndex] && (
                      <ClassSection
                        key={`class-${selectedClassIndex}-${classFields[selectedClassIndex].id}`}
                        classIndex={selectedClassIndex}
                        register={register}
                        control={control}
                        removeClass={handleClassRemove}
                      />
                    )}
                  </div>

                  {/* Right Sidebar - Class Navigation */}
                  <div className="col-span-4 p-4 bg-base-100/50 overflow-y-auto max-h-[600px]">
                    <h5 className="font-bold text-sm mb-3 flex items-center gap-2 sticky top-0 bg-base-100 p-2 rounded">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      ক্লাস লিস্ট
                      <span className="badge badge-primary badge-sm ml-auto">
                        {classFields.length}টি
                      </span>
                    </h5>

                    <div className="space-y-2">
                      {classFields.map((field, index) => (
                        <button
                          key={field.id}
                          type="button"
                          onClick={() => setSelectedClassIndex(index)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedClassIndex === index
                              ? "bg-primary text-primary-content shadow-md"
                              : "bg-base-100 hover:bg-base-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`badge badge-sm ${
                                  selectedClassIndex === index
                                    ? "badge-primary-content"
                                    : "badge-ghost"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium">
                                {field.topic[0]}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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

                <div className="text-center py-8 bg-base-100 rounded-lg">
                  <p className="text-gray-500">No classes added yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Add Class" to create your first class
                  </p>
                </div>
              </div>
            </div>
          )}

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
    keyName: "fieldId",
  });

  const {
    fields: quesAnsFields,
    append: appendQuesAns,
    remove: removeQuesAns,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.quesAns`,
    keyName: "fieldId",
  });

  const {
    fields: homeWorkFields,
    append: appendHomeWork,
    remove: removeHomeWork,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.homeWork`,
    keyName: "fieldId",
  });

  const {
    fields: someWordFields,
    append: appendSomeWord,
    remove: removeSomeWord,
  } = useFieldArray({
    control,
    name: `classes.${classIndex}.someWord`,
    keyName: "fieldId",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b">
        <h5 className="font-bold text-lg flex items-center gap-2">
          <div className="badge badge-primary badge-lg">
            Class {classIndex + 1}
          </div>
          <span>ক্লাস {classIndex + 1} এর বিবরণ</span>
        </h5>
        <button
          type="button"
          disabled
          onClick={() => removeClass(classIndex)}
          className="btn btn-error btn-sm gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove Class
        </button>
      </div>

      {/* Topics */}
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title font-semibold text-gray-300">
          Topics (বিষয়সমূহ) - {topicFields.length} items
        </div>
        <div className="collapse-content">
          <div className="space-y-2 mt-2">
            {topicFields.map((field, index) => (
              <div key={field.fieldId} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Topic ${index + 1}`}
                  className="input input-md text-gray-400 input-bordered flex-1"
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
        <div className="collapse-title font-semibold text-gray-300">
          Questions & Answers - {quesAnsFields.length} items
        </div>
        <div className="collapse-content">
          <div className="space-y-2 mt-2">
            {quesAnsFields.map((field, index) => (
              <div key={field.fieldId} className="card bg-base-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-md font-semibold text-gray-400">
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
                      className="input input-md text-gray-400 input-bordered w-full"
                      {...register(
                        `classes.${classIndex}.quesAns.${index}.question`,
                        { required: true }
                      )}
                    />
                    {/* <input
                      type="text"
                      placeholder="Answer"
                      className="input input-md text-gray-400 input-bordered w-full"
                      {...register(
                        `classes.${classIndex}.quesAns.${index}.answer`,
                        { required: true }
                      )}
                    /> */}
                    <textarea
                      placeholder="Answer"
                      className="textarea textarea-md text-gray-400 textarea-bordered w-full"
                      {...register(
                        `classes.${classIndex}.quesAns.${index}.answer`,
                        { required: true }
                      )}
                    ></textarea>
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
        <div className="collapse-title font-semibold text-gray-300">
          Homework - {homeWorkFields.length} items
        </div>
        <div className="collapse-content">
          <div className="space-y-2 mt-2">
            {homeWorkFields.map((field, index) => (
              <div key={field.fieldId} className="card bg-base-100 shadow-sm">
                <div className="card-body p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-semibold">
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
                      className="input input-md text-gray-400 input-bordered"
                      {...register(
                        `classes.${classIndex}.homeWork.${index}.title`,
                        { required: true }
                      )}
                    />
                    <input
                      type="text"
                      placeholder="Task"
                      className="input input-md text-gray-400 input-bordered"
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
        <div className="collapse-title font-semibold text-gray-300">
          Important Words - {someWordFields.length} items
        </div>
        <div className="collapse-content">
          <div className="space-y-2 mt-2">
            {someWordFields.map((field, index) => (
              <div key={field.fieldId} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Word ${index + 1}`}
                  className="input input-md text-gray-400 input-bordered flex-1"
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

      {/* Video URL */}
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" />
        <div className="collapse-title font-semibold text-gray-300">
          ভিডিও লিংক
        </div>
        <div className="collapse-content">
          <input
            type="url"
            placeholder="https://example.com/video.mp4"
            className="input input-md text-gray-400 input-bordered w-full mt-2"
            {...register(`classes.${classIndex}.videoUrl`)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
