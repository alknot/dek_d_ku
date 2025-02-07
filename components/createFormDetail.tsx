import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormSectionProps {
  projectData: any;
  handleProjectChange: (field: string, value: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}

const InputField: React.FC<{
  label: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, type, value, onChange, placeholder, required }) => (
  <div className="sm:col-span-2">
    <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}> = ({ label, value, onChange, options, required }) => (
  <div className="w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
      required={required}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);



const FormSection: React.FC<FormSectionProps> = ({
  projectData,
  handleProjectChange,
  handleFileChange,
  nextStep,
}) => {
  const handleRewardChange = (reward: string) => {
    const newRewards = projectData.rewards.includes(reward)
      ? projectData.rewards.filter((r: string) => r !== reward)
      : [...projectData.rewards, reward];
    handleProjectChange("rewards", newRewards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('schName', projectData.name);
    formData.append('description', projectData.description);
    formData.append('academicYear', projectData.academicYear);
    formData.append('term', projectData.semester);
    formData.append('startDate', projectData.startDate.toISOString());
    formData.append('endDate', projectData.endDate.toISOString());
    formData.append('program', projectData.program);
    formData.append('announcementFile', projectData.announcementFile);
    formData.append('rewards', JSON.stringify(projectData.rewards));
    formData.append('otherReward', projectData.otherReward);

    try {
      const response = await fetch('/api/scholarship', {
        method: 'POST',
        body: formData,
        headers: {
          // Assuming you handle authentication outside of this component
          'Authorization': 'Bearer your-token-here'
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert('Form submitted successfully!');
        nextStep(); // Proceed to the next step if necessary
      } else {
        console.error('Failed to submit form:', result);
        alert('Failed to submit the form: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };


  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">สร้างโครงการประพฤติดี</h2>
      <h1 className="mb-4 font-bold text-gray-900 text-center">กรอกข้อมูลของโครงการ</h1>
      <form>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <InputField
          label="ชื่อโครงการ"
          type="text"
          value={projectData.name}
          onChange={(e) => handleProjectChange("name", e.target.value)}
          placeholder="name"
          required
        />
        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-900">ประกาศโครงการ (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            required
          />
          {projectData.announcementFileName && (
            <p className="mt-2 text-sm text-gray-600">Selected file: {projectData.announcementFileName}</p>
          )}
        </div>
        <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">รางวัลในแต่ละโครงการ</label>
            <div className="flex flex-col space-y-2">
              {["ลดค่าบำรุงมหาวิทยาลัย", "ลดค่าหน่วยกิต", "ลดค่าธรรมเนียมพิเศษคณะ", "อื่นๆ"].map((reward) => (
                <label key={reward} className="flex items-center">
                  <input
                    type="checkbox"
                    name="reward"
                    value={reward}
                    checked={projectData.rewards.includes(reward)}
                    onChange={() => handleRewardChange(reward)}
                    className="mr-2"
                  />
                  {reward}
                </label>
              ))}
              {projectData.rewards.includes("อื่นๆ") && (
                <InputField
                  label=""
                  type="text"
                  value={projectData.otherReward}
                  onChange={(e) => handleProjectChange("otherReward", e.target.value)}
                  placeholder="กรอกรางวัลอื่นๆ"
                />
              )}
            </div>
          </div>
        <div className="flex space-x-5">
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">วันที่เริ่มโครงการ</label>
            <DatePicker
              selected={projectData.startDate}
              onChange={(date) => handleProjectChange("startDate", date)}
              placeholderText="Start date"
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">วันที่จบโครงการ</label>
            <DatePicker
              selected={projectData.endDate}
              onChange={(date) => handleProjectChange("endDate", date)}
              placeholderText="End date"
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
        </div>
        <div className="flex w-full px-3 py-0 space-x-3">
        
          <InputField
            label="ปีการศึกษา"
            type="number"
            value={projectData.academicYear}
            onChange={(e) => handleProjectChange("academicYear", e.target.value)}
            placeholder="2568"
            required
          />
          <SelectField
            label="ภาคการศึกษา"
            value={projectData.semester}
            onChange={(e) => handleProjectChange("semester", e.target.value)}
            options={[
              { value: "เทอมต้น", label: "เทอมต้น" },
              { value: "เทอมปลาย", label: "เทอมปลาย" },
            ]}
            required
          />
          <SelectField
            label="สำหรับหลักสูตร"
            value={projectData.program}
            onChange={(e) => handleProjectChange("program", e.target.value)}
            options={[
              { value: "ไทย", label: "ภาคไทย" },
              { value: "นานาชาติ", label: "ภาคนานาชาติ" },
              { value: "ไทย,นานาชาติ", label: "ทั้งภาคไทยและนานาชาติ" },
            ]}
            required
          />
        
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-900">รายละเอียดโครงการ</label>
          <textarea
            value={projectData.description}
            onChange={(e) => handleProjectChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            placeholder="รายละเอียดโครงการ"
            rows={6}
            required
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        ไปหน้าถัดไป
      </button>
    </form>
    </>
  );
};

export default FormSection;